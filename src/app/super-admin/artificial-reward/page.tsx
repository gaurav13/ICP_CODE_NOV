'use client';
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Spinner, Form, Button, Modal } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { UsersList } from '@/components/UsersList';
import { ConnectPlugWalletSlice } from '@/types/store';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import {
  ErrorMessage,
  Field,
  Formik,
  Form as FormikForm,
  FormikProps,
  FormikValues,
} from 'formik';
import { bool, number, object, string } from 'yup';
import { toast } from 'react-toastify';
import Tippy from '@tippyjs/react';
import { Principal } from '@dfinity/principal';
import { E8S } from '@/constant/config';
import ArtificialAndMenualRewarsList from '@/components/transections/MenualAndArtificialHistory';

export default function UserManagment() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const childRef2 = useRef<any>();

  const formikRef = useRef<FormikProps<FormikValues>>(null);
  const pathname = usePathname();
  const feeValues = {
    userId: '',
    amount: '',
  };
  const feeSchema = object().shape({
    userId: string()
      .required('Wallet Address is required')
      .test('min', 'Not a valid userId', (value) => {
        try {
          Principal.fromText(value as string);
          return true;
        } catch {
          return false;
        }
      }),
    amount: number()
      .min(1, 'Reward is required')
      .required('Reward is required')
      .max(10000000000, 'Reward value cannot be greater than 10000000000')
      .integer('Number must be a whole value'),

    // Add a custom test to check the sum
  });
  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });
  const sendReward = async (val: any) => {
    logger(val, 'sendReward');

    if (!identity || auth.state !== 'initialized') return;

    try {
      setIsLoading(true);

      let newReward = val.amount;
      // const principal = Principal.fromText(address);
      let userid = Principal.fromText(val.userId);
      // third perameter will be false if reward is artificial and if menual then it will be true
      let updated = await userActor.give_reward(userid, newReward, false);
      // if (updated)
      toast.success('Reward send to user successfully');

      formikRef?.current?.resetForm();
      setIsLoading(false);
      childRef2?.current?.handleReFetch();
    } catch (error) {
      logger(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.adminManagement && !userAuth.isAdminBlocked) {
      } else {
        router.replace('/super-admin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/super-admin');
    }
  }, [userAuth, auth, pathname]);
  const { t, changeLocale } = useLocalization(LANG);

  return userAuth.userPerms?.adminManagement && !userAuth.isAdminBlocked ? (
    <>
      <main id='main' className='dark'>
        <div className='main-inner admin-main'>
          <Head>
            <title>Hi</title>
          </Head>
          <div className='section admin-inner-pnl' id='top'>
            <Row>
              <Col xl='12' lg='12'>
                <div className=''>
                  <Row className='mb-5'>
                    <Col xl='8' lg='6' md='6'>
                      <h1>Artificial Reward Management</h1>
                    </Col>
                  </Row>
                  <div>
                    <Formik
                      initialValues={feeValues}
                      validationSchema={feeSchema}
                      enableReinitialize
                      innerRef={formikRef}
                      onSubmit={async (values) => {
                        sendReward(values);
                      }}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        validateForm,
                        /* and other goodies */
                      }) => (
                        <FormikForm onSubmit={handleSubmit}>
                          <Row>
                            <Col xl='3' lg='6' md='6'>
                              <Field name='userId'>
                                {({ field, formProps }: any) => (
                                  <Form.Group
                                    className='mb-3'
                                    controlId='formBasicEmail'
                                  >
                                    <Form.Label>
                                      User ID
                                      <Tippy
                                        content={
                                          <div>
                                            <p className='mb-0'>
                                              Enter User ID
                                            </p>
                                          </div>
                                        }
                                      >
                                        <span className='ps-1'>
                                          <i className='fa fa-circle-info' />
                                        </span>
                                      </Tippy>
                                    </Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      type='text'
                                      name='userId'
                                      placeholder='Enter user ID'
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div
                                style={{ height: 35 }}
                                className='text-danger mt-2'
                              >
                                <ErrorMessage
                                  className='Mui-err'
                                  name='userId'
                                  component='div'
                                />
                              </div>
                            </Col>

                            <Col xl='3' lg='6' md='6'>
                              <Field name='amount'>
                                {({ field, formProps }: any) => (
                                  <Form.Group
                                    className='mb-3'
                                    controlId='formBasicEmail'
                                  >
                                    <Form.Label>
                                      {t('Reward Amount')}
                                      <Tippy
                                        content={
                                          <div>
                                            <p className='mb-0'>
                                              Number of BlockZa coins that
                                              you want to send user and user
                                              can't claim these coins.
                                            </p>
                                          </div>
                                        }
                                      >
                                        <span className='ps-1'>
                                          <i className='fa fa-circle-info' />
                                        </span>
                                      </Tippy>
                                    </Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      type='number'
                                      name='amount'
                                      placeholder='BlockZa coins amount'
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div
                                style={{ height: 35 }}
                                className='text-danger mt-2'
                              >
                                <ErrorMessage
                                  className='Mui-err'
                                  name='amount'
                                  component='div'
                                />
                              </div>
                            </Col>
                            <Row>
                              <Col xs='4'>
                                <Button
                                  disabled={isLoading}
                                  className='publish-btn'
                                  type='submit'
                                >
                                  {isLoading ? <Spinner size='sm' /> : 'Apply'}
                                </Button>
                              </Col>
                            </Row>
                          </Row>
                        </FormikForm>
                      )}
                    </Formik>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <ArtificialAndMenualRewarsList menual={false}  btnRef={childRef2}/>
        </div>
      </main>

    </>
  ) : (
    <></>
  );
}
