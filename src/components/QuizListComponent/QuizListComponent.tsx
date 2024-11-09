import { array, number, object, string } from 'yup';
import { toast } from 'react-toastify';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import AddQuestionForm from '@/components/addQuestionForm/addQuizQuestionForm';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Button, Table, Modal, Spinner, Form } from 'react-bootstrap';
import {
  Formik,
  Field,
  ErrorMessage,
  FormikProps,
  FormikValues,
  Form as FormikForm,
} from 'formik';
import { usePathname, useRouter } from 'next/navigation';
import {
  makeEntryActor,
  makeLedgerCanister,
  makeTokenCanister,
  makeUserActor,
} from '@/dfx/service/actor-locator';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { sliceString } from '@/constant/helperfuntions';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { E8S, GAS_FEE } from '@/constant/config';
import { canisterId as entryCanisterId } from '@/dfx/declarations/entry';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { Principal } from '@dfinity/principal';
import {
  ADD_QUIZ_ROUTE_ADMIN,
  ADD_QUIZ_ROUTE_USER,
  ALL_QUIZ_ROUTE_USER,
} from '@/constant/routes';
import updateBalance from '@/components/utils/updateBalance';
import updateTokensBalance from '@/components/utils/updateTokensBalance';
import { formatLikesCount } from '@/components/utils/utcToLocal';
export default React.memo(function QuizListComponent({
  quizList,
  reGetFn,
}: {
  quizList: any[];
  reGetFn: any;
}) {
  const [showModal, setShowModal] = useState(false);
  const [showQuizPromoteModal, setQuizPromoteModal] = useState(false);
  const [confirmTransaction, setConfirmTransaction] = useState(false);
  const location = usePathname();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizId, setQuizId] = useState('');
  const [isStatusChanging, setStatusChanging] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { auth, identity, setBalance,setTokensBalance } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    identity: state.identity,
    setBalance: state.setBalance,
    setTokensBalance:state.setTokensBalance
  }));
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const [isQuizSubmitting, setIsQuizSubmitting] = useState(false);
  const { t, changeLocale } = useLocalization(LANG);
  const myDivRef = useRef<HTMLDivElement | null>(null);
  const [quizAmountValues, setQuizAmountValues] = useState({
    token: 0,
    totalUser: 0,
  });
  const [quizAmountValuesInIcp, setQuizAmountValuesInIcp] = useState({
    totalAmount: 0,
    plateForm: 0,
    adminfees: 0,
    priceOfAllUsers: 0,
  });
  const [rewardFees, satRewardFees] = useState({
    admin: 0,
    plateform: 0,
  });
  const [oneNftCoin, setOneNftCoin] = useState(0);
  let gasFee = GAS_FEE / E8S;
  const initialQuizAmountVales = {
    ICP: 0,
  };
  const quizAmountSchema = object().shape({
    ICP: number().min(1, t('ICP cannot be less than 1')),
  });

  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });
  let convertTokensToIcp = (token: number, totalUser: number) => {
    let priceOfAllUsers = token * totalUser;
    let plateForm = ((token * totalUser) / 100) * rewardFees.plateform;
    let adminfees = ((token * totalUser) / 100) * rewardFees.admin;
    // let tempGasFees= gasFee * 2 + gasFee / 5;
    let totalAmount = (priceOfAllUsers + plateForm + adminfees)
    setQuizAmountValuesInIcp({
      priceOfAllUsers,
      plateForm,
      adminfees,
      totalAmount,
    });
  };
  const handleClose = () => {
    setShowModal(false);
    setQuizId('');
  };
  const handleOpen = () => {
    setShowModal(true);
  };
  const handleDeleteModleClose = () => {
    setShowDeleteModal(false);
    setQuizId('');
  };
  const handleDeleteModleOpen = () => {
    setShowDeleteModal(true);
  };

  let handleDeleteQuiz = async () => {
    setIsLoading(true);
    try {
      let deletedRes = await entryActor.delete_quiz(quizId, userCanisterId);
      handleDeleteModleClose();
      setIsLoading(false);
      if (deletedRes?.ok) {
        toast.success(t('Quiz deleted successfully.'));
        if (reGetFn) {
          reGetFn();
        }
      } else {
        toast.error(deletedRes?.err[0]);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(t('There is an error while deleting quiz.'));
    }
  };
  let handleChangeQuizStatus = async () => {
    setIsLoading(true);
    try {
      let status = isActive ? false : true;
      let changed = await entryActor.changeTheStatusOfQuiz(
        status,
        userCanisterId,
        quizId
      );

      handleDeleteModleClose();
      setIsLoading(false);
      if (changed?.ok) {
        toast.success(
          `${t('Quiz')}  ${isActive ? t('Deactivated') : t('Activated')} ${t(
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
        } ${t('the Quiz.')}`
      );
    }
  };
  const handleModalClose = () => {
    setQuizPromoteModal(false);
    setConfirmTransaction(false);
    setQuizAmountValues({
      token: 0,
      totalUser: 0,
    });
  };
  const handlePromote = async (approvingPromotionE8S: number) => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    let rewardConfig = await entryActor.get_reward();
    const defaultEntryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    let promted = await defaultEntryActor.promotedTheQuiz(
      approvingPromotionE8S,
      userCanisterId,
      quizId
    );
    if (promted?.ok) {
      toast.success('Your quiz has been activated');
      updateTokensBalance({ identity, auth, setTokensBalance });
      if (reGetFn) {
        reGetFn();
      }
    } else {
      toast.error(promted?.err[0]);
    }
    setIsQuizSubmitting(false);
    handleModalClose();
  };

  const handleTransaction = async () => {
  
    try {
      setIsQuizSubmitting(true);
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

      let promotion = parseFloat(rewardConfig.master);
      // check onenftstudiocion value
      // token in one icp exp 1 icp= 1000tokens
      const oneCoinVal = await userActor.get_NFT24Coin();
      let tokenInOneIcp = Number(oneCoinVal);
      if (oneNftCoin != tokenInOneIcp) {
        setIsQuizSubmitting(false);
        handleModalClose();
        setOneNftCoin(tokenInOneIcp);
        return;
      }
      let platform = parseFloat(rewardConfig.platform);
      let admin = parseFloat(rewardConfig.admin);
      let total = promotion + platform + admin;
      if (total !== 100) {
        setIsQuizSubmitting(false);

        return toast.error(t('Error During Transaction'));
      }

      let tempTotall = Number(quizAmountValuesInIcp.totalAmount);
      if (balance < tempTotall) {
        setConfirmTransaction(false);
        setIsQuizSubmitting(false);
        return toast.error(
          `${t('Insufficient balance to promote. Current Balance')} ${balance} ${t('please transfer assets to your wallet.')}`
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
          handlePromote(quizAmountValuesInIcp.priceOfAllUsers);
        }, 100);
      }
    } catch (error) {
      setIsQuizSubmitting(false);

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
    // let amount=Number(oneCoinVal)
    let tokensInOneIcp = Number(oneCoinVal);

    setOneNftCoin(tokensInOneIcp);
  };
  useEffect(() => {
    get_reward_Fees();
    oneNftstudioCoin();
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
                      <p>{t('Article Name')}</p>
                    </th>
                      <th>
                      <p>{t('Duration')}</p>
                    </th>
                    <th>
                      <p>{t('Question')}</p>
                    </th>
                    <th>
                      <p>{t('Status')}</p>
                    </th>
                    <th>
                      <div className='centercls'>
                        <p>{t('Action')}</p>
                      </div>
                    </th>
                  </tr>
                </thead>
            
                
                <tbody>
               

                  {quizList &&
                    quizList.map((item: any) => {
                      let quiz = item[1];
                      let id = item[0];

                      let questionCount = 0;
                      let quizDuration = 0;
                      let rewardPerUser = 0;
                      if (quiz?.rewardPerUser) {
                        rewardPerUser = parseInt(quiz?.rewardPerUser);
                      }

                      let remaningUserCanTakenReward = 0;
                      if (quiz?.remaningUserCanTakeReward) {
                        remaningUserCanTakenReward = parseInt(
                          quiz?.remaningUserCanTakeReward
                        );
                      }
                      let noOfUserWillGet = 0;
                      if (quiz?.usersWillGetReward) {
                        noOfUserWillGet = parseInt(quiz?.usersWillGetReward);
                      }
                      if (quiz?.questionCount) {
                        questionCount = parseInt(quiz?.questionCount);
                      }
                      if (quiz?.duration) {
                        quizDuration = parseInt(quiz?.duration);
                      }

                      return (
                        <tr key={id}>
                      
                    
                          <td className='category-item'>
                            <p>{sliceString(quiz?.title, 0, 20)}</p>{' '}
                            <Button className='text-primary ps-0'>
                              {t('View')}
                            </Button>
                            <Button
                              onClick={() => {
                                if (location == ALL_QUIZ_ROUTE_USER) {
                                  router.push(
                                    `${ADD_QUIZ_ROUTE_USER}?quizId=${id}`
                                  );
                                } else {
                                  router.push(
                                    `${ADD_QUIZ_ROUTE_ADMIN}?quizId=${id}`
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
                                setQuizId(id);
                                setStatusChanging(false);
                              }}
                              className='text-danger ps-0'
                            >
                              {t('delete')}
                            </Button>
                          </td>
                          <td className='category-item'><p>{quiz?.entryTitle}</p></td>
                          <td>{quizDuration}m</td>

                          <td>{questionCount}</td>

                          <td>
                            {quiz.isAtive ? (
                              <p className='green-color'>{t('Active')}</p>
                            ) : (
                              <p className='text-danger'>{t('Deactivate')}</p>
                            )}
                          </td>
                          <td>
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
                                      setQuizId(id);
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
                                      if (location == ALL_QUIZ_ROUTE_USER) {
                                        router.push(
                                          `/quiz-questions?quizId=${id}`
                                        );
                                      } else {
                                        router.push(
                                          `/super-admin/quiz-questions?quizId=${id}`
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
                                        setQuizAmountValues({
                                          token: rewardPerUser,
                                          totalUser: noOfUserWillGet,
                                        });
                                        setQuizPromoteModal(true);
                                      }

                                      setQuizId(id);
                                      setStatusChanging(true);
                                      setIsActive(quiz?.isAtive);
                                    }}
                                    className='green'
                                  >
                                    {quiz?.isAtive
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
      <AddQuestionForm
        quizId={quizId}
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
                  'the Quiz.'
                )}`
              : t('delete this Quiz.')}
          </h3>
        </Modal.Header>
        <Modal.Footer>
          <Button
            className='publish-btn me-2'
            onClick={() => {
              if (isStatusChanging) {
                handleChangeQuizStatus();
              } else {
                handleDeleteQuiz();
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
      <Modal show={showQuizPromoteModal} centered onHide={handleModalClose}>
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
              onClick={handleModalClose}
              className='fa fa-close'
            />
            {/* <Button
          className='close-btn'
        /> */}
          </div>
          <div>
            <p className='text-secondary'>
              {t('Are you sure you want to active you quiz for ')}{' '}
              {formatLikesCount(quizAmountValuesInIcp.totalAmount)} {t('Blockza tokens')}?
            </p>

            <p className='d-flex justify-content-between mb-1'>
              {/* <span
                    style={{
                      border: '2px',
                    }}
                  > */}
              <span>{t('No of user:')}</span>{' '}
              <span className='text-secondary'>
                {quizAmountValues.totalUser}
              </span>
              {/* </span> */}
            </p>
            <p className='d-flex justify-content-between mb-1'>
              <span>{t('Reward Per User:')}</span>{' '}
              <span className='text-secondary'>
                {quizAmountValues.token} {t('Tokens')}
              </span>
              {/* </span> */}
            </p>
            <p className='d-flex justify-content-between mb-1'>
              <span>{t('Reward Of All User:')}</span>{' '}
              <span className='text-secondary'>
              {quizAmountValues.totalUser} x {quizAmountValues.token} = {quizAmountValues.totalUser*quizAmountValues.token}  {t('Tokens')}
              </span>
              {/* </span> */}
            </p>
            <p className='d-flex justify-content-between mb-1'>
              <span>{t('Admin fee:')}</span>{' '}
              <span className='text-secondary'>
                {quizAmountValuesInIcp.adminfees} {t('Tokens')}
              </span>
            </p>
            <p className='d-flex justify-content-between mb-1'>
              <span>{t('Platform fee:')}</span>{' '}
              <span className='text-secondary'>
                {quizAmountValuesInIcp.plateForm} {t('Tokens')}
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
                {quizAmountValuesInIcp.totalAmount} {t('Tokens')}
              </span>
            </p>
          </div>
          <div className='d-flex justify-content-center mt-2'>
            <Button
              className='publish-btn w-100 mt-2 py-2'
              disabled={isQuizSubmitting}
              onClick={handleTransaction}
              // type='submit'
            >
              {isQuizSubmitting ? <Spinner size='sm' /> : t('Confirm')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
});
