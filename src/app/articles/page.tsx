'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage, iframeimgThumbnail } from '@/components/utils/getImage';
import { ArticlesList } from '@/components/ArticlesList';
import { EntrySizeMap } from '@/types/dashboard';
import { fromNullable } from '@dfinity/utils';
import getCategories from '@/components/utils/getCategories';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { ALL_ARTICLES} from '@/constant/routes';

export default function Reward() {
  const [processedList, setProcessedList] = useState<any[]>([]);
  const [isGetting, setIsGetting] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeListName, setActiveListName] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userDraftList, setUserDraftList] = useState<any[]>([]);
  const [oldAuth, setOldAuth] = useState('');
  const [forcePaginate, setForcePaginate] = useState(0);
  const { t, changeLocale } = useLocalization(LANG);
  const [showLoader, setShowLoader] = useState(true);
  // const [entriesSize, setEntriesSize] = useState(0);
  // const [userEnriesSize, setUserEnriesSize] = useState(0);
  const location = usePathname();

  const [entriesSize, setEntriesSize] = useState<any>({
    all: 0,
    user: 0,
    draft: 0,
  });
  const router = useRouter();
  const pathName = usePathname();
  const { auth, setAuth, identity } = useConnectPlugWalletStore(
    (state: any) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
    })
  );
  const entryActorDefault = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  let itemsPerPage = 20;
  const entrySizeMap: EntrySizeMap = {
    All: 'all',
    Minted: 'all',
    Draft: 'draft',
    Mine: 'user',
    MyMinted: 'user',
  };
  const entrySizeKey = entrySizeMap[activeListName] || 'all';
  const pageCount = Math.ceil(entriesSize[entrySizeKey] / itemsPerPage);

  const getRefinedList = async (tempEntriesList: any[]) => {
    if (tempEntriesList.length === 0) {
      return [];
    }
    // const userActor = makeUserActor({
    //   agentOptions: {
    //     identity,
    //   },
    // });
    const refinedPromise = await Promise.all(
      tempEntriesList.map(async (entry: any) => {
        let image = null;
        // entry[1].isPodcast= entry[1].isPodcast;
        logger(tempEntriesList, 'tempEntriesList');

        if (entry[1].image) {
          image = getImage(entry[1].image[0]);
        }
        if (entry[1].podcastImg.length != 0) {
          image = getImage(entry[1].podcastImg[0]);
        }
        if (entry[1].podcastVideoLink != '') {
          image = iframeimgThumbnail(entry[1].podcastVideoLink);
        }

        const userId = entry[1].user.toString();
        let categoryNames = await Promise.all(
          entry[1].category?.map(async (categoryId: string) => {
            let resp = await entryActorDefault.get_category(categoryId);
            let category: any = fromNullable(resp);
            let categoryName = 'No Category';
            if (category) {
              categoryName = category.name;
            }
            return categoryName;
          })
        );
        let isQuizId = null;
        let quiz = await entryActorDefault.getQuizIdsList_Of_article(entry[0]);
        if (quiz && quiz.length != 0) {
          isQuizId = quiz[0];
        }
        let isSurveyId = null;
        let survey = await entryActorDefault.getSurveyIdsList_Of_article(
          entry[0]
        );
        if (survey && survey.length != 0) {
          isSurveyId = survey[0];
        }
        // const user = await userActor.get_user_details([userId]);
        let newItem = {
          entryId: entry[0],
          creation_time: entry[1].creation_time,
          image: image,
          categories: categoryNames,
          categoriesId: entry[1].category,

          title: entry[1].title,
          isDraft: entry[1].isDraft,
          isPromoted: entry[1].isPromoted,
          userName: entry[1].userName,
          minters: entry[1].minters,
          userId,
          status: entry[1].status,
          pressRelease: entry[1].pressRelease,
          isPodcast: entry[1].isPodcast,
          isStatic: entry[1].isStatic,
          isQuizId,
          isSurveyId,
        };
        // if (user.ok) {
        //   newItem.userName = user.ok[1].name ?? entry[1].userName;
        // }
        return newItem;
      })
    );

    return refinedPromise;
  };
  const getEntriesList = async (all?: string, reset?: boolean) => {
    // logger(activeListName,"activeListName")

    const categ = all ? all : selectedCategory;
    // logger({search,reset}, 'EntriweresList');

    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const resp = await entryActor.getEntriesList(
      categ,
      false,
      reset ? '' : search,
      reset ? 0 : forcePaginate * itemsPerPage,
      itemsPerPage
    );
    let amount = parseInt(resp.amount);
    setEntriesSize((prev: any) => ({
      ...prev,
      all: amount,
    }));
    const tempList = resp.entries;
    return tempList;
  };

  const getUserEntries = async (
    reset?: boolean,
    draft: boolean = false,
    all?: string
  ) => {
    // logger({reset,draft,all,search}, 'Entri234esList');

    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const resp = await entryActor.getUserEntriesList(
      all ? 'All' : selectedCategory,
      draft,
      reset ? '' : search,
      reset ? 0 : forcePaginate * itemsPerPage,
      itemsPerPage
    );
    const tempList = resp.entries;

    // setEntriesSize();
    let amount = parseInt(resp.amount);

    if (draft) {
      setUserDraftList(tempList);
      setEntriesSize((prev: any) => ({
        ...prev,
        draft: amount,
      }));
    } else {
      setEntriesSize((prev: any) => ({
        ...prev,
        user: amount,
      }));
    }
    if (reset) {
      return tempList;
    }
    return tempList;
    // logger(myEntries, 'Entries List fetched from canister');
  };
  const getEntriesSize = async () => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    let size = await entryActor.getEntriesLength();
    // setEntriesSize(parseInt(size));
  };
  // Invoke when user click to request another page.
  const handlePageClick = async (event: any) => {
    setIsGetting(true);

    setForcePaginate(event.selected);

    let list: any = [];
    if (activeListName === 'All' || activeListName === 'Minted') {
      const newOffset = (event.selected * itemsPerPage) % entriesSize.all;
      const resp = await entryActorDefault.getEntriesList(
        selectedCategory,
        false,
        search,
        newOffset,
        itemsPerPage
      );
      list = resp.entries;
    } else if (activeListName === 'Mine' || activeListName === 'MyMinted') {
      const newOffset = (event.selected * itemsPerPage) % entriesSize.user;

      const resp = await entryActorDefault.getUserEntriesList(
        selectedCategory,
        false,
        search,
        newOffset,
        itemsPerPage
      );
      list = resp.entries;
    } else if (activeListName === 'Draft') {
      const newOffset = (event.selected * itemsPerPage) % entriesSize.draft;
      const resp = await entryActorDefault.getUserEntriesList(
        selectedCategory,
        true,
        search,
        newOffset,
        itemsPerPage
      );
      list = resp.entries;
    }
    const tempList = await getRefinedList(list);
    setProcessedList(tempList);
    setIsGetting(false);
  };
  const handleTabChange = async (tab: string) => {
    setIsGetting(true);
    setSelectedCategory('All');
    setActiveListName(tab);
    setForcePaginate(0);
    let list = [];
    if (tab === 'All' || tab === 'Minted') {
      list = await getEntriesList('All');
    } else if (tab === 'Mine' || tab === 'MyMinted') {
      list = await getUserEntries(true, false, 'All');
    } else if (tab === 'Draft') {
      list = await getUserEntries(true, true, 'All');
    }
    const tempList = await getRefinedList(list);
    setProcessedList(tempList);
    setIsGetting(false);
  };

  const filter = async () => {
    setForcePaginate(0);
    let list = [];
    if (activeListName == 'All' || activeListName == 'Minted') {
      list = await getEntriesList(selectedCategory, false);
    } else if (activeListName === 'Mine' || activeListName === 'MyMinted') {
      list = await getUserEntries(false);
    } else if (activeListName === 'Draft') {
      list = await getUserEntries(false, true);
    }
    // logger({ list,activeListName }, '343652sad5ghhh');

    const tempRefList = await getRefinedList(list);
    setProcessedList(tempRefList);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      filter();
    }
  };
  const resetVals = async () => {
    setSearch('');
    setForcePaginate(0);
    let list = [];
    if (activeListName == 'All' || activeListName == 'Minted') {
      list = await getEntriesList('All', true);
    } else if (activeListName === 'Mine' || activeListName === 'MyMinted') {
      list = await getUserEntries(true, false);
    } else if (activeListName === 'Draft') {
      list = await getUserEntries(true, true);
    }

    const tempRefList = await getRefinedList(list);
    setProcessedList(tempRefList);
  };
  useEffect(() => {
    async function getData() {
      const _categories = await getCategories(identity);
      setCategories(_categories);
    }

    getData();
  }, [auth, identity]);

  useEffect(() => {
    logger({ auth: auth.state, identity }, 'current auth');
    if (identity) {
      if (auth.state !== oldAuth) {
        getUserEntries();
        handleTabChange('Mine');
        getUserEntries(false, true);
        setOldAuth(auth.state);
        getEntriesList();
      }
    } else if (auth.state === 'anonymous') {
      handleTabChange('All');
    }
  }, [identity, pathName, auth]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (location.startsWith("/articles") && !location.endsWith('/')) {
     router.push(`${ALL_ARTICLES}`);
   }
     }, [])
  return (
    <>
      <main id='main'>
        <div className='main-inner home'>
          <Head>
            <title>Hi</title>
          </Head>
          <div className='section' id='top'>
            <Row>
              <Col xl='12' lg='12'>
                <div className='pbg-pnl text-left'>
                  <Row>
                    <Col xl='12' lg='12'>
                      <div className='flex-div-sm'>
                        <div>
                          {auth.state === 'initialized' && (
                            <Button
                              className='default-btn'
                              onClick={() => router.push('/add-article')}
                            >
                              <i className='fa fa-plus' /> {t('create article')}
                            </Button>
                          )}
                        </div>

                        <div>
                          <div
                            className='search-post-pnl'
                            style={{ minWidth: '300px' }}
                          >
                            <input
                              type='text'
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              placeholder={t('search post')}
                              onKeyDown={handleSearch}
                            />
                            {search.length >= 1 && (
                              <button onClick={resetVals}>
                                <i className='fa fa-xmark mx-1' />
                              </button>
                            )}
                            <button onClick={filter}>
                              <i className='fa fa-search' />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xl='12' lg='12'>
                      <ul className='all-filters-list'>
                        {auth.state !== 'initialized' && (
                          <li>
                            <span
                              onClick={() => handleTabChange('All')}
                              className={
                                activeListName === 'All' ? 'active' : ''
                              }
                            >
                              <p>{t('all')}</p>({entriesSize.all})
                            </span>
                          </li>
                        )}
                        {auth.state === 'initialized' && (
                          <li>
                            <span
                              onClick={() => handleTabChange('Mine')}
                              className={
                                activeListName === 'Mine' ? 'active' : ''
                              }
                            >
                              <p> {t('all')} </p>({entriesSize.user})
                            </span>
                          </li>
                        )}
                        {auth.state !== 'initialized' && (
                          <li>
                            <span
                              onClick={() => handleTabChange('Minted')}
                              className={
                                activeListName === 'Minted' ? 'active' : ''
                              }
                            >
                              <p>{t('minted articles')}</p>({entriesSize.all})
                            </span>
                          </li>
                        )}{' '}
                        {auth.state === 'initialized' && (
                          <li>
                            <span
                              onClick={() => handleTabChange('MyMinted')}
                              className={
                                activeListName === 'MyMinted' ? 'active' : ''
                              }
                            >
                              <p>{t('minted articles')}</p>({entriesSize.user})
                            </span>
                          </li>
                        )}
                        {/* <li>
                            <Link href='/'>
                              <p>Pending</p>
                              (8)
                            </Link>
                          </li> */}
                        {auth.state === 'initialized' && (<>
                          <li>
                            <span
                              onClick={() => handleTabChange('Draft')}
                              className={
                                activeListName === 'Draft' ? 'active' : ''
                              }
                            >
                              <p> {t('draft')} </p>({entriesSize.draft ?? '0'})
                            </span>
                          </li>
                         </>
                        )}
                      </ul>
                    </Col>
                    <Col xl='6' lg='12'>
                      <div className='full-div'>
                        <ul className='filter-list'>
                         
                          <li>
                            <Form.Select
                              aria-label={t('all categories')}
                              value={selectedCategory}
                              onChange={(e) =>
                                setSelectedCategory(e.target.value)
                              }
                            >
                              <option value={'All'}>
                                {t('all categories')}
                              </option>
                              {categories &&
                                categories.map((category: any, index) => (
                                  <option value={category[0]} key={index}>
                                    {category[1].name}
                                  </option>
                                ))}
                            </Form.Select>
                          </li>
                          <li>
                            <Button
                              className='filter-btn showbtn'
                              onClick={filter}
                            >
                              {t('filter')}
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </Col>
                    <Col xl='6' lg='12'>
                      <div className='pagination-container flexEnd'>
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
                      </div>
                    </Col>
                    {isGetting || showLoader ? (
                      <div className='d-flex justify-content-center w-full'>
                        <Spinner />
                      </div>
                    ) : processedList.length > 0 ? (
                      <ArticlesList
                        currentTab={activeListName}
                        currentItems={processedList}
                        handleTabChange={handleTabChange}
                      />
                    ) : (
                      <p>{t('No Articles Found')}</p>
                    )}
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </main>
    </>
  );
}
