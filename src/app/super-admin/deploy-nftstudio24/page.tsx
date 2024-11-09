'use client';
import React, { useEffect, useState } from 'react';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import Head from 'next/head';
import { Row, Col, Form, Button, Spinner, Modal } from 'react-bootstrap';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import NavBarDash from '@/components/DashboardNavbar/NavDash';
import SideBarDash from '@/components/SideBarDash/SideBarDash';
import { ConnectPlugWalletSlice } from '@/types/store';
import { UserPermissions } from '@/types/store';
import {
  ErrorMessage,
  Field,
  Formik,
  Form as FormikForm,
  FormikHelpers,
  FormikValues,
} from 'formik';
import { array, boolean, object, string } from 'yup';
import { MAX_NAME_CHARACTERS } from '@/constant/validations';
import { Roles } from '@/types/profile';
import { Principal } from '@dfinity/principal';
import { toast } from 'react-toastify';
import instance from '@/components/axios';
import { EMAIL_VALIDATE } from '@/constant/regulerExpression';

interface adminDetails {
  name: string;
  address: string;
  perms: UserPermissions;
}

export default function MakeAdmin() {
  const { t, changeLocale } = useLocalization(LANG);
  const [show, setShow] = React.useState<boolean | undefined>();
  const [isLoggin, setIsLoggin] = React.useState<boolean>(false);
  const [deploying, setDeploying] = useState(false);
  const [showPass, setShowpass] = React.useState(false);
  let [formSubmiting, setFormSubmiting] = useState<boolean>(false);
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const router = useRouter();
  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });

  const loginValues = {
    email: '',
    password: '',
  };
  const loginSchema = object().shape({
    email: string()
      .required('Email is required')
      .trim()
      .matches(EMAIL_VALIDATE, 'Invalid Email'),
    password: string().required('Password is required'),
  });

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setIsLoggin(false);
  };
  // const login = async (
  //   values: FormikValues,
  //   actions: FormikHelpers<typeof loginValues>
  // ) => {
  //   setIsLoggin(true);
  //   try {
  //     const response = await instance.post('auth/login', {
  //       email: values.email,
  //       password: values.password,
  //     });
  //     actions.resetForm();
  //     toast.success('Logged In Successfully');
  //     const token = response.data.data;
  //     localStorage.setItem('token', token);
  //     setEmailConnected(true);
  //     handleClose();
  //     logger(response, 'Login rep');
  //   } catch (error: any) {
  //     toast.error(error.response.data.errors[0]);
  //     logger(error);
  //   }
  //   setIsLoggin(false);
  // }
  const deployBuild = async (
    values: FormikValues,
    actions: FormikHelpers<typeof loginValues>
  ) => {
    setDeploying(true);
    instance
      .post('/build/deploy', {
        email: values.email,
        password: values.password,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        logger(res, 'DEEEEEEEE');
        setDeploying(false);
        actions?.resetForm();
      })
      .catch((err) => {
        toast.error(err?.response?.data?.errors[0]);
        console.warn(err);
        setDeploying(false);
      });
  };

  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.adminManagement) {
      } else {
        router.replace('/super-admin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/super-admin');
    }
  }, [userAuth, auth]);

  return (
    userAuth.userPerms?.adminManagement && (
      <>
        <main id='main' className='dark'>
          <div className='main-inner admin-main'>
            <div className='section admin-inner-pnl' id='top'>
              <Row>
                <Col xl='9' lg='12' className='text-left'>
                  <h1>
                    Build Deployment <i className='fa fa-arrow-right' />{' '}
                    <span>Deploy BlockZa</span>
                  </h1>
                  <div className='spacer-20' />
                  <p>
                    Deploy the build to the BlockZa canister. This will
                    make the newly created articles available for the google
                    bots.
                  </p>
                  <Button
                    className='publish-btn'
                    onClick={handleShow}
                    // disabled={deploying}
                  >
                    {'Deploy'}
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </main>
        <Modal centered show={show} onHide={handleClose} onClose={handleClose}>
          <Modal.Header closeButton className=''>
            <h5 className='mb-0'>Deploy Build</h5>
          </Modal.Header>
          <Modal.Body>
            <div className=''>
              <Formik
                initialValues={loginValues}
                // innerRef={formikRef}
                // enableReinitialize
                validationSchema={loginSchema}
                onSubmit={async (values, actions) => {
                  await deployBuild(values, actions);
                }}
              >
                {({
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  isValid,
                  dirty,
                }) => (
                  <FormikForm
                    className='flex w-full flex-col items-center justify-center'
                    // onChange={(e) => handleImageChange(e)}
                  >
                    <Field name='email'>
                      {({ field, formProps }: any) => (
                        <Form.Group className='mb-2'>
                          <div className='d-flex justify-content-between w-100'>
                            <Form.Label>Email</Form.Label>
                          </div>

                          <Form.Control
                            type='email'
                            placeholder='Email'
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
                        <Form.Group className='mb-2'>
                          <div className='d-flex justify-content-between w-100'>
                            <Form.Label>Password</Form.Label>
                          </div>
                          <div className='icon-input-cntnr'>
                            <Form.Control
                              type={showPass ? 'text' : 'password'}
                              placeholder='Password'
                              value={field.value}
                              onInput={handleBlur}
                              onChange={handleChange}
                              name='password'
                            />
                            {/* <i className='fa fa-eye-slash'/> */}
                            <i
                              className={
                                showPass ? 'fa fa-eye-slash' : 'fa fa-eye'
                              }
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
                    <div className='d-flex justify-content-end gap-4'>
                      <Button
                        className='publish-btn'
                        disabled={deploying}
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        className='publish-btn'
                        disabled={deploying}
                        type='submit'
                      >
                        {deploying ? <Spinner size='sm' /> : 'Confirm'}
                      </Button>
                    </div>
                  </FormikForm>
                )}
              </Formik>
            </div>
          </Modal.Body>
        </Modal>
      </>
    )
  );
}
