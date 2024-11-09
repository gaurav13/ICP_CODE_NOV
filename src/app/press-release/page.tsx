'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Breadcrumb, Dropdown, Spinner, Form } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Link from 'next/link';
import smallpost1 from '@/assets/Img/Posts/podcast-1.jpeg';
import smallpost2 from '@/assets/Img/Posts/poadcast-1.jpg';
import smallpost3 from '@/assets/Img/Posts/podcast-3.jpg';
import smallpost4 from '@/assets/Img/Posts/podcast-4.webp';
import iconevents from '@/assets/Img/Icons/icon-event.png';
import iconhorn from '@/assets/Img/Icons/icon-horn.png';
import iconthumb from '@/assets/Img/Icons/icon-thumb.png';
import iconmessage from '@/assets/Img/Icons/icon-comment.png';
import ReleasePost from '@/components/ReleasePost/ReleasePost';
import TakeQuiz from '@/components/TakeQuiz/TakeQuiz';
import ReactPaginate from 'react-paginate';
import { ArticlesList } from '@/components/ArticlesList';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { getImage, iframeimgThumbnail } from '@/components/utils/getImage';
import { EntrySizeMap } from '@/types/dashboard';
import logger from '@/lib/logger';
import { ARTICLE_FEATURED_IMAGE_ASPECT } from '@/constant/sizes';
import { utcToLocal } from '@/components/utils/utcToLocal';
import parse from 'html-react-parser';
import TopEvents from '@/components/TopEvents';
import TrendingArticleSide from '@/components/TrendingArticleSide/TrendingArticleSide';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { ARTICLE_DINAMIC_PATH, ARTICLE_STATIC_PATH, PRESSRELEASE } from '@/constant/routes';
import { siteConfig } from '@/constant/config';
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePathname, useRouter } from 'next/navigation';

export default function NewPodcast() {
  const { t, changeLocale } = useLocalization(LANG);
  const [isGetting, setIsGetting] = useState(true);
  const [forcePaginate, setForcePaginate] = useState(0);
  const [search, setSearch] = useState('');
  const [activeListName, setActiveListName] = useState('All');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const location = usePathname();
  const router = useRouter();
  const [processedList, setProcessedList] = useState<any[]>([]);
  const [HideTrendinpost, setHideTrendinpost] = useState<any>(true);
  const [entriesSize, setEntriesSize] = useState<any>({
    all: 0,
    user: 0,
    draft: 0,
  });
  const { auth, setAuth, identity } = useConnectPlugWalletStore(
    (state: any) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
    })
  );

  let itemsPerPage = 20;
  const entryActorDefault = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const entrySizeMap: EntrySizeMap = {
    All: 'all',
    Minted: 'all',
    Draft: 'draft',
    Mine: 'user',
    MyMinted: 'user',
  };

  const entrySizeKey = entrySizeMap[activeListName] || 'all';
  const pageCount = Math.ceil(entriesSize[entrySizeKey] / itemsPerPage);
  const getRefinedList = async (tempEntriesList: any[]) => {
    if (tempEntriesList.length === 0) {
      return [];
    }

    const refinedPromise = await Promise.all(
      tempEntriesList.map(async (entry: any) => {
        const userId = entry[1].user.toString();
        // const user = await userActor.get_user_details([userId]);
        let date = utcToLocal(entry[1].creation_time.toString(), 'MMM D, YYYY');
        let newItem = {
          title: entry[1].title,
          entryId: entry[0],
          image: entry[1].image[0],
          likes: entry[1].likes,
          views: entry[1].views,
          creation_time: date,
          userName: entry[1].userName,
          categories: entry[1].category,
          isDraft: entry[1].isDraft,
          minters: entry[1].minters,
          status: entry[1].status,
          pressRelease: entry[1].pressRelease,
          userId,
          isCompanySelected: entry[1].isCompanySelected,
          companyId: entry[1].companyId,
          isPodcast: entry[1].isPodcast,
          podcastVideoLink: entry[1].podcastVideoLink,
          seoExcerpt: entry[1].seoExcerpt,
          isStatic: entry[1].isStatic,
        };
      
        return newItem;
      })
    );

    return refinedPromise;
  };
  const filter = async () => {
    getPodcastList();
  };
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      filter();
    }
  };
  /**
   * getAllPressReleaseList use to get pressrelese 
   * @param startInde?:number
   * @returns list of pressrelease
   */
  const getAllPressReleaseList = async (startInde?:number) => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    //  dataType for below function
    // 1 =pressRelease
    // 2 =podcast
    // 3 =article

    const resp = await entryActor.getUniqueDataList(
      'All',
      false,
      search,
      startInde,
      itemsPerPage,
      1
    );
    let amount = parseInt(resp.amount);
    setEntriesSize((prev: any) => ({
      ...prev,
      all: amount,
    }));
    const tempList = resp.entries;
    // setEntriesList(tempList);
    return tempList;
  };
     /**
   * getPodcastList use to get pressrelese called by infinate loaded
   * @param Null
   * @returns Null
   */
  let getPodcastList = async () => {
    let podcastList = await getAllPressReleaseList(page);
    const tempList = await getRefinedList(podcastList);
    setProcessedList((prevItems) => {
      const allItems = [...prevItems, ...tempList];
      const uniqueItems = allItems.filter((item, index, self) => 
        index === self.findIndex((t) => (
          t.entryId === item.entryId
        ))
      );
      return uniqueItems;
    });
    if(pageCount <= page){
      setHasMore(false);
    }else{
      setPage((pre)=> pre+1);

    }
    
    setIsGetting(false);
  };
    /**
   * getPodcastInintialList use to get pressrelese 
   * @param Null
   * @returns Null
   */
  let getPodcastInintialList = async () => {
    let podcastList = await getAllPressReleaseList(0);
    const tempList = await getRefinedList(podcastList);
    setProcessedList(tempList);
    setIsGetting(false);
  };
  useEffect(() => {
    getPodcastInintialList();
  }, []);

  useEffect(() => {
    if (location.startsWith("/press-release") && !location.endsWith('/')) {
     router.push(PRESSRELEASE);
   }
     }, [])
  return (
    <>
      <main id='main'>
        <div className='main-inner event-detail-page lis pod'>
          <div className='inner-content'>
            <Col xl='12' lg='12' md='12'>
              <div className='flex-div-sm align-items-center'>
                <Breadcrumb className='new-breadcrumb web'>
                  <Breadcrumb.Item>
                    <Link href='/'>
                      <i className='fa fa-home' />
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active>
                    <Link
                      href='/'
                      style={{
                        pointerEvents: 'none',
                      }}
                    >
                      {t('Press Release')}
                    </Link>
                  </Breadcrumb.Item>
                </Breadcrumb>
                <div className='search-pnl small'>
                  <input
                    type='text'
                    className='form-control'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('Search Press Release')}
                    onKeyDown={handleSearch}
                  />
                  <button onClick={filter}>
                    <i className='fa fa-search' />
                  </button>
                </div>
              </div>
            </Col>
            <div className='event-innr'>
              <Col xl='12' lg='12' md='12'>
                <h1 className='podcastpageheading'>
                  {t(
                    "Boost Your Web3, DeFi, and Crypto Projects' Visibility with Blockza Press Release Service"
                  )}
                </h1>
                <p className='d-inline'>{siteConfig.pressreleasePgDetail}</p><a href="mailto:support@blockza.io">support@blockza.io</a>
                <div className='spacer-30' />
                <h4>
                  <Image src={iconhorn} alt='Horn' /> {t('Press Release')}
                </h4>
                <div className='spacer-20' />
              </Col>
              <Col xl='12' lg='12' md='12'>
                <Row>
                  <Col xxl='8' xl='12' lg='12'>
                    <Row>
                    <InfiniteScroll
      dataLength={processedList?.length}
      next={() => {

        setTimeout(() => {
          getPodcastList();

        }, 2000);
      }}
      scrollThreshold={0.6}
      hasMore={hasMore}
      loader={<div className='d-flex justify-content-center w-full w-100'>
        <Spinner />
      </div>}
      endMessage={<div className='w-100'><p className='text-center'>{t("No more items to load")}</p></div>}
      className='asRow'
    >
      { processedList?.map((item: any) => {
                          return (
                            <Col xl='6' lg='6' md='6' sm='12' key={item.entryId} className='d-flex justify-content-center pressReleaseItem'>
                              <div className='general-post auto'>
                                <Link
                                  className='img-pnl pressRelease'
                                  href={
                                    item.isStatic
                                      ? `${ARTICLE_STATIC_PATH + item.entryId}`
                                      : `${ARTICLE_DINAMIC_PATH + item.entryId}`
                                  }
                                >
                                  <div
                                    style={{
                                      width: '100%',
                                    }}
                                  >
                                    <Image
                                      src={item.image ? item.image : smallpost1}
                                      fill
                                      alt={item.title ?? 'Post'}
                                    />
                                  </div>
                                </Link>
                                <div className='txt-pnl'>
                                  <Link
                                    href={
                                      item.isStatic
                                        ? `${
                                            ARTICLE_STATIC_PATH + item.entryId
                                          }`
                                        : `${
                                            ARTICLE_DINAMIC_PATH + item.entryId
                                          }`
                                    }
                                  >
                                    <h6>{item.title}</h6>
                                  </Link>
                                  <p className='mb-2'>
                                    <span>{item.userName}</span>{' '}
                                    {item.creation_time}
                                  </p>
                                  <p
                                    style={{
                                      maxHeight: '25px',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    {item?.seoExcerpt}
                                    {/* {item?.seoExcerpt?.length>100? `${item.seoExcerpt.slice(0,100)}...`: item.seoExcerpt} */}
                                  </p>
                                </div>
                              </div>
                            </Col>
                          );
                        })}
    </InfiniteScroll>
                     
                    </Row>
                   
                  </Col>
                  <Col xxl='4' xl='4' lg='12'>
                    <Row>
                      <Col
                        xxl='12'
                        xl='12'
                        lg='6'
                        md='6'
                        sm='12'
                        className='m-text-center'
                      >
                        <TakeQuiz />
                      </Col>
                      <Col xxl='12' xl='12' lg='12' md='12' className='heding'>
                        {/* <h4 style={{ textTransform: 'unset' }}> */}
                        <TopEvents small />
                      </Col>
                      <Col xl='12' lg='12' className='heding'>
                        <Dropdown
                          onClick={() => setHideTrendinpost((pre: any) => !pre)}
                        >
                          <Dropdown.Toggle
                            variant='success'
                            className='fill'
                            id='dropdown-basic'
                          >
                            {t('Trending')}{' '}
                            {HideTrendinpost ? (
                              <i className='fa fa-angle-down' />
                            ) : (
                              <i className='fa fa-angle-right' />
                            )}
                          </Dropdown.Toggle>
                          {/* 
                      <Dropdown.Menu>
                        <Dropdown.Item href='#/action-1'>
                          Trending
                        </Dropdown.Item>
                        <Dropdown.Item href='#/action-2'>
                          Trending
                        </Dropdown.Item>
                      </Dropdown.Menu> */}
                        </Dropdown>
                        <div className='spacer-20' />
                      </Col>

                      <span
                        className={
                          HideTrendinpost ? 'content show' : 'content hide'
                        }
                      >
                        <TrendingArticleSide isArticle={true} />
                      </span>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
