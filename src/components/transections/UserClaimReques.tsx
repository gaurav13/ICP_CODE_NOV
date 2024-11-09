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
import { ADMIN_DATE_FORMATE, ADMIN_TIME_FORMATE } from '@/constant/DateFormates';

export default function ClaimsRequestedOfUser({setTotalRewards}:{setTotalRewards:any}) {
  const [rewards, setRewards] = useState<any>();
  const {tokenSymbol } = useConnectPlugWalletStore((state) => ({

    tokenSymbol:(state as ConnectPlugWalletSlice).tokenSymbol, 
  

  }));
  
  const { t, changeLocale } = useLocalization(LANG);
  const [totalRewardList, setTotalRewardList] = useState(0);
  const [forcePaginate, setForcePaginate] = useState(0);

  const pageCount = Math.ceil(totalRewardList / Rewardperpages);


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



  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });

  const getRefinedList =  (tempEntriesList: any[]) => {
    if (tempEntriesList.length === 0) {
      return [];
    }
    const userActor = makeUserActor({
      agentOptions: {
        identity,
      },
    });

      let newArray=tempEntriesList.map((item: any) => {
        let id=item[0];
        let entry=item[1];
        let tempTime = utcToLocal(entry.creation_time.toString(), ADMIN_TIME_FORMATE);
        let tempdate  = utcToLocal(entry.creation_time.toString(), ADMIN_DATE_FORMATE);
        let tokens = parseInt(entry.tokens);
        let transectionFee = parseInt(entry.transectionFee);

        let status=Object.keys(entry.status)[0];
        let userid=entry.user.toString()
        let newItem = {
          entryId: id,
        amount:tokens,
     time:tempTime,
     date:tempdate,
     userId:userid,
     status,
     transectionFee
        };
      
        return newItem;
      })
    

    return newArray;
  };

  let getRewardArray=async (startIndex:number,res?:any)=>{
    let userReward=null
    if (res) {
      userReward = await res.getTokensClaimedRequestsForUser("",startIndex,Rewardperpages);
    } else {
      userReward = await auth.actor.getTokensClaimedRequestsForUser("",startIndex,Rewardperpages);
    }
    if(userReward){
      let total=Number(userReward?.amount) ??0
      let totallAproved=Number(userReward?.totallAproved) ??0
      setTotalRewards(totallAproved)
      setTotalRewardList(total);
      let rewarslist=getRefinedList(userReward?.entries)
      setRewards(rewarslist);

    }else{
      setRewards([]);
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
    
      getRewardArray(0)

    }
  }, [auth, pathname]);




  return (
    <>
     <div className='reward-table-panl'>
                          <div className='reward-tabel'>
                            <div className='reward-table-head'>
                              <Row>
                                {/* <Col xs='2'>{t('Transaction')}</Col> */}
                                {/* <Col xs='4'>{t('Reward Type')}</Col> */}

                                <Col xs='2'>{t('Amount')}</Col>
                                <Col xs='4'>{t('Transaction fee')}</Col>


                                <Col xs='2'>{t('date')}</Col>
                                <Col xs='2'>{t('Time')}</Col>
                                <Col xs='2'>{t('status')}</Col>
                              </Row>
                            </div>
     {rewards && rewards?.length > 0 ? (
                                rewards?.map((reward: any, index: number) => (
                                  <Row key={index}>
                                  
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
                                    <Col xs='4'>
                                      <Tippy
                                        content={
                                          <div>
                                            <p className='m-0 d-flex'>
                                              {exponentialToDecimal(
                                               reward.transectionFee
                                                  
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
                                          {reward.transectionFee
                                            ? formatLikesCount(reward.transectionFee)
                                            : 0}{' '}
                                           {tokenSymbol}
                                        </p>
                                      </Tippy>
                                    </Col>
                                    <Col xs='2'>
                                      {/* 20-05-2023{' '} */}
                                      {reward?.date}
                                    </Col>
                                    <Col xs='2'>
                                      
                                       {reward?.time}
                                      
                                    </Col>
                                    <Col xs='2'>
                                    <p className={reward?.status}>{reward?.status}</p>
                                    </Col>
                                  </Row>
                                ))
                              ) : (
                                <p className='mt-3 text-center'>
                                  {t('No Record found')}
                                </p>
                              )}

                              <div style={{ height: 300 }} />
                         
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
  
      
     
     
    </>
  );
}
