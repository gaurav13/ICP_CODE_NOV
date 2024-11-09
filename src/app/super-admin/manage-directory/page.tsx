'use client';
import React, { useEffect, useState } from 'react';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import Head from 'next/head';
import { Row, Col, Table, Form, Button, Spinner, Modal } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import arrows from '@/assets/Img/Icons/icon-arrows.png';
import post1 from '@/assets/Img/Posts/small-post-10.png';
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import NavBarDash from '@/components/DashboardNavbar/NavDash';
import SideBarDash from '@/components/SideBarDash/SideBarDash';
import { EntrySizeMap } from '@/types/dashboard';
import { ConnectPlugWalletSlice } from '@/types/store';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import Tippy from '@tippyjs/react';
import { toast } from 'react-toastify';
import DirectoryItems from '@/components/DirectoryItem';
import { fromNullable } from '@dfinity/utils';

const statuses = ['Verified', 'Unverified'];

export default function PendingList() {
  const { t, changeLocale } = useLocalization(LANG);
  const [entriesList, setEntriesList] = useState<any[]>([]);
  const [processedList, setProcessedList] = useState<any>([]);
  const [isGetting, setIsGetting] = useState(true);
  const [itemOffset, setItemOffset] = useState(0);
  const [userArticleList, setUserArticleList] = useState<any[]>([]);
  const [activeListName, setActiveListName] = useState('All');
  const [activeList, setActiveList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [userDraftList, setUserDraftList] = useState<any[]>([]);
  const [oldAuth, setOldAuth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Unverified');
  const [forcePaginate, setForcePaginate] = useState(0);

  // const [entriesSize, setEntriesSize] = useState(0);
  // const [userEnriesSize, setUserEnriesSize] = useState(0);
  const [entriesSize, setEntriesSize] = useState<any>({
    all: 0,
    user: 0,
    draft: 0,
  });
  const router = useRouter();
  const pathName = usePathname();
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
  const userActorDefault = makeUserActor({
    agentOptions: {
      identity,
    },
  });

  let status: {
    verfied?: null;
    un_verfied?: null;
  } = { verfied: null };

  switch (selectedStatus) {
    case 'Verified':
      status = { verfied: null };
      break;
    case 'Unverified':
      status = { un_verfied: null };
      break;
    default:
      status = { verfied: null };
  }

  let itemsPerPage = 8;
  const entrySizeMap: EntrySizeMap = {
    All: 'all',
    Minted: 'all',
    Draft: 'draft',
    Mine: 'user',
  };

  const entrySizeKey: string = entrySizeMap[activeListName] || 'all';
  const pageCount = Math.ceil(entriesSize[entrySizeKey] / itemsPerPage);
  const getRefinedList = async (tempEntriesList: any[]) => {
    if (tempEntriesList.length === 0) {
      return [];
    }
    for (let entry = 0; entry < tempEntriesList.length; entry++) {
      let useremail = await userActorDefault.get_user_email(
        tempEntriesList[entry][1].user
      );
      if (useremail.length != 0) {
        if (useremail[0].email.lenght != 0) {
          tempEntriesList[entry][1].email = useremail[0].email[0];
        }
      }
      // logger(useremail,"useremail")
      let catagoryId = tempEntriesList[entry][1].catagory;
      let resp = await entryActorDefault.get_category(
        tempEntriesList[entry][1].catagory
      );
      let category: any = fromNullable(resp);
      let categoryName = 'No Category';
      if (category) {
        categoryName = category.name;
      }
      tempEntriesList[entry][1].catagoryId = catagoryId;
      tempEntriesList[entry][1].catagory = categoryName;

      if (tempEntriesList[entry][1].companyLogo) {
        tempEntriesList[entry][1].companyLogo = getImage(
          tempEntriesList[entry][1].companyLogo
        );
      }
    }
    return tempEntriesList;
  };
  const getDirectoriesList = async (reset?: boolean) => {
    if (
      !userAuth.userPerms?.articleManagement ||
      auth.state !== 'initialized' ||
      !identity
    ) {
      return [];
    }

    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    const resp = await entryActor.getWeb3DirectoriesDashboard(
      userCanisterId,
      status,
      'All',
      reset ? '' : search,
      forcePaginate * itemsPerPage,
      itemsPerPage
    );
    let amount = parseInt(resp.amount);
    setEntriesSize((prev: any) => ({
      ...prev,
      ['all']: amount,
    }));
    const tempList = resp.web3List;
    logger(tempList, 'safsdafdsfsdf');

    setEntriesList(tempList);
    return tempList;
  };

  const handlePageClick = async (event: any) => {
    setIsGetting(true);

    setForcePaginate(event.selected);

    let list: any = [];
    const newOffset = (event.selected * itemsPerPage) % entriesSize.all;
    const resp = await entryActorDefault.getWeb3DirectoriesDashboard(
      userCanisterId,
      status,
      'All',
      search,
      newOffset,
      itemsPerPage
    );
    const tempList = resp.web3List;
    logger(resp, 'abc_tempList');
    let amount = parseInt(resp.amount);
    setEntriesSize((prev: any) => ({
      ...prev,
      ['all']: amount,
    }));
    const listItems = await getRefinedList(tempList);
    setProcessedList(tempList);
    setIsGetting(false);
  };
  const filter = async (reset?: boolean) => {
    setForcePaginate(0);
    let list = [];
    setIsGetting(true);
    list = await getDirectoriesList(reset);
    const tempRefList = await getRefinedList(list);
    setProcessedList(tempRefList);
    // logger(tempRefList, 'listWeb3');

    setIsGetting(false);
  };
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      filter();
    }
  };
  const handleRefetch = async () => {
    setForcePaginate(0);
    setIsGetting(true);
    let list = await getDirectoriesList();
    const tempRefList = await getRefinedList(list);
    logger(tempRefList, 'tempRefList');

    setProcessedList(tempRefList);
    setIsGetting(false);
  };

  useEffect(() => {
    async function getdirectories() {
      setIsGetting(true);
      let list = await getDirectoriesList();
      const tempRefList = await getRefinedList(list);
      setProcessedList(tempRefList);
      setIsGetting(false);
    }
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.articleManagement && !userAuth.isAdminBlocked) {
        getdirectories();
      } else {
        router.replace('/super-admin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/super-admin');
    }
  }, [identity, pathName, userAuth, auth]);
  return (
    userAuth.userPerms?.articleManagement &&
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
                          Web3 Directories Management{' '}
                          <i className='fa fa-arrow-right' />{' '}
                          <span>Pending Web3 Directories</span>
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
                                placeholder='Search Web3 directory'
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
                                aria-label={t('all categories')}
                                value={selectedStatus}
                                onChange={(e) =>
                                  setSelectedStatus(e.target.value)
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
                      ) : processedList.length > 0 ? (
                        <DirectoryItems
                          currentItems={processedList}
                          handleRefetch={handleRefetch}
                        />
                      ) : (
                        <div className='d-flex justify-content-center w-ful'>
                          <h3>No Web3 Directory Found</h3>
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
