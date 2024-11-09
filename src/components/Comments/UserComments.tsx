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

type Comments = {
  time: String;
  date: String;
  entryId: String;
  title: String;
};
let itemsPerPage = 10;
export default function UserComments({userId}: {userId:Principal}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [myComments, setMyComments] = useState<Comments[]>([]);
  const [totalComments, setTotalComments] = useState(0);

  const [forcePaginate, setForcePaginate] = useState(0);
  const { t, changeLocale } = useLocalization(LANG);
  const { auth, identity, principal,userAuth } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    identity: state.identity,
    principal: state.principal,
    userAuth:state.userAuth
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

  const pageCount = Math.ceil(totalComments / itemsPerPage);
  // let endIndex =
  //   forcePaginate === 0
  //     ? itemsPerPage
  //     : (forcePaginate * itemsPerPage) % myActivity.length;


  let refinedComments = (comments: any[]) => {
    if (!comments || comments?.length == 0) return null;
    let mapComments = comments.map((c) => {
      let tempTime = utcToLocal(c.creation_time.toString(), 'hh:mm A');
      let tempDate = utcToLocal(c.creation_time.toString(), 'DD-MM-yyyy');
      return {
        title: c?.content,
        entryId: c?.entryId,
        time: tempTime,
        date: tempDate,
      };
    });
    return mapComments;
  };
  const getUserComments = async (principal: Principal, start: number) => {
    const myComments = await activityActor.getCommentsofUser(
      principal,
      start,
      itemsPerPage
    );

    let comments = refinedComments(myComments?.entries);
    let totalComment = Number(myComments?.amount);
    setTotalComments(totalComment);
    if (comments) {
      setMyComments(comments);
    };
    setIsLoading(false);

  };
  const handlePageClick = async (event: any) => {
    setIsLoading(true);

    setForcePaginate(event.selected);
    let startIndex = event.selected * itemsPerPage;
    let princ = identity.getPrincipal();
    getUserComments(princ, startIndex);
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
  let getUserCommentsList=(startIndex:number)=>{
    if (auth.state === 'initialized') {
      if (userId) {
       
          if (userAuth.userPerms?.articleManagement && !userAuth.isAdminBlocked) {
            getUserComments(userId, startIndex);
          }
        
      } else {
        if (identity) {
          let princ = identity.getPrincipal();
          if (myComments?.length !== 0) return;
  
          getUserComments(princ, startIndex);
        }
      }}
  }
  useEffect(() => {
    getUserCommentsList(0)
  }, [auth, userId, identity]);


  return (
    <div>
      <div
        className='profile-comment-pnl m-0 p-0'
        style={{ boxShadow: 'none' }}
      >
        {myComments?.length > 0 ? (
          <div className='table-container'>
            <div className='table-container-inner '>
              <Table className='activity-table small mb-0'>
                <thead>
                  <tr>
                    <th>
                      <p>{t('Content')}</p>
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
                  {myComments?.map((comment: Comments, index: number) => (
                    <tr key={index}>
                      <td className=''>
                        <div
                          className='d-inline-flex align-items-start cursor-pointer'
                          onClick={() => handleClick(comment?.entryId)}
                        >
                          {comment?.title.length >20?comment?.title.slice(0,20):comment?.title ?? ''}
                        </div>
                      </td>
                      <td>{comment?.date ?? ''}</td>
                      <td>{comment?.time ?? ''}</td>
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
              <p className='h5 m-0 text-center'>{t('No Comments Found')}</p>
            )}
          </div>
        )}
      </div>
      {totalComments > itemsPerPage &&    <div className='d-flex justify-content-end mt-2'>
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
