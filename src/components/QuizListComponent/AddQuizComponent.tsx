import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import {
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from 'react-bootstrap';
import {
  ErrorMessage,
  Field,
  Form as FormikForm,
  Formik,
  FormikValues,
  FormikProps,
} from 'formik';
import * as Yup from 'yup';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { usePathname } from 'next/navigation';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import { toast } from 'react-toastify';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { useRouter } from 'next/navigation';
import Tippy from '@tippyjs/react';
import { E8S, GAS_FEE } from '@/constant/config';
import {
  ADD_QUIZ_ROUTE_ADMIN,
  ALL_ARTICLES,
  ALL_QUIZ_ROUTE_ADMIN,
  ALL_QUIZ_ROUTE_USER,
  ARTICLE_DINAMIC_PATH,
} from '@/constant/routes';
export default function AddQuizComponent() {
  const formikRef = useRef<FormikProps<FormikValues>>(null);

  const [isLoading, setIsLoading] = useState(false);
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  let quizId = searchParams.get('quizId');
  let entryId = searchParams.get('entryId');
  const [quiz, setQuiz] = useState<any>(null);
  const [oneNftCoin, setOneNftCoin] = useState(0);
  const location = usePathname();
  let language;

  const changeLang = () => {
    if (LANG === 'jp') {
      if (location) {
        language = location.includes('super-admin/') ? 'en' : 'jp';
      }
    } else {
      language = 'en';
    }
  };
  const funcCalling = changeLang();
  const { t, changeLocale } = useLocalization(language);

  const { auth, userAuth, identity, principal } = useConnectPlugWalletStore(
    (state) => ({
      auth: (state as ConnectPlugWalletSlice).auth,
      userAuth: (state as ConnectPlugWalletSlice).userAuth,
      identity: (state as ConnectPlugWalletSlice).identity,
      principal: state.principal,
    })
  );
  const router = useRouter();
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    userWillGetReward: Yup.number()
      .required(t('Please Enter the No of Users Who will Get Rewards'))
      .min(1, t('Must be greater than 1'))
      .max(100000000000000000000, t('Must be less than 100000000000000000000')).test(
        'is-multiple-of-1',
        'Users must be integer',
        (value) => value % 1 === 0
      ),
    reward: Yup.number()
      .required('Please enter coins amount')
      .min(10, 'Coins amount can not be less than 10')
      .max(E8S * 1000, `Coins amount can not be more than ${E8S * 1000}`)
      .test(
        'is-multiple-of-10',
        'Reward amount must be a multiple of 10',
        (value) => value % 10 === 0
      ),
    duration: Yup.number()
      .required(t('Duration is required'))
      .min(1, t('Must be greater than 1')),
    passingMarks: Yup.number()
      .required(t('Passing Percentage is required'))
      .min(1, t('Passing Marks can not be less than 1'))
      .max(100, t('Passing Marks can not be more than 100')),
  });
  const initialValues = {
    title: quiz ? quiz.title : '',
    reward: quiz ? quiz.rewardPerUser : '',
    duration: quiz ? quiz.duration : '',
    passingMarks: quiz ? quiz.passingMarks : '',
    userWillGetReward: quiz ? quiz.usersWillGetReward : '',
  };
  let gasFee = GAS_FEE / E8S;

  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });
  async function submitData(values: any, resetForm: any) {
    setIsLoading(true);

    try {
      let tempQuiz = {
        title: values.title,
        description: '',
        isGeneral: false,
        entryId: entryId,
        shouldRewarded: true,
        rewardPerUser: [values.reward],
        usersWillGetReward: values.userWillGetReward,
        isAtive: false,
        duration: parseInt(values.duration),
        attemptsPerUser: 2,
        passingMarks: values.passingMarks,
      };

      if (quizId) {
        tempQuiz.entryId = quiz.entryId;
        let newQuizAdd = await entryActor.updateQuiz(
          tempQuiz,
          userCanisterId,
          quizId
        );
        setIsLoading(false);

        if (newQuizAdd?.ok) {
          //  resetForm();
          toast.success(t('Quiz updated successfully.'));
        } else {
          toast.error(t('There is an error while upadating quiz.'));
        }
      } else {
        // let tokensOfAllUser = values.reward * values.userWillGetReward;
        // let icpOfUsersTokens = tokensOfAllUser / oneNftCoin;
        // let gasInICP = gasFee * 2 + gasFee / 5;

        // if (icpOfUsersTokens < 5) {
        //   setIsLoading(false);

        //   return toast.error(
        //     `Amount can't be less then ${5} ICP please increase no of users who take the reward or increase amount of coins.`
        //   );
        // }
        let newQuizAdd = await entryActor.addQuiz(tempQuiz, userCanisterId);
        setIsLoading(false);
        if (newQuizAdd?.ok) {
          resetForm();
          toast.success(t('Quiz created successfully.'));

          if (location == ADD_QUIZ_ROUTE_ADMIN) {
            router.push(ALL_QUIZ_ROUTE_ADMIN);
          } else {
            router.push(ALL_QUIZ_ROUTE_USER);
          }
        } else {
          toast.error(newQuizAdd?.err[0]);
          if (location == ADD_QUIZ_ROUTE_ADMIN) {
            router.push(ALL_QUIZ_ROUTE_ADMIN);
          } else {
            router.back();
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(t('There is an error while creating quiz.'));
    }
  }
  let getQuiz = async () => {
    try {
      let newQuizAdd = await entryActor.getQuizById_foradmin(quizId);
      if (newQuizAdd && newQuizAdd.length != 0) {
        let entry = newQuizAdd[0];
        let tempQuiz = {
          title: entry.title,
          description: entry.description,
          isGeneral: entry.isGeneral,
          entryId: entry.entryId,
          shouldRewarded: entry.shouldRewarded,
          rewardPerUser:
            entry.rewardPerUser.length != 0
              ? parseInt(entry.rewardPerUser[0])
              : '',
          usersWillGetReward: parseInt(entry.usersWillGetReward),
          isAtive: entry.isAtive,
          duration: parseInt(entry.duration),
          attemptsPerUser: parseInt(entry.attemptsPerUser),
          passingMarks: parseInt(entry.passingMarks),
        };
        if (
          entry.createdBy == principal ||
          userAuth.userPerms?.articleManagement
        ) {
          setQuiz(tempQuiz);
        } else {
          return router.back();
        }
      }
    } catch (error) {
      setQuiz(null);
    }
  };
  // useEffect(() => {
  //   if (quizId) {
  //     getQuiz();
  //   }
  // }, [quizId]);
  useEffect(() => {
    let timeINt = setTimeout(() => {
      if (!(entryId || quizId)) {
        router.push('/');
      }
    }, 2000);
    return () => {
      clearTimeout(timeINt);
    };
  }, [entryId, quizId]);
  useEffect(() => {
    if (auth.state === 'initialized') {
      if (quizId) {
        getQuiz();
      }
    } else if (auth.state === 'anonymous') {
      router.back();
    }
  }, [userAuth, auth, quizId]);
  const oneNftstudioCoin = async () => {
    const oneCoinVal = await userActor.get_NFT24Coin();
    let tokensInOneIcp = Number(oneCoinVal);
    setOneNftCoin(tokensInOneIcp);
  };
  useEffect(() => {
    oneNftstudioCoin();
  }, []);
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      innerRef={formikRef}
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
            <Col xl='12' lg='12' md='12'>
              <Field name='title'>
                {({ field, formProps }: any) => (
                  <Form.Group
                    className='mb-2'
                    controlId='exampleForm.ControlTextarea1'
                  >
                    <Form.Label>{t('Quiz title')}</Form.Label>
                    <Form.Control
                      type='text'
                      name='title'
                      className='form-control'
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t('Enter quiz title')}
                    />
                  </Form.Group>
                )}
              </Field>
              <div className='text-danger mb-2'>
                <ErrorMessage
                  className='Mui-err'
                  name='title'
                  component='div'
                />
              </div>
            </Col>
            <Col xl='6' lg='6' md='12'>
              <Field name='duration'>
                {({ field, formProps }: any) => (
                  <Form.Group
                    className='mb-2'
                    controlId='exampleForm.ControlTextarea1'
                  >
                    <Form.Label>
                      {t('Duration')}{' '}
                      <Tippy
                        content={
                          <div>
                            <p className='mb-0'>
                              {t(
                                'Time in minutes user will complete the quiz.'
                              )}
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
                      type='number'
                      name='duration'
                      value={values.duration}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t('Enter duration in mins')}
                    />
                  </Form.Group>
                )}
              </Field>
              <div className='text-danger mb-2'>
                <ErrorMessage
                  className='Mui-err'
                  name='duration'
                  component='div'
                />
              </div>
            </Col>
            <Col xl='6' lg='6' md='12'>
              <Field name='passingMarks'>
                {({ field, formProps }: any) => (
                  <Form.Group
                    className='mb-2'
                    controlId='exampleForm.ControlTextarea1'
                  >
                    <Form.Label>
                      {t('Passing Marks')}{' '}
                      <Tippy
                        content={
                          <div>
                            <p className='mb-0'>
                              {t(
                                'Percentage of passing marks user need to pass the quiz.'
                              )}
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
                      type='number'
                      name='passingMarks'
                      value={values.passingMarks}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t('Enter percentage of passing marks')}
                    />
                  </Form.Group>
                )}
              </Field>
              <div className='text-danger mb-2'>
                <ErrorMessage
                  className='Mui-err'
                  name='passingMarks'
                  component='div'
                />
              </div>
            </Col>

            <Col xl='6' lg='6' md='12'>
              <Field name='reward'>
                {({ field, formProps }: any) => (
                  <Form.Group
                    className='mb-2'
                    controlId='exampleForm.ControlTextarea1'
                  >
                    <Form.Label>
                      {t('Reward per user')}{' '}
                      <Tippy
                        content={
                          <div>
                            <p className='mb-0'>
                              {t(
                                'Number of coins which user will get when complete the quiz.'
                              )}{' '}
                              once you add you can't edit it.
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
                      type='number'
                      placeholder={t('Reward')}
                      value={field.value}
                      onChange={handleChange}
                      disabled={quizId ? true : false}
                      name='reward'
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                )}
              </Field>

              <div className='text-danger mb-2'>
                <ErrorMessage
                  className='Mui-err'
                  name='reward'
                  component='div'
                />
              </div>
            </Col>

            <Col xl='6' lg='6' md='12'>
              <Field name='userWillGetReward'>
                {({ field, formProps }: any) => (
                  <Form.Group
                    className='mb-2'
                    controlId='exampleForm.ControlTextarea1'
                  >
                    <Form.Label>
                      {t('No of Users')}{' '}
                      <Tippy
                        content={
                          <div>
                            <p className='mb-0'>
                              {t('How many users will get the reward.')} once
                              you add you can't edit it.
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
                      type='number'
                      name='userWillGetReward'
                      value={values.userWillGetReward}
                      onChange={handleChange}
                      disabled={quizId ? true : false}
                      onBlur={handleBlur}
                      placeholder={t(
                        'Enter the number of user who will get rewards'
                      )}
                    />
                  </Form.Group>
                )}
              </Field>
              <div className='text-danger mb-2'>
                <ErrorMessage
                  className='Mui-err'
                  name='userWillGetReward'
                  component='div'
                />
              </div>
            </Col>

            <Col xl='12' lg='12' md='12'>
              <div className='spacer-20' />
              <Form.Group className='mb-3'>
                <Button
                  className='reg-btn fill-not ble-brdr'
                  type='submit'
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner size='sm' /> : t('Submit')}
                </Button>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
}
