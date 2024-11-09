'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Tab, Nav, Table, Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import {
  makeCommentActor,
  makeEntryActor,
  makeUserActor,
} from '@/dfx/service/actor-locator';
import { Activity, RefinedActivity } from '@/types/profile';
import ReactPaginate from 'react-paginate';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import logger from '@/lib/logger';
import { Principal } from '@dfinity/principal';
import { utcToLocal } from '@/components/utils/utcToLocal';
import {
  ARTICLE_DINAMIC_PATH,
  ARTICLE_STATIC_PATH,
  Podcast_DINAMIC_PATH,
  Podcast_STATIC_PATH,
} from '@/constant/routes';
import { fromNullable } from '@dfinity/utils';

type QuizTaken = {
  time: string;
  date: string;
  quizId: string;
  title: string;
  reward: number;

};
let itemsPerPage = 10;
export default function UserTakenSurveyList({userId}: {userId:Principal}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [myTakenQuiz, setMyTakenQuiz] = useState<QuizTaken[]>([]);
  const [totalTakenQuiz, setTotalTakenQuiz] = useState(0);

  const [forcePaginate, setForcePaginate] = useState(0);
  const { t, changeLocale } = useLocalization(LANG);
  const { auth, identity, principal,tokenSymbol ,userAuth} = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    identity: state.identity,
    principal: state.principal,
    tokenSymbol:state.tokenSymbol,
    userAuth : state.userAuth
  }));
  const activityActor = makeCommentActor({
    agentOptions: {
      identity,
    },
  });
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });

  const pageCount = Math.ceil(totalTakenQuiz / itemsPerPage);
  // let endIndex =
  //   forcePaginate === 0
  //     ? itemsPerPage
  //     : (forcePaginate * itemsPerPage) % myActivity.length;


  let refineduserTakenQuiz = (TakenList: any[]) => {
    if (!TakenList || TakenList?.length == 0 || !Array.isArray(TakenList)) return null;
    let mapComments = TakenList.map((entry) => {
      let c=entry[1];
      let id=entry[0]

      let tempTime = utcToLocal(c?.attemptAt.toString(), 'hh:mm A');
      let tempDate = utcToLocal(c?.attemptAt.toString(), 'DD-MM-yyyy');
      let tempReward=fromNullable(c?.reward)
      return {
        title: c?.title,
        quizId: id,
        time: tempTime,
        date: tempDate,
        reward: tempReward?Number(tempReward):0,

      };
    });
    return mapComments;
  };
  const getUserTakenSurvey = async (principal: Principal, start: number) => {
    let searchString= '';
    const userTakenQuiz = await entryActor.getTakenSurveyOfUser(
      principal,
      searchString,
      start,
      itemsPerPage
    );
    let takenQuiz = refineduserTakenQuiz(userTakenQuiz?.entries);
    logger({userTakenQuiz,takenQuiz},"userTakenQuiz")
    let totalQuizTaken = Number(userTakenQuiz?.amount);
    setTotalTakenQuiz(totalQuizTaken);
    if (takenQuiz) {
      setMyTakenQuiz(takenQuiz);
    };
    setIsLoading(false);

  };
  const handlePageClick = async (event: any) => {
    setIsLoading(true);

    setForcePaginate(event.selected);
    let startIndex = event.selected * itemsPerPage;
    let princ = identity.getPrincipal();
    getUserTakenSurvey(princ, startIndex);
  };
  let handleClick = async (id: String) => {
    try {
      let isEntryPodcsat = await entryActor.isEntryPodcast(id);
      if (isEntryPodcsat?.ok) {
        if (isEntryPodcsat?.ok?.isPodcast) {
          router.push(
            isEntryPodcsat?.ok?.isStatic
              ? `${Podcast_STATIC_PATH + id}`
              : `${Podcast_DINAMIC_PATH + id}`
          );
        } else {
          router.push(
            isEntryPodcsat?.ok?.isStatic
              ? `${ARTICLE_STATIC_PATH + id}`
              : `${ARTICLE_DINAMIC_PATH + id}`
          );
        }
      }
    } catch (error) {}
  };
  let getUserSurveyList=(startIndex:number)=>{
    if (auth.state === 'initialized') {
      if (userId) {
       
          if (userAuth.userPerms?.articleManagement && !userAuth.isAdminBlocked) {
            getUserTakenSurvey(userId, startIndex);
          }
        
      } else {
        if (identity) {
          let princ = identity.getPrincipal();
          if (myTakenQuiz?.length !== 0) return;
  
          getUserTakenSurvey(princ, startIndex);
        }
      }}
  }

  useEffect(() => {
    getUserSurveyList(0)
  }, [auth, userId, identity]);


  return (
    <div>
      <div
        className='profile-comment-pnl m-0 p-0'
        style={{ boxShadow: 'none' }}
      >
        {myTakenQuiz?.length > 0 ? (
          <div className='table-container'>
            <div className='table-container-inner '>
              <Table className='activity-table small mb-0'>
                <thead>
                  <tr>
                    <th>
                      <p>{t('Title')}</p>
                    </th>
                    <th>
                      <p>{t('Reward')}</p>
                    </th>
                    <th>
                      <p>{t('date')}</p>
                    </th>
                    <th>
                      <p>{t('Time')}</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myTakenQuiz?.map((taken: QuizTaken, index: number) => (
                    <tr key={index}>
                      <td className=''>
                        <div
                          className={`ps-1 cursor-none`}
                         
                        >
                          {taken.title.length>15?taken.title.slice(0,15):taken.title}
                        
                        </div>
                      </td>
                      <td><span className='ps-1'>{taken.reward ?? ''}{" "}{tokenSymbol}</span></td>

                      <td>{taken.date ?? ''}</td>
                      <td>{taken.time ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        ) : (
          <div className='my-3'>
            {isLoading ? (
           <div className='d-flex justify-content-center'>  <Spinner /></div>
            ) : (
              <p className='h5 m-0'>{t('No taken quiz found')}</p>
            )}
          </div>
        )}
      </div>
    {totalTakenQuiz>itemsPerPage &&  <div className='d-flex justify-content-end mt-2'>
        <div className='pagination-container' style={{ width: 'auto' }}>
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
        </div>
      </div>}
    </div>
  );
}
