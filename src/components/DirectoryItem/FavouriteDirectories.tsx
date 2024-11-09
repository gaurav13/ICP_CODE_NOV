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
import { getImage } from '@/components/utils/getImage';
import FavouriteDirectoryItem from '@/components/DirectoryItem/FavouriteDirectoryItem';
import { fromDefinedNullable, fromNullable } from '@dfinity/utils';

let itemsPerpage = 10;
export default function UserDirectories({userId}:{userId:Principal} ) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [directories, setDirectories] = useState<any[]>([]);
  const [totalDirectories, setTotalDirectories] = useState(0);

  const [forcePaginate, setForcePaginate] = useState(0);
  const { t, changeLocale } = useLocalization(LANG);

  const { auth, identity, principal,userAuth } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    identity: state.identity,
    principal: state.principal,
    userAuth: state.userAuth
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
  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });
  const pageCount = Math.ceil(totalDirectories / itemsPerpage);

  let refinedDirectories =async (dir: any[]) => {
    if (!dir || dir?.length == 0) return null;
 let mapweb3=await Promise.all( 
  dir.map(async (c) => {
  let tempWeb3=c[1]
  
  let tempBanner = await getImage(
    tempWeb3?.companyBanner
  );
  
  let tempLogo = await getImage(
    tempWeb3?.companyLogo
  );
  let twitterLink= fromNullable(tempWeb3?.twitter)
  let telegramLink= fromNullable(tempWeb3?.telegram)
  let discordLink= fromNullable(tempWeb3?.discord)
  let instagramLink= fromNullable(tempWeb3?.instagram)
  let facebookLink= fromNullable(tempWeb3?.facebook)
  let linkedinLink= fromNullable(tempWeb3?.linkedin)
  let companyLink= fromNullable(tempWeb3?.companyUrl)
        return {
          companyLogo: tempLogo,
          id: c[0],
          company :tempWeb3?.company,
          companyUrl :companyLink,
          likeCount : Number(tempWeb3?.likes) ?? 0,
          views : Number(tempWeb3?.views) ?? 0,
  
          status : tempWeb3?.status,
          shortDescription : tempWeb3?.shortDescription,
          twitter : twitterLink,
          telegram : telegramLink,
          discord : discordLink,
          instagram : instagramLink,
          facebook : facebookLink,
          linkedin : linkedinLink,
          isStatic : tempWeb3?.isStatic,
          companyBanner :tempBanner,
        };
      }))
    return mapweb3;
  };
  const getUserDirectories = async (principal: Principal, start: number) => {
    logger(start,"safasfdsadfsad")
    const myDirectories = await entryActor.getUserFavouriteDirectories(
      principal,
      "",
      start,
      itemsPerpage
    );

    let directories = await refinedDirectories(myDirectories?.web3List);

    let totalDirectories = Number(myDirectories?.amount);
    setTotalDirectories(totalDirectories);
    if (directories) {
      setDirectories(directories);
    };
    setIsLoading(false);

  };
  const handlePageClick = async (event: any) => {
    setIsLoading(true);
    setDirectories([])
    setForcePaginate(event.selected);
    let startIndex = event.selected * itemsPerpage;
    let princ = identity.getPrincipal();
    getUserDirectories(princ, startIndex);
  };

  let getUserFavDirectoriesList=(startIndex:number)=>{
    if (auth.state === 'initialized') {
      if (userId) {
       
          if (userAuth.userPerms?.articleManagement && !userAuth.isAdminBlocked) {
            getUserDirectories(userId, startIndex);
          }
        
      } else {
        if (identity) {
          let princ = identity.getPrincipal();
          if (directories?.length !== 0) return;
  
          getUserDirectories(princ, startIndex);
        }
      }}
  }
  useEffect(() => {
    getUserFavDirectoriesList(0)
  }, [auth, userId, identity]);

  return (
   <>    <div>
   <div
     className=''
     style={{ boxShadow: 'none' }}
   >
    {isLoading? <div className='d-flex justify-content-center'><Spinner /></div>:
     (directories?.length > 0 && directories)? (
    directories?.map((directory:any,index:number) => {
    
     return (
      <div key={index}>
      <FavouriteDirectoryItem directory={directory}/></div>

     )
       
     })
     ) : (
       <div className='my-3'>
           <p className='h5 m-0 text-center'>{t('No Favourite Post Found')}</p>
      
       </div>
     )}
   </div>
   {totalDirectories > itemsPerpage && <div className='d-flex justify-content-end mt-2'>
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
   </>
  );
}
