'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Spinner, Form, Button, Modal } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import {
  makeCommentActor,
  makeEntryActor,
  makeUserActor,
} from '@/dfx/service/actor-locator';
import { ConnectPlugWalletSlice } from '@/types/store';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
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
import { t } from 'i18next';
import {
  MAX_ARTICLE_READ_REWARD,
  MAX_DAILY_LOGIN_REWARD,
  MAX_MINIMUM_REWARD_TO_CLAIM,
  MIN_ARTICLE_READ_REWARD,
  MIN_DAILY_LOGIN_REWARD,
  MIN_MINIMUM_REWARD_TO_CLAIM,
} from '@/constant/validations';
import RewardChangerList from '@/components/ManageReward/RewardChangers';
import { debounce } from '@/lib/utils';

export default function UserManagment() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [initialValues, setInitialValues] = useState({
    likeReward: 0,
    promotion: 0,
    platform: 0,
    admin: 0,
  });
  const [commentRewardVal, setCommentReward] = useState({ commentReward: 0 });
  const [emailVerificationReward, setEmailVerificationReward] = useState({
    emailVerificationReward: 0,
  });
  const [newUserReward, setNewUserReward] = useState({ newUserReward: 0 });
  const [articleReadReward, setArticleReadReward] = useState({
    articleReadReward: 0,
  });
  const [profileCompReward, setProfileCompReward] = useState({
    profileCompReward: 0,
  });
  const [minimumRewardToClaim, setMinimumRewardToClaim] = useState({
    minimumRewardToClaim: 0,
  });
  const [dailyLoginReward, setDailyLoginReward] = useState({
    dailyLoginReward: 0,
  });

  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isNewUserRewardLoading, setIsNewUserRewardLoading] = useState(false);
  const [articleReadRewardLoading, setIsArticleReadRewardLoading] =
    useState(false);
    const [profileCompRewardLoading, setIsProfileCompRewardLoading] =
    useState(false);
  const [minimumRewardToClaimLoading, setMinimumRewardToClaimLoading] =
    useState(false);
  const [dailyLoginRewardLoading, setDailyLoginRewardLoading] = useState(false);

  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));

  const formikRef = useRef<FormikProps<FormikValues>>(null);
  const likeRewardRef = useRef<FormikProps<FormikValues>>(null);
  const commentRewardRef = useRef<FormikProps<FormikValues>>(null);
  const emailVerificationRewardRef = useRef<FormikProps<FormikValues>>(null);
  const newUserRewardRef = useRef<FormikProps<FormikValues>>(null);
  const articleReadRewardRef = useRef<FormikProps<FormikValues>>(null);
  const profileCompRewardRef = useRef<FormikProps<FormikValues>>(null);
  const minimumRewardToClaimRef = useRef<FormikProps<FormikValues>>(null);
  const dailyLoginRewardRef = useRef<FormikProps<FormikValues>>(null);
  const historyList = useRef<any>();

  const pathname = usePathname();
  const feeValues = {
    promotion: initialValues.promotion,
    platform: initialValues.platform,
    admin: initialValues.admin,
  };
  const likeRewardValues = {
    likeReward: initialValues.likeReward,
  };
  const likeRewardSchema = object().shape({
    likeReward: number()
      .required('Please Enter Reward Amount')
      .min(10, 'Reward Amount can not be less than 10')
      .test(
        'is-multiple-of-10',
        'Reward Amount must be a multiple of 10',
        (value) => value % 10 === 0
      ),
  });
  const commentRewardSchema = object().shape({
    commentReward: number()
      .required('Please Enter Reward Amount')
      .min(10, 'Reward Amount can not be less than 10')
      .test(
        'is-multiple-of-10',
        'Reward Amount must be a multiple of 10',
        (value) => value % 10 === 0
      ),
  });
  const newUserRewardSchema = object().shape({
    newUserReward: number()
      .required('Please Enter Reward Amount')
      .min(10, 'Reward Amount can not be less than 10')
      .test(
        'is-multiple-of-10',
        'Reward Amount must be a multiple of 10',
        (value) => value % 10 === 0
      ),
  });
  const emailVerificationRewardSchema = object().shape({
    emailVerificationReward: number()
      .required('Please Enter Reward Amount')
      .min(10, 'Reward Amount can not be less than 10')
      .test(
        'is-multiple-of-10',
        'Reward Amount must be a multiple of 10',
        (value) => value % 10 === 0
      ),
  });
  const articleReadRewardSchema = object().shape({
    articleReadReward: number()
      .required('Please Enter Reward Amount')
      .min(
        MIN_ARTICLE_READ_REWARD,
        `Reward Amount can not be less than ${MIN_ARTICLE_READ_REWARD}`
      )
      .max(
        MAX_ARTICLE_READ_REWARD,
        `Reward Amount can not be less than ${MAX_ARTICLE_READ_REWARD}`
      ),
  });
  const minimumRewardToClaimSchema = object().shape({
    minimumRewardToClaim: number()
      .required('Please Enter Reward Amount')
      .min(
        MIN_MINIMUM_REWARD_TO_CLAIM,
        `Reward Amount can not be less than ${MIN_MINIMUM_REWARD_TO_CLAIM}`
      )
      .max(
        MAX_MINIMUM_REWARD_TO_CLAIM,
        `Reward Amount can not be less than ${MIN_MINIMUM_REWARD_TO_CLAIM}`
      ),
  });
  const dailyLoginRewardSchema = object().shape({
    dailyLoginReward: number()
      .required('Please Enter Reward Amount')
      .min(
        MIN_DAILY_LOGIN_REWARD,
        `Reward Amount can not be less than ${MIN_DAILY_LOGIN_REWARD}`
      )
      .max(
        MAX_DAILY_LOGIN_REWARD,
        `Reward Amount can not be less than ${MAX_DAILY_LOGIN_REWARD}`
      ),
  });
  const feeSchema = object().shape({
    promotion: number()
      .min(1, 'Promotion poll is required')
      .max(100, 'Promotion value cannot be greater than 100')
      .integer('Number must be a whole value'),

    platform: number()
      .min(1, 'Platform fee is required')
      .max(100, 'Platform value cannot be greater than 100')
      .integer('Number must be a whole value'),

    admin: number()
      .min(1, 'Admin fee is required')
      .max(100, 'Admin value cannot be greater than 100')
      .integer('Number must be a whole value'),

    // Add a custom test to check the sum
  });
  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });

  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const commentActor = makeCommentActor({
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
  const handleRewardDistributionUpdate = async (values: FormikValues) => {
    let sum = values.admin + values.platform + values.promotion;
    if (sum !== 100) {
      return toast.error('The sum of these values must be 100');
    }
    if (!identity || auth.state !== 'initialized') return;
    try {
      setIsLoading(true);

      let newRewardConfig = {
        master: values.promotion,
        admin: values.admin,
        platform: values.platform,
      };
      let updated = await entryActor.update_reward(
        userCanisterId,
        newRewardConfig
      );

      toast.success('Distribution Values have been updated successfully');
      formikRef?.current?.resetForm();
      getInitValues();
      setIsLoading(false);
      historyList?.current?.handleReFetch();
    } catch (error) {
      setIsLoading(false);
    }
  };
  const handleLikeRewardUpdate = async () => {
    if (!identity || auth.state !== 'initialized') return;
    try {
      setIsLikeLoading(true);

      let newReward = likeRewardRef?.current?.values.likeReward;
      let updated = await entryActor.update_like_reward(
        userCanisterId,
        newReward
      );

      toast.success('Like reward has been updated successfully');
      handleModalClose();
      getInitValues();
      likeRewardRef?.current?.resetForm();
      historyList?.current?.handleReFetch();

      setIsLikeLoading(false);
    } catch (error) {
      setIsLikeLoading(false);
    }
  };
  const handleCommentRewardUpdate = async () => {
    if (!identity || auth.state !== 'initialized') return;
    try {
      setIsCommentLoading(true);

      let newReward = commentRewardRef?.current?.values.commentReward;
      let updated = await commentActor.update_comment_reward(
        userCanisterId,
        newReward
      );
      toast.success('Comment reward has been updated successfully');

      getInitcommentReward();
      commentRewardRef?.current?.resetForm();
      historyList?.current?.handleReFetch();

      setIsCommentLoading(false);
    } catch (error) {
      setIsCommentLoading(false);
    }
  };
  const handleEmailVerficationRewardUpdate = async () => {
    if (!identity || auth.state !== 'initialized') return;
    try {
      setIsEmailLoading(true);

      let newReward =
        emailVerificationRewardRef?.current?.values.emailVerificationReward;
      let updated = await userActor.updateEmailVerificationReward(newReward);
      toast.success('Email verifcation reward has been updated successfully');

      getInitEmailReward();
      emailVerificationRewardRef?.current?.resetForm();
      historyList?.current?.handleReFetch();

      setIsEmailLoading(false);
    } catch (error) {
      setIsEmailLoading(false);
    }
  };
  const handleNewUserRewardUpdate = async () => {
    if (!identity || auth.state !== 'initialized') return;
    try {
      setIsNewUserRewardLoading(true);

      let newReward = newUserRewardRef?.current?.values.newUserReward;
      let updated = await userActor.updateNewUserReward(newReward);
      toast.success('New user reward has been updated successfully');

      getInitNewUserReward();
      newUserRewardRef?.current?.resetForm();
      historyList?.current?.handleReFetch();

      setIsNewUserRewardLoading(false);
    } catch (error) {
      setIsNewUserRewardLoading(false);
    }
  };
  const handleArticleRewardUpdate = async () => {
    if (!identity || auth.state !== 'initialized') return;
    try {
      setIsArticleReadRewardLoading(true);

      let newReward = articleReadRewardRef?.current?.values.articleReadReward;
      let updated = await userActor.updateArticleReadReward(newReward);
      toast.success('Article reading reward has been updated successfully');

      getInitArticleReadReward();
      articleReadRewardRef?.current?.resetForm();
      historyList?.current?.handleReFetch();

      setIsArticleReadRewardLoading(false);
    } catch (error) {
      setIsArticleReadRewardLoading(false);
    }
  };

  const handleProfileCompRewardUpdate = async () => {
    if (!identity || auth.state !== 'initialized') return;
    try {
      setIsProfileCompRewardLoading(true);

      let newReward = profileCompRewardRef?.current?.values.profileCompReward;
      let updated = await userActor.updateProfileCompReward(newReward);
      toast.success('Profile Completing  reward has been updated successfully');

      getInitProfileCompReward()
      profileCompRewardRef?.current?.resetForm();
      historyList?.current?.handleReFetch();

      setIsProfileCompRewardLoading(false);
    } catch (error) {
      setIsProfileCompRewardLoading(false);
    }
  };
  const handleUpdateMinimumRewardToClaim = async () => {
    if (!identity || auth.state !== 'initialized') return;
    try {
      setMinimumRewardToClaimLoading(true);

      let newReward =
        minimumRewardToClaimRef?.current?.values.minimumRewardToClaim;
      let updated = await userActor.updateMinimumClaimReward(newReward);
      toast.success('Minimum claimable reward has been updated successfully');

      getInitMinimumRewardToClaim();
      minimumRewardToClaimRef?.current?.resetForm();
      historyList?.current?.handleReFetch();

      setMinimumRewardToClaimLoading(false);
    } catch (error) {
      setMinimumRewardToClaimLoading(false);
    }
  };
  const handleUpdateDailyLoginReward = async () => {
    if (!identity || auth.state !== 'initialized') return;
    try {
      setDailyLoginRewardLoading(true);

      let newReward = dailyLoginRewardRef?.current?.values.dailyLoginReward;
      let updated = await userActor.updateDailyLoginReward(newReward);
      toast.success('Daily login reward has been updated successfully');

      getInitLoginReward();
      dailyLoginRewardRef?.current?.resetForm();
      historyList?.current?.handleReFetch();

      setDailyLoginRewardLoading(false);
    } catch (error) {
      setDailyLoginRewardLoading(false);
    }
  };
  const getInitValues = async () => {
    if (!identity || auth.state !== 'initialized') return;

    const likeReward = await entryActor.get_like_reward();

    const config = await entryActor.get_reward();
    setInitialValues((prev) => {
      return {
        likeReward: parseInt(likeReward),
        admin: parseInt(config.admin),
        platform: parseInt(config.platform),
        promotion: parseInt(config.master),
      };
    });
  };
  let getInitcommentReward = async () => {
    const commentReward = await commentActor.get_comment_reward();

    setCommentReward((prev) => {
      return {
        commentReward: parseInt(commentReward),
      };
    });
  };
  let getInitEmailReward = async () => {
    const initEmailReward = await userActor.getEmailVerificationReward();

    if (initEmailReward) {
      setEmailVerificationReward((prev) => {
        return {
          emailVerificationReward: parseInt(initEmailReward),
        };
      });
    }
  };
  let getInitNewUserReward = async () => {
    const initNewUserReward = await userActor.get_newUserReward();
    if (initNewUserReward) {
      setNewUserReward((prev) => {
        return {
          newUserReward: parseInt(initNewUserReward),
        };
      });
    }
  };
  let getInitArticleReadReward = async () => {
    const initArticleReadReward = await userActor.getArticleReadReward();

    if (initArticleReadReward) {
      setArticleReadReward((prev) => {
        return {
          articleReadReward: parseInt(initArticleReadReward),
        };
      });
    }
  };
  let getInitProfileCompReward = async () => {
    const initProfileCompReward = await userActor.getProfileCompReward();

    if (initProfileCompReward) {
      setProfileCompReward((prev) => {
        return {
          profileCompReward: parseInt(initProfileCompReward),
        };
      });
    }
  };
  let getInitMinimumRewardToClaim = async () => {
    const initMinimumRewardToClaim = await userActor.getMinimumClaimReward();

    if (initMinimumRewardToClaim) {
      setMinimumRewardToClaim((prev) => {
        return {
          minimumRewardToClaim: parseInt(initMinimumRewardToClaim),
        };
      });
    }
  };
  let getInitLoginReward = async () => {
    const getDailyLoginReward = await userActor.getDailyLoginReward();

    if (getDailyLoginReward) {
      setDailyLoginReward((prev) => {
        return {
          dailyLoginReward: parseInt(getDailyLoginReward),
        };
      });
    }
  };
/**
 * getInitialReward to get ininitails rewards
 * @param null 
 * @return null
 */
  function getInitialReward(){
    getInitValues();
    getInitMinimumRewardToClaim();
    getInitArticleReadReward();
    getInitNewUserReward();
    getInitEmailReward();
    getInitProfileCompReward();
    getInitcommentReward();
    getInitLoginReward();
  };
  /**
 * getInitialValues to get initails values of rewards
 * @param null 
 * @return null
 */
  function getInitialValues(){
    getInitValues();
  }
  const debouncedFetchResults = useCallback(debounce(getInitialReward, 500), []);

  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.adminManagement && !userAuth.isAdminBlocked) {
        debouncedFetchResults();
        getInitialValues()
      } else {
        router.replace('/super-admin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/super-admin');
    }
  }, [userAuth, auth, pathname,identity]);

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
                      <h1>Reward Management</h1>
                    </Col>
                  </Row>
                  <div>
                    <Formik
                      initialValues={feeValues}
                      validationSchema={feeSchema}
                      enableReinitialize
                      innerRef={formikRef}
                      onSubmit={async (values) => {
                        handleRewardDistributionUpdate(values);
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
                              <Field name='promotion'>
                                {({ field, formProps }: any) => (
                                  <Form.Group
                                    className='mb-3'
                                    controlId='formBasicEmail'
                                  >
                                    <Form.Label>
                                      Article Promotion Pool
                                      <Tippy
                                        content={
                                          <div>
                                            <p className='mb-0'>
                                              Percentage of icp that will go to
                                              the pool of article which will
                                              then be used to reward the users
                                              who vote on the article.
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
                                      name='promotion'
                                      placeholder='Enter % value'
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
                                  name='promotion'
                                  component='div'
                                />
                              </div>
                            </Col>
                            <Col xl='3' lg='6' md='6'>
                              <Field name='platform'>
                                {({ field, formProps }: any) => (
                                  <Form.Group
                                    className='mb-3'
                                    controlId='formBasicEmail'
                                  >
                                    <Form.Label>
                                      Platform Fee
                                      <Tippy
                                        content={
                                          <div>
                                            <p className='mb-0'>
                                              Percentage of icp that will go to
                                              the platform wallet to maintain
                                              the platform.
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
                                      name='platform'
                                      placeholder='Enter % value'
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
                                  name='platform'
                                  component='div'
                                />
                              </div>
                            </Col>
                            <Col xl='3' lg='6' md='6'>
                              <Field name='admin'>
                                {({ field, formProps }: any) => (
                                  <Form.Group
                                    className='mb-3'
                                    controlId='formBasicEmail'
                                  >
                                    <Form.Label>
                                      Admin Fee
                                      <Tippy
                                        content={
                                          <div>
                                            <p className='mb-0'>
                                              Percentage of icp that will go to
                                              the super admin wallet.
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
                                      name='admin'
                                      placeholder='Enter % value'
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
                                  name='admin'
                                  component='div'
                                />
                              </div>
                            </Col>
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
                        </FormikForm>
                      )}
                    </Formik>
                  </div>
                </div>
              </Col>
              <Col xl='10' lg='12'>
                <div className='d-flex flexWrap mt-5 gap-4'>
                  <Formik
                    initialValues={likeRewardValues}
                    enableReinitialize={true}
                    validationSchema={likeRewardSchema}
                    innerRef={likeRewardRef}
                    onSubmit={async (values) => {
                      handleShow();
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
                          <Col>
                            <Field name='likeReward'>
                              {({ field, formProps }: any) => (
                                <Form.Group controlId='formBasicEmail'>
                                  <Form.Label>
                                    Like Reward
                                    <Tippy
                                      content={
                                        <div>
                                          <p className='mb-0'>
                                          BlockZa coins that user will get
                                            when like a promoted entry.
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
                                    placeholder='eg. 1000 e8s'
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
                            disabled={isLoading}
                            className='publish-btn'
                            type='submit'
                          >
                            {isLikeLoading ? <Spinner size='sm' /> : 'Apply'}
                          </Button>
                        </Col>
                      </FormikForm>
                    )}
                  </Formik>
                  <Formik
                    initialValues={commentRewardVal}
                    enableReinitialize={true}
                    validationSchema={commentRewardSchema}
                    innerRef={commentRewardRef}
                    onSubmit={async (values) => {
                      handleCommentRewardUpdate();
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
                          <Col>
                            <Field name='commentReward'>
                              {({ field, formProps }: any) => (
                                <Form.Group controlId='formBasicEmail'>
                                  <Form.Label>
                                    Comment Reward
                                    <Tippy
                                      content={
                                        <div>
                                          <p className='mb-0'>
                                          BlockZa coins that user will get
                                            when comment on a promoted entry.
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
                                    name='commentReward'
                                    placeholder='eg. 1000 e8s'
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
                                name='commentReward'
                                component='div'
                              />
                            </div>
                          </Col>
                        </Row>
                        <Col xs='4' className='d-flex align-items-end'>
                          <Button
                            disabled={isCommentLoading}
                            className='publish-btn'
                            type='submit'
                          >
                            {isCommentLoading ? <Spinner size='sm' /> : 'Apply'}
                          </Button>
                        </Col>
                      </FormikForm>
                    )}
                  </Formik>
                  <Formik
                    initialValues={emailVerificationReward}
                    enableReinitialize={true}
                    validationSchema={emailVerificationRewardSchema}
                    innerRef={emailVerificationRewardRef}
                    onSubmit={async (values) => {
                      handleEmailVerficationRewardUpdate();
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
                          <Col>
                            <Field name='emailVerificationReward'>
                              {({ field, formProps }: any) => (
                                <Form.Group controlId='formBasicEmail'>
                                  <Form.Label>
                                    Email Verification Reward
                                    <Tippy
                                      content={
                                        <div>
                                          <p className='mb-0'>
                                          BlockZa coins that user will get
                                            when he/she verify his/her profile
                                            email.
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
                                    name='emailVerificationReward'
                                    placeholder='eg. 1000 e8s'
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
                                name='emailVerificationReward'
                                component='div'
                              />
                            </div>
                          </Col>
                        </Row>
                        <Col xs='4' className='d-flex align-items-end'>
                          <Button
                            disabled={isEmailLoading}
                            className='publish-btn'
                            type='submit'
                          >
                            {isEmailLoading ? <Spinner size='sm' /> : 'Apply'}
                          </Button>
                        </Col>
                      </FormikForm>
                    )}
                  </Formik>
                  <Formik
                    initialValues={newUserReward}
                    enableReinitialize={true}
                    validationSchema={newUserRewardSchema}
                    innerRef={newUserRewardRef}
                    onSubmit={async (values) => {
                      handleNewUserRewardUpdate();
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
                          <Col>
                            <Field name='newUserReward'>
                              {({ field, formProps }: any) => (
                                <Form.Group controlId='formBasicEmail'>
                                  <Form.Label>
                                    New User Reward
                                    <Tippy
                                      content={
                                        <div>
                                          <p className='mb-0'>
                                          BlockZa coins that user will get
                                            when he/she register new account.
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
                                    name='newUserReward'
                                    placeholder='eg. 1000 e8s'
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
                                name='newUserReward'
                                component='div'
                              />
                            </div>
                          </Col>
                        </Row>
                        <Col xs='4' className='d-flex align-items-end'>
                          <Button
                            disabled={isNewUserRewardLoading}
                            className='publish-btn'
                            type='submit'
                          >
                            {isNewUserRewardLoading ? (
                              <Spinner size='sm' />
                            ) : (
                              'Apply'
                            )}
                          </Button>
                        </Col>
                      </FormikForm>
                    )}
                  </Formik>
                  <Formik
                    initialValues={articleReadReward}
                    enableReinitialize={true}
                    validationSchema={articleReadRewardSchema}
                    innerRef={articleReadRewardRef}
                    onSubmit={async (values) => {
                      handleArticleRewardUpdate();
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
                          <Col>
                            <Field name='articleReadReward'>
                              {({ field, formProps }: any) => (
                                <Form.Group controlId='formBasicEmail'>
                                  <Form.Label>
                                    Article Read Reward
                                    <Tippy
                                      content={
                                        <div>
                                          <p className='mb-0'>
                                          BlockZa coins that user will get
                                            when read complete article.
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
                                    name='articleReadReward'
                                    placeholder='1000'
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
                                name='articleReadReward'
                                component='div'
                              />
                            </div>
                          </Col>
                        </Row>
                        <Col xs='4' className='d-flex align-items-end'>
                          <Button
                            disabled={articleReadRewardLoading}
                            className='publish-btn'
                            type='submit'
                          >
                            {articleReadRewardLoading ? (
                              <Spinner size='sm' />
                            ) : (
                              'Apply'
                            )}
                          </Button>
                        </Col>
                      </FormikForm>
                    )}
                  </Formik>
                  <Formik
                    initialValues={minimumRewardToClaim}
                    enableReinitialize={true}
                    validationSchema={minimumRewardToClaimSchema}
                    innerRef={minimumRewardToClaimRef}
                    onSubmit={async (values) => {
                      handleUpdateMinimumRewardToClaim();
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
                          <Col>
                            <Field name='minimumRewardToClaim'>
                              {({ field, formProps }: any) => (
                                <Form.Group controlId='formBasicEmail'>
                                  <Form.Label>
                                    Minimum claimable reward
                                    <Tippy
                                      content={
                                        <div>
                                          <p className='mb-0'>
                                          BlockZa coins which user can
                                            claim
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
                                    name='minimumRewardToClaim'
                                    placeholder='1000'
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
                                name='minimumRewardToClaim'
                                component='div'
                              />
                            </div>
                          </Col>
                        </Row>
                        <Col xs='4' className='d-flex align-items-end'>
                          <Button
                            disabled={minimumRewardToClaimLoading}
                            className='publish-btn'
                            type='submit'
                          >
                            {minimumRewardToClaimLoading ? (
                              <Spinner size='sm' />
                            ) : (
                              'Apply'
                            )}
                          </Button>
                        </Col>
                      </FormikForm>
                    )}
                  </Formik>
                  <Formik
                    initialValues={dailyLoginReward}
                    enableReinitialize={true}
                    validationSchema={dailyLoginRewardSchema}
                    innerRef={dailyLoginRewardRef}
                    onSubmit={async (values) => {
                      handleUpdateDailyLoginReward();
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
                          <Col>
                            <Field name='dailyLoginReward'>
                              {({ field, formProps }: any) => (
                                <Form.Group controlId='formBasicEmail'>
                                  <Form.Label>
                                    Daily login reward
                                    <Tippy
                                      content={
                                        <div>
                                          <p className='mb-0'>
                                          BlockZa coins which user will
                                            get when login after 24H
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
                                    name='dailyLoginReward'
                                    placeholder='1000'
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
                                name='dailyLoginReward'
                                component='div'
                              />
                            </div>
                          </Col>
                        </Row>
                        <Col xs='4' className='d-flex align-items-end'>
                          <Button
                            disabled={dailyLoginRewardLoading}
                            className='publish-btn'
                            type='submit'
                          >
                            {dailyLoginRewardLoading ? (
                              <Spinner size='sm' />
                            ) : (
                              'Apply'
                            )}
                          </Button>
                        </Col>
                      </FormikForm>
                    )}
                  </Formik>
                  <Formik
                    initialValues={profileCompReward}
                    enableReinitialize={true}
                    // validationSchema={articleReadRewardSchema}
                    innerRef={profileCompRewardRef}
                    onSubmit={async (values) => {
                      handleProfileCompRewardUpdate();
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
                          <Col>
                            <Field name='profileCompReward'>
                              {({ field, formProps }: any) => (
                                <Form.Group controlId='formBasicEmail'>
                                  <Form.Label>
                                    Profile Complete Reward
                                    <Tippy
                                      content={
                                        <div>
                                          <p className='mb-0'>
                                          BlockZa coins that user will get
                                            when  complete the profile.
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
                                    name='profileCompReward'
                                    placeholder='1000'
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
                                name='profileCompReward'
                                component='div'
                              />
                            </div>
                          </Col>
                        </Row>
                        <Col xs='4' className='d-flex align-items-end'>
                          <Button
                            disabled={profileCompRewardLoading}
                            className='publish-btn'
                            type='submit'
                          >
                            {profileCompRewardLoading ? (
                              <Spinner size='sm' />
                            ) : (
                              'Apply'
                            )}
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
        <div>
          <RewardChangerList btnRef={historyList}/>
        </div>
      </main>
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Body>
          <>
            <div className='flex-div connect-heading-pnl mb-3'>
              <p />
              <p className='text-bold h5 fw-bold text-danger m-0'>
                Update Like Rewards
              </p>
              <i
                style={{
                  cursor: 'pointer',
                }}
                onClick={handleModalClose}
                className='fa fa-close'
              />
              {/* <Button
                  className='close-btn'
                /> */}
            </div>
            <div>
              <p className='text-danger text-center'>
                Be Carefull changing the reward per vote can have serious impact
                on the platform!
              </p>
            </div>
            <div className='d-flex justify-content-center'>
              <Button
                className='publish-btn'
                disabled={isLikeLoading}
                onClick={handleLikeRewardUpdate}
                // type='submit'
              >
                {isLikeLoading ? <Spinner size='sm' /> : 'Confirm'}
              </Button>
            </div>
          </>
        </Modal.Body>
      </Modal>
    </>
  ) : (
    <></>
  );
}
