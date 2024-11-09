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
import { getImage, iframeimgThumbnail } from '@/components/utils/getImage';
import comment from '@/assets/Img/Icons/icon-writer.png';
import ExportPost from '@/components/ExportPost/ExportPost';
import ExportPodcast from '@/components/ExportPodcast/ExportPodcast';

let itemsPerPage = 10;
export default function UserFavouritePosts({userId}:{userId:Principal}) {
  const [isLoading, setIsLoading] = useState(true);
  const [myEntries, setMyEntries] = useState<any[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);

  const [forcePaginate, setForcePaginate] = useState(0);
  const { t, changeLocale } = useLocalization(LANG);

  const { auth, identity, principal ,userAuth} = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    identity: state.identity,
    principal: state.principal,
    userAuth:state.userAuth
  }));

  const pageCount = Math.ceil(totalEntries / itemsPerPage);
  // let endIndex =
  //   forcePaginate === 0
  //     ? itemsPerPage
  //     : (forcePaginate * itemsPerPage) % myActivity.length;
  let startIndex = forcePaginate * itemsPerPage;

  let refinedEntries = (entries: any[]) => {
    if (!entries || entries?.length == 0) return null;
    let mapComments = entries.map((e) => {
      logger(e,"dsafasfasdfsadf");
      if(e[1].isPodcast){
        if (e[1].podcastVideoLink != '') {
          e[1].image = iframeimgThumbnail(
            e[1].podcastVideoLink
          );
        } else if (e[1].podcastImg.length != 0) {
         e[1].image = getImage(
            e[1].podcastImg[0]
          );
        } else {
          e[1].image = comment;
        };
        return e

      }else{
        return e
      }
    
    });
    return mapComments;
  };

  const getUserFavourite = async (principal: Principal, start: number) => {
    try {
      const entryActor = makeEntryActor({
        agentOptions: {
          identity,
        },
      });
      const tempEntries = await entryActor.getUserFavouritePost(principal,start,itemsPerPage);
      let entries = refinedEntries(tempEntries?.entries);
      let totalComment = Number(tempEntries?.amount);
      setTotalEntries(totalComment);
      if (entries) {
        setMyEntries(entries);
      };
      setIsLoading(false);
  
    } catch (err) {
      logger(err);
    }
  };
  const handlePageClick = async (event: any) => {
    setIsLoading(true);

    setForcePaginate(event.selected);
    let startIndex = event.selected * itemsPerPage;
    let princ = identity.getPrincipal();
    getUserFavourite(princ, startIndex);
  };

  let getUserFavPostsList=(startIndex:number)=>{
    if (auth.state === 'initialized') {
      if (userId) {
       
          if (userAuth.userPerms?.articleManagement && !userAuth.isAdminBlocked) {
            getUserFavourite(userId, startIndex);
          }
        
      } else {
        if (identity) {
          let princ = identity.getPrincipal();
          if (myEntries?.length !== 0) return;
  
          getUserFavourite(princ, startIndex);
        }
      }}
  }
  useEffect(() => {
    getUserFavPostsList(0)
  }, [auth, userId, identity]);


  return (
    <div>
      <div
        className=''
        style={{ boxShadow: 'none' }}
      >
        {myEntries?.length > 0 ? (
      myEntries && Array.isArray(myEntries) && myEntries?.map((entry) => {
      let id= Array.isArray(entry)  && entry[0];
      let tempEntry=Array.isArray(entry) && entry[1];

        return (
          <>
        { tempEntry?.isPodcast?
         <ExportPodcast
         key={id}
         entry={tempEntry}
         entryId={id as string}
       />:
            <ExportPost
              key={id}
              entry={tempEntry}
              entryId={id as string}
            /> }
           </>)
          
        })
        ) : (
          <div className='my-3'>
            {isLoading ? (
            <div className='d-flex justify-content-center'>  <Spinner /></div>
            ) : (
              <p className='h5 m-0 text-center'>{t('No Favourite Post Found')}</p>
            )}
          </div>
        )}
      </div>
      {totalEntries > itemsPerPage && <div className='d-flex justify-content-end mt-2'>
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
      </div>
}
    </div>   
  );
}
