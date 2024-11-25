'use client';
import React, { useEffect, useState } from 'react';
import { Row, Col, Breadcrumb, Dropdown, Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import talwaar from '@/assets/Img/Icons/talwaar.png';
import iconthumb from '@/assets/Img/Icons/icon-thumb.png';
import bard from '@/assets/Img/Icons/bard.png';
import tag from '@/assets/Img/Icons/tag.png';
import usericon from '@/assets/Img/Icons/icon-woman.png';
import bg from '@/assets/Img/Icons/bg.png';
import verifyicon from '@/assets/Img/Icons/verify-1.png';
import unverifyicon from '@/assets/Img/Icons/verify.png';
import calender from '@/assets/Img/Icons/icon-calender.png';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { User } from '@/types/profile';
import { getImage } from '@/components/utils/getImage';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import CompanySlider from '@/components/CompanySlider/CompanySlider';
import { toast } from 'react-toastify';
import DirectorySliderv2 from '@/components/DirectorySlider/DirectorySliderv2';
import { fromNullable } from '@dfinity/utils';
import { EntryTypes, profileAspect } from '@/constant/sizes';
import CompanyListSidebar from '@/components/companyListSidebar/CompanyListSidebar';
import {
  formatLikesCount,
  isUserConnected,
  utcToLocal,
} from '@/components/utils/utcToLocal';
import { Principal } from '@dfinity/principal';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import ConnectModal from '@/components/Modal';
import Tippy from '@tippyjs/react';
import { ConnectPlugWalletSlice } from '@/types/store';
import parse from 'html-react-parser';
import { ADD_WEB3, AI_CATEGORY_ID, CONTACT_US, DIRECTORY_DYNAMIC_PATH_2, DIRECTORY_STATIC_PATH } from '@/constant/routes';
import EntryListNewHome from '@/components/EntryListNewHome/EntryListNewHome';
import TopEventsSlider from '@/components/EntryListNewHome/EventSliderHome';
import EntriesSlider from '@/components/ArticlesList/ArticleSlider';
import EventSlider from '@/components/EventSlider/EventSlider';
import { TopEvent } from '@/types/article';
import MarketSentimentChart  from '@/components/MediaGraph/LineChart';
import NewsComponent  from '@/components/googlenews/news';
import LinkndindataComponent  from '@/components/linkendindata/linkndindata';
import DirectoryModelPopup from '@/components/DirectoryModelPopup/DirectoryModelPopup';
export default function Web3DirectoryDetail({
  directoryId,
}: {
  directoryId: string;
}) {
  const { t, changeLocale } = useLocalization(LANG);
  const [directory, setDirectory] = useState<any>([]);
  const [relatedDirectory, setRelatedDirectory] = useState<any>([]);
  let [isliked, setIsLiked] = useState(false);
  const [hideMyContent, setHideMyContent] = useState(true);
  let [likeCount, setLikeCount] = useState(0);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const router = useRouter();
  const [showWeb3Model, setShowWeb3Model] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = usePathname();
  const [topEvents, setTopEvents] = useState<null | TopEvent[]>();
  const [showContactModal, setShowContactModal] = useState(false);

  const handleShowContactModal = () => setShowContactModal(true);
  const handleCloseContactModal = () => setShowContactModal(false);
  const { auth, setAuth, identity, userAuth } = useConnectPlugWalletStore(
    (state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      userAuth: (state as ConnectPlugWalletSlice).userAuth,
    })
  );
  let copyDirectoryLink = (e: any) => {
    e.preventDefault();
    if (directoryId) {
      let directoryLink = window.location.href;
      window.navigator.clipboard.writeText(directoryLink);
      toast.success(t('Copied successfully.'));
    } else {
      toast.error('Directory Id not found.');
    }
  };

  const handleConnectModal = () => {
    setShowConnectModal(true);
  };
  const handleConnectModalClose = () => {
    setShowConnectModal(false);
  };
  const likeDirectory = async () => {
    if (!isUserConnected(auth, handleConnectModal)) return;
    if (!isliked) {
      setLikeCount((pre) => pre + 1);
      setIsLiked(true);
    } else {
      setLikeCount((pre) => pre - 1);
      setIsLiked(false);
    }

    return new Promise(async (resolve, reject) => {
      if (directory.length == 0 || !directory[0].user.toString())
        reject('NO directory or user ID provided');
      const entryActor = makeEntryActor({
        agentOptions: {
          identity,
        },
      });

      entryActor
        .likeWeb3(directoryId, userCanisterId, commentCanisterId)
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

  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  let getWeb3 = async () => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    if (directoryId) {
      setIsLoading(true);
      let TempDirectory: null | any = null;
      let tempWeb3;
      if (userAuth?.userPerms?.articleManagement) {
        tempWeb3 = await entryActor.getWeb3_for_admin(
          directoryId,
          userCanisterId
        );
        getdirectoryfn(tempWeb3);
      } else {
        tempWeb3 = await entryActor.getWeb3(directoryId);
        getdirectoryfn(tempWeb3);
      }

      if (tempWeb3.length != 0) {
        if (
          DIRECTORY_DYNAMIC_PATH_2.startsWith(location) &&
          tempWeb3[0] &&
          tempWeb3[0].isStatic
        ) {
          return router.push(DIRECTORY_STATIC_PATH + directoryId+"/");
        }
        let resp = await entryActor.get_category(tempWeb3[0].catagory);
        let category: any = fromNullable(resp);
        let categoryName = 'No Category';
        if (category) {
          categoryName = category.name;
        }
        tempWeb3[0].catagoryId = tempWeb3[0].catagory;
        tempWeb3[0].catagoryName = categoryName;
        tempWeb3[0].companyBanner = await getImage(tempWeb3[0].companyBanner);
        tempWeb3[0].founderImage = await getImage(tempWeb3[0].founderImage);
        tempWeb3[0].companyLogo = await getImage(tempWeb3[0].companyLogo);

        TempDirectory = tempWeb3;
      }
      if (TempDirectory) {
        if (identity && identity._principal) {
          let liked = TempDirectory[0].likedUsers.some((u: Principal) => {
            let me = identity?._principal.toString();
            let you = u.toString();
            logger({ me, you }, 'tempWeb334');

            return you == me;
          });

          if (liked) {
            setIsLiked(true);
          }
        }
        setLikeCount(Number(TempDirectory[0].likes));
        getRelatedWeb3(TempDirectory[0].catagoryId);
        setDirectory(TempDirectory);
        setIsLoading(false);
      }
      // const promted = await entryActor.getPromotedEntries();
      // logger(promted, 'PROMTED ENTRIES');
    }
  };
  let getdirectoryfn = async (tempWeb3: any) => {
    if (!tempWeb3) return;
    let TempDirectory: null | any = null;
    if (tempWeb3.length != 0) {
      let resp = await entryActor.get_category(tempWeb3[0].catagory);
      let category: any = fromNullable(resp);
      let categoryName = 'No Category';
      if (category) {
        categoryName = category.name;
      }
      tempWeb3[0].catagoryId = tempWeb3[0].catagory;
      tempWeb3[0].catagoryName = categoryName;
      tempWeb3[0].companyBanner = await getImage(tempWeb3[0].companyBanner);
      tempWeb3[0].founderImage = await getImage(tempWeb3[0].founderImage);
      tempWeb3[0].companyLogo = await getImage(tempWeb3[0].companyLogo);
      TempDirectory = tempWeb3;
    }
    if (TempDirectory) {
      if (identity && identity._principal) {
        let liked = TempDirectory[0].likedUsers.some((u: Principal) => {
          let me = identity?._principal.toString();
          let you = u.toString();
          logger({ me, you }, 'tempWeb334');

          return you == me;
        });

        if (liked) {
          setIsLiked(true);
        }
      }
      setLikeCount(Number(TempDirectory[0].likes));
      getRelatedWeb3(TempDirectory[0].catagoryId);
      setDirectory(TempDirectory);
    }
  };

  let getRelatedWeb3 = async (catagory: string) => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    let TempDirectory = null;
    let tempWeb3 = await entryActor.getWeb3ListOfAllUsers(catagory, '', 0, 8);

    if (tempWeb3?.web3List?.length != 0) {
      let web3array = tempWeb3.web3List.filter(
        (e: string) => e[0] != directoryId
      );

      for (let dirc = 0; dirc < web3array.length; dirc++) {
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
      TempDirectory = web3array;
    }
    if (TempDirectory) {
      setRelatedDirectory(TempDirectory);
    }
    // const promted = await entryActor.getPromotedEntries();
    // logger(promted, 'PROMTED ENTRIES');
  };
  useEffect(() => {
    getWeb3();
  }, [directoryId]);
/**
 * getEvents use to get events created on web3 directory
 * @param directoryId 
 */
  async function getEvents(directoryId: string) {
    let searched =  '';
    let tags = "";

    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const resp = await entryActor.getEventsOfWeb3(searched, 0, 6, [], [], [],tags,directoryId);
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
      if (refinedEvents.length > 6) {
        setTopEvents(refinedEvents.slice(0, 6));
      } else {
        setTopEvents(refinedEvents);
      }
      setTopEvents(refinedEvents);
    } else {
      setTopEvents(null);
    }
    setIsLoading(false);
  }
  // router.push('/route')
  let addViewfn = async () => {
    if (directoryId) {
      const entryActor = makeEntryActor({
        agentOptions: {
          identity,
        },
      });
      let isadded = await entryActor.addWeb3View(directoryId);
    }
  };
  useEffect(() => {
    addViewfn();
   if(directoryId) getEvents(directoryId)
  }, [directoryId]);
  useEffect(() => {
    if (location.startsWith(DIRECTORY_STATIC_PATH) && !location.endsWith('/')) {
     router.push(`${DIRECTORY_STATIC_PATH + directoryId}/`);
   }
   
     }, [])
  return (
    <>
       <style jsx>{`
        .market-sentiment-chart:empty + .news-column {
          flex: 0 0 100%;
          max-width: 100%; /* Make it take full width */
        }
        .market-sentiment-chart:empty {
          display: none; /* Hide the first column if empty */
        }
        .news-column {
          transition: all 0.3s ease; /* Optional: Add a smooth transition effect */
        }
          /* Reduce the size of icons in the specific list */
        .small-icons i {
          font-size: 20px; /* Adjust the size as per your requirement */
          line-height: 1;
          width: auto; /* Ensure the icon's width adapts */
          height: auto;
        }

        /* Optional: Add spacing between icons for better visibility */
        .small-icons li {
          margin-right: 10px; /* Adjust spacing as needed */
        }

          @media (max-width: 576px) {
        .left-side-pnl{display:none}
        }
      `}</style>
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
        <div className='main-inner web-page directory-details'>
          <div className='inner-content'>
            <Row>
              <Col xl='12' lg='12' md='12'>
                <Breadcrumb className='new-breadcrumb web'>
                  <Breadcrumb.Item>
                    <Link href='/'>
                      <i className='fa fa-home' />
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link href={`/web3-directory`}>{t('Web3 Directory')}</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item href='#'>
                    {directory.length != 0 ? (
                      <Tippy content={directory[0]?.catagoryName}>
                        <Link
                          href={`/web3-directory?category=${directory[0]?.catagoryId}`}
                        >
                          {directory[0]?.catagoryName}
                        </Link>
                      </Tippy>
                    ) : (
                      <></>
                    )}
                  </Breadcrumb.Item>
                  <Breadcrumb.Item href='#'>
                    {directory.length != 0 ? (
                      <Link
                        href={`/category-detail?category=${directory[0]?.company}`}
                        style={{
                          pointerEvents: 'none',
                        }}
                      >
                        {directory[0]?.company}
                      </Link>
                    ) : (
                      <></>
                    )}
                  </Breadcrumb.Item>
                </Breadcrumb>
                {/* <nav aria-label="breadcrumb" class="new-breadcrumb web"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="#" role="button" tabindex="0"><a href="/">HOME </a></a></li><li class="breadcrumb-item active" aria-current="page"><a href="/category-detail?category=undefined" style="pointer-events: none;">Web3 Directory</a></li></ol></nav> */}
              </Col>
              {isLoading ? (
                <div className='tets d-flex justify-content-center my-3'><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{ width: '300px' }}>
                
                </div>
              </div>
                  <Spinner />
                </div>
              ) : (
                <Col xl='12' lg='12'>
                  <Row>
                    <Col xxl='6' xl='7' lg='12'>
                      <div>
                        <div className='top-us-pnl'>
                          <div className='img-pnl'>
                            <Image
                              src={
                                directory.length != 0
                                  ? directory[0]?.companyLogo
                                  : usericon
                              }
                              alt='founder image'
                              height={50}
                              width={50}
                            />
                          </div>
                          <div className='txt-pnl'>
                            <h1 style={{ fontSize: '18px', fontWeight: 600 }}>
                              {directory.length != 0
                                ? directory[0].company
                                : ''}
                            </h1>
                            
                          </div>
                        </div>
                        <ul className='inline-list'>
                          <li>
                            <a
                              href='#'
                              className='mr-3'
                              onClick={(e) => {
                                e.preventDefault();
                                likeDirectory();
                              }}
                            >
                              <Image
                                src={`${
                                  isliked
                                    ? '/images/liked.svg'
                                    : '/images/like.svg'
                                }`}
                                width={30}
                                height={25}
                                alt='Icon Thumb'
                              />{' '}
                              {formatLikesCount(likeCount)}
                            </a>
                          </li>
                          <li>
                            <p className=''>
                              <div className='viewbox'>
                                <i className='fa fa-eye fill blue-icon fa-lg me-1' />
                                {t('Views')} <span className='mx-1'>|</span>
                                {directory[0]
                                  ? formatLikesCount(
                                      parseInt(directory[0]?.views)
                                    )
                                  : 0}
                              </div>
                            </p>
                          </li>
                          <li>
                            <a
                              className='reg-btn blue-btn small'
                              href='#'
                              onClick={copyDirectoryLink}
                            >
                              <i className='fa fa-share-alt' /> {t('Share')}
                            </a>
                          </li>
                          {directory.length != 0 && (
                            <li>
                              <a
                                className='reg-btn yellow small d-flex justify-content-center align-items-center dark'
                                href='#'
                              >
                                {Object.keys(directory[0].status).toString() ==
                                'un_verfied' ? (
                                  // <i className='fa fa-circle-xmark me-2 fs-5'/>
                                  <div
                                    style={{
                                      aspectRatio: profileAspect,
                                      position: 'relative',
                                      height: '20px',
                                    }}
                                    className='me-2'
                                  >
                                    <Image
                                      src={unverifyicon}
                                      alt='founder image'
                                      fill
                                      style={{ height: '100%', width: '100%' }}
                                    />
                                  </div>
                                ) : (
                                  // <i className='fa fa-circle-check fs-5 me-2'/>
                                  <div
                                    style={{
                                      aspectRatio: profileAspect,
                                      position: 'relative',
                                      height: '20px',
                                    }}
                                    className='me-2'
                                  >
                                    <Image
                                      src={verifyicon}
                                      alt='founder image'
                                      fill
                                      style={{ height: '100%', width: '100%' }}
                                    />{' '}
                                  </div>
                                )}
                                {Object.keys(directory[0].status).toString() ==
                                'un_verfied'
                                  ? t('Unverified')
                                  : t('Verified')}
                              </a>
                            </li>
                          )}
                        </ul>
                        <p>
                          {directory.length != 0
                            ? directory[0].shortDescription
                            : ''}
                        </p>
                        {/* <p>
                        Blockchain.com (formerly Blockchain.info) is a
                        cryptocurrency financial services company. The company
                        began as the first Bitcoin blockchain explorer in 2011
                        and later created a cryptocurrency wallet that accounted
                        for 28% of bitcoin transactions between 2012 and 2020.
                      </p>
                      <p>
                        It also operates a cryptocurrency exchange and provides
                        institutional markets lending business and data, charts,
                        and analytics.
                      </p> */}
                        <ul className='post-social-list-2 small-icons d-flex flex-wrap'>
                          {directory.length != 0 ? (
                            directory[0].twitter[0].length != 0 ? (
                              <li>
                                <Link href={directory[0].twitter[0]}>
                                  <i className='fa fa-twitter' />
                                </Link>
                              </li>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )}
                          {directory.length != 0 ? (
                            directory[0].telegram[0].length != 0 ? (
                              <li>
                                <Link href={directory[0].telegram[0]}>
                                  <i className='fa fa-telegram' />
                                </Link>
                              </li>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )}
                          
                          {directory.length != 0 ? (
                            directory[0].instagram[0].length != 0 ? (
                              <li>
                                <Link href={directory[0].instagram[0]}>
                                  <i className='fa fa-youtube' />
                                </Link>
                              </li>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )}
                          {directory.length != 0 ? (
                            directory[0].facebook[0].length != 0 ? (
                              <li>
                                <Link href={directory[0].facebook[0]}>
                                  <i className='fa fa-facebook' />
                                </Link>
                              </li>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )}
                          {directory.length != 0 ? (
                            directory[0].linkedin[0].length != 0 ? (
                              <li>
                                <Link href={directory[0].linkedin[0]}>
                                  <i className='fa fa-linkedin' />
                                </Link>
                              </li>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )}
                              {directory.length != 0 ? (
                            directory[0].companyUrl[0].length != 0 ? (
                              <li>
                                <Link href={directory[0].companyUrl[0]}>
                                  <i className='fa fa-globe' />
                                </Link>
                              </li>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )}
                           
                        </ul>
                        <ul className='directoryBtn'>
                          {directory.length != 0 ? (
                            directory[0].companyUrl[0].length != 0 ? (
                              <>
                              
                              <li>
                                  <Link
              href="#"
              className="reg-btn small yellow dark"
              onClick={(e) => {
                e.preventDefault();
                handleShowContactModal();
              }}
            >
               {t('Contact')}{' '}
            </Link>
            <DirectoryModelPopup show={showContactModal} handleClose={handleCloseContactModal}  companyName={directory[0]?.company} />


                          
                              </li>
                              </>
                            ) : (
                              ''
                            )
                          ) : (
                            ''
                          )}
                          
                        </ul>
                      </div>
                      {/* <div>
            
                                <Link
                                  className='reg-btn small yellow dark'
                               href={CONTACT_US}
                                >
                                  {t('Contact Us')}{' '}
                                </Link>
                          
                      </div> */}
                    </Col>
                    <Col xxl='4' xl='5' lg='6' md='8'>
                            <div className='img-box-pnl'>
          {isLoading ? (
            <Spinner animation='border' />
          ) : (
            directory.length > 0 &&
            directory[0]?.companyBanner && (
              <Image
                src={directory[0].companyBanner}
                alt='company banner'
                height={100}
                width={100}
                style={{ height: '100%', width: '100%' }}
              />
            )
          )}
        </div>

                      {/* <Image src={bg} alt='Infinity' /> */}
                    </Col>
                    <Col xl='12'>
                      <div className='spacer-40' />
                    </Col>
                  </Row>
                </Col>
              )}
              <Col xxl='12' xl='12' lg='12'>
                <div className='flex-details-pnl'>
                  <div className='left-side-pnl'>
                    <div
                      style={{
                        position: 'sticky',
                        top: '0',
                        minHeight: '256px',
                      }}
                    >
                      <ul className='faq-btn-list'>
                        <li>
                          <Link href={CONTACT_US} className='reg-btn faq-btn'>
                            {t('FAQ')}
                          </Link>
                        </li>
                        <li>
                          <Dropdown
                            onClick={() => setHideMyContent((pre: any) => !pre)}
                          >
                            <Dropdown.Toggle
                              variant='success'
                              className='fill'
                              id='dropdown-basic'
                            >
                              {t('All Company')}{' '}
                              {hideMyContent ? (
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
                        </li>
                      </ul>
                      <ul
                        className='tab-blue-list'
                        style={{ display: hideMyContent ? 'block' : 'none' }}
                      >
                        <li>
                          <Link className='active' href='/web3-directory'>
                            <i className='fa fa-angle-right' />{' '}
                            {t('Search for People')}
                          </Link>
                        </li>
                        <li>
                          <Link href='/web3-directory'>
                            <i className='fa fa-angle-right' />{' '}
                            {t('Search for Company')}
                          </Link>
                        </li>
                      </ul>
                      <Link
                        // onClick={(e: any) => addcompanyfn(e)}
                        href={ADD_WEB3}
                        style={{
                          display: hideMyContent ? 'inline-block' : 'none',
                        }}
                        className='reg-btn trans'
                      >
                        {t('Submit your Listing')}
                      </Link>
                    </div>
                  </div>
                  {!isLoading && (
                    <div className='right-detail-pnl pr'>
                                      
                      <h3>
                        <Image src={bard} alt='Bard' /> {t('Company Detail')}
                      </h3>
                      <div className='spacer-20' />
                      <div>
                        <p>
                          {' '}
                          {directory.length != 0
                            ? parse(directory[0].companyDetail ?? '')
                            : ''}
                        </p>
                        <div className="container">
                                       <div className="row">
         <div className="col-md-6 market-sentiment-chart">
        <MarketSentimentChart />
        </div>
        <div className="col-md-6 news-column mt-3">
        <NewsComponent />
        </div>
                 </div>
      
         </div>
                      </div>
                      <div className='full-div'>
                      <h3 className='mt-3'>
                        {LANG === 'jp' ? 'チーム' : 'Team'}
                      </h3>

                        <div className='shadow-txt-pnl mt-1'>
                        <div>
  <p>
    <i>
      {directory.length !== 0 ? directory[0].founderDetail : ''}
    </i>
  </p>
</div>

                          <div className='d-flex'>
                            <div className='img-pnl radius'>
                              {/* <Image src={usericon} alt='Infinity' /> */}
                              <Image
                                src={
                                  directory.length != 0
                                    ? directory[0]?.founderImage
                                    : usericon
                                }
                                alt='founder image'
                                height={50}
                                width={50}
                              />
                            </div>
                            <div className='txt-pnl mx-2'>
                              <h6 className='m-0'>
                                <b>
                                  {directory.length != 0
                                    ? directory[0].founderName
                                    : ''}
                                </b>
                              </h6>
                              <p className='m-0'>{t('Founder')}</p>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                      <div className="row">
                      <div className="col-md-12">
                      <LinkndindataComponent />
                        </div>
                        </div> 
                      
{directory[0]?.discord[0] =="yes" && <><div className='mt-5'>
  <EntriesSlider contentType={EntryTypes.PressRelease} web3Id={directoryId} directoryName={directory[0]?.company}/>
</div>
<div className='mt-5'>
  <EntriesSlider contentType={EntryTypes.articles} web3Id={directoryId} directoryName={directory[0]?.company}/>
</div>
<div className='mt-5'>
  <EntriesSlider contentType={EntryTypes.Podcast} web3Id={directoryId} directoryName={directory[0]?.company}/>
</div>
<div className='mt-5'>
<h3 className='my-4'>
                          <Image src={calender} alt='Infinity' />
                          {t('Similar Events of')} {" "}
                          {directory.length != 0 ? directory[0]?.company : ''}
                        </h3>
<EventSlider eventList={topEvents} />
</div></>}
                      <div className='slide-cntnr'>
                        <h3>
                          <Image src={talwaar} alt='Infinity' />
                          {t('Similar Companies of')} {" "}
                          {directory.length != 0 ? directory[0]?.catagoryName : ''}
                        </h3>
                        <div className='slid-bg'>
                          <DirectorySliderv2
                            relatedDirectory={relatedDirectory}
                            isDirectory={true}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className='spacer-40' />
              </Col>

              {!isLoading && (
                <Col xxl='12' xl='12' lg='12' md='12'>
                  <div className='flex-details-pnl'>
                    <div className='left-side-pnl' />
                    <div className='right-detail-pnl pr'>
                      <Row>
                        <Col xxl='5' xl='6' lg='12' md='12'>
                          <h3>
                            <Image src={tag} alt='Bard' /> {t('Trending')}{' '}
                            {t('companies')}
                          </h3>
                          <div className='spacer-10' />

                          <CompanyListSidebar />
                          <Link className='grey-link' href='/web3-directory'>
                            {t('View more')} {t('Suggestion')}{' '}
                            <i className='fa fa-long-arrow-right' />
                          </Link>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </div>
      </main>

      <ConnectModal
        handleClose={handleConnectModalClose}
        showModal={showConnectModal}
      />
    </>
  );
}
