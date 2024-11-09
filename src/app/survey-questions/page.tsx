'use client';
import React, { use, useEffect, useRef, useState } from 'react';
import {
  Row,
  Col,
  Form,
  Button,
  Table,
  Modal,
  Spinner,
  Breadcrumb,
} from 'react-bootstrap';
import { Formik, Field, ErrorMessage, FormikProps, FormikValues } from 'formik';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useConnectPlugWalletStore } from '@/store/useStore';
import logger from '@/lib/logger';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter } from 'next/navigation';
import { number, object, string } from 'yup';
import { toast } from 'react-toastify';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { utcToLocalAdmin } from '@/components/utils/utcToLocal';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import QuizQuestionListComponent from '@/components/QuizListComponent/QuestionListComponent';
import ServayQuestionListComponent from '@/components/ServayComponents/QuestionListComponent';
import { ALL_SURVEY_ROUTE_USER } from '@/constant/routes';

const itemsPerPage = 10;
export default function QuizListPage() {
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const [search, setSearch] = useState('');
  const [QuizSize, setQuizSize] = useState(0);
  const [isGetting, setIsGetting] = useState(true);
  const [servayQuestionList, setServayQuestionList] = useState<any[]>([]);
  const [forcePaginate, setForcePaginate] = useState(0);
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  let servayId = searchParams.get('SurveyId');
  const router = useRouter();
  const [servayName, setServayName] = useState<any>(null);
  let pageCount = Math.ceil(QuizSize / itemsPerPage);

  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });

  async function getListOfQuestion(reset?: boolean) {
    setIsGetting(true);
    const searched = reset ? '' : search;
    const resp = await entryActor.getQuestionsOfServay_admin(
      servayId,
      searched,
      0,
      itemsPerPage
    );

    if (resp?.ok) {
      const list = resp?.ok[1].entries;
      const servayName = resp?.ok[0][0]?.title;
      const listLength = parseInt(resp?.ok[1].amount);
      setQuizSize(listLength);
      setServayQuestionList(list);
      setServayName(servayName);
    }
    setIsGetting(false);
  }
  const handlePageClick = async (event: any) => {
    setIsGetting(true);
    setForcePaginate(event.selected);
    const newOffset = (event.selected * itemsPerPage) % QuizSize;
    //isActiveList value 1 for active ,2 for non active and 0 for all

    const resp = await entryActor.getQuestionsOfServay_admin(
      servayId,
      search,
      newOffset,
      itemsPerPage
    );

    if (resp?.ok) {
      const list = resp?.ok[1].entries;

      setServayQuestionList(list);
    }

    setIsGetting(false);
  };
  function handleSearch(reset?: boolean) {
    setForcePaginate(0);
    getListOfQuestion(reset);
  }
  useEffect(() => {
    if (servayId && auth?.state === 'initialized') {
      getListOfQuestion();
    }
  }, [servayId, auth]);
  // let handelTest=async ()=>{
  //   let tempresult=[{
  //     title:"jjjjjjj",
  //     selectedOption:["1","2"],
  //     seggestion:"no seggestion"
  //   },{
  //     title:"ppppp",
  //     selectedOption:["1","2"],
  //     seggestion:"no seggestion"
  //   }]
  //   let res= await entryActor.saveUserResponseToServay(servayId,tempresult,userCanisterId);
  //   logger(res,"dkahsdksadkasdasd")
  // }
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
              <Col xl='12' lg='12' md='12'>
              
                <Col xl='12' lg='12' md='12'>
                <Breadcrumb className='new-breadcrumb web'>
                  <Breadcrumb.Item>
                    <Link href='/'>
                      <i className='fa fa-home' />
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link href={ALL_SURVEY_ROUTE_USER}>{'Manage-Survey'}</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item >
                  <Link  href={`/survey-questions?SurveyId=${servayId}`}>
                    {'Survey-questions'}</Link>
                  </Breadcrumb.Item>
                  {servayName && (
                  <Breadcrumb.Item active>
                    <Link
                      href=''
                      style={{
                        pointerEvents: 'none',
                      }}
                    >
                     <span>{servayName}</span>
                    </Link>
                  </Breadcrumb.Item>
                )}
                </Breadcrumb>
              </Col>
              </Col>
            </Row>     
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
                ) : servayQuestionList.length > 0 ? (
                  <ServayQuestionListComponent
                    servayId={servayId}
                    servayQuestionList={servayQuestionList}
                    reGetFn={getListOfQuestion}
                  />
                ) : (
                  <p className='text-center'>{t('No question Found')}</p>
                )}
                <div className='pagination-container mystyle d-flex justify-content-end'>
                  {servayQuestionList.length > 0 && (
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
