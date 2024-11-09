'use client';
import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Breadcrumb } from 'react-bootstrap';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useConnectPlugWalletStore } from '@/store/useStore';
import logger from '@/lib/logger';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/navigation';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import QuizQuestionListComponent from '@/components/QuizListComponent/QuestionListComponent';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { usePathname } from 'next/navigation';
import { ALL_QUIZ_ROUTE_USER } from '@/constant/routes';
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
  const [quizQuestionList, setQuizQuestionList] = useState<any[]>([]);
  const [forcePaginate, setForcePaginate] = useState(0);
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  let quizId = searchParams.get('quizId');
  const router = useRouter();
  const [quizName, setQuizName] = useState<any>(null);
  let pageCount = Math.ceil(QuizSize / itemsPerPage);
  const handleShow = () => {
    setShowModal(true);
  };

  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });

  async function getListOfQuestion(reset?: boolean) {
    setIsGetting(true);
    const searched = reset ? '' : search;
    const resp = await entryActor.getQuestionsOfQuiz_admin(
      quizId,
      searched,
      0,
      itemsPerPage
    );

    if (resp?.ok) {
      const quizlist = resp?.ok[1].entries;
      const quizlistLength = parseInt(resp?.ok[1].amount);
      const quizName = resp?.ok[0][0]?.title;
      setQuizSize(quizlistLength);
      setQuizQuestionList(quizlist);
      setQuizName(quizName);
    }
    setIsGetting(false);
  }
  const handlePageClick = async (event: any) => {
    setIsGetting(true);
    setForcePaginate(event.selected);
    const newOffset = (event.selected * itemsPerPage) % QuizSize;
    //isActiveList value 1 for active ,2 for non active and 0 for all
    let isActiveList: any = 0;
    const resp = await entryActor.getQuestionsOfQuiz_admin(
      quizId,
      search,
      newOffset,
      itemsPerPage
    );

    if (resp?.ok) {
      const quizlist = resp?.ok[1].entries;

      setQuizQuestionList(quizlist);
    }

    setIsGetting(false);
  };
  function handleSearch(reset?: boolean) {
    setForcePaginate(0);
    getListOfQuestion(reset);
  }
  useEffect(() => {
    if (quizId && auth?.state === 'initialized') {
      getListOfQuestion();
    }
  }, [quizId, auth]);

  useEffect(() => {
    if (auth.state === 'initialized') {
    } else if (auth.state === 'anonymous') {
      router.replace('/');
    }
  }, [userAuth, auth]);

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
                      placeholder='Search question'
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
                ) : quizQuestionList.length > 0 ? (
                  <QuizQuestionListComponent
                    quizId={quizId}
                    QuizQuestionList={quizQuestionList}
                    reGetFn={getListOfQuestion}
                  />
                ) : (
                  <p className='text-center'>{t('No question Found')}</p>
                )}
                <div className='pagination-container mystyle d-flex justify-content-end'>
                  {quizQuestionList.length > 0 && (
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
    </>
  );
}
