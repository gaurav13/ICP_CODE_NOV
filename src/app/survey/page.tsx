'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Button, Table, Modal, Spinner } from 'react-bootstrap';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useConnectPlugWalletStore } from '@/store/useStore';
import logger from '@/lib/logger';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter } from 'next/navigation';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import Tippy from '@tippyjs/react';
import { isUserConnected } from '@/components/utils/utcToLocal';
import ConnectModal from '@/components/Modal';
import { SURVEY } from '@/constant/routes';

function QuizListComponent({
  QuizList,
  handleConnectModal,
  t
}: {
  QuizList: any[];
  handleConnectModal: any;
  t:any
}) {

  const { auth } = useConnectPlugWalletStore(
    (state) => ({
      auth: state.auth,
    })
  );

  return (
    <>
      <Col xl='12' lg='12' md='12'>
        <div className='full-div'>
          <div className='table-container lg'>
            <div className='table-inner-container'>
              <Table striped hover className='article-table'>
               
                  <thead>
                  <tr>
                    <th>
                      <p>{t("Title")}</p>
                    </th>
                   
                   
                    <th>
                      <p>{t("Reward")}</p>
                    </th>
                    <th>
                      <p>{t("Question")}</p>
                    </th>
                    <th>
                      <p>{t("Participant")}</p>
                    </th>
                    <th className='centercls'>
                      <p>{t("Action")}</p>
                    </th>
                  </tr>
                </thead>
             
                <tbody>
                  {QuizList.map((item: any) => {
                    let quiz = item[1];
                    let id = item[0];
                    let questionCount = 0;
                    let quizDuration = 0;
                    let participatedCount=Number(quiz?.usersWillGetReward);

                    if (quiz?.questionCount) {
                      questionCount = parseInt(quiz?.questionCount);
                    }
                    if (quiz?.rewardPerUser) {
                      quizDuration = parseInt(quiz?.rewardPerUser);
                    }

                    return (
                      <tr key={id}>
                        <td className='category-item'>
                          <p>
                            {quiz.title.length > 20
                              ? quiz.title.slice(0, 20) + '...'
                              : quiz.title}
                          </p>{' '}
                        </td>
                        <td>{quizDuration} </td>

                        <td>{questionCount}</td>
                        <td>{participatedCount ?? 0}</td>
                        <td className=''>
                          <div className='centercls'>
                         {quiz?.isTaken?<Tippy content={"You already taken this Survey"}>
                          <Link
                              onClick={(e)=>{if (!isUserConnected(auth, handleConnectModal)){ e.preventDefault();  return;}}}    
                            href={"#"}
                          
                          >
                            <Button
                              className={`reg-btn fill bg-fix trackbtn ms-1 addQuestionBtn`}
                              disabled={true}
                            >
                              Take Survey
                              
                            </Button>
                          </Link>
                        </Tippy>:    
                          <Link
                          onClick={(e)=>{if (!isUserConnected(auth, handleConnectModal)){ e.preventDefault();  return;}}}    
                            href={{ pathname: '/take-survey', query: { id: id } }}
                          
                          >
                            <Button
                              className={`reg-btn fill bg-fix trackbtn ms-1 addQuestionBtn`}
                            >
                              Take Survey
                            </Button>
                          </Link>
                  }
                 
                  
                          </div>
                       
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
}

const itemsPerPage = 10;
export default function QuizListPage() {
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [QuizSize, setQuizSize] = useState(0);
  const [isGetting, setIsGetting] = useState(true);
  const [quizList, setQuizList] = useState<any[]>([]);
  const [forcePaginate, setForcePaginate] = useState(0);
  const [showConnectModal, setShowConnectModal] = useState(false);
let router=useRouter()
  let pageCount = Math.ceil(QuizSize / itemsPerPage);
  const handleShow = () => {
    setShowModal(true);
  };

  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });

  async function getQuizList(reset?: boolean) {
    setIsGetting(true);
    const searched = reset ? '' : search;
    let quizId: any = [];
    const resp = await entryActor.getServayList(searched, 0, itemsPerPage);
    const quizlist = resp.entries;
    const quizlistLength = parseInt(resp.amount);
    setQuizSize(quizlistLength);
    setQuizList(quizlist);
    setIsGetting(false);
  }
  const handlePageClick = async (event: any) => {
    setIsGetting(true);

    setForcePaginate(event.selected);
    // setItemOffset(newOffset);
    // if ()
    let list: any = [];
    const newOffset = (event.selected * itemsPerPage) % QuizSize;
    let quizId: any = [];
    const resp = await entryActor.getServayList(
      search,
      newOffset,
      itemsPerPage
    );
    list = resp.entries;
    setQuizList(list);

    setIsGetting(false);
  };
  function handleSearch(reset?: boolean) {
    setForcePaginate(0);
    getQuizList(reset);
  }

  useEffect(() => {

      getQuizList();
   
  }, [auth]);

  const location = usePathname();
  let language;

  const changeLang = () => {
    if (LANG === 'jp') {
      if (location) {
        language = location.includes('super-admin/') ? 'en' : 'jp';
      }
    } else {
      language = 'en';
    }
  };
  const funcCalling = changeLang();
  const { t, changeLocale } = useLocalization(language);
  const handleConnectModal = () => {
    // e.preventDefault();
    setShowConnectModal(true);
    // setConnectLink(e);
  };
  const handleConnectModalClose = () => {
    setShowConnectModal(false);
  };
  useEffect(() => {
    if (location.startsWith("/survey") && !location.endsWith('/')) {
     router.push(SURVEY);
   }
     }, [])
  return (
    <>
      <main id='main' className='dark'>
        <div className='main-inner admin-main'>
          <div className='section admin-inner-pnl' id='top'>
            <Row>
              <Col xl='12' lg='12' md='12' className='mt-2 mb-4'>
                <div className='full-div text-right-md'>
                  <div className='search-post-pnl'>
                    <input
                      type='text'
                      placeholder={t('Search Survey')}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                    />
                    {search.length >= 1 && (
                      <button
                        onClick={() => {
                          setSearch('');
                          handleSearch(true);
                        }}
                      >
                        <i className='fa fa-xmark mx-1' />
                      </button>
                    )}
                    <button onClick={() => handleSearch()}>
                      <i className='fa fa-search' />
                    </button>
                  </div>
                </div>
              </Col>
              <Col xxl='12'>
                {isGetting ? (
                  <div className='d-flex justify-content-center w-full'>
                    <Spinner />
                  </div>
                ) : quizList.length > 0 ? (
                  <QuizListComponent
                    QuizList={quizList}
                    handleConnectModal={handleConnectModal}
                    t={t}
                  />
                ) : (
                  <p className='text-center'>{t('No Survey Found')}</p>
                )}
                <div className='pagination-container mystyle d-flex justify-content-end'>
                  {quizList.length > 0 && (
                    <ReactPaginate
                      breakLabel='...'
                      nextLabel=''
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={5}
                      pageCount={pageCount}
                      previousLabel=''
                      renderOnZeroPageCount={null}
                      forcePage={forcePaginate}
                    />
                  )}
                </div>
              </Col>
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
