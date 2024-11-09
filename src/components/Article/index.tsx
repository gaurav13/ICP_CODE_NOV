'use client';
import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Breadcrumb,
  Dropdown,
  Spinner,
  Button,
} from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import iconrelated from '@/assets/Img/Icons/icon-related.png';
import NFTArticlePost from '@/components/NFTArticlePost/NFTArticlePost';
import RelatedPost from '@/components/RelatedPost/RelatedPost';
import iconinfo from '@/assets/Img/Icons/icon-infor.png';
import iconfeed from '@/assets/Img/Icons/icon-feed.png';
import iconevents from '@/assets/Img/Icons/icon-event.png';
import iconshare from '@/assets/Img/Icons/icon-share-o.png';
import iconthumb from '@/assets/Img/Icons/icon-thumb.png';
import QuizPost from '@/components/QuizPost/QuizPost';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import { User } from '@/types/profile';
import { getImage, getImageById } from '@/components/utils/getImage';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import iconmessage from '@/assets/Img/Icons/icon-comment.png';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import ReleasePost from '@/components/ReleasePost/ReleasePost';

import girl from '@/assets/Img/user-img.png';
import iconbnb from '@/assets/Img/icon-bnb.png';
import { isUserConnected, utcToLocal } from '@/components/utils/utcToLocal';
import iconrss from '@/assets/Img/Icons/icon-rss.png';
import NewsSlider from '@/components/NewsSlider';
import angledown from '@/assets/Img/Icons/angle-down-solid.png';
import angleright from '@/assets/Img/Icons/angle-right-solid.png';
import TopEvents from '@/components/TopEvents';
import { fromNullable } from '@dfinity/utils';
import CompanyListSidebar from '@/components/companyListSidebar/CompanyListSidebar';
import TrendingArticleSide from '@/components/TrendingArticleSide/TrendingArticleSide';
import { toast } from 'react-toastify';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import ConnectModal from '@/components/Modal';
import Tippy from '@tippyjs/react';
import { Date_m_d_y_h_m } from '@/constant/DateFormates';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { ConnectPlugWalletSlice } from '@/types/store';
import {
  ARTICLE_DYNAMIC_PATH_2,
  ARTICLE_STATIC_PATH,
  DIRECTORY_DINAMIC_PATH,
  DIRECTORY_STATIC_PATH,
} from '@/constant/routes';
import ArticleDetailShimmer from '@/components/Shimmers/ArticleDetailShimmer';
import ArticleHeaderShimmer from '@/components/Shimmers/ArticleHeaderShimmer';
import JSONLD from '@/components/JSONLD/JSONLD';
import logger from '@/lib/logger';

export default function Article({
  articleId,
  schema,
}: {
  articleId: string;
  schema?: any;
}) {
  const [userImg, setUserImg] = useState<string | null>();
  const [user, setUser] = useState<User | null>();
  const [featuredImage, setFeaturedImage] = useState<string | null>();
  const [entry, setEntry] = useState<any>();
  const [userId, setUserId] = useState();
  const { t, changeLocale } = useLocalization(LANG);
  const [adminMenueShow, setAdminMenueShow] = useState(false);
  const [HideTrendinpost, setHideTrendinpost] = useState<any>(true);
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const promote = searchParams.get('promoted');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectLink, setConnectLink] = useState('/');
  const router = useRouter();
  const [showContent, setShowContent] = useState(true);
  const [isArticleLoading, setIsArticleLoading] = useState(true);
  const location = usePathname();
  const { auth, setAuth, identity, articleHeadingsHierarchy, userAuth } =
    useConnectPlugWalletStore((state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      articleHeadingsHierarchy: state.articleHeadingsHierarchy,
      userAuth: (state as ConnectPlugWalletSlice).userAuth,
    }));
  const [adminMenuShows, setAdminMenuShows] = useState(
    articleHeadingsHierarchy
      ? new Array(articleHeadingsHierarchy.length).fill(false)
      : []
  );
  const [timeoutId, setTimeoutId] = useState<any>(null);
  const updateImg = async (img: any, name: string) => {
    if (img) {
      const tempImg = img;
      if (name === 'user') setUserImg(tempImg);
      else {
        setFeaturedImage(tempImg);
      }
    } else {
      // setProfileFile(null);
      if (name === 'user') setUserImg(null);
      else {
        setFeaturedImage(null);
      }
    }
  };
  let updateNewImg = async (img: any, name?: string) => {
    if (img) {
      let tempImg = await getImage(img);
      return tempImg;
    }
  };
  const getUser = async () => {
    let newUser = null;

    newUser = await auth.actor.get_user_details([userId]);
    if (newUser.ok) {
      setUser(newUser.ok[1]);
      updateImg(newUser.ok[1].profileImg[0], 'user');
    }
  };
  const createHeadingId = (headingText: string) => {
    return headingText.toLowerCase().replace(/\s+/g, '-');
  };
  const smoothScroll = (targetId: any) => {
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth',
      });
    }
  };
  const handleNavigationClick = (headingText: any) => {
    const headingId = createHeadingId(headingText);
    smoothScroll(headingId);
  };

  const generateNestedList = (headings: any) => {
    if (headings.length == 0) {
      return null;
    }
    return headings.map((item: any, outerIndex: any) => {
      return (
        <li key={outerIndex} className={'no-style'}>
          <div>
            <div className='d-flex align-items-center border-0'>
              <Image
                src={adminMenuShows[outerIndex] ? angledown : angleright}
                alt='admin'
                onClick={() => {
                  const updatedAdminMenuShows = [...adminMenuShows];
                  updatedAdminMenuShows[outerIndex] =
                    !updatedAdminMenuShows[outerIndex];
                  setAdminMenuShows(updatedAdminMenuShows);
                }}
                className='me-2'
                style={{
                  height: '16px',
                  width: adminMenuShows[outerIndex] ? '14px' : '10px',
                }}
              />

              {/* <Image src={admin1} alt='admin' /> */}
              <p
                onClick={() => handleNavigationClick(item.text)}
                className='mb-0'
              >
                {item.text}
              </p>
            </div>

            <div
              style={{ display: adminMenuShows[outerIndex] ? 'block' : 'none' }}
              className='ms-4'
            >
              {item.children.length != 0 &&
                item.children.map((e: any, index: any) => {
                  return (
                    <div
                      onClick={() => handleNavigationClick(e.text)}
                      key={index}
                      // className={headingLevel.length > 1 ? 'no-style' : ''}
                    >
                      <p className='m-0'>
                        <span> - </span>
                        {e.text}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        </li>
      );
    });
  };
  let EntryforAdmin = async (articleId: any) => {
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
    const tempEntry = await entryActor.getEntry_admin(articleId);

    if (tempEntry[0] && tempEntry[0].isDraft) {
      return router.push(`/add-article?draftId=${articleId}`);
    }
    if (
      ARTICLE_DYNAMIC_PATH_2.startsWith(location) &&
      tempEntry[0] &&
      tempEntry[0].isStatic
    ) {
      return router.push(ARTICLE_STATIC_PATH + articleId+"/");
    }
    let TempDirectory = null;
    let tempUser = tempEntry[0]?.user?.toString();
    setUserId(tempUser);
    await updateImg(tempEntry[0].image[0], 'feature');
    let categoryLogo: any = iconbnb;

    let categoryNames = await Promise.all(
      tempEntry[0].category.map(async (categoryId: string) => {
        let resp = await entryActor.get_category(categoryId);
        let category: any = fromNullable(resp);
        let categoryName = 'No Category';
        if (category) {
          categoryName = category.name;
          if (category?.logo) {
            categoryLogo = getImage(category.logo);
          }
        }
        return { categoryName, categoryId };
      })
    );
    if (tempEntry[0].isCompanySelected) {
      let directoryGet = await entryActor.getWeb3(tempEntry[0].companyId);
      if (directoryGet.length != 0) {
        directoryGet[0].companyBanner = await updateNewImg(
          directoryGet[0].companyBanner
        );
        directoryGet[0].founderImage = await updateNewImg(
          directoryGet[0].founderImage
        );
        directoryGet[0].companyLogo = await updateNewImg(
          directoryGet[0].companyLogo
        );
        TempDirectory = directoryGet;
      }

      tempEntry[0].directory = TempDirectory;
    }
    tempEntry[0].categoryName = categoryNames;
    tempEntry[0].categoryLogo = categoryLogo;

    setEntry(tempEntry[0]);
    setIsArticleLoading(false);
  };
  let EntryforUser = async (articleId: any) => {
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
    const tempEntry = await entryActor.getEntry(articleId);

    if (tempEntry.length == 0 && auth?.state == 'anonymous') {
      return router.push(`/`);
    }

    if (auth?.state == 'initialized') {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const newTimeoutId = setTimeout(() => {
        // Your logic here
        if (tempEntry.length == 0) {
          router.push(`/`);
        }
      }, 4000);
      setTimeoutId(newTimeoutId);
    }
    if (tempEntry[0] && tempEntry[0].isDraft) {
      return router.push(`/add-article?draftId=${articleId}`);
    }

    if (
      ARTICLE_DYNAMIC_PATH_2.startsWith(location) &&
      tempEntry[0] &&
      tempEntry[0].isStatic
    ) {
      return router.push(ARTICLE_STATIC_PATH + articleId+"/");
    }
    let TempDirectory = null;
    let tempUser = tempEntry[0]?.user?.toString();
    setUserId(tempUser);
    await updateImg(tempEntry[0].image[0], 'feature');
    let categoryLogo: any = iconbnb;

    let categoryNames = await Promise.all(
      tempEntry[0].category.map(async (categoryId: string) => {
        let resp = await entryActor.get_category(categoryId);
        let category: any = fromNullable(resp);
        let categoryName = 'No Category';
        if (category) {
          categoryName = category.name;
          if (category?.logo) {
            categoryLogo = getImage(category.logo);
          }
        }
        return { categoryName, categoryId };
      })
    );
    if (tempEntry[0].isCompanySelected) {
      let directoryGet = await entryActor.getWeb3(tempEntry[0].companyId);
      if (directoryGet.length != 0) {
        directoryGet[0].companyBanner = await updateNewImg(
          directoryGet[0].companyBanner
        );
        directoryGet[0].founderImage = await updateNewImg(
          directoryGet[0].founderImage
        );
        directoryGet[0].companyLogo = await updateNewImg(
          directoryGet[0].companyLogo
        );
        TempDirectory = directoryGet;
      }

      tempEntry[0].directory = TempDirectory;
    }
    tempEntry[0].categoryName = categoryNames;
    tempEntry[0].categoryLogo = categoryLogo;

    setEntry(tempEntry[0]);
    setIsArticleLoading(false);
  };
  const getEntry = async () => {
    if (articleId) {
      const userActor = makeUserActor({
        agentOptions: {
          identity,
        },
      });
      if (userAuth.userPerms?.articleManagement) {
        EntryforAdmin(articleId);
      } else if (!auth.isLoading) {
        EntryforUser(articleId);
      }
    }
  };
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
    return new Promise(async (resolve, reject) => {
      if (!entry || !userId) reject('NO Entry or user ID provided');
      const entryActor = makeEntryActor({
        agentOptions: {
          identity,
        },
      });

      entryActor
        .likeEntry(articleId, userCanisterId, commentCanisterId)
        .then(async (entry: any) => {
          await getEntry();
          resolve(entry);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
  useEffect(() => {
    if (
      (auth.state == 'anonymous' || auth.state === 'initialized') &&
      !auth.isLoading
    )
      getEntry();
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [articleId, auth, promote]);
  useEffect(() => {
    if (userId && auth.actor) {
      getUser();
    }
  }, [userId, auth.actor]);
  let addViewfn = async () => {
    if (articleId) {
      const entryActor = makeEntryActor({
        agentOptions: {
          identity,
        },
      });
      let isadded = await entryActor.addView(articleId);
    }
  };
  useEffect(() => {
    addViewfn();
  }, [articleId]);
  useEffect(() => {
 if (location.startsWith(ARTICLE_STATIC_PATH) && !location.endsWith('/')) {
  router.push(`${ARTICLE_STATIC_PATH + articleId}/`);
}

  }, [])

  // router.push('/route')
  return (
    <>
      <main id='main'>
        <ins
          className='adsbygoogle'
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-layout='in-article'
          data-ad-format='fluid'
          data-ad-client='ca-pub-8110270797239445'
          data-ad-slot='3863906898'
        />
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        <div className='main-inner'>
          <div className='inner-content'>
            <Row>
              <Col xl='3' lg='12' md='12' className='d-flex'>
                <Breadcrumb className='new-breadcrumb'>
                  <Breadcrumb.Item>
                    <Link href='/'>
                      <i className='fa fa-home' />
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Tippy
                      content={
                        entry?.categoryName[0].categoryName
                          ? entry?.categoryName[0].categoryName
                          : ''
                      }
                    >
                      <Link href={`/category-details?category=${entry?.category[0]}`}>
  {entry?.categoryName[0].categoryName || ''}
</Link>
                    </Tippy>

                    {/* {entry?.category[0]} */}
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active>
                    {entry?.title
                      ? entry?.title?.length > 8
                        ? `${entry?.title.slice(0, 8)}...`
                        : entry?.title
                      : ''}
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              {articleHeadingsHierarchy &&
                articleHeadingsHierarchy.length != 0 && (
                  <Col
                    className='d-xl-none d-block web-view-display'
                    md={{ span: '12', order: 2 }}
                    sm={{ span: '12', order: 2 }}
                    xs={{ span: '12', order: 2 }}
                  >
                    <Dropdown
                      onClick={() => setShowContent((pre) => !pre)}
                      className='mb-2'
                    >
                      <Dropdown.Toggle
                        variant='success'
                        className='fill'
                        id='dropdown-basic'
                      >
                        {t('All Content')}{' '}
                        {showContent ? (
                          <i className='fa fa-angle-down' />
                        ) : (
                          <i className='fa fa-angle-right' />
                        )}
                      </Dropdown.Toggle>
                    </Dropdown>
                    <ul
                      className='article-menu mt-2'
                      style={{ display: showContent ? 'block' : 'none' }}
                    >
                      {articleHeadingsHierarchy ? (
                        <>{generateNestedList(articleHeadingsHierarchy)}</>
                      ) : null}
                    </ul>
                  </Col>
                )}
              {isArticleLoading ? (
                <Col xl='6' lg='12' md='12'>
                  <ArticleHeaderShimmer />
                </Col>
              ) : (
                <Col xl='6' lg='12' md='12'>
                  <div className='flex-div align-items-start '>
                    <div className='user-panel'>
                      <Image
                        src={userImg ? userImg : girl}
                        alt='User'
                        width={60}
                        height={60}
                        style={{ borderRadius: '50%', maxHeight: 60 }}
                      />

                      <div className='txty-pnl'>
                        <h6 className='big'>{t('by')}</h6>
                        <h4
                          onClick={() =>
                            router.push(`/profile?userId=${userId}`)
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          {user?.name ?? 'User name  '}
                        </h4>
                        <p className='m-0'>
                          {user?.designation?.length !== 0
                            ? user?.designation
                            : ''}
                        </p>
                        <p>
                          {entry
                            ? `${t('Date')}: ${utcToLocal(
                                entry.creation_time.toString(),
                                Date_m_d_y_h_m
                              )}`
                            : 'Oct 19, 2023, 23:35'}
                        </p>
                      </div>
                    </div>
                    <div className='user-panel'>
                      <div>
                        {/* <Image src={iconbnb} alt='BNB' /> */}
                        <Image
                          src={
                            entry
                              ? entry?.isCompanySelected && entry?.directory
                                ? entry?.directory[0]?.companyLogo
                                : entry?.categoryLogo
                              : iconbnb
                          }
                          alt='BNB'
                          width={50}
                          height={50}
                          style={{ borderRadius: '50%' }}
                        />
                      </div>
                      <Link
                        href={(entry?.isCompanySelected && entry?.directory)?
                          entry?.directory[0].isStatic
                            ? `${DIRECTORY_STATIC_PATH + entry?.companyId}`
                            : `${
                                entry
                                  ? DIRECTORY_DINAMIC_PATH +
                                    entry?.companyId
                                  : DIRECTORY_DINAMIC_PATH + '#'
                              }`:`/category-details?category=${
                                entry ? entry?.category[0] : '#'
                              }`}
                        className='txty-pnl'
                      >
                        <h6 className='big'>{t('ON')}</h6>
                        <h4 className='mb-0' style={{ lineHeight: 1 }}>
                          {entry?.isCompanySelected && entry?.directory
                            ? entry?.directory[0].company
                            : entry?.categoryName[0]?.categoryName}
                          {/* {entry?.category ? entry.category[0] : 'category'} */}
                        </h4>

                        <p>
                          {' '}
                          {entry?.isCompanySelected && entry?.directory
                            ? entry?.directory[0].shortDescription.length > 10
                              ? `${entry?.directory[0].shortDescription.slice(
                                  0,
                                  10
                                )}...`
                              : entry?.directory[0].shortDescription
                            : ''}
                        </p>
                      </Link>
                    </div>
                  </div>
                  <div className='article-top-border' />
                </Col>
              )}
            </Row>
            <Row>
              <Col
                xxl={{ span: '3', order: 2 }}
                xl={{ span: '3', order: 2 }}
                lg={{ span: '12', order: 3 }}
                md={{ span: '12', order: 3 }}
                sm={{ span: '12', order: 3 }}
                xs={{ span: '12', order: 3 }}
              >
                <Row>
                  <Col
                    xxl='12'
                    xl='12'
                    lg='12'
                    md='12'
                    className='heding icp-leadership-pnl web-view-display'
                    id='event'
                  >
                    <TopEvents small />
                  </Col>

                  <Col xl='12' lg='12' className='heding  web-view-display'>
                    <div className='spacer-20' />
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

                      {/* <Dropdown.Menu>
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
                      HideTrendinpost
                        ? 'content show web-view-display'
                        : 'content hide'
                    }
                  >
                    <TrendingArticleSide isArticle={true} />
                  </span>

                  <Col xxl='12' xl='12' lg='12' className='ld-cntnr mmt-0 mt-5'>
                    <div className='flex-div align-items-center heding'>
                      <h4>
                        <Image src={iconfeed} alt='icon feed' />
                        {t('Add Your Feed')}
                      </h4>

                      <h4>
                        <Image src={iconinfo} alt='icon info' />
                      </h4>
                    </div>
                    <div className='spacer-20' />

                    <div className='mobile-view-display w-100'>
                      <CompanyListSidebar contentLength={1} />
                    </div>
                    <div className='web-view-display '>
                      <CompanyListSidebar />
                    </div>
                  </Col>
                  <Col xxl='12' xl='12' lg='12' className='mobile-view-display'>
                    <Link className='grey-link' href='#'>
                      {t('View more')} {t('Suggestion')}{' '}
                      <i className='fa fa-long-arrow-right' />
                    </Link>
                  </Col>
                </Row>
              </Col>
              <Col
                xxl={{ span: '9', order: 1 }}
                xl={{ span: '9', order: 1 }}
                lg={{ span: '12', order: 1 }}
                md={{ span: '12', order: 1 }}
                sm={{ span: '12', order: 1 }}
                xs={{ span: '12', order: 1 }}
              >
                {isArticleLoading ? (
                  <Row>
                    <Col
                      xxl={{ span: '12', order: 1 }}
                      xl={{ span: '12', order: 1 }}
                      lg={{ span: '12', order: 1 }}
                      md={{ span: '12', order: 1 }}
                      sm={{ span: '12', order: 1 }}
                      xs={{ span: '12', order: 1 }}
                    >
                      <ArticleDetailShimmer />
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col
                      xxl={{ span: '12', order: 1 }}
                      xl={{ span: '12', order: 1 }}
                      lg={{ span: '12', order: 1 }}
                      md={{ span: '12', order: 1 }}
                      sm={{ span: '12', order: 1 }}
                      xs={{ span: '12', order: 1 }}
                    >
                      {entry && (
                        <NFTArticlePost
                          likeEntry={likeEntry}
                          article={{
                            entry: entry,
                            user: user,
                            featuredImage: featuredImage,
                            userImg: userImg,
                            userId: userId,
                            articleId: articleId,
                            getEntry,
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>

            <Row>
              <Col
                xxl={{ span: '6', order: 1, offset: 3 }}
                xl={{ span: '6', order: 1, offset: 3 }}
                lg={{ span: '12', order: 1 }}
                md={{ span: '12', order: 1 }}
                sm={{ span: '12', order: 1 }}
                xs={{ span: '12', order: 1 }}
              >
                <div className='dis-spacer pmt-0'>
                  <Row>
                    <Col xl='12' className='web-view-display'>
                      <div className='disclaimer-pnl'>
                        <h4>
                          <b>
                            <i className='fa fa-info info-btn' />{' '}
                            {t('Disclaimer')}
                          </b>
                        </h4>
                        <div className='spacer-10' />
                        <p className='m-0'>
                          {t(
                            'The content provided here is for general informational purposes only. It should not be considered as professional advice. Any actions taken based on this information are at your own risk. We do not assume any responsibility or liability for the accuracy, completeness, or suitability of the information. Always consult with a qualified professional for specific advice related to your circumstances.'
                          )}
                        </p>
                      </div>
                    </Col>
                    <Col
                      xxl='12'
                      xl='12'
                      lg='12'
                      className='heding mt-3'
                      id='blockchain'
                    >
                      <div className='spacer-20 web-view-display' />
                      <h4>
                        <Image src={iconrss} alt='RSS' />
                        {t('Blockchain News')}
                      </h4>
                      <div className='spacer-20' />
                      {/* <GeneralSlider /> */}
                      <NewsSlider isdetailpage={true} />
                    </Col>
                    <Col
                      xxl={{ span: '12', order: 3 }}
                      xl={{ span: '12', order: 3 }}
                      lg={{ span: '12', order: 3 }}
                      md={{ span: '12', order: 3 }}
                      sm={{ span: '12', order: 3 }}
                      xs={{ span: '12', order: 3 }}
                      className='heding mt-3'
                    >
                      <h4>
                        <Image src={iconrelated} alt='icon related' />{' '}
                        {t('Related Posts')}
                      </h4>
                      <div className='spacer-20' />
                      <div className='related-post-container rlf p-0'>
                        <RelatedPost catagorytype={entry?.category} />
                      </div>
                    </Col>
                    <Col xl='12' className='mobile-view-display'>
                      <div className='spacer-20' />
                      <div className='disclaimer-pnl'>
                        <h4>
                          <b>
                            <i className='fa fa-info info-btn' />{' '}
                            {t('Disclaimer')}
                          </b>
                        </h4>
                        <div className='spacer-10' />
                        <p className='m-0'>
                          {t(
                            'The content provided here is for general informational purposes only. It should not be considered as professional advice. Any actions taken based on this information are at your own risk. We do not assume any responsibility or liability for the accuracy, completeness, or suitability of the information. Always consult with a qualified professional for specific advice related to your circumstances.'
                          )}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </main>
      <ConnectModal
        handleClose={handleConnectModalClose}
        showModal={showConnectModal}
        link={connectLink}
      />
    </>
  );
}