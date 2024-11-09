'use client';
import React, { use, useEffect, useRef, useState } from 'react';
import { Row, Col, Spinner, Breadcrumb } from 'react-bootstrap';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useConnectPlugWalletStore } from '@/store/useStore';
import logger from '@/lib/logger';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { usePathname, useRouter } from 'next/navigation';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import ServayQuestionListComponent from '@/components/ServayComponents/QuestionListComponent';
import ServayQuestionReportComponent from '@/components/ServayComponents/ServayQuestionReportComponent';
import ServayQustionReportchart from '@/components/ServayComponents/ServayQustionReportChart';
import { ALL_QUIZ_ROUTE_ADMIN, MANAGE_SURVEY_ADMIN } from '@/constant/routes';

const itemsPerPage = 10;
export default function QuizListPage() {
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const [search, setSearch] = useState('');
  const [Size, setSize] = useState(0);
  const [isGetting, setIsGetting] = useState(true);
  const [servayQuestionReportList, setServayQuestionReportList] = useState<
    any[]
  >([]);
  const [forcePaginate, setForcePaginate] = useState(0);
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  let servayId = searchParams.get('SurveyId');
  let questionId = searchParams.get('questionId');
  const router = useRouter();
  const [servayName, setServayName] = useState<any>(null);
  const [report, setReport] = useState<any>(null);

  let pageCount = Math.ceil(Size / itemsPerPage);

  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });

  async function getListOfQuestion(reset?: boolean) {
    setIsGetting(true);
    const searched = reset ? '' : search;
    const resp = await entryActor.getUserSeggestionList(
      servayId,
      questionId,
      searched,
      0,
      itemsPerPage,
      userCanisterId
    );
    logger(resp, 'asdagjhgfju65uyssadasdsatr');

    if (resp?.ok) {
      const list = resp?.ok[1].entries;
      // const servayName = resp?.ok[0][0]?.title;
      const listLength = parseInt(resp?.ok[1].amount);
      setSize(listLength);
      setServayQuestionReportList(list);
      // setServayName(servayName);
    }
    setIsGetting(false);
  }
  async function getReportOfQuestion() {
    setIsGetting(true);
    const resp = await entryActor.getAnalysis(servayId, questionId);

    if (resp?.ok) {
      setReport(resp?.ok);
      let questionName = resp?.ok[1];
      setServayName(questionName);
    }
  }
  const handlePageClick = async (event: any) => {
    setIsGetting(true);
    setForcePaginate(event.selected);
    const newOffset = (event.selected * itemsPerPage) % Size;
    //isActiveList value 1 for active ,2 for non active and 0 for all

    const resp = await entryActor.getUserSeggestionList(
      servayId,
      questionId,
      search,
      newOffset,
      itemsPerPage,
      itemsPerPage,
      userCanisterId
    );

    if (resp?.ok) {
      const list = resp?.ok[1].entries;

      setServayQuestionReportList(list);
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
      getReportOfQuestion();
    }
  }, [servayId, auth]);

  // let handelTest=async ()=>{
  //   let tempresult=[{
  //     title:"where you live",
  //     selectedOption:["1"],
  //     seggestion:"i am pakistani"
  //   }]
  //   let res= await entryActor.saveUserResponseToServay("1714136445653349743",tempresult,userCanisterId);
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
                      <Link href={MANAGE_SURVEY_ADMIN}>{'manage-Survey'}</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item
                      href={`/super-admin/survey-questions?SurveyId=${servayId}`}
                    >
                      {'Survey-questions'}
                    </Breadcrumb.Item>
                    {servayName && (
                      <Breadcrumb.Item active>
                        <span>{servayName}</span>
                      </Breadcrumb.Item>
                    )}
                  </Breadcrumb>
                </Col>
              </Row>
              <Row>
                <Col xl='9' lg='12' className='text-left'>
                  <h1>
                    Report of Survey Question{' '}
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
                        placeholder='Search suggestion'
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
                  ) : servayQuestionReportList.length > 0 ? (
                    <ServayQuestionReportComponent
                      servayQuestionReportList={servayQuestionReportList}
                    />
                  ) : (
                    <p className='text-center'>No Suggestion Found</p>
                  )}

                  <div className='pagination-container mystyle d-flex justify-content-end'>
                    {servayQuestionReportList.length > 0 && (
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
              <Row>
                {report && <ServayQustionReportchart report={report} />}
              </Row>
            </div>
          </div>
        </main>
      </>
    )
  );
}
