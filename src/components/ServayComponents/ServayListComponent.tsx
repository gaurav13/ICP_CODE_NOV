import { array, number, object, string } from 'yup';
import { toast } from 'react-toastify';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import React, { useEffect, useRef, useState } from 'react';
import { Col, Button, Table, Modal, Spinner } from 'react-bootstrap';
import { FormikProps, FormikValues } from 'formik';
import { usePathname, useRouter } from 'next/navigation';
import {
  makeEntryActor,
  makeLedgerCanister,
  makeTokenCanister,
  makeUserActor,
} from '@/dfx/service/actor-locator';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useConnectPlugWalletStore } from '@/store/useStore';
import AddServayQuestionForm from '@/components/addQuestionForm/addServayQuestionForm';
import { sliceString } from '@/constant/helperfuntions';
import { E8S, GAS_FEE } from '@/constant/config';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { canisterId as entryCanisterId } from '@/dfx/declarations/entry';
import { Principal } from '@dfinity/principal';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import updateBalance from '@/components/utils/updateBalance';
import {
  ADD_SURVEY_ROUTE_ADMIN,
  ADD_SURVEY_ROUTE_USER,
  ALL_SURVEY_ROUTE_USER,
} from '@/constant/routes';
import updateTokensBalance from '@/components/utils/updateTokensBalance';
import { formatLikesCount } from '@/components/utils/utcToLocal';

export default React.memo(function ServayListComponent({
  servayList,
  reGetFn,
}: {
  servayList: any[];
  reGetFn: any;
}) {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [servayId, setServayId] = useState('');
  const [isStatusChanging, setStatusChanging] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isServaySubmitting, setIsServaySubmitting] = useState(false);
  const [showServayPromoteModal, setServayPromoteModal] = useState(false);

  const [rewardFees, satRewardFees] = useState({
    admin: 0,
    plateform: 0,
  });
  const [surveyAmountValuesInIcp, setsurveyAmountValuesInIcp] = useState({
    totalAmount: 0,
    plateForm: 0,
    adminfees: 0,
    priceOfAllUsers: 0,
  });
  let gasFee = GAS_FEE / E8S;
  const [servayAmountValues, setServayAmountValues] = useState({
    tokens: 0,
    totalUser: 0,
  });
  const { t, changeLocale } = useLocalization(LANG);
  const [oneNftCoin, setOneNftCoin] = useState(0);
  const { auth, identity, setBalance,setTokensBalance } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    identity: state.identity,
    setBalance: state.setBalance,
    setTokensBalance: state.setTokensBalance,


  }));

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
  const location = usePathname();
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });
  let convertTokensToIcp = (token: number, totalUser: number) => {
    let priceOfAllUsers = token * totalUser;
    let plateForm = Math.ceil((token * totalUser) / 100) * rewardFees.plateform;
    let adminfees = Math.ceil((token * totalUser) / 100) * rewardFees.admin;
    // let tempGasFees= gasFee * 2 + gasFee / 5;
    let totalAmount = (priceOfAllUsers + plateForm + adminfees);
    setsurveyAmountValuesInIcp({
      priceOfAllUsers,
      totalAmount,
      plateForm,
      adminfees,
    });
  };
  const handleClose = () => {
    setShowModal(false);
    setServayId('');
  };
  const handleOpen = () => {
    setShowModal(true);
  };
  const handleDeleteModleClose = () => {
    setShowDeleteModal(false);
    setServayId('');
  };
  const handleDeleteModleOpen = () => {
    setShowDeleteModal(true);
  };
  const handleServayModalClose = () => {
    setServayPromoteModal(false);

    setServayAmountValues({
      tokens: 0,
      totalUser: 0,
    });
  };
  let handleDeleteServay = async () => {
    setIsLoading(true);
    try {
      let deletedRes = await entryActor.delete_servay(servayId, userCanisterId);
      handleDeleteModleClose();
      setIsLoading(false);
      if (deletedRes?.ok) {
        toast.success(t('Survey deleted successfully.'));
        if (reGetFn) {
          reGetFn();
        }
      } else {
        toast.error(deletedRes?.err[0]);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(t('There is an error while deleting Survey.'));
    }
  };
  let handleChangeServayStatus = async () => {
    setIsLoading(true);
    try {
      let status = isActive ? false : true;
      let changed = await entryActor.changeStatusOfServay(
        status,
        userCanisterId,
        servayId
      );

      handleDeleteModleClose();
      setIsLoading(false);
      if (changed?.ok) {
        toast.success(
          `${t('Survey')}  ${isActive ? t('Deactivated') : t('Activated')} ${t(
            'successfully.'
          )}`
        );
        if (reGetFn) {
          reGetFn();
        }
      } else {
        toast.error(changed?.err[0]);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(
        `${t('There is an error while')} ${
          isActive ? t('Deactivating') : t('Activating')
        } ${t('the Survey.')}`
      );
    }
  };

  const handlePromote = async (approvingPromotionE8S: number) => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    const defaultEntryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    let promted = await defaultEntryActor.promoteTheServay(
      approvingPromotionE8S,
      userCanisterId,
      servayId
    );

    if (promted?.ok) {
      toast.success('Your survey has been activated');

      if (reGetFn) {
        reGetFn();
      }
      updateTokensBalance({ identity, auth, setTokensBalance });
    } else {
      toast.error(promted?.err[0]);
    }
    setIsServaySubmitting(false);
    handleServayModalClose();
  };
  const handleTransaction = async () => {
    try {
      setIsServaySubmitting(true);
      const defaultEntryActor = makeEntryActor({
        agentOptions: {
          identity,
        },
      });
      let tokenActor = await makeTokenCanister({
        agentOptions: {
          identity,
        },
      });
      let myPrincipal = identity.getPrincipal();
      let res = await tokenActor.icrc1_balance_of({
        owner: myPrincipal,
        subaccount: [],
      });

      // let balance = parseInt(res.e8s) / E8S;
      let balance = parseInt(res);

      let rewardConfig = await defaultEntryActor.get_reward();

      const oneCoinVal = await userActor.get_NFT24Coin();
      let coinsInOneIcp = Number(oneCoinVal);
      if (oneNftCoin != coinsInOneIcp) {
        setIsServaySubmitting(false);
        handleServayModalClose();
        setOneNftCoin(coinsInOneIcp);
        return;
      }

      let promotion = parseFloat(rewardConfig.master);

      let platform = parseFloat(rewardConfig.platform);
      let admin = parseFloat(rewardConfig.admin);

      let total = promotion + platform + admin;

      if (total !== 100) {
        setIsServaySubmitting(false);

        return toast.error(t('Error During Transaction'));
      }
      let tempTotall = Number(surveyAmountValuesInIcp.totalAmount);
      if (balance < tempTotall) {
        setIsServaySubmitting(false);
        return toast.error(
          `${t(
            'Insufficient balance to promote. Current Balance'
          )} ${balance} ${t(t('please transfer assets to your wallet.'))}`
        );
      }

      if (!entryCanisterId) return toast.error(t('Error in transaction'));
      let entryPrincipal = Principal.fromText(entryCanisterId);
      let approval = await tokenActor.icrc2_approve({
        amount: tempTotall,
        spender: {
          owner: entryPrincipal,
          subaccount: [],
        },
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        expected_allowance: [],
        expires_at: [],
      });
      if (approval.Ok) {
        setTimeout(() => {
          handlePromote(surveyAmountValuesInIcp.priceOfAllUsers);
        }, 100);
      }
    } catch (e) {
      setIsServaySubmitting(false);
      toast.error(t("You do not have enough balance to activate your survey"))
    }
  };
  let get_reward_Fees = async () => {
    const defaultEntryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    let rewardConfig = await defaultEntryActor.get_reward();
    let plateform = parseFloat(rewardConfig.platform);
    let admin = parseFloat(rewardConfig.admin);
    satRewardFees({
      admin,
      plateform,
    });
  };
  const oneNftstudioCoin = async () => {
    const oneCoinVal = await userActor.get_NFT24Coin();
    let amount = Number(oneCoinVal);
    setOneNftCoin(amount);
  };
  useEffect(() => {
    oneNftstudioCoin();
    get_reward_Fees();
  }, []);

  return (
    <>
      <Col xl='12' lg='12' md='12'>
        <div className='full-div'>
          <div className='table-container lg'>
            <div className='table-inner-container'>
              <Table striped hover className='article-table'>
                <thead>
                  <tr>
                  <th>
                     <p>{t('Title')}</p>
                    </th>
                    <th>
                    <p>{t('Survey Title')}</p> 
                    </th>
                    <th>
                      <p>{t('User taken')}</p>
                    </th>
                    <th>
                      <p>{t('Question')}</p>
                    </th>
                    <th>
                      <p>{t('Status')}</p>
                    </th>
                    <th className='centercls'>
                      <p>{t('Action')}</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {servayList &&
                    servayList.map((item: any) => {
                      let servay = item[1];
                      let id = item[0];
                      let questionCount = 0;
                      let userTakenTheServay = 0;
                      let rewardPerUser = 0;
                      if (servay?.rewardPerUser) {
                        rewardPerUser = parseInt(servay?.rewardPerUser);
                      }
                      let remaningUserCanTakenReward = 0;
                      if (servay?.remaningUserCanTakeReward) {
                        remaningUserCanTakenReward = parseInt(
                          servay?.remaningUserCanTakeReward
                        );
                      }
                      let noOfUserWillGet = 0;
                      if (servay?.usersWillGetReward) {
                        noOfUserWillGet = parseInt(servay?.usersWillGetReward);
                      }
                      if (servay?.questionCount) {
                        questionCount = parseInt(servay?.questionCount);
                      }
                      if (servay?.takenBy) {
                        userTakenTheServay = parseInt(servay?.takenBy.length);
                      }

                      return (
                        <tr key={id}>
                          <td className='category-item'>
                            <p>{sliceString(servay?.title, 0, 20)}</p>{' '}
                            <Button
                              onClick={() => {
                                if (location == ALL_SURVEY_ROUTE_USER) {
                                  router.push(
                                    `${ADD_SURVEY_ROUTE_USER}?SurveyId=${id}`
                                  );
                                } else {
                                  router.push(
                                    `${ADD_SURVEY_ROUTE_ADMIN}?SurveyId=${id} `
                                  );
                                }
                              }}
                              className='text-primary ps-0'
                            >
                              {t('Edit')}
                            </Button>
                            <Button
                              onClick={() => {
                                handleDeleteModleOpen();
                                setServayId(id);
                                setStatusChanging(false);
                              }}
                              className='text-danger ps-0'
                            >
                              {t('Delete')}
                            </Button>
                          </td>
                          <td className='category-item'><p>{servay?.entryTitle}</p></td>

                          <td>{userTakenTheServay}</td>

                          <td>{questionCount}</td>

                          <td>{servay.isAtive ? 'Active' : 'Deactive'}</td>
                          <td >
                            {/* <Button
                            onClick={() => {
                              handleOpen();
                              setQuizId(id);
                            }}
                            className={`reg-btn fill bg-fix trackbtn ms-1 addQuestionBtn`}
                          >
                            Add question
                          </Button> */}
                        <div className='centercls'>
                        <ul className='quizBtnList'>
                              <li>
                                <Button
                                  onClick={() => {
                                    handleOpen();
                                    setServayId(id);
                                    setStatusChanging(false);
                                  }}
                                  className=' text-primary'
                                >
                                  {t('Add question')}
                                </Button>
                              </li>
                              <li>
                                <Button
                                  onClick={() => {
                                    if (location == ALL_SURVEY_ROUTE_USER) {
                                      router.push(
                                        `/survey-questions?SurveyId=${id}`
                                      );
                                    } else {
                                      router.push(
                                        `/super-admin/survey-questions?SurveyId=${id}`
                                      );
                                    }
                                  }}
                                   className=' text-primary'
                                >
                                  {t('view questions')}
                                </Button>
                              </li>
                              <li>
                                <Button
                                  onClick={() => {
                                    if (remaningUserCanTakenReward > 0) {
                                      handleDeleteModleOpen();
                                    } else {
                                      convertTokensToIcp(
                                        rewardPerUser,
                                        noOfUserWillGet
                                      );
                                      setServayAmountValues({
                                        tokens: rewardPerUser,
                                        totalUser: noOfUserWillGet,
                                      });
                                      setServayPromoteModal(true);
                                    }

                                    setServayId(id);
                                    setStatusChanging(true);
                                    setIsActive(servay.isAtive);
                                  }}
                               className='green'
                                >
                                  {servay.isAtive
                                    ? t('Deactivate')
                                    : t('Activate')}
                                </Button>
                              </li>
                            </ul>
                        </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </Col>
      <AddServayQuestionForm
        servayId={servayId}
        showModal={showModal}
        handleClose={handleClose}
        reGetFn={reGetFn}
      />
      <Modal show={showDeleteModal} centered onHide={handleDeleteModleClose}>
        <Modal.Header>
          <h3 className='text-center'>
            {t('Are you sure you want to')}{' '}
            {isStatusChanging
              ? ` ${isActive ? t('Deactivate') : t('Activate')} ${t(
                  'the Survey.'
                )}`
              : t('delete this Survey.')}
          </h3>
        </Modal.Header>
        <Modal.Footer>
          <Button
            className='publish-btn me-2'
            onClick={() => {
              if (isStatusChanging) {
                handleChangeServayStatus();
              } else {
                handleDeleteServay();
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner size='sm' />
            ) : isStatusChanging ? (
              isActive ? (
                t('Deactivate')
              ) : (
                t('Activate')
              )
            ) : (
              t('Delete')
            )}
          </Button>
          <Button
            className='default-btn'
            onClick={handleDeleteModleClose}
            disabled={isLoading}
          >
            {t('Cancel')}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showServayPromoteModal}
        centered
        onHide={handleServayModalClose}
      >
        <Modal.Body>
          <div className='flex-div connect-heading-pnl mb-3'>
            {/* <i className='fa fa-question-circle-o'/> */}
            <p />
            <p className='text-bold h5 fw-bold m-0'>
              {t('Confirm Transaction')}
            </p>
            {/* <i onClick={handleModalClose} className='fa fa-close'/> */}
            <i
              style={{
                cursor: 'pointer',
              }}
              onClick={handleServayModalClose}
              className='fa fa-close'
            />
            {/* <Button
          className='close-btn'
        /> */}
          </div>
          <div>
            <p className='text-secondary'>
              {t("Are you sure you want to activate your survey for ")}{' '}
              {formatLikesCount(surveyAmountValuesInIcp.totalAmount)}{' '}
              {t('Blockza tokens')}?
            </p>

            <p className='d-flex justify-content-between mb-1'>
              {/* <span
                    style={{
                      border: '2px',
                    }}
                  > */}
              <span>{t('No of user:')}</span>{' '}
              <span className='text-secondary'>
                {servayAmountValues.totalUser}
              </span>
              {/* </span> */}
            </p>
            <p className='d-flex justify-content-between mb-1'>
              <span>{t('Reward Per User:')}</span>{' '}
              <span className='text-secondary'>
                {servayAmountValues.tokens} {t('Tokens')}
              </span>
              {/* </span> */}
            </p>
            <p className='d-flex justify-content-between mb-1'>
              <span>{t('Reward Of All User:')}</span>{' '}
              <span className='text-secondary'>
              {servayAmountValues.totalUser} x {servayAmountValues.tokens} = {servayAmountValues.totalUser*servayAmountValues.tokens}  {t('Tokens')}
              </span>
              {/* </span> */}
            </p>
            <p className='d-flex justify-content-between mb-1'>
              <span>{t('Admin fee:')}</span>{' '}
              <span className='text-secondary'>
                {surveyAmountValuesInIcp.adminfees} {t('Tokens')}
              </span>
            </p>
            <p className='d-flex justify-content-between mb-1'>
              <span>{t('Platform fee:')}</span>{' '}
              <span className='text-secondary'>
                {surveyAmountValuesInIcp.plateForm} {t('Tokens')}
              </span>
            </p>

            <div
              style={{
                height: 1,
                backgroundColor: 'gray',
                width: '100%',
              }}
            />
            <p className=' d-flex justify-content-between mt-1 mb-0'>
              <span>Total: </span>{' '}
              <span className='text-secondary'>
                {surveyAmountValuesInIcp.totalAmount} {t('Tokens')}
              </span>
            </p>
          </div>
          <div className='d-flex justify-content-center mt-2'>
            <Button
              className='publish-btn w-100 mt-2 py-2'
              disabled={isServaySubmitting}
              onClick={handleTransaction}
              // type='submit'
            >
              {isServaySubmitting ? <Spinner size='sm' /> : t('Confirm')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
});
