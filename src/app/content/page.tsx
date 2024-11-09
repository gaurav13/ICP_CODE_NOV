'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Breadcrumb, Dropdown, Spinner, Form } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import smallpost1 from '@/assets/Img/Posts/small-post-16.jpg';
import smallpost2 from '@/assets/Img/Posts/small-post-17.jpg';
import smallpost3 from '@/assets/Img/Posts/small-post-18.jpg';
import smallpost4 from '@/assets/Img/Posts/small-post-19.jpg';
import smallpost5 from '@/assets/Img/Posts/small-post-20.jpg';
import iconevents from '@/assets/Img/Icons/icon-event.png';
import iconhorn from '@/assets/Img/Icons/icon-horn.png';
import iconthumb from '@/assets/Img/Icons/icon-thumb.png';
import iconmessage from '@/assets/Img/Icons/icon-comment.png';
import ReleasePost from '@/components/ReleasePost/ReleasePost';
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

const MAX_ENTRIES = 12;

function EntryItem({ entry, entryActor }: { entry: any; entryActor: any }) {
  const [likeCount, setLikeCount] = useState<number>(entry.likes);
  const [isliked, setIsLiked] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const contentRoute = entry.isPodcast
    ? entry.isStatic
      ? `${Podcast_STATIC_PATH + entry.id}`
      : `${Podcast_DINAMIC_PATH + entry.id}`
    : entry.isStatic
    ? `${ARTICLE_STATIC_PATH + entry.id}`
    : `${ARTICLE_DINAMIC_PATH + entry.id}`;
  logger({ contentRoute, entry }, 'route is disss');
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
      <Col xl='4' lg='6' md='6' sm='6' xxl="3" className='d-flex justify-content-center'>
        <div className='general-post auto'>
          <Link
            className='img-pnl'
            style={{
              width: '100%',
              aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT,
              position: 'relative',
            }}
            href={contentRoute}
          >
            <Image fill src={entry?.image} alt='Post' />
          </Link>
          <div className='txt-pnl'>
            <Link href={contentRoute}>
              <h6>{entry?.title}</h6>
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
                  href={`${contentRoute}${
                    entry?.isStatic ? '?route=comments' : '&route=comments'
                  }`}
                >
                  <Image src={iconmessage} alt='Icon Comment' />{' '}
                  {entry?.comments} {t('Comments')}
                </Link>
              </li>
              <li>
                <Link
                  href={`${contentRoute}${
                    entry?.isStatic ? '?route=comments' : '&route=comments'
                  }`}
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
  const [entries, setEntries] = useState<undefined | any[]>();
  const [entriesSize, setEntriesSize] = useState(0);
  const [HideTrendinpost, setHideTrendinpost] = useState<any>(true);
  const [isLoading, setIsLoading] = useState(true);

  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const categoryId = searchParams.get('category');
  const tag = searchParams.get('tag');
  const podcast = searchParams.get('podcast');

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
    logger(id, 'sdafsafssad');

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
    if (_category.isChild) {
      let parentId: string | undefined = fromNullable(
        _category.parentCategoryId
      );
      if (parentId) return getCategory(parentId, oldCategory);
    } else {
      return oldCategory;
    }
  }
  const getRefinedList = async (tempEntriesList: any[]) => {
    if (tempEntriesList.length === 0) {
      return [];
    }
    const refinedPromise = await Promise.all(
      tempEntriesList.map(async (entry: any) => {
        let image = null;
        if (entry[1].image) {
          image = getImage(entry[1].image[0]);
        }
        if (entry[1].isPodcast) {
          if (entry[1].podcastVideoLink != '') {
            image = iframeimgThumbnail(entry[1].podcastVideoLink);
          }
          if (entry[1]?.podcastImg.length != 0) {
            image = getImage(entry[1].podcastImg[0]);
          }
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
          isPodcast: entry[1].isPodcast,
          isStatic: entry[1].isStatic,
          views: entry[1].views,
          seoExcerpt: entry[1].seoExcerpt,
        };
        // if (user.ok) {
        //   newItem.userName = user.ok[1].name ?? entry[1].userName;
        // }
        return newItem;
      })
    );

    return refinedPromise;
  };
  async function getEntries(reset?: boolean, oldEntries?: any) {
    let searched = reset ? '' : search;
    let searchedCategory = categoryId ? [categoryId] : [];
    const searchedTag = tag ? tag : 'no where is this gonna be awaibale';
    const resp = await entryActor.getQuriedEntries(
      searchedCategory,
      searched,
      searchedTag,
      0,
      6
    );
    const { entries: _entries, amount } = resp;
    logger(resp, 'entries654');

    if (oldEntries) {
      oldEntries.push(..._entries);
    } else {
      oldEntries = _entries;
    }
    return oldEntries;
    // if (oldEntries.length >= MAX_ENTRIES || oldEntries.length >= amount) {
    //   return oldEntries;
    // } else {
    //   return getEntries(false, oldEntries);
    // }
  }
  const { t, changeLocale } = useLocalization(LANG);
  const getNSetEntries = async (reset?: boolean) => {
    setIsLoading(true);
    const tempEntries = await getEntries(reset);
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
    getNSetEntries();
  }, [tag]);

  return (
    <>
      <main id='main'>
        <div className='main-inner event-detail-page lis'>
          <div className='inner-content'>
            <Col xl='12' lg='12' md='12'>
              <div className='event-innr'>
                <div className='flex-div-sm align-items-center justify-content-end'>
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
            <div className='event-innr my-3'>
              <Col xl='12' lg='12' md='12'>
                <Row>
                  <Col lg='12'>
                    <Row>
                      {isLoading ? (
                        <div className='d-flex justify-content-center w-full'>
                          <Spinner />
                        </div>
                      ) : entries && entries.length != 0 ? (
                        entries.map((entry: any) => (
                          <EntryItem entry={entry} entryActor={entryActor} />
                        ))
                      ) : (
                        <p className='d-flex justify-content-center w-full'>
                          {t('No news found')}{' '}
                          {tag && (
                            <span className='ms-1'>
                              {t('ON')} <b>#{tag} </b>
                              {t('Tag')}
                            </span>
                          )}
                        </p>
                      )}
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
