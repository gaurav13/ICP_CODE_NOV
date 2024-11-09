'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Button, Modal, Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import inifinity from '@/assets/Img/coin-image.png';
import inifinity2 from '@/assets/Img/infinity.png';
import Image from 'next/image';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import Link from 'next/link';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { usePathname, useRouter } from 'next/navigation';
import { formatLikesCount, utcToLocal } from '@/components/utils/utcToLocal';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import { canisterId as entryCanisterId } from '@/dfx/declarations/entry';
import icpimage from '@/assets/Img/coin-image.png';
import {
  E8S,
  GAS_FEE,
  MIN_REWARD_CLAIM,
  MIN_REWARD_CLAIM_ICP,
} from '@/constant/config';
import Tippy from '@tippyjs/react';
import { toast } from 'react-toastify';
import updateBalance from '@/components/utils/updateBalance';
import updateReward from '@/components/utils/updateReward';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { exponentialToDecimal } from '@/components/utils/NOExponentional';
import updateTokensBalance from '@/components/utils/updateTokensBalance';
import { ConnectPlugWalletSlice } from '@/types/store';
import logger from '@/lib/logger';
import ReactPaginate from 'react-paginate';
import { Rewardperpages } from '@/constant/sizes';
import ClaimsRequestedOfUser from '@/components/transections/UserClaimReques';

export default function Reward() {
  const [rewards, setRewards] = useState<any>();
  const {tokenSymbol } = useConnectPlugWalletStore((state) => ({

    tokenSymbol:(state as ConnectPlugWalletSlice).tokenSymbol, 
  

  }));
  const [likeReward, setLikeReward] = useState<number>();
  const [showModal, setShowModal] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedRewards, setClaimedRewards] = useState<any>();
  const [userVerification, setUserVerification] = useState<any | null>();
  const [unlaimedRewards, setUnClaimedRewards] = useState<any>();
  const [claimableTokens, setClaimableTokens] = useState(0);
  const { t, changeLocale } = useLocalization(LANG);
  const [totallRewardFont, setTotallRewardFont] = useState(2.5);
  const [oneCoinVal, setCoinVal] = useState(0);
  const [minimumRewardToClaim, setMinimumRewardToClaim] = useState(0);
  const [totalRewardList, setTotalRewardList] = useState(0);
  const [forcePaginate, setForcePaginate] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);



  const [totallClaimedFont, setTotallClaimedFont] = useState(2.5);
  const [totallUnclaimedRewardFont, setTotallUnclaimedRewardFont] =
    useState(2.5);
  const [rewardAmount, setRewardAmount] = useState({
    all: 0,
    claimed: 0,
    unclaimed: 0,
  });
  const location = usePathname();
  const pageCount = Math.ceil(totalRewardList / Rewardperpages);

  const [chartData, setChartData] = useState({
    labels: ['Total Rewards', 'Total Claimed', 'Total unClaimed'],
    datasets: [
      {
        backgroundColor: ['#348BFB', '#FFE544', '#FFAA7A'],
        hoverBackgroundColor: ['#348BFB', '#FFE544', '#FFAA7A'],
        data: [0, 0, 0],
      },
    ],
  });
  const { auth, setAuth, identity, principal, setReward, setBalance,setTokensBalance } =
    useConnectPlugWalletStore((state: any) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
      setReward: state.setReward,
      setBalance: state.setBalance,
      setTokensBalance: state.setTokensBalance,


    }));

  const router = useRouter();
  const pathname = usePathname();

  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });

  const handleShow = () => {
    if (!userVerification)
      return toast.error(t('You have to verify your profile to claim rewards'));

    if (claimableTokens < minimumRewardToClaim) {
      return toast.error(
        `${t('You need to have atleast')} ${formatLikesCount(
          minimumRewardToClaim
        )} ${t(
          'unclaimed rewards to claim them, Current Amount:'
        )} ${formatLikesCount(exponentialToDecimal(claimableTokens))}`
      );
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    if (isClaiming) return;

    setShowModal(false);
  };
  const getUser = async (res?: any) => {
    let tempUser = null;
    let userReward = null;

    if (res) {
      tempUser = await res.get_user_details([]);
      userReward = await res.get_reward_of_user_count();
    } else {
      tempUser = await auth.actor.get_user_details([]);
      userReward = await auth.actor.get_reward_of_user_count();
    }
    if (tempUser?.ok) {
      var tempRewards = null;
      if (userReward) {
        tempRewards = userReward;
       
      }
      setUserVerification(tempUser?.ok[1].isVerified);
 


      let allAmount = Number(tempRewards?.all) ?? 0;
      let claimedAmount =  Number(tempRewards?.claimed) ?? 0;;
      let unClaimedAmount =  Number(tempRewards?.unclaimed) ?? 0;;

      setRewardAmount({
        all: allAmount,
        claimed: claimedAmount,
        unclaimed: unClaimedAmount,
      });
      setReward(unClaimedAmount);
      setClaimableTokens(unClaimedAmount);

      // const claimedRewards = tempRewards.filter((reward: any) => {
      //   return reward.isClaimed;
      // });
      // const unClaimedRewards = tempRewards.filter((reward: any) => {
      //   return !reward.isClaimed;
      // });
      setClaimedRewards([]);
      setUnClaimedRewards([]);

      // updateImg(tempUser.ok[1].profileImg[0]);
    }
  };
  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });
  const getNFTCoinVal = async () => {
    if (!identity || auth.state !== 'initialized') return;

    const temponeCoinValue = await userActor.get_NFT24Coin();

    let amount = Number(temponeCoinValue) / E8S;
    const expandedForm = Number(amount.toExponential()).toFixed(20);
    // scientificNotation.toFixed(20)

    setCoinVal(amount);
    return amount;
  };
  // chart conig
  let ifNoVal = {
    labels: ['No Rewards'],
    datasets: [
      {
        backgroundColor: ['#c0c0c0'],
        hoverBackgroundColor: ['#c0c0c0'],
        data: [0.000000001],
      },
    ],
  };
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            if (context) {
              const label = context.label || '';
              const value = context.parsed;

              const formattedValue = value.toFixed(8);

              return ` ${formattedValue}`;
            }
          },
        },
      },
    },
  };
  const handleClaim = async () => {
    if (auth.state !== 'initialized' || !identity) return;
    if (claimableTokens < minimumRewardToClaim) {
      return toast.error(
        `${t('You need to have atleast')} ${formatLikesCount(
          minimumRewardToClaim
        )} ${t(
          'unclaimed rewards to claim them, Current Amount:'
        )} ${formatLikesCount(claimableTokens)}`
      );
    }
    try {
      setIsClaiming(true);
      const claim = await auth.actor.claim_rewards_of_user();
      getUser();
      toast.success(t('Your reques has been send to admin for approvel.'));
      updateTokensBalance({ identity, auth, setTokensBalance });
      setIsClaiming(false);
      handleModalClose();
    } catch (err) {
      setIsClaiming(false);
      handleModalClose();
    }
  };
  let claimableReward = rewardAmount.unclaimed;
  let gasFee = GAS_FEE / E8S;
  let getRewardArray=async (startIndex:number,res?:any)=>{
    let userReward=null
    if (res) {
      userReward = await res.get_reward_of_user(startIndex,Rewardperpages);
    } else {
      userReward = await auth.actor.get_reward_of_user(startIndex,Rewardperpages);
    }
    if(userReward){
      let total=Number(userReward?.amount) ??0
      setTotalRewardList(total)
      let rewardsList=userReward?.reward;
      setRewards(rewardsList);

    }else{

    }

  }

  const handlePageClick = async (event: any) => {
    setForcePaginate(event.selected);
    let offset=event.selected * Rewardperpages;
    getRewardArray(offset)

  }
  useEffect(() => {
    if (auth.state === 'anonymous') {
      router.push('/');
      // setIsOwner(false);
    } else if (auth.state !== 'initialized') {
    } else {
      getUser();
      getRewardArray(0)
      getNFTCoinVal();
    }
  }, [auth, pathname]);
  let getInitMinimumRewardToClaim = async () => {
    const initMinimumRewardToClaim = await userActor.getMinimumClaimReward();

    if (initMinimumRewardToClaim) {
      let amount = parseInt(initMinimumRewardToClaim);
      setMinimumRewardToClaim(amount);
    }
  };
  useEffect(() => {
    const getLikeR = async () => {
      const tempLike = await entryActor.get_like_reward();
      const likeR = parseInt(tempLike);
      setLikeReward(likeR / E8S);
    };
    if (identity && auth.state === 'initialized') {
      getLikeR();
    }
    getInitMinimumRewardToClaim();
  }, [auth, identity, pathname]);
  useEffect(() => {
    setChartData({
      labels: ['Total Rewards', 'Total Claimed', 'Total Unclaimed'],
      datasets: [
        {
          backgroundColor: ['#348BFB', '#FFE544', '#FFAA7A'],
          hoverBackgroundColor: ['#348BFB', '#FFE544', '#FFAA7A'],
          data: [
            rewardAmount ? rewardAmount.all : 0,
            rewardAmount ? rewardAmount.claimed : 0,
            rewardAmount ? rewardAmount.unclaimed : 0,
          ],
        },
      ],
    });
  }, [rewardAmount]);
  ChartJS.register(ArcElement, Tooltip);
  useEffect(() => {
    let all = rewardAmount.all.toString();
    let claimed = rewardAmount.claimed.toString();
    let unclaimed = rewardAmount.unclaimed.toString();

    if (all.length <= 9) {
      setTotallRewardFont(2.1);
    } else if (all.length <= 11) {
      setTotallRewardFont(1.7);
    } else if (all.length <= 15) {
      setTotallRewardFont(1.3);
    } else if (all.length <= 17) {
      setTotallRewardFont(1);
    } else {
      setTotallRewardFont(0.85);
    }

    if (claimed.length <= 9) {
      setTotallClaimedFont(2.1);
    } else if (claimed.length <= 11) {
      setTotallClaimedFont(1.7);
    } else if (claimed.length <= 15) {
      setTotallClaimedFont(1.3);
    } else if (claimed.length <= 17) {
      setTotallClaimedFont(1);
    } else {
      setTotallClaimedFont(0.85);
    }

    if (unclaimed.length <= 9) {
      setTotallUnclaimedRewardFont(2.1);
    } else if (unclaimed.length <= 11) {
      setTotallUnclaimedRewardFont(1.7);
    } else if (unclaimed.length <= 15) {
      setTotallUnclaimedRewardFont(1.3);
    } else if (claimed.length <= 17) {
      setTotallUnclaimedRewardFont(1);
    } else {
      setTotallUnclaimedRewardFont(0.85);
    }
  }, [rewardAmount]);
  useEffect(() => {
    if (location.startsWith("/reward") && !location.endsWith('/')) {
     router.push("/reward/");
   }
     }, [])
  return (
    <>
      <main id='main'>
        <div className='main-inner home'>
          <Head>
            <title>{t('Hi')}</title>
          </Head>
          <div className='section' id='top'>
            
            <Row>
              <Col xl='12' lg='12' md='12'>
                <div className='spacer-20' />
                <Row>
                  <Col xl='12' lg='12' md='12'>
                    <div className='flex-div-sm align-items-center'>
                      <div>
                        <h2>{t('my rewards')}</h2>
                        <div className='spacer-20' />
                      </div>
                      <div className='d-flex flex-column align-items-end rewardbtn'>
                        <Button
                          onClick={handleShow}
                          disabled={isClaiming}
                          className='blue-button sm'
                        >
                          {t('Claim Your Rewards')} (
                          {formatLikesCount(claimableReward)}
                          <Image
                            src={inifinity}
                            alt='inifinity'
                            style={{ height: '24px', width: '24px' }}
                          />
                          )
                        </Button>
                        <p className='text-secondary mt-2'>
                          {t('* The minimum requirement for claiming is')}{' '}
                          {minimumRewardToClaim}{' '}
                          {t('ICP worth of unclaimed rewards')}
                        </p>
                        <div className='spacer-20' />
                      </div>
                    </div>
                  </Col>
               
                  <Col xl='4' lg='6' md='6'>
                    <div className='total-reward-panel sbluecolor'>
                      <h3>{t('Total Rewards')}</h3>
                      <div className='flex-div-xs align-items-center'>
                        <Image src={inifinity} alt='inifinity' />
                          {/* {rewards && rewards.length ? rewards.length : '0'} */}
                          <Tippy content={totalRewards ?? 0}>
                          <p
                          className='reward-text'
                          style={{ fontSize: `${totallRewardFont}rem ` }}
                        >
                          {formatLikesCount(totalRewards ?? 0)}
                        
                          
                        </p>
                         
                        </Tippy>
                      
                      </div>
                      <div className='text-right'>
                        <p className='sblueclor'>.</p>
                      </div>
                    </div>
                  </Col>
                  <Col xl='4' lg='6' md='6'>
                    <Link href='#' className='total-reward-panel syellowcolor'>
                      <h3>{t('Total Claimed')}</h3>
                      <div className='flex-div-xs align-items-center'>
                        <Image src={inifinity} alt='inifinity' />
                        <Tippy content={rewardAmount?.claimed ?? 0}>
                        <p
                          className='reward-text'
                          style={{ fontSize: `${totallClaimedFont}rem ` }}
                        >
                          {/* {claimedRewards ? claimedRewards.length : 0} */}
                          {formatLikesCount(rewardAmount?.claimed ?? 0)}
                        </p>
                         
                        </Tippy>
                     
                      </div>
                      <div className='text-right'>
                        <p>---------</p>
                      </div>
                    </Link>
                  </Col>
                  <Col xl='4' lg='6' md='6'>
                    <div
                      className='total-reward-panel'
                      style={{ backgroundColor: '#FFAA7A' }}
                    >
                      <h3>{t('Total Unclaimed')}</h3>
                      <div className='flex-div-xs align-items-center'>
                        <Image src={inifinity} alt='inifinity' />
                        <Tippy content={rewardAmount?.unclaimed ?? 0}>
                        <p
                          className='reward-text'
                          style={{
                            fontSize: `${totallUnclaimedRewardFont}rem `,
                          }}
                        >
                          {/* 0 */}
                          {formatLikesCount(rewardAmount?.unclaimed ?? 0)}
                        </p>
                         
                        </Tippy>
                     
                      </div>
                      <div className='text-right'>
                        <p>---------</p>
                      </div>
                    </div>
                  </Col>
                  <Row className='my-5'>
              <Col>
              <ClaimsRequestedOfUser setTotalRewards={setTotalRewards}/>
              </Col>
            </Row>
                  <Col xl='4' lg='6' md='6'>
                    <div className='total-pnl' style={{ paddingTop: '10px' }}>
                      {/* <Image src={Circle} alt='Circle' /> */}
                      <div className='d-flex justify-content-center ghContainer'>
                        {rewards && rewards.length == 0 ? (
                          <div style={{ height: '100%' }}>
                            <Doughnut data={ifNoVal} />
                          </div>
                        ) : (
                          <div style={{ height: '100%' }}>
                            <Doughnut data={chartData} options={options} />
                          </div>
                        )}
                      </div>
                      <ul className='total-toal-list '>
                        <li>
                          <span className='sbluecolor' /> {t('Total Rewards')}
                        </li>
                        <li>
                          <span className='syellowcolor' /> {t('Total Claimed')}
                        </li>
                        <li>
                          <span style={{ backgroundColor: '#FFAA7A' }} />{' '}
                          {t('Total Unclaimed')}
                        </li>
                      </ul>
                    </div>
                  </Col>
                  {/* <Col xl='12' lg='12' md='12'>
                    <div className='spacer-20'/>
                  </Col> */}
                  <Col xl='8' lg='12' md='12'>
                    <div className='table-container'>
                      <div
                        className='table-container-inner sm'
                        style={{ borderRadius: '20px' }}
                      >
                        <div className='reward-table-panl'>
                          <div className='reward-tabel'>
                            <div className='reward-table-head'>
                              <Row>
                                {/* <Col xs='2'>{t('Transaction')}</Col> */}
                                <Col xs='4'>{t('Reward Type')}</Col>

                                <Col xs='2'>{t('Amount')}</Col>

                                <Col xs='2'>{t('date')}</Col>
                                <Col xs='2'>{t('Time')}</Col>
                                <Col xs='2'>{t('Action')}</Col>
                              </Row>
                            </div>
                            <div className='reward-table-body'>
                              {rewards && rewards?.length > 0 ? (
                                rewards?.map((reward: any, index: number) => (
                                  <Row key={index}>
                                    <Col xs='4'>
                                      {reward?.reward_type}
                                    </Col>
                                    <Col xs='2'>
                                      <Tippy
                                        content={
                                          <div>
                                            <p className='m-0 d-flex'>
                                              {exponentialToDecimal(
                                               reward.amount
                                                  
                                              )}{' '}
                                              <div className='tooltiptokenLogo'>
                                              <Image
                          src={icpimage}
                          alt='icpimage'
                          className='imageStyle'
                        
                        />
                                              </div>
                                              {t('NFTStudio tokens')}   
                                            </p>
                                          </div>
                                        }
                                      >
                                        <p className='m-0'>
                                          {reward.amount
                                            ? formatLikesCount(reward.amount)
                                            : 0}{' '}
                                           {tokenSymbol}
                                        </p>
                                      </Tippy>
                                    </Col>
                                    <Col xs='2'>
                                      {/* 20-05-2023{' '} */}
                                      {utcToLocal(
                                        reward.creation_time.toString(),
                                        'DD-MM-YYYY'
                                      )}
                                    </Col>
                                    <Col xs='2'>
                                      {
                                        // 09:06 AM
                                        utcToLocal(
                                          reward.creation_time.toString(),
                                          'hh:mm A'
                                        )
                                      }
                                    </Col>
                                    <Col xs='2'>
                                      {reward.isClaimed ? (
                                        <Tippy
                                          content={
                                            <div>
                                              {utcToLocal(
                                                reward?.claimed_at[0]?.toString(),
                                                'DD-MM-yyyy hh:mm A'
                                              )}
                                            </div>
                                          }
                                        >
                                          <span>{t('Claimed')}</span>
                                        </Tippy>
                                      ) : (
                                        t('UnClaimed')
                                      )}
                                    </Col>
                                  </Row>
                                ))
                              ) : (
                                <p className='mt-3 text-center'>
                                  {t('No Rewards found')}
                                </p>
                              )}

                              <div style={{ height: 300 }} />
                            </div>
                           {rewards && rewards?.length >Rewardperpages && <Col xl='6' lg='12'>
                        <div className='pagination-container mystyle d-flex justify-content-center justify-content-md-end'>
                          {
                            <ReactPaginate
                              breakLabel='...'
                              nextLabel=''
                              onPageChange={handlePageClick}
                              pageRangeDisplayed={5}
                              pageCount={pageCount}
                              previousLabel=''
                              renderOnZeroPageCount={null}
                              forcePage={forcePaginate}
                            />
                          }
                        </div>
                      </Col>}
                          </div>
                        </div>
                      </div>
                      
                    </div>
                    <div className='spacer-30' />
                  </Col>
                  {/* <Col xl='4' lg='6' md='12'>
                    <div className='total-pnl'>
                      {/* <Image src={Circle} alt='Circle' /> */}
                  {/* <div className='d-flex justify-content-center'>

                    
                     {(rewards && rewards.length == 0) ? <Doughnut data={ifNoVal} />:<div style={{width:'200px'}}><Doughnut data={chartData} //> }
                     </div>
                      <ul className='total-toal-list'>
                        <li>
                          <span className="sbluecolor"/>{' '}
                          Total Rewards
                        </li>
                        <li>
                          <span className="syellowcolor"/>{' '}
                          Total Claimed
                        </li>
                        <li>
                          <span style={{ backgroundColor: '#FFAA7A' }}/>{' '}
                          Recent Rewards
                        </li>
                      </ul>
                    </div>
                  </Col> */}
                </Row>
                {/* <div className='pbg-pnl text-left'/> */}
              </Col>
            </Row>
           
          </div>
        </div>
      </main>
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Body>
          <>
            <div className='flex-div connect-heading-pnl mb-3'>
              {/* <i className='fa fa-question-circle-o'/> */}
              <p />
              <p className='text-bold h5 fw-bold m-0'>{t('Claim Rewards')}</p>
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
              <p className='text-center'>
                {t('Are you sure you want to claim')} {claimableReward}{' '}
                {t('rewards ?')}
              </p>

              <p className='text-secondary mb-1'>
                <span
                  style={{
                    border: '2px',
                  }}
                >
                  {t('Reward:')} {claimableReward}
                </span>
              </p>
              <p className='text-secondary mb-1'>
                <span
                  style={{
                    border: '2px',
                  }}
                >
                  {t('Amount in Tokens:')} {claimableTokens} Tokens
                </span>
              </p>
              <p className='text-secondary mb-0'>
                {t('Transaction fee:')} {(claimableTokens*(10/100)).toFixed(4)} Tokens
              </p>
              <div
                style={{
                  height: 1,
                  backgroundColor: 'gray',
                  width: '40%',
                }}
              />
              <p className='text-secondary mt-1 mb-0'>
                {t('Total:')}
                {claimableTokens.toFixed(8)} Tokens
              </p>
            </div>
            <div className='d-flex justify-content-center'>
              <Button
                className='publish-btn'
                disabled={isClaiming || isClaiming}
                onClick={handleClaim}
                // type='submit'
              >
                {isClaiming ? <Spinner size='sm' /> : t('Confirm')}
              </Button>
            </div>
          </>
        </Modal.Body>
      </Modal>
    </>
  );
}
