'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Breadcrumb, Dropdown, Spinner, Form } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import iconpodcast from '@/assets/Img/Icons/icon-podcast-1.png';
import iconpressrelease from '@/assets/Img/Icons/icon-press-release.png';
import iconhorn from '@/assets/Img/Icons/icon-horn.png';
import iconthumb from '@/assets/Img/Icons/icon-thumb.png';
import iconmessage from '@/assets/Img/Icons/icon-comment.png';
import TakeQuiz from '@/components/TakeQuiz/TakeQuiz';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { useConnectPlugWalletStore } from '@/store/useStore';
import {
  makeCommentActor,
  makeEntryActor,
  makeUserActor,
} from '@/dfx/service/actor-locator';
import { fromNullable } from '@dfinity/utils';
import logger from '@/lib/logger';
import { getImage, iframeimgThumbnail } from '@/components/utils/getImage';
import HTMLReactParser from 'html-react-parser';
import { ARTICLE_FEATURED_IMAGE_ASPECT } from '@/constant/sizes';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import TopEvents from '@/components/TopEvents';
import TrendingArticleSide from '@/components/TrendingArticleSide/TrendingArticleSide';
import {
  formatLikesCount,
  isUserConnected,
} from '@/components/utils/utcToLocal';
import { toast } from 'react-toastify';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import ConnectModal from '@/components/Modal';
import Tippy from '@tippyjs/react';
import {
  ARTICLE_DINAMIC_PATH,
  ARTICLE_STATIC_PATH,
  Podcast_DINAMIC_PATH,
  Podcast_STATIC_PATH,
} from '@/constant/routes';
import ReactPaginate from 'react-paginate';
import InfiniteScroll from 'react-infinite-scroll-component';

let CATEGORY_ENTRIES_PERPAGE = 20;


function EntryItem({ entry, entryActor }: { entry: any; entryActor: any }) {
  const [likeCount, setLikeCount] = useState<number>(entry.likes);
  const [isliked, setIsLiked] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const { identity, auth } = useConnectPlugWalletStore((state) => ({
    identity: state.identity,
    auth: state.auth,
  }));
  const handleConnectModal = () => {
    // e.preventDefault();
    setShowConnectModal(true);
    // setConnectLink(e);
  };
  const handleConnectModalClose = () => {
    setShowConnectModal(false);
  };

  const likeEntry = async () => {
    if (!isUserConnected(auth, handleConnectModal)) return;
    if (!isliked) {
      setLikeCount((pre: number) => pre + 1);
      setIsLiked(true);
    } else {
      setLikeCount((pre: number) => pre - 1);
      setIsLiked(false);
    }

    return new Promise(async (resolve, reject) => {
      // if (!entry || !article[1].userId)
      //   reject('NO Entry or user ID provided');

      entryActor
        .likeEntry(entry.id, userCanisterId, commentCanisterId)
        .then(async (entry: any) => {
          logger(entry, 'een');
          resolve(entry);
        })
        .catch((err: any) => {
          logger(err);
          if (!isliked) {
            setLikeCount((pre) => pre + 1);
            setIsLiked(true);
          } else {
            setLikeCount((pre) => pre - 1);
            setIsLiked(false);
          }
          reject(err);
        });
    });
  };
  const { t, changeLocale } = useLocalization(LANG);
  useEffect(() => {
    if (identity) {
      let liked = entry.likedUsers.some(
        (u: any) => u.toString() == identity.getPrincipal()
      );
      setIsLiked(liked);
    }
  }, [identity]);

  return (
    <>
      <Col xl='6' lg='6' md='6' sm='12' className='d-sm-flex justify-content-sm-center'>
        <div className='general-post auto'>
          <Link
            className='img-pnl categoryimg'
            style={{
              width: '100%',
              aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT,
              position: 'relative',
            }}
            href={
              entry.isPodcast
                ? entry.isStatic
                  ? `${Podcast_STATIC_PATH + entry.id}`
                  : `${Podcast_DINAMIC_PATH + entry.id}`
                : entry.isStatic
                ? `${ARTICLE_STATIC_PATH + entry.id}`
                : `${ARTICLE_DINAMIC_PATH + entry.id}`
            }
          >
            <Image fill src={entry?.image} alt='Post' />
          </Link>
          <div className='txt-pnl'>
            <Link
              href={
                entry.isPodcast
                  ? entry.isStatic
                    ? `${Podcast_STATIC_PATH + entry.id}`
                    : `${Podcast_DINAMIC_PATH + entry.id}`
                  : entry.isStatic
                  ? `${ARTICLE_STATIC_PATH + entry.id}`
                  : `${ARTICLE_DINAMIC_PATH + entry.id}`
              }
            >
              <h6>
                {entry.pressRelease ? (
                  <Image
                    src={iconpressrelease}
                    width={25}
                    height={25}
                    alt='Icon Press release'
                  />
                ) : entry.isPodcast ? (
                  <Image
                    src={iconpodcast}
                    width={25}
                    height={25}
                    alt='Icon podcast'
                  />
                ) : (
                  ''
                )}{' '}
                {entry?.title}
              </h6>
            </Link>
            <p
              style={{ maxHeight: '45px', overflow: 'hidden' }}
              className='customstyle'
            >
              {/* {HTMLReactParser(entry?.description)} */}
              {entry?.seoExcerpt}
            </p>
            <ul className='thumb-list'>
              <li
                style={{
                  cursor: 'pointer',
                }}
                onClick={likeEntry}
              >
                <a
                  style={{
                    pointerEvents: 'none',
                  }}
                  href='#'
                >
                  <Image
                    src={`${
                      isliked ? '/images/liked.svg' : '/images/like.svg'
                    }`}
                    width={25}
                    height={25}
                    alt='Icon Thumb'
                  />{' '}
                  {formatLikesCount(likeCount) ?? 0}
                </a>
              </li>
              <li>
                <Link
                  href={
                    entry.isPodcast
                      ? entry.isStatic
                        ? `${Podcast_STATIC_PATH + entry.id}?route=comments`
                        : `${Podcast_DINAMIC_PATH + entry.id}?route=comments`
                      : entry.isStatic
                      ? `${ARTICLE_STATIC_PATH + entry.id}?route=comments`
                      : `${ARTICLE_DINAMIC_PATH + entry.id}&route=comments`
                  }
                >
                  <Image src={iconmessage} alt='Icon Comment' />{' '}
                  {entry?.comments} {t('Comments')}
                </Link>
              </li>
              <li>
                <Link
                  href={
                    entry.isPodcast
                      ? entry.isStatic
                        ? `${Podcast_STATIC_PATH + entry.id}?route=comments`
                        : `${Podcast_DINAMIC_PATH + entry.id}?route=comments`
                      : entry.isStatic
                      ? `${ARTICLE_STATIC_PATH + entry.id}?route=comments`
                      : `${ARTICLE_DINAMIC_PATH + entry.id}&route=comments`
                  }
                  className='ms-1'
                >
                  <div className='viewbox'>
                    <i className='fa fa-eye fill blue-icon fa-lg me-1' />
                    {t('Views')} <span className='mx-1'>|</span>
                    {entry?.views ? formatLikesCount(entry?.views) : 0}
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Col>
      <ConnectModal
        handleClose={handleConnectModalClose}
        showModal={showConnectModal}
      />
    </>
  );
}
export default function CategoryDetails() {
  const [category, setCategory] = useState<any | undefined>();
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState<any[]>();
  const [entriesSize, setEntriesSize] = useState(0);
  const [HideTrendinpost, setHideTrendinpost] = useState<any>(true);
  const [isLoading, setIsLoading] = useState(true);

  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const categoryId = searchParams.get('category');
  const latestnews = searchParams.get('news');
  const [forcePaginate, setForcePaginate] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(entriesSize / CATEGORY_ENTRIES_PERPAGE);
  const { auth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    identity: state.identity,
  }));
  const router = useRouter();
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
  const commentsActor = makeCommentActor({
    agentOptions: {
      identity,
    },
  });
  async function getCategory(newCategoryId?: string, oldCategory?: any) {
    let id = newCategoryId ? newCategoryId : categoryId;
    if (id == null) {
      return;
    }

    const resp = await entryActor.get_list_category(id);
    const _category: any | undefined = fromNullable(resp);
    if (_category) {
      _category.id = id;
      if (newCategoryId) {
        oldCategory.parents.unshift(_category);
      } else {
        _category.parents = [];
        oldCategory = _category;
      }
    }
    if (_category?.isChild) {
      let parentId: string | undefined = fromNullable(
        _category.parentCategoryId
      );
      if (parentId) return getCategory(parentId, oldCategory);
    } else {
      return oldCategory;
    }
  }
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

        // const user = await userActor.get_user_details([userId]);
        const _comments = await commentsActor.getComments(entry[0]);
        let comments = 0;
        if (_comments.ok) {
          comments = _comments.ok[0].length;
        }

        // let
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
        // if (user.ok) {
        //   newItem.userName = user.ok[1].name ?? entry[1].userName;
        // }
        return newItem;
      })
    );

    return refinedPromise;
  };
  /**
   * getEntries use to get list of entries
   * @param {reset?: boolean, oldEntries?: any,startIndex:number}
   * @returns array of entries
   */
  async function getEntries({reset, oldEntries,startIndex}:{reset?: boolean, oldEntries?: any,startIndex:number}) {
    let searched = reset ? '' : search;
    if (!categoryId) return;
    if (latestnews == 'latest') {
      const resp = await entryActor.getEntriesNewlatest(
        searched,
        startIndex,
        CATEGORY_ENTRIES_PERPAGE
      );
      const { entries: _entries, amount } = resp;
      let tempAmount = parseInt(amount);
      setEntriesSize(tempAmount);
      if (oldEntries) {
        oldEntries.push(..._entries);
      } else {
        oldEntries = _entries;
      }
      return oldEntries;
    } else {
      const resp = await entryActor.getEntriesNew(
        categoryId,
        searched,
        startIndex,
        CATEGORY_ENTRIES_PERPAGE
      );
      const { entries: _entries, amount } = resp;
      let tempAmount = parseInt(amount);
      setEntriesSize(tempAmount);
      if (oldEntries) {
        oldEntries.push(..._entries);
      } else {
        oldEntries = _entries;
      }
      return oldEntries;
    }

   
  }

  const { t, changeLocale } = useLocalization(LANG);
  /**
   * getNSetEntriesInfinate use for infinate load data
   * @param Null
   * @returns Null
   */
  const getNSetEntriesInfinate = async () => {
    setIsLoading(true);
    const tempEntries = await getEntries({startIndex:page});
    const refinedEntries = await getRefinedList(tempEntries);
    setEntries((prevItems) => {
      const allItems = [...prevItems, ...refinedEntries];
      const uniqueItems = allItems.filter((item, index, self) => 
        index === self.findIndex((t) => (
          t.id === item.id
        ))
      );
      return uniqueItems;
    });
    if(pageCount <= page){
      setHasMore(false);
    }else{
      setPage((pre)=> pre+1);

    }
    setIsLoading(false);
  };
  const getNSetEntries = async (reset?: boolean) => {
    setIsLoading(true);
    const tempEntries = await getEntries({reset:reset,startIndex:0});
    const refinedEntries = await getRefinedList(tempEntries);
    setEntries(refinedEntries);
    setIsLoading(false);
  };
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      getNSetEntries();
    }
  };
  useEffect(() => {
    const getnSetCategory = async () => {
      const tempCategory = await getCategory();
      setCategory(tempCategory);
      getNSetEntries();
    };
    getnSetCategory();
  }, [categoryId, latestnews]);

  return (
    <>
      <main id='main'>
        <div className='main-inner event-detail-page lis'>
          <div className='inner-content'>
            <Col xl='12' lg='12' md='12'>
              <div className='event-innr'>
                <div className='flex-div-sm align-items-center'>
                  <Breadcrumb className='new-breadcrumb web'>
                    <Breadcrumb.Item>
                      <Link href='/'>
                        <i className='fa fa-home' />
                      </Link>
                    </Breadcrumb.Item>
                    {category?.parents &&
                      category?.parents.length > 0 &&
                      category?.parents.map((parent: any, index: number) => (
                        <Breadcrumb.Item key={index}>
                          <Link
                            href={`/category-details?category=${parent.id}`}
                          >
                            {parent.name}
                          </Link>
                        </Breadcrumb.Item>
                      ))}
                    {category && (
                      <Breadcrumb.Item>
                        <Tippy content={category.name}>
                          <Link
                            href={`/category-details?category=${category.id}`}
                          >
                            {category.name}
                          </Link>
                        </Tippy>
                      </Breadcrumb.Item>
                    )}
                  </Breadcrumb>
                  <div className='search-pnl small'>
                    <input
                      type='text'
                      className='form-control'
                      placeholder={t('Search News')}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={handleSearch}
                    />
                    {search.length >= 1 && (
                      <button
                        onClick={() => {
                          setSearch('');
                          getNSetEntries(true);
                        }}
                      >
                        <i className='fa fa-xmark mx-1' />
                      </button>
                    )}
                    <button onClick={() => getNSetEntries()}>
                      <i className='fa fa-search' />
                    </button>
                  </div>
                </div>
              </div>
            </Col>
            <div className='event-innr'>
              <Col xl='12' lg='12' md='12'>
                {category ? (
                  <>
                    <h2>{category.name}</h2>
 
                    <div className='spacer-10' />
                
                    <p>{category.description}</p>
                  </>
                ) : (
                  <div className='spinner-div'>
                    <Spinner />
                  </div>
                )}
                <div className='spacer-50' />
                <h4>
                  <Image src={iconhorn} alt='Horn' />{' '}
                  {category && `${category?.name}`}
                </h4>
                <div className='spacer-20' />
              </Col>
              <Col xl='12' lg='12' md='12'>
                <Row>
                  <Col xxl='8' xl='12' lg='12'>
                    <Row>
                    <InfiniteScroll
      dataLength={entries?.length ?? 0}
      next={() => {

        setTimeout(() => {
          getNSetEntriesInfinate();

        }, 2000);
      }}
      scrollThreshold={0.6}
      hasMore={hasMore}
      loader={<div className='d-flex justify-content-center w-full w-100'>
        <Spinner />
      </div>}
      endMessage={<div className='w-100'><p className='text-center'>{t("No more items to load")}</p></div>}
      className='asRow d-sm-flex justify-content-sm-center'
    >
                      {
                       entries && entries.map((entry: any) => (
                          <EntryItem entry={entry} entryActor={entryActor} />
                        ))}
             </InfiniteScroll>
                    </Row>
                   
                  </Col>

                  <Col xxl='4' xl='5' lg='12'>
                    <Row>
                      <Col xxl='12' xl='12' lg='6' md='6' sm='12' className='d-sm-flex justify-content-sm-center '>
                        <TakeQuiz />
                      </Col>
                      <Col xxl='12' xl='12' lg='12' md='12' className='heding'>
                      
                        <TopEvents />
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
