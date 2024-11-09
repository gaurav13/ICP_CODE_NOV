'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Row, Col, Spinner, Form } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Link from 'next/link';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { useConnectPlugWalletStore } from '@/store/useStore';
import {
  
  makeEntryActor,

} from '@/dfx/service/actor-locator';
import { fromNullable } from '@dfinity/utils';
import logger from '@/lib/logger';
import { getImage, iframeimgThumbnail } from '@/components/utils/getImage';
import { ARTICLE_FEATURED_IMAGE_ASPECT, globalEventsPerPage, PAGINATION_PAGE_RANGE } from '@/constant/sizes';
import {
  utcToLocal,
} from '@/components/utils/utcToLocal';
import {
  Event_DINAMIC_PATH
} from '@/constant/routes';
import { TopEvent } from '@/types/article';
import ReactPaginate from 'react-paginate';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { debounce } from '@/lib/utils';
import post1 from '@/assets/Img/placeholder-img.jpg';

function EntryItem({ event, entryActor }: { event: any; entryActor: any }) {
  const { t, changeLocale } = useLocalization(LANG);

  return (
    <>
        <Col sm={6} md={4} xl={3} xxl={3} className='mb-3 ' key={event?.id} >
  
                <div className='Event-Post-small '>
                  <div className='Event-Post-inner boxShadow p-3'>
                    <Link
                      href={`${Event_DINAMIC_PATH+event.id}`}
                      className='img-pnl'
                      style={{
                        aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT,
                        width: '100%',
                        position: 'relative',
                      }}
                    >
                      {/* <Image src={post12} alt='Post' /> */}
                      <Image
                        src={event ? event.image : post1}
                       
                        fill
                        alt={`feature image`}
                      />
                    </Link>
                    <div className='txt-pnl'>
                      <p>{event.date}</p>
                      <Link href={`${Event_DINAMIC_PATH+event.id}`} className='text-decoration-no'>
                        {event.title}
                      </Link>
                    </div>
                  </div>
                </div>
                 
              </Col>
    </>
  );
}
export default function AllEventsTagsSearch() {
  const [entries, setEntries] = useState<null | TopEvent[]>();
  const [entriesSize, setEntriesSize] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [forcePaginate, setForcePaginate] = useState(0);
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
   const tag = searchParams.get('tag');
  const pageCount = Math.ceil(entriesSize / globalEventsPerPage);
  const { auth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    identity: state.identity,
  }));
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });

 
    /**
   * getEvents use to get Events 
   * @parms {startIndex:number,str:string}
   * @return   Events;
   */
  async function getEvents(startIndex:number,tags:string) {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    

    const resp = await entryActor.get_events("", startIndex, globalEventsPerPage, [], [], [],tags);
    let tempAmount = parseInt(resp?.amount);
    setEntriesSize(tempAmount);
    setIsLoading(true);
    const unEvents = resp.entries;
    if (unEvents.length > 0) {
      const refinedEvents = unEvents.map((raw: any) => {
        const unEvent = raw[1];
        const image = getImage(unEvent.image);
        const date = utcToLocal(unEvent.date.toString(), 'MMM D, YYYY');
        const endDate = utcToLocal(unEvent.endDate.toString(), 'MMM D, YYYY');

        const refinedEvent: TopEvent = {
          id: raw[0],
          title: unEvent.title,
          date: date,
          endDate,
          image,
          shortDescription: unEvent.shortDescription,
          freeTicket: unEvent.freeTicket,
          applyTicket: unEvent.applyTicket,
          lat: unEvent.lat,
          lng: unEvent.lng,
          isStatic: unEvent.isStatic,
        };
        return refinedEvent;
      });
      if(refinedEvents && refinedEvents?.lenght==0){

      }

      setEntries(refinedEvents);
    } else {

      setEntries(null);
    }
    setIsLoading(false);
  };
     /**
   * handlePageClick use to navigate page 
   * @parms event
   * @return   null;
   */
  const handlePageClick = async (event: any) => {

    setIsLoading(true);
    setForcePaginate(event.selected);
    const newOffset = (event.selected * globalEventsPerPage) % entriesSize;
    const tempEntries = await getEvents(newOffset,tag ?? "");

    setIsLoading(false);
  };
  const { t, changeLocale } = useLocalization(LANG);
     /**
   * getNSetEntries use for get entries
   * @parms search string
   * @return   null;
   */
  const getNSetEntries = async (tagsstr:string) => {
    setIsLoading(true)
    const tempEntries = await getEvents(0,tagsstr)
    setIsLoading(false);
  };
  const debouncedFetchResults = useCallback(debounce(getNSetEntries, 500), []);

useEffect(()=>{
  debouncedFetchResults(tag ?? "") 
},[tag])
  return (
    <>
       <main id='main'>
       <div className='main-inner home'>
          {(entriesSize > 0 && !isLoading) &&<div className='ps-4  d-flex justify-content-center'>
           
            <div className='event-innr w-100'>
              <Col xl='12' lg='12' md='12'>
                <div className='spacer-50' />
                <h2>
                </h2>
                <div className='spacer-20' />
              </Col>
              <Col xl='12' lg='12' md='12'>
                <Row>
                  <Col>
                    <Row>
                      {isLoading ? (
                        <div className='d-flex justify-content-center w-full'>
                          <Spinner />
                        </div>
                      ) : entries && entries.length != 0 ? (
                        entries.map((entry: any) => (
                          <EntryItem event={entry} entryActor={entryActor} />
                        ))
                      ) : (
                        <p className='d-flex justify-content-center w-full'>
                          {t('No Web3 Directory Found')}{' '}
                        
                        </p>
                      )}
           
                    </Row>
                    {entriesSize > globalEventsPerPage &&   <Row>
                      <Col>
                        <div className='pagination-container mystyle d-flex justify-content-center justify-content-md-end'>
                          {
                            <ReactPaginate
                              breakLabel='...'
                              nextLabel=''
                              onPageChange={handlePageClick}
                              pageRangeDisplayed={PAGINATION_PAGE_RANGE}
                              pageCount={pageCount}
                              previousLabel=''
                              renderOnZeroPageCount={null}
                              forcePage={forcePaginate}
                            />
                          }
                        </div>
                      </Col>
                    </Row>}
                  </Col>
                </Row>
              </Col>
            </div>
          </div>}
          </div>
      </main>
   
    </>
  );
}
