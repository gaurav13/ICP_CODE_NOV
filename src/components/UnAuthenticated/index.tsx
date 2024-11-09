'use client';
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Dropdown, Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import hot from '@/assets/Img/Icons/icon-flame-1.png';
import stars from '@/assets/Img/Icons/icon-start.png';
import press from '@/assets/Img/Icons/icon-press-release.png';
import iconcompass from '@/assets/Img/Icons/icon-compass.png';
import iconarticle from '@/assets/Img/Icons/icon-article-1.png';
import iconrss from '@/assets/Img/Icons/icon-rss.png';
import iconevents from '@/assets/Img/Icons/icon-event.png';
import iconmessage from '@/assets/Img/Icons/icon-comment.png';
import iconranking from '@/assets/Img/Icons/icon-ranking.png';
import icpimage from '@/assets/Img/coin-image.png';
import iconbnb from '@/assets/Img/icon-bnb.png';
import PodcastPost from '@/components/PodcastPost/PodcastPost';
import SurveyPost from '@/components/SurveyPost/SurveyPost';
import ReleasePost from '@/components/ReleasePost/ReleasePost';
// import PressPost from '@/components/PressPost/PressPost';
import FeaturedSlider from '@/components/FeaturedSlider/FeaturedSlider';
import ReleaseSlider from '@/components/ReleaseSlider/ReleaseSlider';
import ProductSlider from '@/components/ProductSlider/ProductSlider';
import LeadershipPost from '@/components/LeadershipPost/LeadershipPost';
import { useConnectPlugWalletStore, useThemeStore } from '@/store/useStore';
import WebstoriesSlider from '@/components/WebstoriesSlider/WebstoriesSlider';
import { getImage } from '@/components/utils/getImage';
import girl from '@/assets/Img/user-img.png';
import logger from '@/lib/logger';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import {
  makeCommentActor,
  makeEntryActor,
  makeUserActor,
} from '@/dfx/service/actor-locator';
import parse from 'html-react-parser';
import EntryListNewHome from '@/components/EntryListNewHome/EntryListNewHome';
import ConnectModal from '@/components/Modal';
import PromotedSVG from '@/components/PromotedSvg/Promoted';
import Tippy from '@tippyjs/react';
import {
  ADDS_IMAGE_RATIO,
  ARTICLE_FEATURED_IMAGE_ASPECT,
} from '@/constant/sizes';
import TopEvents from '@/components/TopEvents';
import { E8S } from '@/constant/config';
import { fromNullable } from '@dfinity/utils';
import CompanySlider from '@/components/CompanySlider/CompanySlider';
import TrendingArticleSide from '@/components/TrendingArticleSide/TrendingArticleSide';
import LeadershipboardNew from '@/components/LeadershipboardNew/LeadershipboardNew';
import { formatLikesCount } from '@/components/utils/utcToLocal';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import TrendingPressRelease from '@/components/TrendingArticleSide/TrendingPressRelease';
import HomeMBSlider from '@/components/mobileStoriesSlider/HomeMBSlider';
import {
  AI_CATEGORY_ID,
  ALL_ARTICLES,
  ARTICLE_DINAMIC_PATH,
  ARTICLE_STATIC_PATH,
  BLOCKCHAIN_CATEGORY_ID,
  BLOCKCHAIN_GAMES_CATEGORY_ID,
  CRYPTO_CATEGORY_ID,
  DAO_CATEGORY_ID,
  DEFI_CATEGORY_ID,
  DIRECTORY_DINAMIC_PATH,
  DIRECTORY_STATIC_PATH,
  EVENTS,
  METAVERCE_CATEGORY_ID,
  NFT_CATEGORY_ID,
  QUIZ_ROUTE,
  WEB3_CATEGORY_ID,
} from '@/constant/routes';
import TopEventsSlider from '@/components/EntryListNewHome/EventSliderHome';

export default function UnAuthenticated() {
  const { t, changeLocale } = useLocalization(LANG);
  const router = useRouter();
  const [animatedElements, setAnimatedElements] = useState([]);
  // const [Entries, setEntries] = useState<any>([]);
  const [blockchainEntries, setBlockchainEntries] = useState<any>([]);

  const [connectLink, setConnectLink] = useState('/');
  const [latestEntry, setLatestEntry] = useState<any>([]);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [trendingDirectries, setTrendingDirectries] = useState<any>([]);
  const [trendingDirectriesLoading, setTrendingDirectriesLoading] =
    useState(true);
  const [HideTrendinpost, setHideTrendinpost] = useState<any>(true);
  const [HideStoriespost, setHideStoriespost] = useState<any>(true);
  const [isArticleLoading, setIsArticleLoading] = useState<any>(true);
  const { isBlack } = useThemeStore((state) => ({
    isBlack: state.isBlack,
  }));

  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  let cRoute = searchParams.get('route');
  const { auth, setAuth, identity, principal } = useConnectPlugWalletStore(
    (state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
    })
  );

  let refineEntries = async (entriesList: any) => {
    logger(entriesList, 'entriesList22');
    const userAcotr = makeUserActor({
      agentOptions: {
        identity,
      },
    });
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
    for (let entry = 0; entry < entriesList.length; entry++) {
      let newUser = null;
      let TempDirectory = null;
      var authorId = entriesList[entry][1].user.toString();
      newUser = await userAcotr.get_user_details([authorId]);
      const comments = await commentsActor.getComments(entriesList[entry][0]);
      let resp = await entryActor.get_category(
        entriesList[entry][1].category[0]
      );
      let category: any = fromNullable(resp);
      let categoryName = 'No Category';
      let categoryLogo: any = iconbnb;
      if (category) {
        categoryName = category.name;
        if (category?.logo) {
          categoryLogo = getImage(category.logo);
        }
      }
      if (entriesList[entry][1].isCompanySelected) {
        let directoryGet = await entryActor.getWeb3(
          entriesList[entry][1].companyId
        );
        if (directoryGet.length != 0) {
          directoryGet[0].companyBanner = await updateImg(
            directoryGet[0].companyBanner
          );
          directoryGet[0].founderImage = await updateImg(
            directoryGet[0].founderImage
          );
          directoryGet[0].companyLogo = await updateImg(
            directoryGet[0].companyLogo
          );
          TempDirectory = directoryGet;
        }
        logger(TempDirectory, 'TempDirectory2');
      }
      if (comments.ok) {
        // setArticleComments(comments.ok[0]);
        let tempComments = comments.ok[0];

        let tempComment = tempComments[0];
        let commenterId = tempComment.user;
        let authorDetails = await userAcotr.get_user_name(commenterId);
        if (authorDetails[0]?.image.length > 0) {
          tempComment.image = await updateImg(authorDetails[0].image[0]);
        } else {
          tempComment.image = false;
        }
        logger({ authorDetails }, 'Name of comments');
        tempComment.author = authorDetails[0].name;
        tempComment.comments = tempComments.length;
        entriesList[entry][1].comment = tempComment;
        // logger({ Comment: comments.ok[0], identity }, 'THEM DOMMENTS');
      }
      if (newUser.ok) {
        if (newUser.ok[1].profileImg.length != 0) {
          newUser.ok[1].profileImg = await updateImg(
            newUser.ok[1].profileImg[0]
          );
        }
        entriesList[entry][1].userId = authorId;
        entriesList[entry][1].user = newUser.ok[1];
      }
      entriesList[entry][1].image[0] = await updateImg(
        entriesList[entry][1].image[0]
      );
      entriesList[entry][1].directory = TempDirectory;
      entriesList[entry][1].categoryName = categoryName;
      entriesList[entry][1].categoryLogo = categoryLogo;
    }
    return entriesList;
  };
  let getAllWeb3List = async (searchString = '') => {
    logger(searchString, 'searchString');
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    let TempDirectory = null;
    let tempWeb3 = await entryActor.getWeb3ListOfAllUsers(
      'All',
      searchString,
      0,
      5
    );

    if (tempWeb3?.web3List?.length != 0) {
      let web3array = tempWeb3.web3List;

      for (let dirc = 0; dirc < web3array.length; dirc++) {
        let resp = await entryActor.get_category(web3array[dirc][1].catagory);
        let category: any = fromNullable(resp);
        let categoryName = 'No Category';
        if (category) {
          categoryName = category.name;
        }
        web3array[dirc][1].catagory = categoryName;
        web3array[dirc][1].companyBanner = await getImage(
          web3array[dirc][1].companyBanner
        );
        web3array[dirc][1].founderImage = await getImage(
          web3array[dirc][1].founderImage
        );
        web3array[dirc][1].companyLogo = await getImage(
          web3array[dirc][1].companyLogo
        );
      }
      TempDirectory = web3array.sort(
        (f: any, l: any) => Number(l[1].likes) - Number(f[1].likes)
      );
    }
    if (TempDirectory) {
      setTrendingDirectries(TempDirectory);
    } else {
      setTrendingDirectries([]);
    }
    setTrendingDirectriesLoading(false);
    // const promted = await entryActor.getPromotedEntries();
    // logger(promted, 'PROMTED ENTRIES');
    logger(tempWeb3, 'trendingWeb3list');
  };
  const getEntries = async (category?: string | null) => {
    try {
      const entryActor = makeEntryActor({
        agentOptions: {
          identity,
        },
      });

      const tempEntries = await entryActor.getAllEntries('All');
      logger(tempEntries, 'entriesList33');
      if (tempEntries.length > 5) {
        const filteredEntries = tempEntries.slice(0, 5);
        let refined = await refineEntries(filteredEntries);
        setLatestEntry(refined[0]);
        let [bcaa, ...restEntries] = refined;
        // setEntries(restEntries);
        setIsArticleLoading(false);
      } else if (tempEntries.length != 0) {
        let refined = await refineEntries(tempEntries);
        logger(refined, 'refinedrefined');

        // let [bcaa, ...restEntries] = refined;
        // setEntries(restEntries);

        setIsArticleLoading(false);
        // setIsArticleLoading(false)
        setLatestEntry(refined[0]);
      } else {
        setIsArticleLoading(false);
      }
      // setEntryId(templatestEntry[0]);
      // logger('pop');
    } catch (err) {
      setIsArticleLoading(false);
      // logger('pop');
    }
  };
  const getBlockchainEntries = async (category: string | null) => {
    try {
      const entryActor = makeEntryActor({
        agentOptions: {
          identity,
        },
      });

      const tempEntries = await entryActor.getAllEntries(category);
      if (tempEntries.length > 5) {
        const filteredEntries = tempEntries.slice(0, 5);
        let refined = await refineEntries(filteredEntries);

        let [bcaa, ...restEntries] = refined;
        setBlockchainEntries(restEntries);
        setIsArticleLoading(false);
      } else if (tempEntries.length != 0) {
        let refined = await refineEntries(tempEntries);

        let [bcaa, ...restEntries] = refined;
        setBlockchainEntries(restEntries);

        setIsArticleLoading(false);
      } else {
        setIsArticleLoading(false);
      }
    } catch (err) {
      setIsArticleLoading(false);
    }
  };
  let openArticleLink = (articleLink: any) => {
    router.push(articleLink);
  };
  let updateImg = async (img: any, name?: string) => {
    if (img) {
      let tempImg = await getImage(img);
      return tempImg;
    }
  };
  const handleConnectModal = (e: string) => {
    // e.preventDefault();
    setShowConnectModal(true);
    setConnectLink(e);
  };
  const handleConnectModalClose = () => {
    setShowConnectModal(false);
  };
  useEffect(() => {
    // console.log('reee');
    getAllWeb3List();
    getEntries();
    getBlockchainEntries(BLOCKCHAIN_CATEGORY_ID);
  }, []);
  useEffect(() => {
    if (cRoute && auth.state === 'initialized') {
      const targetElement = document.getElementById(cRoute);

      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
      }
    }
  }, [cRoute, auth]);

  // router.push('/route')
  return (
    <>
      <main id='main' className='new-home'>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        <div className='main-inner home'>
          <Head>
            <title>Hi</title>
          </Head>
          <div className='section pmt-0' id='top'>
            <Row>
              <div className='col-xl-12 col-lg-12 col-md-12'>
                <ins
                  className='adsbygoogle'
                  data-ad-layout='in-article'
                  data-ad-format='fluid'
                  data-ad-client='ca-pub-8110270797239445'
                  data-ad-slot='3863906898'
                  style={{ display: 'block', textAlign: 'center' }}
                />
                <Link
                  href='https://www.bitget.com/'
                  className='img-pnl new'
                  style={{
                    aspectRatio: ADDS_IMAGE_RATIO,
                  }}
                >
                  <Image
                    src={
                      'https://blockza.io/wp-content/uploads/2024/07/promotess-img-.png'
                    }
                    width={100}
                    height={100}
                    style={{ width: '100%', maxHeight: 'unset' }}
                    alt={'BlockZa'}
                  />
                </Link>
              </div>
              <Col xl='6' lg='12' md='12'>
                <div className='anime-left bdrd-pnl featured-slid-cntnr'>
                  <Row>
                    <Col
                      id='campaign'
                      xl='12'
                      lg='12'
                      md='12'
                      className='heding'
                    >
                      <h4>
                        <Image src={stars} alt='Hot' />
                        {t('Featured Campaigns')}{' '}
                      </h4>
                      <div className='spacer-20' />
                    </Col>
                    <FeaturedSlider isHome={true} />
                    <div className='full-div mobile-view-display bordery text-right'>
                      <Link className='red-anchor' href='#'>
                        {t('View All Feature Campaigns')}{' '}
                        <i className='fa fa-angle-right' />
                      </Link>
                    </div>
                  </Row>
                </div>
              </Col>
              <Col sm='12' className='mobile-view-display'>
                <Row>
                  <Col xl='12' lg='12' className='heding'>
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
                  <Col
                    className={
                      HideTrendinpost ? 'content show' : 'content hide'
                    }
                  >
                    <HomeMBSlider isArticle={true} />
                  </Col>
                  {/* {HideTrendinpost && <TrendingArticleSide isArticle={true} />} */}
                  <div className='full-div mobile-view-display bordery  text-right'>
                    <Link className='red-anchor' href='#'>
                      {t('View All News')} <i className='fa fa-angle-right' />
                    </Link>
                  </div>
                </Row>
              </Col>
              <Col xl='6' lg='12' md='12'>
                <div className='anime-right press-slid-cntnr'>
                  <Row>
                    <Col
                      xl='12'
                      lg='12'
                      md='12'
                      className='heding'
                      id='pressRelease'
                    >
                      <h2>
                        <Image src={press} alt='Hot' /> {t('Press Release')}
                      </h2>
                      <div className='spacer-20' />
                    </Col>
                    <ReleaseSlider isHome={true} />
                    <div className='full-div mobile-view-display bordery  text-right'>
                      <Link className='red-anchor' href='#'>
                        {t('View All Press Releases')}{' '}
                        <i className='fa fa-angle-right' />
                      </Link>
                    </div>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
          <Row>
            <Col>
              <iframe
                src={LANG=="en"?'https://www.chatbase.co/chatbot-iframe/vXOyMigraOFfiJ7f5O1Il':"https://www.chatbase.co/chatbot-iframe/384SXpy6Uf9FJnTpRTgef"}
                frameBorder='0'
                className='bootIframe'
              ></iframe>
            </Col>
          </Row>
          <div className='section scroll-anime anime-down pmyb-0' id='news'>
            <Row>
              <Col xl='12' lg='12' md='12' sm='12' className='web-view-display'>
                <div className='spacer-20' />
              </Col>
              <Col
                xl='12'
                lg='12'
                md='12'
                sm='12'
                className='heding web-view-display'
              >
                <h2>
                  <Image src={iconrss} alt='Hot' /> {t('Blockza Feed')}
                </h2>
              </Col>

              <Col
                xxl='3'
                xl='12'
                lg='12'
                md='12'
                sm='12'
                className='web-view-display'
              >
                <Row>
                  <Col xl='12' lg='12' className='heding'>
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
                          Top Stories
                        </Dropdown.Item>
                        <Dropdown.Item href='#/action-2'>
                          Top Stories
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
                    <TrendingPressRelease isArticle={true} />
                  </span>
                </Row>
              </Col>
              <Col
                xxl='3'
                xl='12'
                lg='12'
                md='12'
                sm='12'
                className='mobile-view-display'
              >
                <Row>
                  <Col xl='12' lg='12' className='heding'>
                    <Dropdown
                      onClick={() => setHideStoriespost((pre: any) => !pre)}
                    >
                      <Dropdown.Toggle
                        variant='success'
                        className='fill'
                        id='dropdown-basic'
                      >
                        {t('top stories')}{' '}
                        {HideStoriespost ? (
                          <i className='fa fa-angle-down' />
                        ) : (
                          <i className='fa fa-angle-right' />
                        )}
                      </Dropdown.Toggle>

                      {/* <Dropdown.Menu>
                        <Dropdown.Item href='#/action-1'>
                          Top Stories
                        </Dropdown.Item>
                        <Dropdown.Item href='#/action-2'>
                          Top Stories
                        </Dropdown.Item>
                      </Dropdown.Menu> */}
                    </Dropdown>
                    <div className='spacer-20' />
                  </Col>

                  <span
                    className={
                      HideStoriespost ? 'content show' : 'content hide'
                    }
                  >
                    <TrendingPressRelease isArticle={false} />
                  </span>

                  <div className='full-div mobile-view-display bordery  text-right'>
                    <Link className='red-anchor' href='#'>
                      {t('View All Stories')}{' '}
                      <i className='fa fa-angle-right' />
                    </Link>
                  </div>
                </Row>
              </Col>

              <Col xxl='6' xl='12' lg='12' md='12' sm='12'>
                <div className='spacer-20' />

                <h3 className='mobile-view-display-flex hedingxt'>
                  <Image
                    style={{ marginRight: '10px' }}
                    src={iconarticle}
                    alt='Hot'
                  />{' '}
                  Latest Article
                </h3>

                {isArticleLoading ? (
                  <div className='d-flex justify-content-center'>
                    <Spinner />
                  </div>
                ) : latestEntry.length != 0 ? (
                  <div className='general-post big'>
                    <div
                      className='img-pnl new'
                      style={{
                        aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT,
                      }}
                    >
                      {latestEntry.length != 0 &&
                        latestEntry[1].image.length != 0 && (
                          <Link
                            href={
                              latestEntry[1]?.isStatic
                                ? `${ARTICLE_STATIC_PATH + latestEntry[0]}`
                                : `${
                                    latestEntry.length != 0
                                      ? ARTICLE_DINAMIC_PATH + latestEntry[0]
                                      : ARTICLE_DINAMIC_PATH + '#'
                                  }`
                            }
                            target='_self'
                            style={{
                              height: '100%',
                              width: '100%',
                              position: 'relative',
                            }}
                          >
                            {latestEntry[1]?.isPromoted && (
                              <div className='promotedlable'>
                                <PromotedSVG />
                                {/* <Image
                      src={promotedIcon2}
                      alt='promoted icon'
                      height={25}
                      width={25}
                      className='me-2 '
                    />{' '} */}
                                <p
                                  className='mb-0'
                                  style={{ fontWeight: '600' }}
                                >
                                  {t('Promoted Article')}
                                </p>
                              </div>
                            )}
                            <Tippy
                              content={
                                <p
                                  className='mb-0 '
                                  style={{ overflow: 'hidden' }}
                                >
                                  {latestEntry[1]?.caption}
                                </p>
                              }
                            >
                              <Image
                                src={latestEntry[1].image[0]}
                                width={100}
                                height={100}
                                style={{ height: '100%', maxHeight: 'unset' }}
                                alt={latestEntry[1].caption ?? 'article image'}
                              />
                            </Tippy>
                          </Link>
                        )}
                    </div>
                    <div className='txt-pnl'>
                      <div className='flex-div'>
                        <div className='user-pnl'>
                          <div className='imge-pnl'>
                            <Image
                              src={
                                latestEntry.length != 0 &&
                                latestEntry[1]?.user?.profileImg?.length != 0
                                  ? latestEntry[1]?.user?.profileImg
                                  : girl
                              }
                              width={60}
                              className='user-pf-img'
                              height={60}
                              alt='user'
                            />
                          </div>
                          <div className='txte-pnl d-flex align-items-center'>
                            <h5
                              onClick={() =>
                                openArticleLink(
                                  `/profile?userId=${latestEntry[1].userId}`
                                )
                              }
                              style={{ cursor: 'pointer' }}
                            >
                              {t('by')}{' '}
                              {latestEntry.length != 0
                                ? latestEntry[1].user.name[0]
                                : 'User'}
                              <p className='m-0'>
                                {latestEntry[0]
                                  ? latestEntry[1].user?.designation[0] ?? ''
                                  : ''}
                              </p>
                            </h5>

                          </div>
                        </div>
                        <div className='user-pnl'>
                          <div className='imge-pnl'>
                            <Image
                              src={
                                latestEntry.length != 0
                                  ? latestEntry[1]?.isCompanySelected &&
                                    latestEntry[1]?.directory
                                    ? latestEntry[1]?.directory[0]?.companyLogo
                                    : latestEntry[1]?.categoryLogo
                                  : iconbnb
                              }
                              alt='BNB'
                              width={50}
                              height={50}
                            />
                          </div>
                          <div className='txte-pnl  d-flex align-items-center'>
<Link
className='ash5'
href={(
  latestEntry.length != 0 &&
  latestEntry[1]?.isCompanySelected &&
  latestEntry[1]?.directory
) ? 
latestEntry[1]?.directory[0]?.isStatic
  ? `${
      DIRECTORY_STATIC_PATH +
      latestEntry[1]?.companyId
    }`
  : `${
      latestEntry.length != 0
        ? DIRECTORY_DINAMIC_PATH +
          latestEntry[1]?.companyId
        : DIRECTORY_DINAMIC_PATH + '#'
    }`:"#"}
  onClick={() => {
    if (
      latestEntry.length != 0 &&
      latestEntry[1]?.isCompanySelected &&
      latestEntry[1]?.directory
    ) {
      openArticleLink(
        latestEntry[1]?.directory[0]?.isStatic
          ? `${
              DIRECTORY_STATIC_PATH +
              latestEntry[1]?.companyId
            }`
          : `${
              latestEntry.length != 0
                ? DIRECTORY_DINAMIC_PATH +
                  latestEntry[1]?.companyId
                : DIRECTORY_DINAMIC_PATH + '#'
            }`
      );
    }
  }}
>
  {t('ON')}{' '}
  {/* {latestEntry.length != 0
    ? latestEntry[1].category[0]
    : 'category'} */}
  {latestEntry.length != 0
    ? latestEntry[1]?.isCompanySelected &&
      latestEntry[1]?.directory
      ? latestEntry[1]?.directory[0].company
          .length > 15
        ? `${latestEntry[1]?.directory[0]?.company.slice(
            0,
            15
          )}...`
        : latestEntry[1]?.directory[0]?.company
      : latestEntry[1]?.categoryName
    : ''}
  <p className='mb-0'>
    {latestEntry.length != 0
      ? latestEntry[1]?.isCompanySelected &&
        latestEntry[1]?.directory
        ? latestEntry[1]?.directory[0]
            .shortDescription.length > 10
          ? `${latestEntry[1]?.directory[0].shortDescription.slice(
              0,
              10
            )}...`
          : latestEntry[1]?.directory[0]
              .shortDescription
        : ''
      : ''}
  </p>
</Link>
</div>
                        </div>
                      </div>
                      <div className='spacer-20' />
                      <Link
                        href={
                          latestEntry[1]?.isStatic
                            ? `${ARTICLE_STATIC_PATH + latestEntry[0]}`
                            : `${
                                latestEntry.length != 0
                                  ? ARTICLE_DINAMIC_PATH + latestEntry[0]
                                  : ARTICLE_DINAMIC_PATH + '#'
                              }`
                        }
                        target='_self'
                      >
                        <h2 className='homeEntryTitle text-black'>
                          {latestEntry.length != 0
                            ? latestEntry[1].title.length > 58
                              ? `${latestEntry[1].title.slice(0, 58)}...`
                              : latestEntry[1].title
                            : 'loading...'}
                        </h2>
                      </Link>
                      <p
                        style={{
                          overflowY: 'hidden',
                          maxHeight: 158,
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          openArticleLink(
                            latestEntry[1]?.isStatic
                              ? `${ARTICLE_STATIC_PATH + latestEntry[0]}`
                              : `${
                                  latestEntry.length != 0
                                    ? ARTICLE_DINAMIC_PATH + latestEntry[0]
                                    : ARTICLE_DINAMIC_PATH + '#'
                                }`
                          )
                        }
                      >
                        {latestEntry.length !== 0
                          ? latestEntry[1].seoExcerpt
                          : ''}
                      </p>
                      <Link
                        href={
                          latestEntry[1]?.isStatic
                            ? `${ARTICLE_STATIC_PATH + latestEntry[0]}`
                            : `${
                                latestEntry.length != 0
                                  ? ARTICLE_DINAMIC_PATH + latestEntry[0]
                                  : ARTICLE_DINAMIC_PATH + '#'
                              }`
                        }
                        target='_self'
                        className='text-secondary'
                      >
                        {t('show more')} <i className='fa fa-caret-down' />
                      </Link>
                      <ul className='thumb-list auto'>
                        <li>
                          <div className='count-description-pnl'>
                            <li
                              style={{
                                cursor: 'pointer',
                              }}
                              onClick={() =>
                                handleConnectModal(
                                  latestEntry[1]?.isStatic
                                    ? `${ARTICLE_STATIC_PATH + latestEntry[0]}`
                                    : `${
                                        latestEntry.length != 0
                                          ? ARTICLE_DINAMIC_PATH +
                                            latestEntry[0]
                                          : ARTICLE_DINAMIC_PATH + '#'
                                      }`
                                )
                              }
                            >
                              <span className='myanch'>
                                <Image
                                  src={'/images/like.svg'}
                                  width={25}
                                  height={25}
                                  alt='Icon Thumb'
                                  style={{ height: '22px', width: '22px' }}
                                />{' '}
                                {latestEntry.length != 0
                                  ? Number(latestEntry[1].likes)
                                  : 0}
                              </span>
                            </li>
                            <li
                              style={{
                                cursor: 'pointer',
                              }}
                              onClick={() =>
                                handleConnectModal(
                                  latestEntry[1]?.isStatic
                                    ? `${ARTICLE_STATIC_PATH + latestEntry[0]}`
                                    : `${
                                        latestEntry.length != 0
                                          ? ARTICLE_DINAMIC_PATH +
                                            latestEntry[0]
                                          : ARTICLE_DINAMIC_PATH + '#'
                                      }`
                                )
                              }
                            >
                              <p>
                                <Image src={iconmessage} alt='Icon Comment' />{' '}
                                {latestEntry.length != 0
                                  ? latestEntry[1]?.comment?.comments ?? 0
                                  : 0}{' '}
                                {t('Comments')}
                              </p>
                            </li>
                            <li>
                              <span className='myanch'>
                                <div className='viewbox kharab-wala-view-box'>
                                  <i className='fa fa-eye fill blue-icon fa-lg me-1' />
                                  {t('Views')} <span className='mx-1'>|</span>
                                  {formatLikesCount(
                                    parseInt(latestEntry[1]?.views)
                                  ) ?? 0}
                                </div>
                              </span>
                            </li>
                            <div className='quiz-c'>
                              <ul className='quiz-list'>
                                <li>
                                  <Image
                                    src={icpimage}
                                    alt='icpImage'
                                    style={{
                                      height: '32px',
                                      width: '32px ',
                                      maxWidth: '32px',
                                    }}
                                  />{' '}
                                  <span>+500 BlockZa</span>
                                </li>
                                <li>
                                  <Link
                                    href={QUIZ_ROUTE}
                               
                                  >
                                    {t('take quiz')}{' '}
                                    <i className='fa fa-angle-right' />
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className='d-flex justify-content-center'>
                    {' '}
                    <b>{t('No Article Found')}</b>
                  </div>
                )}
              </Col>
              <div className='full-div mobile-view-display bordery text-right'>
                <Link className='red-anchor' href={ALL_ARTICLES}>
                  View All Articles <i className='fa fa-angle-right' />
                </Link>
              </div>
              <Col
                xxl='3'
                xl='12'
                lg='12'
                md='12'
                sm='12'
                className='web-view-display'
              >
                <Row>
                  <Col xl='12' lg='12' className='heding'>
                    <div className='spacer-20' />
                    <Dropdown
                      onClick={() => setHideStoriespost((pre: any) => !pre)}
                    >
                      <Dropdown.Toggle
                        variant='success'
                        className='fill'
                        id='dropdown-basic'
                      >
                        {t('top stories')}{' '}
                        {HideStoriespost ? (
                          <i className='fa fa-angle-down' />
                        ) : (
                          <i className='fa fa-angle-right' />
                        )}
                      </Dropdown.Toggle>

                      {/* <Dropdown.Menu>
                        <Dropdown.Item href='#/action-1'>
                          Top Stories
                        </Dropdown.Item>
                        <Dropdown.Item href='#/action-2'>
                          Top Stories
                        </Dropdown.Item>
                      </Dropdown.Menu> */}
                    </Dropdown>
                    <div className='spacer-20' />
                  </Col>

                  <span
                    className={
                      HideStoriespost ? 'content show' : 'content hide'
                    }
                  >
                    <TrendingPressRelease isArticle={false} />
                  </span>
                </Row>
              </Col>
              <Col xl='12'>
                <div className='upcoming-post-container mobile-view-display w-100 pt-2 text-left'>
                  <TopEventsSlider />
                </div>
              </Col>
              <div className='full-div mobile-view-display  bordery text-right'>
                <Link className='red-anchor' href={EVENTS}>
                  {t('View more')} {t('Events')}{' '}
                  <i className='fa fa-angle-right' />
                </Link>
              </div>
            </Row>
          </div>

          <div className='section scroll-anime anime-down pmyb-0' id='news'>
            <Row>
              <EntryListNewHome
                categoryName={'Web3 '}
                categoryId={WEB3_CATEGORY_ID}
                connectModel={(e: any) => {
                  e.preventDefault();
                  handleConnectModal(
                    latestEntry[1]?.isStatic
                      ? `${ARTICLE_STATIC_PATH + latestEntry[0]}`
                      : `${
                          latestEntry.length != 0
                            ? ARTICLE_DINAMIC_PATH + latestEntry[0]
                            : ARTICLE_DINAMIC_PATH + '#'
                        }`
                  );
                }}
              />

              <div className='full-div mobile-view-display bordery text-right'>
                <Link className='red-anchor' href='#'>
                  {t('View All News')}
                  <i className='fa fa-angle-right' />
                </Link>
              </div>
            </Row>
          </div>
          <div className='spacer-20 web-view-display' />
          <div className='section scroll-anime icp-leadership-pnl pmt-0 hm'>
            <Row>
              <Col
                xxl='12'
                xl='12'
                lg='12'
                md='12'
                className='heding'
                id='event'
              >
                <div className='custome-flex-div'>
                  <div className='upcoming-post-container web-view-display'>
                    <TopEvents />
                  </div>
                  <div className='custome-slider-pnl heding'>
                    <Row>
                      <Col xl='9' lg='9' md='9' id='web3'>
                        <div className='flex-div align-items-center'>
                          <h2 style={{ textTransform: 'unset' }}>
                            {/* <Col xl='9' lg='9' md='9' sm='9' className='heding'>
                    <div className='flex-div-xs align-items-center heding'>
                      <h4> */}
                            <Image src={iconcompass} alt='Hot' /> Web 3
                            {t('Directory')}
                          </h2>
                          <Link href='/web3-directory' className='discover-btn'>
                            {t('View more')} <i className='fa fa-angle-right' />
                          </Link>
                        </div>
                      </Col>
                    </Row>
                    <div className='spacer-20' />
                    <div className='shadow-slider'>
                      {trendingDirectriesLoading ? (
                        <Spinner className='d-flex m-auto' animation='border' />
                      ) : (
                        <ProductSlider
                          trendingDirectries={trendingDirectries}
                        />
                      )}
                    </div>

                    <div className='spacer-20' />
                  </div>
                  <div className='leadership-cntnr ld-cntnr hom'>
                    <div className='heding'>
                      <h2>
                        <Image src={iconranking} alt='icon ranking' />{' '}
                        {t('Leaderboard')}
                      </h2>
                    </div>
                    <div className='lead-cnnt'>
                      <LeadershipboardNew />
                      <SurveyPost />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className='section scroll-anime anime-down pmyb-0' id='news'>
            <Row>
              <EntryListNewHome
                categoryName={'Crypto'}
                categoryId={CRYPTO_CATEGORY_ID}
                connectModel={(e: any) => {
                  e.preventDefault();
                  handleConnectModal(
                    latestEntry[1]?.isStatic
                      ? `${ARTICLE_STATIC_PATH + latestEntry[0]}`
                      : `${
                          latestEntry.length != 0
                            ? ARTICLE_DINAMIC_PATH + latestEntry[0]
                            : ARTICLE_DINAMIC_PATH + '#'
                        }`
                  );
                }}
              />

              <div className='full-div mobile-view-display bordery text-right'>
                <Link className='red-anchor' href='#'>
                  {t('View All News')}
                  <i className='fa fa-angle-right' />
                </Link>
              </div>
            </Row>
          </div>
          <div className='section scroll-anime anime-down pmyb-0' id='news'>
            <Row>
              <EntryListNewHome
                categoryName={'Blockchain News1'}
                categoryId={BLOCKCHAIN_CATEGORY_ID}
                connectModel={(e: any) => {
                  e.preventDefault();
                  handleConnectModal(
                    latestEntry[1]?.isStatic
                      ? `${ARTICLE_STATIC_PATH + latestEntry[0]}`
                      : `${
                          latestEntry.length != 0
                            ? ARTICLE_DINAMIC_PATH + latestEntry[0]
                            : ARTICLE_DINAMIC_PATH + '#'
                        }`
                  );
                }}
              />

              <div className='full-div mobile-view-display bordery text-right'>
                <Link className='red-anchor' href='#'>
                  {t('View All News')}
                  <i className='fa fa-angle-right' />
                </Link>
              </div>
            </Row>
          </div>
          {/* Podcast Panel */}
          <div className='section scroll-anime' id='podcast'>
            <Row>
              <Col xl='12' lg='12' md='12'>
                <div className='spacer-40 tab-view-none' />
              </Col>
              <Col xl='12' lg='12' md='12'>
                <div className='podcast-survey-container'>
                  <PodcastPost />
                  <SurveyPost />
                </div>
              </Col>
              <Col xl='12' lg='12' md='12'>
                <div className='spacer-50 tab-view-none' />
              </Col>
            </Row>
          </div>
          <div className='section scroll-anime anime-down pmyb-0' id='news'>
            <Row>
              <EntryListNewHome
                categoryName={'Defi'}
                categoryId={DEFI_CATEGORY_ID}
                connectModel={(e: any) => {
                  e.preventDefault();
                  handleConnectModal(
                    latestEntry[1]?.isStatic
                      ? `${ARTICLE_STATIC_PATH + latestEntry[0]}`
                      : `${
                          latestEntry.length != 0
                            ? ARTICLE_DINAMIC_PATH + latestEntry[0]
                            : ARTICLE_DINAMIC_PATH + '#'
                        }`
                  );
                }}
              />

              <div className='full-div mobile-view-display bordery text-right'>
                <Link className='red-anchor' href='#'>
                  {t('View All News')}
                  <i className='fa fa-angle-right' />
                </Link>
              </div>
            </Row>
          </div>
          <div className='section scroll-anime anime-down pmyb-0' id='news'>
            <Row>
              <EntryListNewHome
                categoryName={'Dao'}
                categoryId={DAO_CATEGORY_ID}
                connectModel={(e: any) => {
                  e.preventDefault();
                  handleConnectModal(
                    latestEntry[1]?.isStatic
                      ? `${ARTICLE_STATIC_PATH + latestEntry[0]}`
                      : `${
                          latestEntry.length != 0
                            ? ARTICLE_DINAMIC_PATH + latestEntry[0]
                            : ARTICLE_DINAMIC_PATH + '#'
                        }`
                  );
                }}
              />

              <div className='full-div mobile-view-display bordery text-right'>
                <Link className='red-anchor' href='#'>
                  {t('View All News')}
                  <i className='fa fa-angle-right' />
                </Link>
              </div>
            </Row>
          </div>
          <div className='section scroll-anime anime-down pmyb-0' id='news'>
            <Row>
              <EntryListNewHome
                categoryName={'NFT'}
                categoryId={NFT_CATEGORY_ID}
                connectModel={(e: any) => {
                  e.preventDefault();
                  handleConnectModal(
                    latestEntry[1]?.isStatic
                      ? `${ARTICLE_STATIC_PATH + latestEntry[0]}`
                      : `${
                          latestEntry.length != 0
                            ? ARTICLE_DINAMIC_PATH + latestEntry[0]
                            : ARTICLE_DINAMIC_PATH + '#'
                        }`
                  );
                }}
              />

              <div className='full-div mobile-view-display bordery text-right'>
                <Link className='red-anchor' href='#'>
                  {t('View All News')}
                  <i className='fa fa-angle-right' />
                </Link>
              </div>
            </Row>
          </div>
          <div className='section scroll-anime anime-down pmyb-0' id='news'>
            <Row>
              <EntryListNewHome
                categoryName={'Metaverse'}
                categoryId={METAVERCE_CATEGORY_ID}
                connectModel={(e: any) => {
                  e.preventDefault();
                  handleConnectModal(
                    latestEntry[1]?.isStatic
                      ? `${ARTICLE_STATIC_PATH + latestEntry[0]}`
                      : `${
                          latestEntry.length != 0
                            ? ARTICLE_DINAMIC_PATH + latestEntry[0]
                            : ARTICLE_DINAMIC_PATH + '#'
                        }`
                  );
                }}
              />

              <div className='full-div mobile-view-display bordery text-right'>
                <Link className='red-anchor' href='#'>
                  {t('View All News')}
                  <i className='fa fa-angle-right' />
                </Link>
              </div>
            </Row>
          </div>
          <div className='section scroll-anime anime-down pmyb-0' id='news'>
            <Row>
              <EntryListNewHome
                categoryName={'Blockchain Game'}
                categoryId={BLOCKCHAIN_GAMES_CATEGORY_ID}
                connectModel={(e: any) => {
                  e.preventDefault();
                  handleConnectModal(
                    latestEntry[1]?.isStatic
                      ? `${ARTICLE_STATIC_PATH + latestEntry[0]}`
                      : `${
                          latestEntry.length != 0
                            ? ARTICLE_DINAMIC_PATH + latestEntry[0]
                            : ARTICLE_DINAMIC_PATH + '#'
                        }`
                  );
                }}
              />

              <div className='full-div mobile-view-display bordery text-right'>
                <Link className='red-anchor' href='#'>
                  {t('View All News')}
                  <i className='fa fa-angle-right' />
                </Link>
              </div>
            </Row>
          </div>
          <div className='section scroll-anime anime-down pmyb-0' id='news'>
            <Row>
              <EntryListNewHome
                categoryName={'AI'}
                categoryId={AI_CATEGORY_ID}
                connectModel={(e: any) => {
                  e.preventDefault();
                  handleConnectModal(
                    latestEntry[1]?.isStatic
                      ? `${ARTICLE_STATIC_PATH + latestEntry[0]}`
                      : `${
                          latestEntry.length != 0
                            ? ARTICLE_DINAMIC_PATH + latestEntry[0]
                            : ARTICLE_DINAMIC_PATH + '#'
                        }`
                  );
                }}
              />

              <div className='full-div mobile-view-display bordery text-right'>
                <Link className='red-anchor' href='#'>
                  {t('View All News')}
                  <i className='fa fa-angle-right' />
                </Link>
              </div>
            </Row>
          </div>
          {/* Podcast Panel */}

          {/* Partners Site Panel */}
          <div className='section scroll-anime stories-container pb-4'>
            <Row>
              <Col xl='12' lg='12' md='12' sm='12' className='heding'>
                <h2 className='Webstories'>
                  <Image src={hot} alt='Hot' />
                  {t('Top Webstories')}
                </h2>
                <div className='spacer-10' />
              </Col>
              <WebstoriesSlider />
            </Row>
          </div>
        </div>
        {/* Partners Site Panel */}
      </main>
      <ConnectModal
        handleClose={handleConnectModalClose}
        showModal={showConnectModal}
        link={connectLink}
      />
    </>
  );
}
