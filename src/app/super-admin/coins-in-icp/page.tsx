'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Spinner, Form, Button, Modal } from 'react-bootstrap';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { ConnectPlugWalletSlice } from '@/types/store';
import {
  ErrorMessage,
  Field,
  Formik,
  Form as FormikForm,
  FormikProps,
  FormikValues,
} from 'formik';
import { number, object } from 'yup';
import { toast } from 'react-toastify';
import Tippy from '@tippyjs/react';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { E8S } from '@/constant/config';
import axios from 'axios';
import { debounce } from '@/lib/utils';

export default function UserManagment() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [initialValues, setInitialValues] = useState({
    likeReward: 1,
  });
  const [IcpRate, setIcpRate] = useState(0);

  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const likeRewardRef = useRef<FormikProps<FormikValues>>(null);
  const pathname = usePathname();
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const likeRewardSchema = object().shape({
    likeReward: number()
      .required('Please enter coins amount')
      .min(10, 'Coins Amount can not be less than 10')
      .max(E8S, `Coins Amount can not be more than ${E8S}`)
      .test(
        'is-multiple-of-10',
        'Coins Amount must be a multiple of 10',
        (value) => value % 10 === 0
      ),
  });

  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });
  const handleShow = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    if (isLikeLoading) return;

    setShowModal(false);
  };

  const handleCoinsInIcpUpdate = async () => {
    if (!identity || auth.state !== 'initialized') return;
    try {
      setIsLikeLoading(true);

      let newReward = likeRewardRef?.current?.values.likeReward;
      let updated = await userActor.update_NFT24Coin(newReward);

      logger(updated, 'UPPPPPPppp');
      toast.success('Blockza coins has been updated successfully');
      handleModalClose();
      getInitValues();
      likeRewardRef?.current?.resetForm();
      setIsLikeLoading(false);
    } catch (error) {
      logger(error);
      setIsLikeLoading(false);
    }
  };
  const getInitValues = async () => {
    if (!identity || auth.state !== 'initialized') return;

    const likeReward = await userActor.get_NFT24Coin();
    let amount = Math.ceil(Number(likeReward));
    // let amount = (E8S/Number(likeReward));

    setInitialValues((pre) => {
      return { likeReward: amount };
    });
  };
  async  function getRateOfIcp() {    
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd`,
    );
    logger(response,"response")
  
    if(response?.status ==200){
      setIcpRate(response?.data?.["internet-computer"]?.usd)
      // return response?.data?.["internet-computer"]?.usd
    }
      
    }
    const debouncedFetchResults = useCallback(debounce(getRateOfIcp, 500), []);
  
  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.adminManagement && !userAuth.isAdminBlocked) {
        getInitValues();
        debouncedFetchResults()
      } else {
        router.replace('/super-admin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/super-admin');
    }
  }, [userAuth, auth, pathname]);

  return userAuth.userPerms?.adminManagement && !userAuth.isAdminBlocked ? (
    <>
      <main id='main' className='dark'>
        <div className='main-inner admin-main'>
          <Head>
            <title>Hi</title>
          </Head>
          <div className='section admin-inner-pnl' id='top'>
            <Row className='mb-5'>
              <Col xl='8' lg='6' md='6'>
                <h1>BlockZa Coins</h1>
              </Col>
            </Row>
            <Row>
              <Col>
              <span>1$  ≈ {(1/IcpRate).toFixed(6)} </span>
              </Col>
            </Row>
            <Row>
              <Col xl='10' lg='12'>
                <div className='mt-5'>
                  <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validationSchema={likeRewardSchema}
                    innerRef={likeRewardRef}
                    onSubmit={async (values) => {
                      handleCoinsInIcpUpdate();
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
                          <Col xs='3' sm='2' md='1'>
                            <Field name='icp'>
                              {({ field, formProps }: any) => (
                                <Form.Group controlId='formBasicEmail'>
                                  <Form.Label>Doller</Form.Label>
                                  <Form.Control
                                    value={1}
                                    disabled
                                    type='number'
                                    name='likeReward'
                                  />
                                </Form.Group>
                              )}
                            </Field>
                          </Col>
                          <div
                            className=' d-flex justify-content-center align-items-center'
                            style={{ width: '10px' }}
                          >
                            <div>=</div>
                      
                          </div>
                          <Col xs='8' lg='4'>
                            <Field name='likeReward'>
                              {({ field, formProps }: any) => (
                                <Form.Group controlId='formBasicEmail'>
                                  <Form.Label>
                                  BlockZa Coins
                                    <Tippy
                                      content={
                                        <div>
                                          <p className='mb-0'>
                                            How many BlockZa coins will be
                                            in one ICP.
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
                                    name='likeReward'
                                    placeholder='eg. 1000 '
                                  />
                                </Form.Group>
                              )}
                            </Field>
                            <div
                              style={{ height: 35 }}
                              className='text-danger '
                            >
                              <ErrorMessage
                                className='Mui-err '
                                name='likeReward'
                                component='div'
                              />
                            </div>
                          </Col>
                        </Row>
                        <Col xs='4' className='d-flex align-items-end'>
                          <Button
                            disabled={isLikeLoading}
                            className='publish-btn'
                            type='submit'
                          >
                            {isLikeLoading ? <Spinner size='sm' /> : 'Apply'}
                          </Button>
                        </Col>
                      </FormikForm>
                    )}
                  </Formik>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </main>
    </>
  ) : (
    <></>
  );
}
