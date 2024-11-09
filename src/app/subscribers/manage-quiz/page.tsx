'use client';
import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useConnectPlugWalletStore } from '@/store/useStore';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/navigation';

import QuizListComponent from '@/components/QuizListComponent/QuizListComponent';

const itemsPerPage = 10;
export default function QuizListPage() {
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));

  const [search, setSearch] = useState('');
  const [quizSize, setQuizSize] = useState(0);
  const [isGetting, setIsGetting] = useState(true);
  const [quizList, setQuizList] = useState<any[]>([]);
  const [forcePaginate, setForcePaginate] = useState(0);
  const router = useRouter();
  let pageCount = Math.ceil(quizSize / itemsPerPage);
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });

  async function getQuizList(reset?: boolean) {
    setIsGetting(true);
    const searched = reset ? '' : search;
    let quizId: any = [];
    //isActiveList value 1 for active ,2 for non active and 0 for all
    let isActiveList: any = 0;
    const resp = await entryActor.getQuizList_for_admin(
      quizId,
      isActiveList,
      searched,
      0,
      itemsPerPage
    );

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
    const newOffset = (event.selected * itemsPerPage) % quizSize;
    let quizId: any = [];

    //isActiveList value 1 for active ,2 for non active and 0 for all
    let isActiveList: any = 0;
    const resp = await entryActor.getQuizList_for_admin(
      quizId,
      isActiveList,
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
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.articleManagement && !userAuth.isAdminBlocked) {
        getQuizList();
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
                <Col xl='9' lg='12' className='text-left'>
                  <h1>
                    Quiz Management <i className='fa fa-arrow-right' />{' '}
                    <span>All Quiz</span>
                  </h1>
                  <div className='spacer-20' />
                </Col>
                <Col xl='12' lg='12' md='12' className='mt-2 mb-4'>
                  <div className='full-div text-right-md'>
                    <div className='search-post-pnl'>
                      <input
                        type='text'
                        placeholder='Search quiz'
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
                      quizList={quizList}
                      reGetFn={getQuizList}
                    />
                  ) : (
                    <p className='text-center'>No Quiz Found</p>
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
      </>
    )
  );
}
