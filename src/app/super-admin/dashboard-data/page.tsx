'use client';
import React, { useState, useEffect } from 'react';
import { makeUserActor, makeEntryActor } from '@/dfx/service/actor-locator';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { usePathname, useRouter } from 'next/navigation';
import logger from '@/lib/logger';
import { Doughnut } from 'react-chartjs-2';
import { Row, Col, Button, Modal, Spinner } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
  getEntriesCount,
  getEventsCount,
  getQuizCount,
  getSurveyCount,
  getUsersCount,
  getWeb3Count,
  getpromtedCount,
} from '@/components/utils/getEntries';
import EmptyGraph from '@/components/Grapgh/EmptyGraph';

const page = () => {
  const router = useRouter();
  const [usersCount, setUsersCount] = useState<any>(null);
  const [articleCount, setArticleCount] = useState<any>(null);
  const [web3Count, setWeb3Count] = useState<any>(null);
  const [eventsCount, setEventsCount] = useState<any>(null);
  const [quizCount, setQuizCount] = useState<any>(null);
  const [surveyCount, setSurveyCount] = useState<any>(null);
  const [promoteCount, setPromoteCount] = useState<any>(null);

  // =======S T A T E S=======
  const [promteData, setPromteData] = useState({
    labels: ['Promoted Articles'],
    datasets: [
      {
        data: [0],
        backgroundColor: ['#92E33A'],
      },
    ],
  });

  const [ChartData, setChartData] = useState({
    labels: [
      'Verified Users',
      'Unverified Users',
      'Blocked Users',
      'Unblocked Users',
    ],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#92E33A', '#348BFB', '#FFE544', '#FFAA7A'],
      },
    ],
  });

  const [articleData, setArticleData] = useState({
    labels: ['Approved', 'Reject', 'Pending', 'Drafts'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#92E33A', '#348BFB', '#FFE544', '#FFAA7A'],
      },
    ],
  });

  const [podcastData, setPodcastData] = useState({
    labels: ['Approved', 'Reject', 'Pending', 'Drafts'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#92E33A', '#348BFB', '#FFE544', '#FFAA7A'],
      },
    ],
  });

  const [pressreleaseData, setPressreleaseData] = useState({
    labels: ['Approved', 'Reject', 'Pending', 'Drafts'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#92E33A', '#348BFB', '#FFE544', '#FFAA7A'],
      },
    ],
  });

  const [web3Data, setWeb3Data] = useState({
    labels: ['Verified', 'UnVerified'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#92E33A', '#FFE544'],
      },
    ],
  });

  const [eventsData, setEventsData] = useState({
    labels: ['PastEvents', 'OngoingEvents', 'UpcomingEvents'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ["#FFE544", '#348BFB', '#92E33A'],
      },
    ],
  });

  const [quizData, setQuizData] = useState({
    labels: ['Active', 'Not Active'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#92E33A', '#FFE544'],
      },
    ],
  });

  const [surveyData, setSurveyData] = useState({
    labels: ['Active', 'Not Active'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#92E33A', '#FFE544'],
      },
    ],
  });

  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));

  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });

  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });

  const getquiz = async () => {
    const quizCount = await entryActor.quiz_list();
    if (quizCount) {
      let data = getQuizCount(quizCount);
      setQuizCount(data);
    }
  };

  const getsurvey = async () => {
    const surveyCount = await entryActor.survey_list();
    if (surveyCount) {
      let data = getSurveyCount(surveyCount);
      setSurveyCount(data);
    }
  };

  const getarticles = async () => {
    const ariclescount = await entryActor.user_count();

    if (ariclescount) {
      let data = getEntriesCount(ariclescount);

      setArticleCount(data);
    }
  };

  const getpromtedarticles = async () => {
    const promotedcount = await entryActor.promotedarticles_count();

    if (promotedcount) {
      let data = getpromtedCount(promotedcount);
      setPromoteCount(data);
    }
  };
  // ========================

  const getuser = async () => {
    const userCount = await userActor.verified_user_count();
    if (userCount) {
      let data = getUsersCount(userCount);

      setUsersCount(data);
    }
  };

  const getWeb3 = async () => {
    const web3Count = await entryActor.web_list();
    if (web3Count) {
      let data = getWeb3Count(web3Count);

      setWeb3Count(data);
    }
  };

  const getEvents = async () => {
    const eventsCount = await entryActor.event_types();
    if (eventsCount) {
      let data = getEventsCount(eventsCount);
      setEventsCount(data);
    }
  };

  useEffect(() => {
    if (articleCount) {
      setArticleData({
        labels: ['Approved', 'Reject', 'Pending', 'Drafts'],
        datasets: [
          {
            data: [
              articleCount ? articleCount.articlesapproved : 0,
              articleCount ? articleCount.articlesrejected : 0,
              articleCount ? articleCount.articlespendings : 0,
              articleCount ? articleCount.articlesdrafts : 0,
              // articleCount ? articleCount.totalarticles : 0
            ],
            backgroundColor: ['#92E33A', '#348BFB', '#FFE544', '#FFAA7A'],
          },
        ],
      });
    }

    if (articleCount) {
      setPodcastData({
        labels: ['Approved', 'Reject', 'Pending', 'Drafts'],
        datasets: [
          {
            data: [
              articleCount ? articleCount.podcastapproved : 0,
              articleCount ? articleCount.podcastrejected : 0,
              articleCount ? articleCount.podcastpendings : 0,
              articleCount ? articleCount.podcastdrafts : 0,
              // articleCount ? articleCount.totalpodcasts : 0
            ],
            backgroundColor: ['#92E33A', '#348BFB', '#FFE544', '#FFAA7A'],
          },
        ],
      });
    }

    if (articleCount) {
      setPressreleaseData({
        labels: ['Approved', 'Reject', 'Pending', 'Drafts'],
        datasets: [
          {
            data: [
              articleCount ? articleCount.pressreleaseapproved : 0,
              articleCount ? articleCount.pressreleaserejected : 0,
              articleCount ? articleCount.pressreleasependings : 0,
              articleCount ? articleCount.pressreleasedrafts : 0,
              // articleCount ? articleCount.totalpodcasts : 0
            ],
            backgroundColor: ['#92E33A', '#348BFB', '#FFE544', '#FFAA7A'],
          },
        ],
      });
    }
  }, [articleCount]);

  useEffect(() => {
    if (usersCount) {
      setChartData({
        labels: [
          'Verified Users',
          'Unverified Users',
          'Blocked Users',
          'Unblocked Users',
        ],
        datasets: [
          {
            data: [
              usersCount ? usersCount.verified : 0,
              usersCount ? usersCount.unverified : 0,
              usersCount ? usersCount.blocked : 0,
              usersCount ? usersCount.Unblocked : 0,
              // usersCount ? usersCount.Users : 0
            ],
            backgroundColor: ['#92E33A', '#348BFB', '#FFE544', '#FFAA7A'],
          },
        ],
      });
    }
  }, [usersCount]);

  useEffect(() => {
    if (eventsCount) {
      setEventsData({
        labels: ['PastEvents', 'OngoingEvents', 'UpcomingEvents'],
        datasets: [
          {
            data: [
              eventsCount ? eventsCount.pasts : 0,
              eventsCount ? eventsCount.ongoing : 0,
              eventsCount ? eventsCount.upcoming : 0,
            ],
            backgroundColor: ["#FFE544", '#348BFB', '#92E33A'],
          },
        ],
      });
    }
  }, [eventsCount]);

  useEffect(() => {
    if (web3Count) {
      setWeb3Data({
        labels: ['Verified', 'UnVerified'],
        datasets: [
          {
            data: [
              web3Count ? web3Count.verified : 0,
              web3Count ? web3Count.un_verified : 0,
            ],
            backgroundColor: ['#92E33A', '#FFE544'],
          },
        ],
      });
    }
  }, [web3Count]);

  useEffect(() => {
    if (quizCount) {
      setQuizData({
        labels: ['Active', 'Not Active'],
        datasets: [
          {
            data: [
              quizCount ? quizCount.active : 0,
              quizCount ? quizCount.not_active : 0,
            ],
            backgroundColor: ['#92E33A', '#FFE544'],
          },
        ],
      });
    }
  }, [quizCount]);

  useEffect(() => {
    if (surveyCount) {
      setSurveyData({
        labels: ['Active', 'Not Active'],
        datasets: [
          {
            data: [
              surveyCount ? surveyCount.active : 0,
              surveyCount ? surveyCount.not_active : 0,
            ],
            backgroundColor: ['#92E33A', '#FFE544'],
          },
        ],
      });
    }
  }, [surveyCount]);

  useEffect(() => {
    if (promoteCount) {
      setPromteData({
        labels: ['Promoted Articles'],
        datasets: [
          {
            data: [promoteCount ? promoteCount.totalEntries : 0],
            backgroundColor: ['#92E33A'],
          },
        ],
      });
    }
  }, [promoteCount]);
  ChartJS.register(ArcElement, Tooltip);

  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.articleManagement && !userAuth.isAdminBlocked) {
        getuser();
        getarticles();
        getWeb3();
        getEvents();
        getquiz();
        getsurvey();
        getpromtedarticles();
      } else {
        router.replace('/super-admin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/super-admin');
    }
  }, [userAuth, auth]);

  return (
    userAuth.userPerms?.articleManagement &&
    !userAuth.isAdminBlocked && (
      <>
        <main id='main'>
          <div className='main-inner home'>
            <div className='section' id='top'>
              <Row>
                <Col xl='12' lg='12' md='12'>
                  <div className='spacer-20' />
                  <Row className='dashborad'>
                    <Col xl='4' lg='6' md='6'>
                      <div className='total-pnl padd-top-10'>
                        <h3 className='mt-2'>
                          <b>Total Article :</b>
                          {articleCount ? articleCount.totalarticles : 0}
                        </h3>
                        <div className='d-flex justify-content-center ghContainer'>
                          <div className=''>
                           
                            { articleCount?.totalarticles ?<Doughnut data={articleData} />: <EmptyGraph/>}

                          </div>
                        </div>

                        <ul className='total-toal-list '>
                          <li>
                            <span className='sgreencolor' /> Approved {articleCount? articleCount?.articlesapproved:0 }
                          </li>
                          <li>
                            <span className='sbluecolor ' /> Rejected {articleCount? articleCount?.articlesrejected:0 }
                          </li>
                          <li>
                            <span className='syellowcolor' /> Pending {articleCount? articleCount?.articlespendings:0 }
                          </li>
                          <li>
                            <span className='sornagecolor' /> Drafts {articleCount? articleCount?.articlesdrafts:0 }
                          </li>
                        </ul>
                      </div>
                    </Col>

                    <Col xl='4' lg='6' md='6'>
                      <div className='total-pnl padd-top-10'>
                        <h3 className='mt-2'>
                          <b>Total Podcasts :</b>
                          {articleCount ? articleCount.totalpodcasts : 0}
                        </h3>
                        <div className='d-flex justify-content-center ghContainer'>
                          <div className=' '>
                           
                            { articleCount?.totalpodcasts ?<Doughnut data={podcastData} />: <EmptyGraph/>}

                          </div>
                        </div>      

                        <ul className='total-toal-list '>
                          <li>
                            <span className='sgreencolor' /> Approved {articleCount? articleCount?.podcastapproved:0 }
                          </li>
                          <li>
                            <span className='sbluecolor ' /> Rejected {articleCount? articleCount?.podcastrejected:0 }
                          </li>
                          <li>
                            <span className='syellowcolor' /> Pending {articleCount? articleCount?.podcastpendings:0 }
                          </li>
                          <li>
                            <span className='sornagecolor' /> Drafts {articleCount? articleCount?.podcastdrafts:0 }
                          </li>
                        </ul>
                      </div>
                    </Col>

                    <Col xl='4' lg='6' md='6'>
                      <div className='total-pnl padd-top-10'>
                        <h3 className='mt-2'>
                          <b>Total Press Release :</b>
                          {articleCount ? articleCount.totalpressrelease : 0}
                        </h3>
                        <div className='d-flex justify-content-center ghContainer'>
                          <div className=' '>
                       
                            {  articleCount?.totalpressrelease ?<Doughnut data={pressreleaseData} />: <EmptyGraph/>}
                          </div>
                        </div>
                        <ul className='total-toal-list '>
                          <li>
                            <span className='sgreencolor' /> Approved {articleCount? articleCount?.pressreleaseapproved:0 }
                          </li>
                          <li>
                            <span className='sbluecolor ' /> Rejected {articleCount? articleCount?.pressreleaserejected:0 }
                          </li>
                          <li>
                            <span className='syellowcolor' /> Pending {articleCount? articleCount?.pressreleasependings:0 }
                          </li>
                          <li>
                            <span className='sornagecolor' /> Drafts {articleCount? articleCount?.pressreleasedrafts:0 }
                          </li>
                        </ul>
                      </div>
                    </Col>

                    <Col xl='4' lg='6' md='6'>
                      <div className='total-pnl padd-top-10'>
                        <h3 className='mt-2'>
                          <b>Total Web3 Directories :</b>
                          {web3Count ? web3Count.total_web : 0}
                        </h3>
                        <div className='d-flex justify-content-center ghContainer'>
                          <div className=' '>
                         
                            {  web3Count?.total_web ?<Doughnut data={web3Data} />: <EmptyGraph/>}
                          </div>
                        </div>

                        <ul className='total-toal-list '>
                          <li>
                            <span className='sgreencolor' /> Verified {web3Count? web3Count?.verified:0 }
                          </li>
                          <li>
                            <span className='syellowcolor' /> UnVerified {web3Count? web3Count?.un_verified:0 }
                          </li>
                        </ul>
                      </div>
                    </Col>

                    <Col xl='4' lg='6' md='6'>
                      <div className='total-pnl padd-top-10'>
                        <h3 className='mt-2'>
                          <b>Total Survey :</b>
                          {surveyCount ? surveyCount.all : 0}
                        </h3>
                        <div className='d-flex justify-content-center ghContainer'>
                          <div className=' '>
                           
                            {   surveyCount?.all ?<Doughnut data={surveyData} />: <EmptyGraph/>}
                          </div>
                        </div>

                        <ul className='total-toal-list '>
                          <li>
                            <span className='sgreencolor' /> Active {surveyCount? surveyCount?.active:0 }
                          </li>
                          <li>
                            <span className='syellowcolor' /> Not Active {surveyCount? surveyCount?.not_active:0 }
                          </li>
                        </ul>
                      </div>
                    </Col>

                    <Col xl='4' lg='6' md='6'>
                      <div className='total-pnl padd-top-10'>
                        <h3 className='mt-2'>
                          <b>Total Quizs :</b>
                          {quizCount ? quizCount.all : 0}
                        </h3>
                        <div className='d-flex justify-content-center ghContainer'>
                          <div className=' '>
                  
                            {  quizCount?.all ?<Doughnut data={quizData} />: <EmptyGraph/>}
                          </div>
                        </div>

                        <ul className='total-toal-list '>
                          <li>
                            <span className='sgreencolor' /> Active  {quizCount? quizCount?.active:0 }
                          </li>
                          <li>
                            <span className='syellowcolor' /> Not Active  {quizCount? quizCount?.not_active:0 }
                          </li>
                        </ul>
                      </div>
                    </Col>

                    <Col xl='4' lg='6' md='6'>
                      <div className='total-pnl padd-top-10'>
                        <h3 className='mt-2'>
                          <b>Total Users :</b>
                          {usersCount ? usersCount.Users : 0}
                        </h3>
                        <div className='d-flex justify-content-center ghContainer'>
                          <div className=' '>
                        
                            {  usersCount?.Users ?<Doughnut data={ChartData} />: <EmptyGraph/>}
                          </div>
                        </div>  

                        <ul className='total-toal-list '>
                          <li>
                            <span className='sgreencolor' /> Verified  {usersCount? usersCount?.verified:0 }
                          </li>
                          <li>
                            <span className='sbluecolor' /> UnVerified  {usersCount? usersCount?.unverified:0 }
                          </li>
                          <li>
                            <span className='syellowcolor' /> Blocked  {usersCount? usersCount?.blocked:0 }
                          </li>
                          <li>
                            <span className='sornagecolor' /> UnBlocked  {usersCount? usersCount?.Unblocked:0 }
                          </li>
                        </ul>
                      </div>
                    </Col>

                    <Col xl='4' lg='6' md='6'>
                      <div className='total-pnl padd-top-10'>
                        <h3 className='mt-2'>
                          <b>Total Events :</b>
                          {eventsCount ? eventsCount.all : 0}
                        </h3>
                        <div className='d-flex justify-content-center ghContainer'>
                          <div className=' '>
                          {  eventsCount?.all ?<Doughnut data={eventsData} />: <EmptyGraph/>}
                          </div>
                        </div>

                        <ul className='total-toal-list '>
                          <li>
                            <span className=' syellowcolor ' /> Pasts {eventsCount? eventsCount?.pasts:0 }
                          </li>
                          <li>
                            <span className='sbluecolor' /> Ongoing {eventsCount? eventsCount?.ongoing:0 }
                          </li>
                          <li>
                            <span className='sgreencolor' /> Upcoming {eventsCount? eventsCount?.upcoming:0 }
                          </li>
                        </ul>
                      </div>
                    </Col>

                    <Col xl='4' lg='6' md='6'>
                      <div className='total-pnl padd-top-10'>
                        <h3 className='mt-2'>
                          <b> Total Promotional ICP:</b>
                          {promoteCount ? promoteCount.promotionIcp : 0}
                        </h3>
                        <div className='d-flex justify-content-center ghContainer'>
                          <div className=' '>
                          {promoteCount?.promotionIcp > 0 ? <Doughnut data={promteData} />:<EmptyGraph/>}
                 
                          </div>
                        </div>

                        <ul className='total-toal-list '>
                          <li>
                            <span className='sgreencolor' /> Promoted Articles {promoteCount? promoteCount?.totalEntries:0 }
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        </main>
      </>
    )
  );
};

export default page;
