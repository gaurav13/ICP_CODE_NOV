'use client';
import React, { useEffect, useRef, useState } from 'react';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import {
  Row,
  Col,
  Breadcrumb,
  Dropdown,
  Spinner,
  Form,
  Button,
} from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Link from 'next/link';
import map from '@/assets/Img/Icons/icon-map.png';
import icondelivery from '@/assets/Img/Icons/icon-delivery.png';
import iconmail from '@/assets/Img/Icons/icon-attach.png';
import iconcall from '@/assets/Img/Icons/icon-call.png';
import logger from '@/lib/logger';
import {
  Formik,
  FormikProps,
  Form as FormikForm,
  Field,
  FormikValues,
  ErrorMessage,
  FormikHelpers,
} from 'formik';
import { number, object, string } from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { EMAIL_VALIDATE } from '@/constant/regulerExpression';
import { siteConfig } from '@/constant/config';
import { usePathname, useRouter } from 'next/navigation';
export default function ContactUs() {
  const [isSending, setIsSending] = useState(false);
  const { t, changeLocale } = useLocalization(LANG);
  const location = usePathname();
  const router = useRouter();
  const contectUsInValues = {
    email: '',
    name: '',
    messge: '',
  };
  const contectUsSchema = object().shape({
    email: string()
      .required(t('Email is required'))
      .trim()
      .matches(EMAIL_VALIDATE, t('Invalid Email')),
    name: string()
      .min(3, "Name can't be less then 3 characters.")
      .max(50, "Name can't be more then 50 characters.")
      .required(t('Name is required')),
    message: string()
      .min(10, "Message can't be less then 10 characters.")
      .max(500, "Message can't be more then 500 characters.")
      .required(t('Message is required')),
  });
  const contactFormikRef = useRef<FormikProps<FormikValues>>(null);

  let handleSubmitfn = async (e: any) => {
    setIsSending(true);
    try {
      const response = await axios.post(
        `${process.env.BASE_URL}email/contactUs`,
        {
          email: e.email,
          name: e.name,
          message: e.message,
        }
      );
      if (response) {
        toast.success(
          t(
            "Your message has been successfully submitted. We'll get back to you shortly. Thank you!"
          )
        );
        setIsSending(false);
        contactFormikRef.current?.resetForm();
        // toast.success(response);
      }
    } catch (error) {
      // logger(error,"sadfdsffdsf")
      toast.error(t('There was an issue while sending message'));
      setIsSending(false);
    }
  };
  useEffect(() => {
    if (location.startsWith("/contact-us") && !location.endsWith('/')) {
     router.push(`/contact-us/`);
   }
     }, [])
  return (
    <>
      <main id='main'>
        <div className='main-inner detail-inner-Pages pri-term-pnl'>
          <div className='inner-content'>
            <div className='pri-term-inner'>
              <Row>
                <Col xl='12' lg='12'>
                  <div className='event-innr'>
                    <div className='flex-details-pnl'>
                      <div className='left-side-pnl'>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant='success'
                            className='fill'
                            id='dropdown-basic'
                          >
                            {t('All Content')}
                            <i className='fa fa-angle-down' />
                          </Dropdown.Toggle>
                          {/* 
                      <Dropdown.Menu>
                        <Dropdown.Item href='#/action-1'>
                          Trending
                        </Dropdown.Item>
                        <Dropdown.Item href='#/action-2'>
                          Trending
                        </Dropdown.Item>
                      </Dropdown.Menu> */}
                        </Dropdown>
                        <div className='spacer-20' />
                        <ul className='tab-blue-list'>
                          <li>
                            <Link className='active' href='#'>
                              <i className='fa fa-angle-right' />{' '}
                              {t('Contact Us')}
                            </Link>
                          </li>
                          {/* <li>
                        <Link href='#companySecrch'>
                          <i className='fa fa-angle-right'/> Search for
                          Company
                        </Link>
                      </li> */}
                        </ul>
                      </div>

                      <div className='right-detail-pnl'>
                        <div className='spacer-20' />
                        <h2>
                          {' '}
                          {t('Call Us, Write Us,')}
                          <br />
                          {t('Or Knock On Our Door')}
                        </h2>
                        <div className='spacer-10' />
                        <div className='banner-text-pnl'>
                          <div className='bg-layer contact' />
                          <h3>
                            {/* Let's Meet You And Learn<br/> All About Your
                            Business */}
                            {t(
                              'Let us Meet You And Learn All About Your Business'
                            )}
                          </h3>
                          <p>
                            {t(
                              'Are you seeking limitless Opportunities, a Dynamic, Vibrant, and Flexible Work Environment?'
                            )}
                          </p>
                          <p>
                            {t(
                              'Your comments and requests, together with other information we ask for in our web form, will be used for the purpose of improving BlockZa – JAPAN broadcasts and website, and may be introduced on our website, in our publications, or in our programs.'
                            )}
                          </p>
                        </div>
                        <div className='banner-text-pnl trans'>
                          <ul className='contact-info-list'>
                            <li>
                              <div className='img-pnl'>
                                <Image src={icondelivery} alt='Map' />
                              </div>
                              <div className='txt-pnl'>
                                <h5>{t('Editorial Team- 24/7 Service')}</h5>
                                <div className='spacer-20' />
                                <p>{t('Monday - Thursday: 9AM - 7PM')}</p>
                                <p>{t('Friday: 9AM - 5PM')}</p>
                                <p>{t('Sunday: Closed')}</p>
                              </div>
                            </li>
                          </ul>
                          <ul className='contact-info-list'>
                            <li>
                              <Link
                                target='_blank'
                                href='https://www.google.com/maps/place/344-0063,+Japan/@35.9718336,139.7635914,16z/data=!3m1!4b1!4m6!3m5!1s0x6018beaea9619b53:0x169cec0083bd0749!8m2!3d35.9741584!4d139.7703197!16s%2Fg%2F1vhkkkj_?entry=ttu'
                              >
                                <div className='img-pnl'>
                                  <Image src={map} alt='Map' />
                                </div>
                                <div className='txt-pnl'>
                                  <h5>{t('We are On The Map​')}​</h5>
                                  <p>
                                    {siteConfig.address}
                                  </p>
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link href={`callto:${siteConfig.phnumber}`}>
                                <div className='img-pnl'>
                                  <Image src={iconcall} alt='call' />
                                </div>
                                <div className='txt-pnl'>
                                  <h5>{t('Give Us A Call')}</h5>
                                  <p>{siteConfig.phnumber}</p>
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link href='mailto:support@blockza.io'>
                                <div className='img-pnl'>
                                  <Image src={iconmail} alt='Mail' />
                                </div>
                                <div className='txt-pnl'>
                                  <h5>{t('Send Us A Message​')}​</h5>
                                  <p>support@blockza.io</p>
                                </div>
                              </Link>
                            </li>
                          </ul>
                        </div>
                        <div className='spacer-20' />
                        <h2>{t('Contact Us')}</h2>
                        <p className='red-text m-0'>
                          {t('Fields marked with an * are required')}
                        </p>
                        <div className='spacer-10' />
                        <Formik
                          initialValues={contectUsInValues}
                          validationSchema={contectUsSchema}
                          innerRef={contactFormikRef}
                          onSubmit={async (values) => {
                            await handleSubmitfn(values);
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
                            <FormikForm className='flex w-full flex-col items-center justify-center'>
                              <Field name='name'>
                                {({ field, formProps }: any) => (
                                  <Form.Group
                                    className='mb-2'
                                    controlId='exampleForm.ControlInput1'
                                  >
                                    {/* <Form.Label>OTP</Form.Label> */}
                                    <Form.Control
                                      type='text'
                                      placeholder={t('Name*')}
                                      value={field.value}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      onInput={handleChange}
                                      name='name'
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div className='text-danger mb-2'>
                                <ErrorMessage
                                  className='Mui-err'
                                  name='name'
                                  component='div'
                                />
                              </div>
                              <Field name='email'>
                                {({ field, formProps }: any) => (
                                  <Form.Group
                                    className='mb-2'
                                    controlId='exampleForm.ControlInput1'
                                  >
                                    {/* <Form.Label>OTP</Form.Label> */}
                                    <Form.Control
                                      type='text'
                                      placeholder={t('Email*')}
                                      value={field.value}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      onInput={handleChange}
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
                              <Field name='message'>
                                {({ field, formProps }: any) => (
                                  <Form.Group
                                    className='mb-2'
                                    controlId='exampleForm.ControlInput1'
                                  >
                                    {/* <Form.Label>OTP</Form.Label> */}
                                    <Form.Control
                                      as='textarea'
                                      placeholder={t('Message*')}
                                      rows={1}
                                      value={field.value}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      onInput={handleChange}
                                      name='message'
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div className='text-danger mb-2'>
                                <ErrorMessage
                                  className='Mui-err'
                                  name='message'
                                  component='div'
                                />
                              </div>
                              <Form.Group controlId='exampleForm.ControlTextarea1'>
                                <Button type='submit' className='submit-btn'>
                                  {isSending ? (
                                    <Spinner size='sm' />
                                  ) : (
                                    t('submit')
                                  )}
                                </Button>
                              </Form.Group>
                            </FormikForm>
                          )}
                        </Formik>

                        <div className='spacer-50' />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
