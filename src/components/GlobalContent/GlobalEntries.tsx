'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { useConnectPlugWalletStore } from '@/store/useStore';
import {
  makeCommentActor,
  makeEntryActor,

} from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage, iframeimgThumbnail } from '@/components/utils/getImage';
import ReactPaginate from 'react-paginate';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { debounce } from '@/lib/utils';
import GlobalSearchEntryItem from '@/components/GlobalContent/GlobalSearchEntryItem';
import { GLOBAL_SEARCH_ITEMS, PAGINATION_PAGE_RANGE } from '@/constant/sizes';



export default function AllEntriesSearch({contentType,setIsData}:{contentType:string,setIsData:any}) {
  const [entries, setEntries] = useState<undefined | any[]>();
  const [entriesSize, setEntriesSize] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [forcePaginate, setForcePaginate] = useState(0);

  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const searchString = searchParams.get('q');
  const pageCount = Math.ceil(entriesSize / GLOBAL_SEARCH_ITEMS);
  const { auth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    identity: state.identity,
  }));
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const commentsActor = makeCommentActor({
    agentOptions: {
      identity,
    },
  });
    /**
   * getRefinedList USE to refine data 
   * @parms list of entires
   * @return refined entries
   */
  const getRefinedList = async (tempEntriesList: any[]) => {
    if (!tempEntriesList || tempEntriesList?.length === 0) {
      return [];
    }
    const refinedPromise = await Promise.all(
      tempEntriesList?.map(async (entry: any) => {
        let image = null;

        if (entry[1].image) {
          image = getImage(entry[1].image[0]);
        }
        if (entry[1].podcastImg.length != 0) {
          image = getImage(entry[1].podcastImg[0]);
        }
        if (entry[1].podcastVideoLink != '') {
          image = iframeimgThumbnail(entry[1].podcastVideoLink);
        }
        const userId = entry[1].user.toString();

        const _comments = await commentsActor.getComments(entry[0]);
        let comments = 0;
        if (_comments.ok) {
          comments = _comments.ok[0].length;
        }

        let newItem = {
          id: entry[0],
          creation_time: entry[1].creation_time,
          image: image,
          title: entry[1].title,
          description: entry[1].description,
          isDraft: entry[1].isDraft,
          isPromoted: entry[1].isPromoted,
          userName: entry[1].userName,
          userId,
          status: entry[1].status,
          pressRelease: entry[1].pressRelease,
          comments,
          likes: parseInt(entry[1].likes),
          likedUsers: entry[1].likedUsers,
          isStatic: entry[1].isStatic,
          views: entry[1].views,
          seoExcerpt: entry[1].seoExcerpt,
          isPodcast: entry[1].isPodcast,
        };
        return newItem;
      })
    );

    return refinedPromise;
  };
   /**
   * getEntries USE to get entries
   * @parms {startIndex:number,str:string}
   * @return    _entries;
   */
  async function getEntries(startIndex:number,str:string) {

      const resp = await entryActor.getSearchedEntries(
        contentType,
        str,
        startIndex,
        GLOBAL_SEARCH_ITEMS
      );
      const { entries: _entries, amount } = resp;
      let tempAmount = parseInt(amount);
      setEntriesSize(tempAmount);


        return _entries;
   

  }
    /**
   * handlePageClick use to navigate page
   * @parms event
   * @return   null;
   */
  const handlePageClick = async (event: any) => {

    setIsLoading(true);
    setForcePaginate(event.selected);
    const newOffset = (event.selected * GLOBAL_SEARCH_ITEMS) % entriesSize;
    const tempEntries = await getEntries(newOffset,searchString ??"");
    const refinedEntries = await getRefinedList(tempEntries);
    setEntries(refinedEntries);
    setIsLoading(false);
  };
  const { t, changeLocale } = useLocalization(LANG);
     /**
   * getNSetEntries use to navigate page
   * @parms search:string
   * @return   null;
   */
  const getNSetEntries = async (str:string) => {
    setIsLoading(true);
    const tempEntries = await getEntries(0,str);
    const refinedEntries = await getRefinedList(tempEntries);
switch (contentType) {
  case "Articles":
    if(refinedEntries.length ==0)
    setIsData((pre:any)=>({...pre,Articles:false}))
    break;
    case "PressRelease":
    if(refinedEntries.length ==0)
    setIsData((pre:any)=>({...pre,PressRelease:false}))
    break;
    case "Podcast":
      if(refinedEntries.length ==0)
      setIsData((pre:any)=>({...pre,Podcast:false}))
      break;
  

  default:
    break;
}
    setEntries(refinedEntries);
    setIsLoading(false);
  };
  const debouncedFetchResults = useCallback(debounce(getNSetEntries, 500), []);

useEffect(()=>{

  debouncedFetchResults(searchString ?? "")
  
},[searchString])
  return (
    <>
     
     {(entriesSize > 0 && !isLoading) &&  <div className='ps-4 pe-4'>
           
            <div className='event-innr'>
              <Col xl='12' lg='12' md='12'>
                <div className='spacer-50' />
                <h2>
                 {contentType}
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
                          <GlobalSearchEntryItem entry={entry} entryActor={entryActor} />
                        ))
                      ) : (
                        <p className='d-flex justify-content-center w-full'>
                          {t(`No ${contentType} Found`)}{' '}
                          
                        </p>
                      )}
           
                    </Row>
                   {entriesSize > GLOBAL_SEARCH_ITEMS && <Row>
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
    
    </>
  );
}
