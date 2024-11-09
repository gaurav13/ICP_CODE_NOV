'use client';
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import {
  ErrorMessage,
  Field,
  Form as FormikForm,
  Formik,
  FormikValues,
  FormikProps,
} from 'formik';
import * as Yup from 'yup';
import logger from '@/lib/logger';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import { toast } from 'react-toastify';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { useRouter } from 'next/navigation';
import DateTimePicker from 'react-datetime-picker';
export default function Page() {
  const formikRef = useRef<FormikProps<FormikValues>>(null);
  const [isLoading, setIsLoading] = useState(false);
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  let campaignId = searchParams.get('campaignId');
  const [campaign, setCampaign] = useState<any>(null);
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const router = useRouter();
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  let todate = new Date(Number(new Date()) - 86400000);
  const validationSchema = Yup.object().shape({
    entryId: Yup.string()
      .required('EntryId is required')
      .min(0, `EntryId cannot be more then 0`)
      .max(1000, `EntryId cannot be more then 1000`),
    startDate: Yup.date()
      .required('start Date is required')
      .min(todate, 'start Date cannot be in the past'),
    endDate: Yup.date()
      .required('End Date is required')
      .min(Yup.ref('startDate'), "End Date can't be before Start Date"),
    isActive: Yup.boolean(),
  });

  const initialValues = {
    entryId: campaign ? campaign.entryId : '',
    isActive: campaign ? campaign.isActive : true,
    startDate: campaign ? campaign.startDate : new Date(),
    endDate: campaign ? campaign.endDate : new Date(),
  };
  async function submitData(values: any, resetForm: any) {
    setIsLoading(true);

    try {
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);
      let unixStartDate = Math.floor(startDate.getTime());
      let unixEndDate = Math.floor(endDate.getTime());
      let tempCampaign = {
        entryId: values.entryId,
        startDate: unixStartDate,
        endDate: unixEndDate,
        isActive: values.isActive,
      };

      if (campaignId) {
        let updateCampaign = await entryActor.update_campaign(
          campaignId,
          tempCampaign,
          userCanisterId
        );
        setIsLoading(false);
        logger(updateCampaign, 'sadasdasdasf');
        if (updateCampaign?.ok) {
          toast.success('Featured Campaign updated successfully.');
        } else {
          toast.error(updateCampaign?.err[0]);
        }
      } else {
        logger(tempCampaign, 'tempServay');
        let newQuizAdd = await entryActor.add_campaign(
          tempCampaign,
          userCanisterId
        );
        setIsLoading(false);
        if (newQuizAdd?.ok) {
          resetForm();
          toast.success('Featured Campaign  created successfully.');
        } else {
          toast.error(newQuizAdd?.err[0]);
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('There is an error while Featured campaign.');
    }
  }
  let getServay = async () => {
    try {
      let getCampaign = await entryActor.getCampaignById_forAdmin(campaignId);
      if (getCampaign && getCampaign.length != 0) {
        let campaign = getCampaign[0];
        let startDate = new Date(Number(campaign.startDate));

        let endDate = new Date(Number(campaign.endDate));
        let tempCampaign = {
          entryId: campaign.entryId,
          startDate: startDate,
          endDate: endDate,
          isActive: campaign.isActive,
        };
        setCampaign(tempCampaign);
      }
    } catch (error) {
      setCampaign(null);
    }
  };
  useEffect(() => {
    if (campaignId) {
      getServay();
    }
  }, [campaignId]);

  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.articleManagement && !userAuth.isAdminBlocked) {
      } else {
        router.replace('/super-admin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/super-admin');
    }
  }, [userAuth, auth]);
  return (
    userAuth.userPerms?.articleManagement &&
    !userAuth.isAdminBlocked && (
      <>
        <main id='main' className='dark'>
          <div className='main-inner admin-main'>
            <Head>
              <title>Hi</title>
            </Head>
            <div className='section admin-inner-pnl' id='top'>
              <Row>
                <Col xl='9' lg='12' className='text-left'>
                  <h1>
                    Featured Campaign Management{' '}
                    <i className='fa fa-arrow-right' />{' '}
                    <span> Add Campaign</span>
                  </h1>
                  <div className='spacer-20' />
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    innerRef={formikRef}
                    enableReinitialize
                    onSubmit={(values, { resetForm }) => {
                      submitData(values, resetForm);
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                    }) => (
                      <Form onSubmit={handleSubmit}>
                        <Row>
                          <Col xl='7' lg='7' md='12'>
                            <Field name='entryId'>
                              {({ field, formProps }: any) => (
                                <Form.Group
                                  className='mb-2'
                                  controlId='exampleForm.ControlTextarea1'
                                >
                                  <Form.Label>EntryId</Form.Label>
                                  <Form.Control
                                    type='text'
                                    name='entryId'
                                    value={values.entryId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Enter entryId'
                                  />
                                </Form.Group>
                              )}
                            </Field>
                            <div className='text-danger mb-2'>
                              <ErrorMessage
                                className='Mui-err'
                                name='entryId'
                                component='div'
                              />
                            </div>
                          </Col>

                          <Col xl='7' lg='7' md='12'>
                            <Field name='isActive'>
                              {({ field, formProps }: any) => (
                                <Form.Group
                                  className='mb-2'
                                  controlId='exampleForm.ControlTextarea1'
                                >
                                  <Form.Check
                                    type='checkbox'
                                    label='Active'
                                    name='isActive'
                                    checked={values.isActive}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                </Form.Group>
                              )}
                            </Field>
                            <div className='text-danger mb-2'>
                              <ErrorMessage
                                className='Mui-err'
                                name='isActive'
                                component='div'
                              />
                            </div>
                          </Col>
                          <Col xl='7' lg='7' md='12'>
                            <Field name='startDate'>
                              {({ field, formProps }: any) => (
                                <Form.Group>
                                  <Form.Label>
                                    Campaign starting Date
                                  </Form.Label>
                                  <DateTimePicker
                                    className={'form-control picker-date'}
                                    onChange={(e) => {
                                      formikRef?.current?.setFieldValue(
                                        'startDate',
                                        e
                                      );
                                    }}
                                    value={field.value}
                                    name='startDate'
                                    format={'y-MM-dd H:mm:ss '}
                                  />
                                </Form.Group>
                              )}
                            </Field>
                            <div className='text-danger mt-2'>
                              <ErrorMessage
                                className='Mui-err'
                                name='startDate'
                                component='div'
                              />
                            </div>
                          </Col>
                          <Col xl='7' lg='7' md='12'>
                            <Field name='endDate'>
                              {({ field, formProps }: any) => (
                                <Form.Group>
                                  <Form.Label>Campaign Ending Date</Form.Label>

                                  <DateTimePicker
                                    className={'form-control picker-date'}
                                    onChange={(e) => {
                                      formikRef?.current?.setFieldValue(
                                        'endDate',
                                        e
                                      );
                                    }}
                                    value={field.value}
                                    name='endDate'
                                    format={'y-MM-dd H:mm:ss '}
                                  />
                                </Form.Group>
                              )}
                            </Field>
                            <div className='text-danger mt-2'>
                              <ErrorMessage
                                className='Mui-err'
                                name='endDate'
                                component='div'
                              />
                            </div>
                          </Col>
                          <Col xl='12' lg='12' md='12'>
                            <Form.Group className='mb-3'>
                              <Button
                                className='reg-btn fill-not ble-brdr'
                                type='submit'
                                disabled={isLoading}
                              >
                                {isLoading ? <Spinner size='sm' /> : 'Submit'}
                              </Button>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </Col>
              </Row>
              <div className='mt-4' />
            </div>
          </div>
        </main>
      </>
    )
  );
}
