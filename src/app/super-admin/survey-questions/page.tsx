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
import { ALL_QUIZ_ROUTE_ADMIN, MANAGE_SURVEY_ADMIN } from '@/constant/routes';
import { admin_manage_survey } from '@/constant/config';

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
      if (userAuth.userPerms?.articleManagement && !userAuth.isAdminBlocked) {
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
        <main id='main' className='dark'>
          <div className='main-inner admin-main'>
            <div className='section admin-inner-pnl' id='top'>
              <Row>
                <Col xl='12' lg='12' md='12'>
                  <Breadcrumb>
                    <Breadcrumb.Item>
                      <Link href={admin_manage_survey}>
                        <p style={{ fontSize: '20px', marginTop: '-5px' }}>
                          {'Manage-Survey'}
                        </p>
                      </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href='#'>
                      <p style={{ fontSize: '20px', marginTop: '-5px' }}>
                        {'Survey-questions'}
                      </p>
                    </Breadcrumb.Item>
                    {servayName && (
                      <Breadcrumb.Item active>
                        <span
                          style={{
                            fontWeight: 'normal',
                            fontSize: '20px',
                            marginTop: '-5px',
                          }}
                        >
                          {servayName}
                        </span>
                      </Breadcrumb.Item>
                    )}
                  </Breadcrumb>
                </Col>
              </Row>
              <Row>
                <Col xl='9' lg='12' className='text-left'>
                  <h1>
                    Survey Question Management{' '}
                    {servayName && (
                      <>
                        <i className='fa fa-arrow-right' />{' '}
                        <span>{servayName}</span>
                      </>
                    )}
                  </h1>

                  <div className='spacer-20' />
                </Col>
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
                    <p className='text-center'>No question Found</p>
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
    )
  );
}
