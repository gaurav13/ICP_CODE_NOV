'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Table, Form, Button, Spinner } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import { ConnectPlugWalletSlice } from '@/types/store';
import { utcToLocalAdmin } from '@/components/utils/utcToLocal';
import { E8S } from '@/constant/config';
import TransectionItems from '@/components/transections/AllTransection';
import logger from '@/lib/logger';

const statuses = ['All', 'Quiz', 'Survey'];

export default function TransectionsList() {
  const [transectionList, setTransectionList] = useState<any[]>([]);
  const [isGetting, setIsGetting] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [forcePaginate, setForcePaginate] = useState(0);
  const [transectionsSize, setTransectionsSize] = useState<any>(0);
  const router = useRouter();
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));

  const entryActorDefault = makeEntryActor({
    agentOptions: {
      identity,
    },
  });

  let entryTypes: {
    all?: null;
    quiz?: null;
    survey?: null;
  } = { all: null };
  switch (selectedType) {
    case 'All':
      entryTypes = { all: null };
      break;
    case 'Quiz':
      entryTypes = { quiz: null };
      break;
    case 'Survey':
      entryTypes = { survey: null };
      break;
    default:
      entryTypes = { all: null };
  }
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  let itemsPerPage = 8;

  const pageCount = Math.ceil(transectionsSize / itemsPerPage);

  const getRefinedList = async (tempEntriesList: any[]) => {
    if (tempEntriesList.length === 0) {
      return [];
    }
    const userActor = makeUserActor({
      agentOptions: {
        identity,
      },
    });

    let data = await Promise.all(
      tempEntriesList.map(async (item: any) => {
        let trans = item[1];
        logger(item, 'dsfsadfsadfsadfsdf');
        let date: any = utcToLocalAdmin(
          trans.creation_time.toString(),
          'DD-MM-yyyy'
        );

        let userName = await userActor.get_user_name_only(trans.user);
        let newItem = {
          transectionId: item[0],
          date,
          gasFee: parseInt(trans?.gasFee),
          promotional: parseInt(trans?.promotional),
          platform: parseInt(trans?.platform),
          admin: parseInt(trans?.admin),
          userName,
        };
        return newItem;
      })
    );

    return data;
  };
  const getTransectionList = async (reset?: boolean) => {
    if (
      !userAuth.userPerms?.userManagement ||
      auth.state !== 'initialized' ||
      !identity
    ) {
      return [];
    }

    const resp = await entryActor.getQuizAndServayTransectionForAdmin(
      entryTypes,
      reset ? '' : search,
      forcePaginate * itemsPerPage,
      itemsPerPage
    );
    let amount = parseInt(resp.amount);
    setTransectionsSize(amount);
    const tempList = resp.entries;

    let data = await getRefinedList(tempList);
    setTransectionList(data);
    setIsGetting(false);
  };

  const handlePageClick = async (event: any) => {
    setIsGetting(true);
    setForcePaginate(event.selected);

    const newOffset = (event.selected * itemsPerPage) % transectionsSize;
    const resp = await entryActor.getQuizAndServayTransectionForAdmin(
      entryTypes,
      search,
      newOffset,
      itemsPerPage
    );
    let list = resp.entries;
    const tempList = await getRefinedList(list);
    setTransectionList(tempList);
    setIsGetting(false);
  };

  const filter = async (reset?: boolean) => {
    setForcePaginate(0);
    setIsGetting(true);
    let list = await getTransectionList(reset);
    setIsGetting(false);
  };
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      filter();
    }
  };

  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.userManagement && !userAuth.isAdminBlocked) {
        getTransectionList();
      } else {
        router.replace('/super-admin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/super-admin');
    }
  }, [userAuth, auth]);

  return (
    userAuth.userPerms?.userManagement &&
    !userAuth.isAdminBlocked && (
      <>
        <main id='main' className='dark'>
          <div className='main-inner admin-main'>
            <Head>
              <title>Hi</title>
            </Head>
            <div className='section admin-inner-pnl' id='top'>
              <Row>
                <Col xl='12' lg='12'>
                  <div className=''>
                    <Row>
                      <Col xl='8'>
                        <h1>
                          Management Transactions{' '}
                          <i className='fa fa-arrow-right' />{' '}
                          <span>All Transactions</span>
                        </h1>
                      </Col>
                      <Col xl='6' lg='6' className='mb-lg-5 mb-0'>
                        <ul className='all-filters-list v2' />
                      </Col>
                      <Col xl='6' lg='6' className='mb-4'>
                        <div className='full-div text-right-md'>
                          <div />

                          <div>
                            <div className='search-post-pnl'>
                              <input
                                type='text'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder='Search transaction'
                                onKeyDown={handleSearch}
                              />
                              {search.length >= 1 && (
                                <button
                                  onClick={(e: any) => {
                                    setSearch('');
                                    filter(true);
                                  }}
                                >
                                  <i className='fa fa-xmark mx-1' />
                                </button>
                              )}
                              <button onClick={() => filter()}>
                                <i className='fa fa-search' />
                              </button>
                            </div>
                          </div>
                        </div>
                      </Col>

                      <Col xl='6' lg='12'>
                        <div className='full-div'>
                          <ul className='filter-list'>
                            <li>
                              <Form.Select
                                aria-label={'All'}
                                value={selectedType}
                                onChange={(e) =>
                                  setSelectedType(e.target.value)
                                }
                              >
                                {statuses.map((category: string, index) => (
                                  <option value={category} key={index}>
                                    <span className='text-capitalize m-0'>
                                      {category.charAt(0).toUpperCase() +
                                        category.slice(1)}
                                    </span>
                                  </option>
                                ))}
                              </Form.Select>
                            </li>
                            <li>
                              <Button
                                className='publish-btn'
                                onClick={() => filter()}
                              >
                                Apply
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </Col>
                      <Col xl='6' lg='12'>
                        <div className='pagination-container mystyle d-flex justify-content-center justify-content-md-end'>
                          {
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
                          }
                        </div>
                      </Col>

                      {isGetting ? (
                        <div className='d-flex justify-content-center w-full'>
                          <Spinner />
                        </div>
                      ) : transectionList.length > 0 ? (
                        <TransectionItems currentItems={transectionList} />
                      ) : (
                        <div className='d-flex justify-content-center w-ful'>
                          <h3>No Transaction Found</h3>
                        </div>
                      )}
                    </Row>
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
