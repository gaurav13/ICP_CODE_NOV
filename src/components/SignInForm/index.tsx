'use client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import * as React from 'react';
import icpimage from '@/assets/Img/coin-image.png';
// import { Modal } from 'flowbite-react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import {
  Button,
  Form,
  Modal,
  Nav,
  NavDropdown,
  NavLink,
  Spinner,
} from 'react-bootstrap';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { ConnectPlugWalletSlice, UserAuth } from '@/types/store';
import logger from '@/lib/logger';
import { canisterId as ledgerCanisterId } from '@/dfx/declarations/icp_ledger_canister';
import { makeLedgerCanister } from '@/dfx/service/actor-locator';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { Principal } from '@dfinity/principal';
import {
  Formik,
  FormikProps,
  Form as FormikForm,
  Field,
  FormikValues,
  ErrorMessage,
  FormikHelpers,
} from 'formik';
import { E8S, GAS_FEE } from '@/constant/config';
import * as yup from 'yup';
import { number, object, string } from 'yup';
import instance from '@/components/axios';
import ChangeForm from '@/components/ChangeForm';
import { STRONG_PASSWORD, STRONG_PASSWORD_SMS } from '@/constant/validations';
import { EMAIL_VALIDATE } from '@/constant/regulerExpression';

export default function SignInForm({
  setisRegister,
  isRegister,
  handleClose,
}: {
  setisRegister: (i: boolean) => void;
  handleClose: () => void;
  isRegister: boolean;
}) {
  const storedIsTimerActive = localStorage.getItem('isTimerActive') === 'true';
  const storedRemainingTime =
    parseInt(localStorage.getItem('remainingTime') as string, 10) || 30;
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [showPass, setShowpass] = React.useState(false);
  const [showPass2, setShowpass2] = React.useState(false);
  const { t, changeLocale } = useLocalization(LANG);
  const [verify, setVerify] = React.useState(false);
  const [otpEmail, setOtpEmail] = React.useState<string | undefined>();
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isTimerActive, setIsTimerActive] = React.useState(storedIsTimerActive);
  const [remainingTime, setRemainingTime] = React.useState(storedRemainingTime);
  const [isSendingOtp, setIsSendingOtp] = React.useState(false);

  const { auth, emailConnected, setEmailConnected } = useConnectPlugWalletStore(
    (state) => ({
      auth: (state as ConnectPlugWalletSlice).auth,
      setEmailConnected: (state as ConnectPlugWalletSlice).setEmailConnected,
      emailConnected: (state as ConnectPlugWalletSlice).emailConnected,
    })
  );
  const signInValues = {
    email: '',
    password: '',
    confirm: '',
  };
  const signInSchema = object().shape({
    email: string()
      .required(t('Email is required'))
      .trim()
      .matches(EMAIL_VALIDATE, t('Invalid Email')),
    password: string()
      .min(6, STRONG_PASSWORD_SMS)
      .required(t('Password is required'))
      .matches(STRONG_PASSWORD, STRONG_PASSWORD_SMS),

    confirm: string()
      .oneOf([yup.ref('password')], t('Passwords must match'))
      .required(t('Confirm password is required'))
      .matches(STRONG_PASSWORD, STRONG_PASSWORD_SMS),
  });
  const otpValues = {
    otp: '',
  };

  const otpSchema = object().shape({
    otp: number()
      .required(t('OTP is required'))
      .test(
        'non-negative',
        'OTP must be a non-negative number',
        (value: any) => {
          // Check if the value is a non-negative number
          return parseInt(value) >= 0;
        }
      ),
  });

  const register = async (
    values: FormikValues,
    actions: FormikHelpers<typeof signInValues>
  ) => {
    setIsRegistering(true);
    try {
      let tempPath = window.location.origin;

      const response = await instance.post('auth/register', {
        email: values.email,
        password: values.password,
        passwordConfirm: values.confirm,
        baseUrl: tempPath,
        language: LANG,
      });
      // toast.success('Sign up Successful, pleasde login');
      setOtpEmail(values.email);
      setVerify(true);
      toast.success(t('OTP sent to email'));
      actions.resetForm();
      logger(response, 'signup rep');
    } catch (error: any) {
      toast.error(t(error.response.data.errorMessage));
      logger(error);
    }
    setIsRegistering(false);
  };

  const resendOtp = async () => {
    setIsSendingOtp(true);
    try {
      let tempPath = window.location.origin;

      const response = await instance.post('auth/resend-otp', {
        email: otpEmail,
        baseUrl: tempPath,
      });
      // toast.success('Sign up Successful, pleasde login');
      // setVerify(true);
      // actions.resetForm();
      setIsTimerActive(true);
      setRemainingTime(30); // Reset the remaining time
      localStorage.setItem('isTimerActive', 'true');
      localStorage.setItem('remainingTime', '30');
      toast.success(t('OTP sent successfully'));
      // logger(response, 'signup rep');
    } catch (error) {
      toast.error(t('Error while authenticating'));
      logger(error);
    }
    setIsSendingOtp(false);
  };

  const verifyOtp = async (
    values: FormikValues,
    actions: FormikHelpers<typeof otpValues>
  ) => {
    setIsVerifying(true);
    try {
      let tempotp = values.otp.toString();
      const response = await instance.post('auth/verify-otp', {
        email: otpEmail,
        otp: tempotp,
      });
      toast.success(t('OTP verification successful'));
      setVerify(false);
      actions.resetForm();
      const token = response.data.data;
 

      localStorage.setItem('token', token);
      localStorage.setItem('email', values.email);
      
      setEmailConnected(true);
      handleClose();
      logger(response, 'otp verification rep');
    } catch (error) {
      toast.error(t('Invalid OTP'));
      logger(error);
    }
    setIsVerifying(false);
  };

  React.useEffect(() => {
    let timer: any;
    if (isTimerActive) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);
            setIsTimerActive(false);
            // setIsLoading(false);
            localStorage.setItem('isTimerActive', 'false');
            return 0;
          }
          localStorage.setItem('remainingTime', (prevTime - 1).toString());
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
      localStorage.removeItem('isTimerActive');
      localStorage.removeItem('remainingTime');
    };
  }, [isTimerActive]);

  return (
    <>
      {verify ? (
        <Formik
          initialValues={otpValues}
          validationSchema={otpSchema}
          onSubmit={async (values, actions) => {
            await verifyOtp(values, actions);
          }}
        >
          {({ errors, touched, handleChange, handleBlur, isValid, dirty }) => (
            <FormikForm className='flex w-full flex-col items-center justify-center'>
              <p>
                {t('OTP has been sent to')} {otpEmail ?? ''}{' '}
                {t('Please verify.')}
              </p>
              <Field name='otp'>
                {({ field, formProps }: any) => (
                  <Form.Group
                    className='mb-2'
                    controlId='exampleForm.ControlInput1'
                  >
                    {/* <Form.Label>OTP</Form.Label> */}
                    <Form.Control
                      type='number'
                      placeholder={t('Enter OTP')}
                      value={field.value}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      onInput={handleChange}
                      name='otp'
                    />
                  </Form.Group>
                )}
              </Field>
              <div className='text-danger mb-2'>
                <ErrorMessage className='Mui-err' name='otp' component='div' />
              </div>
              <div className='d-flex justify-content-end gap-4'>
                <Button
                  onClick={resendOtp}
                  disabled={isTimerActive || isSendingOtp}
                  className='default-btn'
                >
                  {isTimerActive ? (
                    `Resend code in  ${remainingTime}`
                  ) : isSendingOtp ? (
                    <Spinner size='sm' />
                  ) : (
                    t('Resend code')
                  )}
                </Button>
                <Button
                  className='publish-btn'
                  disabled={isVerifying}
                  type='submit'
                >
                  {isVerifying ? <Spinner size='sm' /> : t('Verify')}
                </Button>
              </div>
            </FormikForm>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={signInValues}
          // innerRef={formikRef}
          // enableReinitialize
          validationSchema={signInSchema}
          onSubmit={async (values, actions) => {
            await register(values, actions);
          }}
        >
          {({ errors, touched, handleChange, handleBlur, isValid, dirty }) => (
            <FormikForm
              className='flex w-full flex-col items-center justify-center'
              // onChange={(e) => handleImageChange(e)}
            >
              <Field name='email'>
                {({ field, formProps }: any) => (
                  <Form.Group
                    className='mb-2'
                    controlId='exampleForm.ControlInput1'
                  >
                    <div className='d-flex justify-content-between w-100'>
                      <Form.Label>{t('Email')}</Form.Label>
                    </div>

                    <Form.Control
                      type='email'
                      placeholder={t('Email')}
                      value={field.value}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      name='email'
                    />
                  </Form.Group>
                )}
              </Field>
              <div className='text-danger mb-2'>
                <ErrorMessage
                  className='Mui-err'
                  name='email'
                  component='div'
                />
              </div>
              <Field name='password'>
                {({ field, formProps }: any) => (
                  <Form.Group
                    className='mb-2'
                    controlId='exampleForm.ControlInput1'
                  >
                    <div className='d-flex justify-content-between w-100'>
                      <Form.Label>{t('Password')}</Form.Label>
                    </div>
                    <div className='icon-input-cntnr'>
                      <Form.Control
                        type={showPass ? 'text' : 'password'}
                        placeholder={t('Password')}
                        value={field.value}
                        onInput={handleBlur}
                        onChange={handleChange}
                        name='password'
                      />
                      {/* <i className='fa fa-eye-slash'/> */}
                      <i
                        className={showPass ? 'fa fa-eye-slash' : 'fa fa-eye'}
                        onClick={() => setShowpass((pre) => !pre)}
                      />
                    </div>
                  </Form.Group>
                )}
              </Field>
              <div className='text-danger mb-2'>
                <ErrorMessage
                  className='Mui-err'
                  name='password'
                  component='div'
                />
              </div>{' '}
              <Field name='confirm'>
                {({ field, formProps }: any) => (
                  <Form.Group
                    className='mb-2'
                    controlId='exampleForm.ControlInput1'
                  >
                    <div className='d-flex justify-content-between w-100'>
                      <Form.Label>{t('Confirm Password')}</Form.Label>
                    </div>
                    <div className='icon-input-cntnr'>
                      <Form.Control
                        type={showPass2 ? 'text' : 'password'}
                        placeholder={t('Confirm Password')}
                        value={field.value}
                        onInput={handleBlur}
                        onChange={handleChange}
                        name='confirm'
                      />
                      {/* <i className='fa fa-eye-slash'/> */}
                      <i
                        className={showPass2 ? 'fa fa-eye-slash' : 'fa fa-eye'}
                        onClick={() => setShowpass2((pre) => !pre)}
                      />
                    </div>
                  </Form.Group>
                )}
              </Field>
              <div className='text-danger mb-2'>
                <ErrorMessage
                  className='Mui-err'
                  name='confirm'
                  component='div'
                />
              </div>
              <ChangeForm
                isRegister={isRegister}
                setisRegister={setisRegister}
              />
              <div className='d-flex justify-content-end gap-4'>
                <Button
                  className='publish-btn'
                  disabled={isRegistering}
                  onClick={handleClose}
                >
                  {t('Cancel')}
                </Button>
                <Button
                  className='publish-btn'
                  disabled={isRegistering}
                  type='submit'
                >
                  {isRegistering ? <Spinner size='sm' /> : t('Sign Up')}
                </Button>
              </div>
            </FormikForm>
          )}
        </Formik>
      )}
    </>
  );
}
