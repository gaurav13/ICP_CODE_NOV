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
import { Podcast_DINAMIC_PATH, Podcast_STATIC_PATH, PODCASTSPG } from '@/constant/routes';
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePathname, useRouter } from 'next/navigation';

export default function NewPodcast() {
  const { t, changeLocale } = useLocalization(LANG);
  const [isGetting, setIsGetting] = useState(true);
  const [forcePaginate, setForcePaginate] = useState(0);
  const [search, setSearch] = useState('');
  const [activeListName, setActiveListName] = useState('All');
  const [showLoader, setShowLoader] = useState(true);
  const [processedList, setProcessedList] = useState<any[]>([]);
  const [HideTrendinpost, setHideTrendinpost] = useState<any>(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const location = usePathname();
  const router = useRouter();
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
    // logger(tempEntriesList,"tempEntriesList33")
    // const userActor = makeUserActor({
    //   agentOptions: {
    //     identity,
    //   },
    // });
    const refinedPromise = await Promise.all(
      tempEntriesList.map(async (entry: any) => {
        let image = null;
        if (entry[1].podcastVideoLink != '') {
          image = iframeimgThumbnail(entry[1].podcastVideoLink);
        }
        if (entry[1]?.podcastImg.length != 0) {
          image = getImage(entry[1].podcastImg[0]);
        }

        const userId = entry[1].user.toString();
        // const user = await userActor.get_user_details([userId]);
        let date = utcToLocal(entry[1].creation_time.toString(), 'MMM D, YYYY');
        let newItem = {
          title: entry[1].title,
          entryId: entry[0],
          image: image,
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
        // if (user.ok) {
        //   newItem.userName = user.ok[1].name ?? entry[1].userName;
        // }
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

  const handlePageClick = async (event: any) => {
    setIsGetting(true);
    setForcePaginate(event.selected);
    // setItemOffset(newOffset);
    // if ()

    let list: any = [];

    const newOffset = (event.selected * itemsPerPage) % entriesSize.all;

    //  dataType for below function
    // 1 =pressRelease
    // 2 =podcast
    // 3 =article

    const resp = await entryActorDefault.getUniqueDataList(
      'All',
      false,
      search,
      newOffset,
      itemsPerPage,
      2
    );
    list = resp.entries;

    // const newItems = tempList2.slice(newOffset, newOffset + itemsPerPage);
    const tempList = await getRefinedList(list);
    // logger({ newOffset, list, newItems: 'hi', tempList }, 'EEEEVENTTT');
    setProcessedList(tempList);
    setIsGetting(false);
  };
    /**
   * getPodcastList use to get podcasts  list
   * @return startIndex?:number
   * @param null
   */
  const getAllPodcastList = async (startIndex:number) => {
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
      startIndex,
      itemsPerPage,
      2
    );

    let amount = parseInt(resp.amount);
    setEntriesSize((prev: any) => ({
      ...prev,
      all: amount,
    }));
    const tempList = resp.entries;
    // setEntriesList(tempList);
    // logger(resp, 'podcastList');
    return tempList;
  };
  /**
   * getPodcastList use to get podcasts  list
   * @return null
   * @param null
   */
  let getPodcastList = async () => {
    let podcastList = await getAllPodcastList(page);
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
  let getPodcastListInintial = async () => {
    let podcastList = await getAllPodcastList(0);
    const tempList = await getRefinedList(podcastList);
    setProcessedList(tempList);
    setIsGetting(false);
  };
  useEffect(() => {
    // logger({ auth: auth.state, identity }, 'current auth');

    getPodcastListInintial();
  }, []);

  useEffect(() => {
    if (location.startsWith("/podcasts") && !location.endsWith('/')) {
     router.push(PODCASTSPG);
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
                      {t('Expert Interviews')}
                    </Link>
                  </Breadcrumb.Item>
                </Breadcrumb>
                <div className='search-pnl small'>
                  <input
                    type='text'
                    className='form-control'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('Search podcast')}
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
                <h1 className='podcastpageheading'>{t('Welcome to BlockZa podcast : Web3 Talks!')}</h1>
                <p>{t("From Web3 evolution to integrating blockchain into every arena of life, we talk about every aspect of technological revolution. Each episode of our podcast series presents one shared perspective - radical and complete change of approach to turn an idea into a decentralized reality.")}</p>
                <div className='spacer-30' />
                <h4>
                  <Image src={iconhorn} alt='Horn' /> {t('Interviews')}
                </h4>
                <div className='spacer-20' />
              </Col>
              <Col xl='12' lg='12' md='12'>
                <Row>
                  <Col xxl='8' xl='12' lg='12' sm="12" className='d-sm-flex justify-content-sm-center '>
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
      className='asRow podcastmainList'
    >
                        {processedList && processedList.map((item: any) => {
                          return (
                            <Col xl='6' lg='6' md='6' sm='12' key={item.entryId} className='d-sm-flex justify-content-sm-center'>
                              <div className='general-post auto'>
                                <Link
                                  className='img-pnl podcast'
                                  href={
                                    item.isStatic
                                      ? `${Podcast_STATIC_PATH + item.entryId}`
                                      : `${Podcast_DINAMIC_PATH + item.entryId}`
                                  }
                                >
                                  <div
                                    style={{
                                      aspectRatio:
                                        ARTICLE_FEATURED_IMAGE_ASPECT,
                                      position: 'relative',
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
                                            Podcast_STATIC_PATH + item.entryId
                                          }`
                                        : `${
                                            Podcast_DINAMIC_PATH + item.entryId
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
