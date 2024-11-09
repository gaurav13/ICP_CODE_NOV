'use client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import * as React from 'react';
import icpimage from '@/assets/Img/coin-image.png';
// import { Modal } from 'flowbite-react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
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
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { EMAIL_VALIDATE } from '@/constant/regulerExpression';

export default function LoginForm({
  setisRegister,
  isRegister,
  handleClose,
}: {
  setisRegister: (i: boolean) => void;
  handleClose: () => void;
  isRegister: boolean;
}) {
  const [isLoggin, setIsLoggin] = React.useState(false);
  const [isForgot, setIsForgot] = React.useState(false);
  const { t, changeLocale } = useLocalization(LANG);
  const [showPass, setShowpass] = React.useState(false);
  const [isForgetting, setIsForgetting] = React.useState(false);
  const { auth, emailConnected, setEmailConnected } = useConnectPlugWalletStore(
    (state) => ({
      auth: (state as ConnectPlugWalletSlice).auth,
      setEmailConnected: (state as ConnectPlugWalletSlice).setEmailConnected,
      emailConnected: (state as ConnectPlugWalletSlice).emailConnected,
    })
  );

  const loginValues = {
    email: '',
    password: '',
  };
  const loginSchema = object().shape({
    email: string()
      .required(t('Email is required'))
      .trim()
      .matches(EMAIL_VALIDATE, t('Invalid Email')),
    password: string().required(t('Password is required')),
  });
  const forgotPasswordValues = {
    email: '',
  };

  const forgotPasswordSchema = object().shape({
    email: string()
      .required(t('Email is required'))
      .trim()
      .matches(EMAIL_VALIDATE, t('Invalid Email')),
  });

  const login = async (
    values: FormikValues,
    actions: FormikHelpers<typeof loginValues>
  ) => {
    setIsLoggin(true);
    try {
      const response = await instance.post('auth/login', {
        email: values.email,
        password: values.password,
      });
     
      actions.resetForm();
      toast.success(t('Logged In Successfully'));
      logger(response,"sdfasfasdvresponse")
      const token = response.data.data;


      localStorage.setItem('token', token);
      localStorage.setItem('email', values.email);


      setEmailConnected(true);
      handleClose();
      logger(response, 'Login rep');
    } catch (error: any) {
      toast.error(t(error.response.data.errors[0]));
      // toast.error(t('Invalid credentials'))
      logger(error);
    }
    setIsLoggin(false);
  };

  const forgotPassword = async (
    values: FormikValues,
    actions: FormikHelpers<typeof forgotPasswordValues>
  ) => {
    setIsForgetting(true);
    let tempPath = window.location.origin;

    try {
      const response = await instance.post('auth/forgot-password', {
        email: values.email,
        baseUrl: tempPath,
      });
      toast.success(t('Password reset email sent successfully'));
      handleClose();
      actions.resetForm();
      logger(response, 'Forgot Password response');
    } catch (error: any) {
      toast.error(t(error.response.data.errors[0]));
      logger(error);
    }
    setIsForgetting(false);
  };

  return (
    <>
      {isForgot ? (
        <Formik
          initialValues={forgotPasswordValues}
          validationSchema={forgotPasswordSchema}
          onSubmit={async (values, actions) => {
            await forgotPassword(values, actions);
          }}
        >
          {({ errors, touched, handleChange, handleBlur, isValid, dirty }) => (
            <FormikForm className='flex w-full flex-col items-center justify-center'>
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
              <div className='spacer-10' />
              <div className='d-flex justify-content-end gap-4'>
                <Button
                  className='publish-btn'
                  disabled={isForgetting}
                  type='submit'
                >
                  {isForgetting ? <Spinner size='sm' /> : t('Send Reset Email')}
                </Button>
              </div>
            </FormikForm>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={loginValues}
          // innerRef={formikRef}
          // enableReinitialize
          validationSchema={loginSchema}
          onSubmit={async (values, actions) => {
            await login(values, actions);
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
              <div className='flex-div-xs'>
                <ChangeForm
                  isRegister={isRegister}
                  setisRegister={setisRegister}
                />
                <p
                  className={
                    LANG == 'jp'
                      ? 'jpFont focused-text simple-anchor'
                      : 'focused-text simple-anchor'
                  }
                  onClick={() => setIsForgot(true)}
                >
                  {t('Forgot Password?')}
                </p>
              </div>
              <div className='d-flex justify-content-end gap-4'>
                <Button
                  className='publish-btn'
                  disabled={isLoggin}
                  onClick={handleClose}
                >
                  {t('Cancel')}
                </Button>
                <Button
                  className='publish-btn'
                  disabled={isLoggin}
                  type='submit'
                >
                  {isLoggin ? <Spinner size='sm' /> : t('Log in')}
                </Button>
              </div>
            </FormikForm>
          )}
        </Formik>
      )}
    </>
  );
}
