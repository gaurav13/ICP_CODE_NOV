'use client';
import {
  Formik,
  Field,
  ErrorMessage,
  Form as FormikForm,
  FormikValues,
  FormikHelpers,
} from 'formik';
import { object, string, ref } from 'yup';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import instance from '@/components/axios';
import { toast } from 'react-toastify';
import logger from '@/lib/logger';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { STRONG_PASSWORD, STRONG_PASSWORD_SMS } from '@/constant/validations';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';

// Define initial form values
const resetPasswordValues = {
  newPassword: '',
  confirmPassword: '',
};

export default function ResetPassword() {
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const router = useRouter();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const { t, changeLocale } = useLocalization(LANG);
  const [isResetting, setIsResetting] = useState(false);

  const [isResetSuccessful, setIsResetSuccessful] = useState(false);

  // Define form validation schema
  const resetPasswordSchema = object().shape({
    newPassword: string()
      .min(6, STRONG_PASSWORD_SMS)
      .required(t('New Password is required'))
      .matches(STRONG_PASSWORD, STRONG_PASSWORD_SMS),

    confirmPassword: string()
      .oneOf([ref('newPassword')], t('Passwords must match'))
      .required(t('Confirm password is required'))
      .matches(STRONG_PASSWORD, STRONG_PASSWORD_SMS),
  });
  const resetPassword = async (
    values: FormikValues,
    actions: FormikHelpers<typeof resetPasswordValues>
  ) => {
    setIsResetting(true);
    try {
      const response = await instance.post('/auth/reset-password', {
        resetPasswordToken: token,
        newPassword: values.newPassword,
      });
      toast.success(t('Password reset successfully'));
      router.replace('/');
      // setIsResetSuccessful(true);
      actions.resetForm();
      logger(response, t('Reset Password response'));
    } catch (error: any) {
      toast.error(t(error.response?.data?.errors[0]) || t('An error occurred'));
      logger(error);
    }
    setIsResetting(false);
  };

  if (isResetSuccessful) {
    return <p>{t('Password has been reset. You can leave this page.')}</p>;
  }

  return (
    <main id='main'>
      <div className='main-inner'>
        <div className='inner-content'>
          <div className='reset-form'>
            <Formik
              initialValues={resetPasswordValues}
              validationSchema={resetPasswordSchema}
              onSubmit={resetPassword}
            >
              {({
                errors,
                touched,
                handleChange,
                handleBlur,
                isValid,
                dirty,
              }) => (
                <FormikForm className='flex w-full flex-col items-center justify-center'>
                  <Field name='newPassword'>
                    {({ field }: any) => (
                      <Form.Group
                        className='mb-2'
                        controlId='exampleForm.ControlInput1'
                      >
                        <div className='d-flex justify-content-between w-100'>
                          <Form.Label>{t('New Password')}</Form.Label>
                        </div>
                        <div className='icon-input-cntnr'>
                          <Form.Control
                            type={showPass1 ? 'text' : 'password'}
                            placeholder={t('New Password')}
                            value={field.value}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onInput={handleBlur}
                            name='newPassword'
                          />
                          <i
                            className={
                              showPass1 ? 'fa fa-eye-slash' : 'fa fa-eye'
                            }
                            onClick={() => setShowPass1((pre) => !pre)}
                          />
                          {/* <i className='fa fa-eye-slash'/> */}
                        </div>
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mb-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='newPassword'
                      component='div'
                    />
                  </div>

                  <Field name='confirmPassword'>
                    {({ field }: any) => (
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
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onInput={handleBlur}
                            name='confirmPassword'
                          />
                          <i
                            className={
                              showPass2 ? 'fa fa-eye-slash' : 'fa fa-eye'
                            }
                            onClick={() => setShowPass2((pre) => !pre)}
                          />
                          {/* <i className='fa fa-eye-slash'/> */}
                        </div>
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mb-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='confirmPassword'
                      component='div'
                    />
                  </div>
                  <div className='spacer-10' />
                  <div className='d-flex justify-content-end gap-4'>
                    <Button
                      className='publish-btn'
                      disabled={isResetting}
                      type='submit'
                    >
                      {isResetting ? (
                        <Spinner size='sm' />
                      ) : (
                        t('Reset Password')
                      )}
                    </Button>
                  </div>
                </FormikForm>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </main>
  );
}
