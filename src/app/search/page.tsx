'use client';
import AllEntriesSearch from '@/components/GlobalContent/GlobalEntries';
import AllEventsSearch from '@/components/GlobalContent/GlobalEvents';
import AllWeb3DirectoriesSearch from '@/components/GlobalContent/GlobalWeb3';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { LANG } from '@/constant/language';
import useLocalization from '@/lib/UseLocalization';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
export default function Search() {
  const [isData, setIsData] = useState<any>({Articles:true,Podcast:true,PressRelease:true,Events:true,Directories:true});
  const { t, changeLocale } = useLocalization(LANG);
/**
 * isEmpty use to check whatever page is empty or not
 * @param p as page name
 * @returns boolean
 */
 function isEmpty(p:any) {
  if(!p.Articles && !p.Podcast && !p.PressRelease && !p.Events && !p.Directories){
  return true;
 }else{
  return false
 }}
  return (
    <>
      <main id='main'>
        <div className='main-inner home'>
          <AllEntriesSearch  contentType={"Articles"} setIsData={setIsData}/>
          <AllEntriesSearch  contentType={"PressRelease"} setIsData={setIsData}/>

          <AllEntriesSearch  contentType={"Podcast"} setIsData={setIsData}/>
       <AllWeb3DirectoriesSearch   contentType={"Directories"} setIsData={setIsData}/>
       <AllEventsSearch  contentType={"Events"} setIsData={setIsData}/>
       {isEmpty(isData) && <div>   <p className='d-flex justify-content-center w-full mt-5'>
                          {t(`No Content Found`)}{' '} <br/>
                          
                        </p><p className='text-center'><Link href="/search/?q=" >Clear search</Link></p></div>}
        </div>
      </main>
    </>
  );
}
