import React, { useEffect, useRef, useState } from 'react';
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
import logger from '@/lib/logger';
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
import { E8S, admin_manage_survey, GAS_FEE } from '@/constant/config';

import * as Yup from 'yup';
import {
  ADD_SURVEY_ROUTE_ADMIN,
  ALL_SURVEY_ROUTE_USER,
  MANAGE_SURVEY_ADMIN,
} from '@/constant/routes';
export default function AddServayComponent() {
  const formikRef = useRef<FormikProps<FormikValues>>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [oneNftCoin, setOneNftCoin] = useState(0);
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  let servayId = searchParams.get('SurveyId');
  let entryId = searchParams.get('entryId');
  const [servay, setServay] = useState<any>(null);
  const { auth, userAuth, identity, principal } = useConnectPlugWalletStore(
    (state) => ({
      auth: (state as ConnectPlugWalletSlice).auth,
      userAuth: (state as ConnectPlugWalletSlice).userAuth,
      identity: (state as ConnectPlugWalletSlice).identity,
      principal: state.principal,
    })
  );
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const router = useRouter();
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
  let gasFee = GAS_FEE / E8S;

  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });
  const funcCalling = changeLang();
  const { t, changeLocale } = useLocalization(language);
  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t('Title is required')),

    userWillGetReward: Yup.number()
      .required(t('Please enter the number of users who will get rewards.'))
      .min(1, 'Must be greater than 1')
      .max(100000000000000000000, t('Must be less than 100000000000000000000'))
      .test(
        'is-multiple-of-1',
        'Users must be integer',
        (value) => value % 1 === 0
      ),
    reward: Yup.number()
      .required('Please enter coins amount')
      .min(10, 'Coins amount can not be less than 10')
      .max(E8S * 1000, `Coins amount can not be more than ${E8S * 1000}`)
      // .min(10, 'Coins Amount can not be less than 10')
      // .max(E8S * 1000, `Coins Amount can not be more than ${E8S * 1000}`)
      .test(
        'is-multiple-of-10',
        'Reward amount must be a multiple of 10',
        (value) => value % 10 === 0
      ),

    // attemptsPerUser: Yup.number()
    //   .required('Attempts Per User are required')
    //   .min(1, 'Attempts Per User must be greater than 1')
    //   .max(1000000000, "Attempts Per User can't be more than 1000000000"),
  });

  const initialValues = {
    title: servay ? servay.title : '',
    userWillGetReward: servay ? servay.usersWillGetReward : '',
    shouldRewarded: servay ? servay.shouldRewarded : true,
    reward: servay ? servay.rewardPerUser : '',
    isAtive: servay ? false : false,
    attemptsPerUser: servay ? servay.attemptsPerUser : 1,
  };

  async function submitData(values: any, resetForm: any) {
    setIsLoading(true);

    try {
      let tempServay = {
        title: values.title,
        description: '',
        shouldRewarded: true,
        rewardPerUser: [values.reward],
        usersWillGetReward: values.userWillGetReward,
        isAtive: false,
        attemptsPerUser: values.attemptsPerUser,
        entryId: entryId,
      };

      if (servayId) {
        tempServay.entryId = servay.entryId;
        let updateServay = await entryActor.updateServay(
          tempServay,
          userCanisterId,
          servayId
        );
        
        setIsLoading(false);
        if (updateServay?.ok) {
          toast.success(t('Survey updated successfully.'));
          // router.push(admin_manage_survey);
        } else {
          toast.error(t('There is an error while upadating Survey'));
        }
      } else {
        let newQuizAdd = await entryActor.addServay(tempServay, userCanisterId);
        
        setIsLoading(false);

        if (newQuizAdd?.ok) {
          resetForm();

          if (location?.includes(ADD_SURVEY_ROUTE_ADMIN)) {
            router.push(MANAGE_SURVEY_ADMIN);
          } else {
            // router.push(ALL_SURVEY_ROUTE_USER);
            router.back();
          }
          toast.success(t('Survey created successfully.'));
        } else {
          toast.error(t(newQuizAdd?.err[0]));
        }
      }
    } catch (error) {
      setIsLoading(false);

      // toast.error(String(error)); //
    }
  }
  let getServay = async () => {
    try {
      let newServayAdd = await entryActor.getServayById_foradmin(servayId);
      if (newServayAdd && newServayAdd.length != 0) {
        let entry = newServayAdd[0];
        let tempQuiz = {
          title: entry.title,
          description: entry.description,
          shouldRewarded: entry.shouldRewarded,
          rewardPerUser:
            entry.rewardPerUser.length != 0
              ? parseInt(entry.rewardPerUser[0])
              : '',
          usersWillGetReward: parseInt(entry.usersWillGetReward),
          isAtive: entry.isAtive,

          attemptsPerUser: parseInt(entry.attemptsPerUser),
          entryId: entry.entryId,
        };
        if (
          entry.createdBy == principal ||
          userAuth.userPerms?.articleManagement
        ) {
          setServay(tempQuiz);
        } else {
          return router.back();
        }
      }
    } catch (error) {
      setServay(null);
    }
  };

  // useEffect(() => {
  //   if (servayId) {
  //     getServay();
  //   }
  // }, [servayId]);
  useEffect(() => {
    let timeINt = setTimeout(() => {
      if (!(entryId || servayId)) {
        router.push('/');
      }
    }, 2000);
    return () => {
      clearTimeout(timeINt);
    };
  }, [entryId, servayId]);
  useEffect(() => {
    if (auth.state === 'initialized') {
      if (servayId) {
        getServay();
      }
    } else if (auth.state === 'anonymous') {
      router.back();
    }
  }, [userAuth, auth, servayId]);
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
            <Col xl='12' lg='12' md='12'>
              <Field name='title'>
                {({ field, formProps }: any) => (
                  <Form.Group
                    className='mb-2'
                    controlId='exampleForm.ControlTextarea1'
                  >
                    <Form.Label>{t('Survey title')}</Form.Label>
                    <Form.Control
                      type='text'
                      name='title'
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t('Enter survey title')}
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
                                'Number of coins which user will get on compeleting Survey.'
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
                      name='reward'
                      disabled={servayId ? true : false}
                      value={values.reward}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t('Reward')}
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
                              {t(
                                'How many users will get the reward. These users will get the reward when they complete the Survey.'
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
                      name='userWillGetReward'
                      value={values.userWillGetReward}
                      disabled={servayId ? true : false}
                      onChange={handleChange}
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
