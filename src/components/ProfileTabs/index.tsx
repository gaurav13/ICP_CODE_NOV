'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Tab, Nav } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import comment from '@/assets/Img/Icons/icon-writer.png';
import comment_JP from '@/assets/Img/Icons/icon-writer_JP.png';
import { useConnectPlugWalletStore } from '@/store/useStore';
import logger from '@/lib/logger';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import ExportPost from '@/components/ExportPost/ExportPost';
import ActivityTab from '@/components/ActivityTab';
import ExportPodcast from '@/components/ExportPodcast/ExportPodcast';
import { getImage, iframeimgThumbnail } from '@/components/utils/getImage';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import UserComments from '@/components/Comments/UserComments';
import UserFavouritePosts from '@/components/FavouritePost/FavouritePost';
import UserDirectories from '@/components/DirectoryItem/FavouriteDirectories';
import UserEntries from '@/components/FavouritePost/UserEntries';
import UserTakenQuiz from '@/components/QuizListComponent/UserTakenQuiz';
import UserTakenSurveyList from '@/components/ServayComponents/UserTakenSurveyList';

export default function ProfileTabs({
  userId,
  isOwner,
  isAdmin
}: {
  userId: any;
  isOwner: boolean;
  isAdmin: boolean;

}) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [userEntries, setUserEntries] = useState<any[]>([]);
  const [userPodcast, setUserPodcast] = useState<any[]>([]);
  const { t, changeLocale } = useLocalization(LANG);
  const articleTabName = t('Articles');
  const [activeTab, setActiveTab] = useState<any>(
    LANG == 'en' ? 'Articles' : '記事'
  );
  const activityTabName = t('activity');
  const PodcastTabName = t('Podcast');
  const commentsTabName = t('Comments');
  const favoriteTabName = t('Favorite Posts ');
  const favoriteDirecTabName = t('Favorite product Communities');
  const takenQuizTabName = t('Taken quiz');
  const takenSurveyTabName = t('Taken survey');


  const tabs = [
    activityTabName,
    articleTabName,
    PodcastTabName,
    commentsTabName,
    favoriteTabName,
    favoriteDirecTabName,
    takenQuizTabName,
    takenSurveyTabName
  ];
  const [isLoading, setIsLoading] = useState(false);
  const handleClose = () => {};
  const divRef = useRef<HTMLDivElement | null>(null);
  const { auth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    identity: state.identity,
  }));

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (divRef.current) {
      e.preventDefault();
      setIsDragging(true);
      setStartX(e.pageX - divRef.current.offsetLeft);
      setScrollLeft(divRef.current.scrollLeft);
    }
  };
  const handleTabChange = (tab: string | null) => {
    setActiveTab(tab);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      e.preventDefault();
      const x = e.pageX - divRef.current!.offsetLeft;
      const walk = (x - startX) * 2; // You can adjust the scrolling speed
      divRef.current!.scrollLeft = scrollLeft - walk;
    }
  };

  const scrollForward = () => {
    if (divRef.current) {
      const scrollAmount = 200; // You can adjust this value
      const maxScroll = divRef.current.scrollWidth - divRef.current.clientWidth;

      // Calculate the new scroll position
      const newScroll = scrollPosition + scrollAmount;

      if (newScroll >= maxScroll) {
        // If we reach the end, reset the scroll position
        setScrollPosition(-100);
      } else {
        setScrollPosition(newScroll);
      }

      // Set the new scroll position
      divRef.current.scrollLeft = newScroll;
    }
  };
  const backword = () => {
    if (divRef.current) {
      const scrollAmount = -200; // You can adjust this value
      const maxScroll = divRef.current.clientWidth - divRef.current.scrollWidth;

      // Calculate the new scroll position
      const newScroll = scrollAmount - scrollPosition;

      if (newScroll <= maxScroll) {
        // If we reach the end, reset the scroll position
        setScrollPosition(100);
      } else {
        setScrollPosition(newScroll);
      }

      // Set the new scroll position
      divRef.current.scrollLeft = newScroll;
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  // router.push('/route')

  useEffect(() => {
    if (isOwner) {
      setActiveTab(activityTabName);
    }
  }, [isOwner]);

  return (
    <>
      <Tab.Container
        id='left-tabs-example'
        defaultActiveKey={'Articles'}
        onSelect={handleTabChange}
        activeKey={activeTab}
      >
        <Row>
          <Col sm={12} className='d-flex'>
            <ul className='tabs-list filter'>
              <li>
                <Link
                  href={'#'}
                  onClick={(e) => {
                    e.preventDefault();
                    backword();
                  }}
                  className='arrow-link'
                >
                  <i className='fa fa-angle-left' />
                </Link>
              </li>
            </ul>
            <Nav
              variant='tabs'
              className='tabs-fill scrollable-tabs'
              ref={divRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              {tabs.map((tab, index) => {
                if (tab === activityTabName) {
                  return isOwner ? (
                    <Nav.Item key={index}>
                      <Nav.Link style={{ whiteSpace: 'nowrap' }} eventKey={tab}>
                        {tab}
                      </Nav.Link>
                    </Nav.Item>
                  ) : null;
                } else if (tab === commentsTabName) {
                  return (userId && isAdmin) || !userId?
                  ( <Nav.Item key={index}>
                     <Nav.Link style={{ whiteSpace: 'nowrap' }} eventKey={tab}>
                       {tab}
                     </Nav.Link>
                   </Nav.Item>):null
                } else if (tab === favoriteTabName) {
                  return (userId && isAdmin) || !userId?
                  ( <Nav.Item key={index}>
                     <Nav.Link style={{ whiteSpace: 'nowrap' }} eventKey={tab}>
                       {tab}
                     </Nav.Link>
                   </Nav.Item>):null
                } else if (tab === favoriteDirecTabName) {
                  return (userId && isAdmin) || !userId?
                  ( <Nav.Item key={index}>
                     <Nav.Link style={{ whiteSpace: 'nowrap' }} eventKey={tab}>
                       {tab}
                     </Nav.Link>
                   </Nav.Item>):null
                } else if (tab === takenQuizTabName ) {
                  return (userId && isAdmin) || !userId?
                   ( <Nav.Item key={index}>
                      <Nav.Link style={{ whiteSpace: 'nowrap' }} eventKey={tab}>
                        {tab}
                      </Nav.Link>
                    </Nav.Item>):null
                 
                } else if (tab === takenSurveyTabName) {
                  return (userId && isAdmin) || !userId?
                  ( <Nav.Item key={index}>
                     <Nav.Link style={{ whiteSpace: 'nowrap' }} eventKey={tab}>
                       {tab}
                     </Nav.Link>
                   </Nav.Item>):null
                
                } else {
                  return (
                    <Nav.Item key={index}>
                      <Nav.Link style={{ whiteSpace: 'nowrap' }} eventKey={tab}>
                        {tab}
                      </Nav.Link>
                    </Nav.Item>
                  );
                }
              })}
              {/* {categories &&
                categories?.map((cate, index) => {
                  return (
                    <Nav.Item key={index}>
                      <Nav.Link eventKey={cate}>{cate}</Nav.Link>
                    </Nav.Item>
                  );
                })} */}

              {/* <Nav.Item>
                <Nav.Link eventKey='second'>Tab 2</Nav.Link>
              </Nav.Item> */}
            </Nav>
            <ul className='tabs-list filter'>
              <li>
                <Link
                  href={'#'}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollForward();
                  }}
                  className='arrow-link'
                >
                  <i className='fa fa-angle-right' />
                </Link>
              </li>
            </ul>
            {/* <ul className='tabs-list filter'>
              <li>
                <Link
                  href={'#'}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollForward();
                  }}
                  className='arrow-link'
                >
                  <i className='fa fa-angle-right'/>
                </Link>
              </li>
              <li>
                <Dropdown>
                  <Dropdown.Toggle id='dropdown-basic'>
                    <Image src={iconfilter} alt='Icon Filter' /> Filter
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href='#/action-1'>Action</Dropdown.Item>
                    <Dropdown.Item href='#/action-2'>
                      Another action
                    </Dropdown.Item>
                    <Dropdown.Item href='#/action-3'>
                      Something else
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            </ul> */}
          </Col>
          <Col sm={12}>
            <Tab.Content>
              {tabs.map((c, i) => {
                if (c == activityTabName) {
                  return isOwner ? (
                    <Tab.Pane key={i} eventKey={c}>
                      <div>
                        <ActivityTab />
                      </div>
                    </Tab.Pane>
                  ) : null;
                } else if (c == PodcastTabName) {
                  return (
                    <Tab.Pane key={i} eventKey={c}>
                      <div>
                        {c !== PodcastTabName ? (
                          <div className='profile-comment-pnl'>
                            {LANG === 'en' ? (
                              <Image src={comment} alt='comment' />
                            ) : (
                              <Image
                                src={comment_JP}
                                alt={t('comments')}
                                style={{ opacity: 0.4 }}
                              />
                            )}
                          </div>
                        ) : (
                          <div className='profile-articles mt-3'>
                            <UserEntries userId={userId} onlyPodcast={true} />
                          </div>
                        )}
                      </div>
                    </Tab.Pane>
                  );
                } else if (c === commentsTabName) {
                  return (
                    <Tab.Pane key={i} eventKey={c}>
                      <div>
                        <div className=''>
                          <UserComments userId={userId}/>
                        </div>
                      </div>
                    </Tab.Pane>
                  );
                } else if (c === favoriteTabName) {
                  return (
                    <Tab.Pane key={i} eventKey={c}>
                      <div>
                        <div className='profile-articles mt-3'>
                          <UserFavouritePosts userId={userId}/>
                        </div>
                      </div>
                    </Tab.Pane>
                  );
                } else if (c === favoriteDirecTabName) {
                  return (
                    <Tab.Pane key={i} eventKey={c}>
                      <div>
                        <div className='profile-articles mt-3'>
                          <UserDirectories userId={userId}/>
                        </div>
                      </div>
                    </Tab.Pane>
                  );
                }  else if (c === takenQuizTabName) {
                  return (
                    <Tab.Pane key={i} eventKey={c}>
                      <div>
                        <div className='profile-articles mt-3'>
                          <UserTakenQuiz userId={userId} />
                        </div>
                      </div>
                    </Tab.Pane>
                  );
                } else if (c === takenSurveyTabName ) {
                  return (
                    <Tab.Pane key={i} eventKey={c}>
                      <div>
                        <div className='profile-articles mt-3'>
                          <UserTakenSurveyList userId={userId} />
                        </div>
                      </div>
                    </Tab.Pane>
                  );
                } else {
                  return (
                    <Tab.Pane key={i} eventKey={c}>
                      <div>
                        <div className='profile-articles mt-3'>
                          <UserEntries userId={userId} onlyPodcast={false} />
                        </div>
                      </div>
                    </Tab.Pane>
                  );
                }
              })}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
}
