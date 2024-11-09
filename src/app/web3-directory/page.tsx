'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Breadcrumb, Dropdown, Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import arb from '@/assets/Img/Icons/arb.png';
import blockchain1 from '@/assets/Img/sidebar-icons/icon-blockchain-1.png';
import Defi1 from '@/assets/Img/sidebar-icons/icon-defi-1.png';
import Doa1 from '@/assets/Img/sidebar-icons/icon-dao-1.png';
import NFt1 from '@/assets/Img/sidebar-icons/icon-nft-1.png';
import Metaverse1 from '@/assets/Img/sidebar-icons/icon-metavers-1.png';
import Game1 from '@/assets/Img/sidebar-icons/icon-games-1.png';

import Coins1 from '@/assets/Img/Icons/icon-coins-2.png';
import directory2 from '@/assets/Img/Icons/icon-coins-1.png';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { User } from '@/types/profile';
import { getImage } from '@/components/utils/getImage';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import DirectorySlider from '@/components/DirectorySlider/DirectorySlider';
import CompanySlider from '@/components/CompanySlider/CompanySlider';
import { fromNullable } from '@dfinity/utils';
import { profileAspect, TOP_CATEGORIES_PER_PAGE } from '@/constant/sizes';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import CategoriesList from '@/components/CategoriesList';
import Web3ListbyCategoryId from '@/components/web3List/Web3List';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import ConnectModal from '@/components/Modal';
import { isUserConnected } from '@/components/utils/utcToLocal';
import { ADD_WEB3, CONTACT_US } from '@/constant/routes';

export default function Article() {
  const { t, changeLocale } = useLocalization(LANG);
  const [user, setUser] = useState<User | null>();
  const [featuredImage, setFeaturedImage] = useState<string | null>();
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const [trendingDirectries, setTrendingDirectries] = useState<any>([]);
  const [trendingDirectriesIds, setTrendingDirectriesIds] = useState<any>([]);
  const [inputText, setInputText] = useState(t('Search for Companies'));
  const [trendingDirectriesLoading, setTrendingDirectriesLoading] =
    useState(true);
  const [showWeb3Model, setShowWeb3Model] = useState(false);

  const [Web3BlockchainDir, setWeb3BlockchainDir] = useState<any>([]);
  const [CryptoDir, setCryptoDir] = useState<any>([]);
  const [DefiDir, setDefiDir] = useState<any>([]);
  const [DaoDir, setDaoDir] = useState<any>([]);
  const [NFTDir, setNFTDir] = useState<any>([]);
  const [MetaverseDir, setMetaverseDir] = useState<any>([]);
  const [BlockchainGameDir, setBlockchainGameDir] = useState<any>([]);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [Web3BlockchainDirLoading, setWeb3BlockchainDirLoading] =
    useState(true);
  const [CryptoDirLoading, setCryptoDirLoading] = useState(true);
  const [DefiDirLoading, setDefiDirLoading] = useState(true);
  const [DaoDirLoading, setDaoDirLoading] = useState(true);
  const [NFTDirLoading, setNFTDirLoading] = useState(true);
  const [MetaverseDirLoading, setMetaverseDirLoading] = useState(true);
  const specificElementRef = useRef(null);
  const [BlockchainGameDirLoading, setBlockchainGameDirLoading] =
    useState(true);

  const categoryId = searchParams.get('category');
  const [forcePaginate, setForcePaginate] = useState(0);
  const [isGetting, setIsGetting] = useState(true);
  const [hideMyContent, setHideMyContent] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [categoriesSize, setCategoriesSize] = useState(0);
  const promote = searchParams.get('promoted');
  const router = useRouter();
  const [categories, setCategories] = useState<any>([]);
  const [companyListOfIdSize, setCompanyListOfIdSize] = useState<any>(0);

  const [results, setResults] = useState<any>([]);
  const [companyListOfId, setCompanyListOfId] = useState<any>([]);
  const [OldCategory, setOldCategory] = useState<any>({
    name: '',
    logo: blockchain1,
  });

  const { auth, setAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
    identity: state.identity,
  }));
  const itemsPerPage = 6;
  let pageCount = Math.ceil(companyListOfIdSize / itemsPerPage);

  let addcompanyfn = (e: any) => {
    e.preventDefault();
    // if (!identity) return toast.error('Please connect to internet identity.');
    if (!isUserConnected(auth, handleConnectModal)) return;
    setShowWeb3Model(true);
  };

  function searchbtnclicked() {
    getAllWeb3List(search);
    if (categoryId) {
      getCategory();

      getCompniesByCategory(search, 0, itemsPerPage);
    } else {
      getDirectoriesTopCategories();
    }
  }
  function resetbtnclicked() {
    setSearch('');
    getAllWeb3List();
    if (categoryId) {
      getCategory();

      getCompniesByCategory('', 0, itemsPerPage);
    } else {
      getDirectoriesTopCategories(true);
    }
  }
  let getCompniesByCategory = async (
    searchString = '',
    pageCount: any,
    itemsPerPage: any
  ) => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    let TempDirectory = null;
    let tempWeb3 = await entryActor.getWeb3ListOfAllUsers(
      categoryId,
      searchString,
      pageCount,
      itemsPerPage
    );
    let amountOfcompany = parseInt(tempWeb3?.amount);
    setCompanyListOfIdSize(amountOfcompany);
    if (tempWeb3?.web3List?.length != 0) {
      let web3array = tempWeb3.web3List;

      for (let dirc = 0; dirc < web3array.length; dirc++) {
        let resp = await entryActor.get_category(web3array[dirc][1].catagory);
        let category: any = fromNullable(resp);
        let categoryName = 'No Category';
        if (category) {
          categoryName = category.name;
        }
        web3array[dirc][1].catagory = categoryName;
        web3array[dirc][1].companyBanner = await getImage(
          web3array[dirc][1].companyBanner
        );
        web3array[dirc][1].founderImage = await getImage(
          web3array[dirc][1].founderImage
        );
        web3array[dirc][1].companyLogo = await getImage(
          web3array[dirc][1].companyLogo
        );
      }
      TempDirectory = web3array.sort(
        (f: any, l: any) => Number(l[1].likes) - Number(f[1].likes)
      );
    }
    if (TempDirectory) {
      setCompanyListOfId(TempDirectory);
    } else {
      setCompanyListOfId([]);
    }
    setIsGetting(false);
  };
  const getCategory = async () => {
    if (!categoryId) {
      return;
    }
    const defaultEntryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    let resp = await defaultEntryActor.get_category(categoryId);
    let category: any = fromNullable(resp);
    if (category) {
      setOldCategory({
        name: category.name,
        logo: getImage(category.logo),
      });
    }
  };
  let getDirectoriesTopCategories = async (reset: boolean = false) => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    let listCatagory = await entryActor.get_categories('', 0, TOP_CATEGORIES_PER_PAGE, false);
    if (listCatagory?.entries) {
      if (listCatagory?.entries.length != 0) {
        // logger(listCatagory, 'listCatagory');

        const resultsweb3 = [];

        for (const category of listCatagory?.entries) {
          const result = await getWeb3ByCategory(category[0], reset);
          category[1].logo = await getImage(category[1].logo);
          // Create a new object with the category and result
          const categoryResult = {
            category: category,
            companyList: result,
          };

          resultsweb3.push(categoryResult);
        }
        setResults(resultsweb3);
        setIsGetting(false);
      }
    }
  };
  let getAllWeb3List = async (searchString = '') => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    let TempDirectory = null;
    let tempWeb3 = await entryActor.getWeb3ListOfAllUsers(
      'All',
      searchString,
      0,
      10
    );

    if (tempWeb3?.web3List?.length != 0) {
      let web3array = tempWeb3.web3List;
      let categoriesIds = [];
      for (let dirc = 0; dirc < web3array.length; dirc++) {
        let resp = await entryActor.get_category(web3array[dirc][1].catagory);
        categoriesIds.push(web3array[dirc][0]);
        let category: any = fromNullable(resp);
        let categoryName = 'No Category';
        if (category) {
          categoryName = category.name;
        }
        web3array[dirc][1].catagory = categoryName;
        web3array[dirc][1].companyBanner = await getImage(
          web3array[dirc][1].companyBanner
        );
        web3array[dirc][1].founderImage = await getImage(
          web3array[dirc][1].founderImage
        );
        web3array[dirc][1].companyLogo = await getImage(
          web3array[dirc][1].companyLogo
        );
      }
      setTrendingDirectriesIds(categoriesIds);
      TempDirectory = web3array.sort(
        (f: any, l: any) => Number(l[1].likes) - Number(f[1].likes)
      );
    }
    if (TempDirectory) {
      setTrendingDirectries(TempDirectory);
    } else {
      setTrendingDirectries([]);
    }
    setTrendingDirectriesLoading(false);
    // const promted = await entryActor.getPromotedEntries();
    // logger(promted, 'PROMTED ENTRIES');
  };
  let getWeb3ByCategory = async (catagoryId: string, reset?: boolean) => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    let TempDirectory = [];
    let tempWeb3 = await entryActor.getWeb3ListOfAllUsers(
      catagoryId,
      reset ? '' : search,
      0,
      10
    );
    if (tempWeb3?.web3List?.length != 0) {
      // let web3array = tempWeb3.web3List.filter((e:string)=>e[0]!=directoryId);
      let web3array = tempWeb3.web3List;

      for (let dirc = 0; dirc < web3array.length; dirc++) {
        web3array[dirc][1].companyBanner = await getImage(
          web3array[dirc][1].companyBanner
        );
        web3array[dirc][1].founderImage = await getImage(
          web3array[dirc][1].founderImage
        );
        web3array[dirc][1].companyLogo = await getImage(
          web3array[dirc][1].companyLogo
        );
      }
      TempDirectory = web3array;
    }
    return TempDirectory;
  };
  const handlePageClick = async (event: any) => {
    // setIsGetting(true);

    setForcePaginate(event.selected);
    const newOffset = (event.selected * itemsPerPage) % companyListOfIdSize;
    getCompniesByCategory('', newOffset, itemsPerPage);
  };

  const handlefouce = (e: any) => {
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      getAllWeb3List(search);

      if (categoryId) {
        getCategory();

        getCompniesByCategory(search, 0, itemsPerPage);
      } else {
        getDirectoriesTopCategories();
      }
    }
  };

  const handleConnectModal = () => {
    // e.preventDefault();
    setShowConnectModal(true);
    // setConnectLink(e);
  };
  const handleConnectModalClose = () => {
    setShowConnectModal(false);
  };

  let reFetchfn = () => {
    getAllWeb3List();
    if (categoryId) {
      getCategory();

      getCompniesByCategory('', 0, itemsPerPage);
    } else {
      getDirectoriesTopCategories();
    }
  };
  useEffect(() => {
    if (auth.state == 'anonymous' || auth.state === 'initialized') {
      getAllWeb3List();
      if (categoryId) {
        getCategory();

        getCompniesByCategory('', 0, itemsPerPage);
      } else {
        getDirectoriesTopCategories();
      }
    }
  }, [auth, promote, categoryId]);

  useEffect(() => {
    pageCount = Math.ceil(companyListOfIdSize / itemsPerPage);
  }, [companyListOfIdSize]);
  // router.push('/route')
  return (
    <>
      <main id='main'>
        <div className='main-inner web-page'>
          <div className='inner-content'>
            <Row>
              <Col xl='12' lg='12' md='12'>
                <Breadcrumb className='new-breadcrumb web'>
                  <Breadcrumb.Item>
                    <Link href='/'>
                      <i className='fa fa-home' />
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active={categoryId ? false : true}>
                    <Link href={`/web3-directory`}>
                      {t('Web3 ')}
                      {t('webDirectory')}
                    </Link>
                  </Breadcrumb.Item>
                  {categoryId && (
                    <Breadcrumb.Item active={categoryId ? true : false}>
                      <Link href={`/web3-directory?category=${categoryId}`}>
                        {OldCategory.name}
                      </Link>
                    </Breadcrumb.Item>
                  )}
                </Breadcrumb>
              </Col>
              <Col xl='8' lg='8'>
               
                <h1 style={{ fontWeight: 700 }}>
                  {t('List of Web3 Companies')}
                </h1>
                <p>
                  {t(
                    'Welcome to our Web3 Directory! Your go-to resource for discovering companies working in the fields of blockchain technology, decentralized finance (DeFi), GameFi, NFTs, DAOs, and dApps. Here, you will find the detailed information about each project, including its objectives, technology stack, team, and community. Whether you are an investor, a developer, or simply a Web3 enthusiast, this database is your one-stop destination.Explore a comprehensive list of companies actively contributing to the evolution of the Web3 through blockchain technology. Embark upon the Web3 journey today by listing your project with us.'
                  )}
                </p>
              </Col>
              <Col xl='4' lg='4' className='text-right'>
               
                <div
                  className='search-post-pnl search-pnl small'
                  id='companySecrch'
                >
                  <input
                    type='text'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='form-control'
                    placeholder={inputText}
                    onKeyDown={handleSearch}
                    ref={inputRef}
                  />
                  {search.length >= 1 && (
                    <button onClick={resetbtnclicked}>
                      <i className='fa fa-xmark mx-1' />
                    </button>
                  )}
                  <button onClick={searchbtnclicked}>
                    <i className='fa fa-search' />
                  </button>
                </div>
                <div className='spacer-30' />
              </Col>

              <Col xl='12' lg='12'>
                <h3>
                  <Image src={arb} alt='Arb' />
                  {t('Trending Companies')}
                </h3>
                <div className='spacer-30' />
              </Col>
              <Col xl='12' lg='12'>
                {trendingDirectriesLoading ? (
                  <Spinner className='d-flex m-auto' animation='border' />
                ) : (
                  <CompanySlider trendingDirectries={trendingDirectries} />
                )}
              </Col>
              <Col xl='12' lg='12'>
                <div className='flex-details-pnl'>
                  <div className='left-side-pnl'>
                    <div className='spacer-50' />
                    <div
                      style={{
                        position: 'sticky',
                        top: '0',
                        minHeight: '120px',
                      }}
                    >
                      <ul className='faq-btn-list'>
                        <li>
                          <Link href={CONTACT_US} className='reg-btn faq-btn'>
                            {t('FAQ')}
                          </Link>
                        </li>
                        <li>
                          <Dropdown
                            onClick={() => setHideMyContent((pre: any) => !pre)}
                          >
                            <Dropdown.Toggle
                              variant='success'
                              className='fill'
                              id='dropdown-basic'
                            >
                              {t('All Company')}{' '}
                              {hideMyContent ? (
                                <i className='fa fa-angle-down' />
                              ) : (
                                <i className='fa fa-angle-right' />
                              )}
                            </Dropdown.Toggle>
                          </Dropdown>
                        </li>
                      </ul>
                      <ul
                        className='tab-blue-list'
                        style={{ display: hideMyContent ? 'block' : 'none' }}
                      >
                        <li>
                          <Link
                            className='active'
                            href='#'
                            onClick={(e: any) => {
                              handlefouce(e);
                              setInputText(t('Search for People'));
                            }}
                          >
                            <i className='fa fa-angle-right' />{' '}
                            {t('Search for People')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href='#companySecrch'
                            onClick={(e: any) => {
                              handlefouce(e);
                              setInputText(t('Search for Companies'));
                            }}
                          >
                            <i className='fa fa-angle-right' />{' '}
                            {t('search companies')}
                          </Link>
                        </li>
                      </ul>
                      <Link
                        href={ADD_WEB3}
                        className='reg-btn trans'
                        style={{
                          display: hideMyContent ? 'inline-block' : 'none',
                        }}
                        // onClick={(e: any) => addcompanyfn(e)}
                      >
                        {t('Submit your Listing')}
                      </Link>
                    </div>
                  </div>

                  <div className='right-detail-pnl'>
                    {!categoryId &&
                      results.lenght != 0 &&
                      results.map((company: any, index: string) => {
                        return (
                          company.companyList.length != 0 && (
                            <div className='slide-cntnr' key={index}>
                              <h3 className='d-flex'>
                                <div
                                  style={{
                                    aspectRatio: profileAspect,
                                    height: '30px',
                                    width: '30px',
                                    position: 'relative',
                                  }}
                                  className='me-2'
                                >
                                  <Image
                                    src={
                                      company.category[1].logo
                                        ? company.category[1].logo
                                        : blockchain1
                                    }
                                    fill
                                    alt='Infinity'
                                    className='rounded-circle'
                                  />
                                </div>
                                {company.category[1].name}
                              </h3>
                              <div className='slid-bg'>
                                <DirectorySlider
                                  relatedDirectory={company.companyList}
                                  trendingDirectriesIds={trendingDirectriesIds}
                                />
                              </div>
                            </div>
                          )
                        );
                      })}
                    {categoryId && (
                      <Row>
                        <Col xxl='12'>
                          {isGetting ? (
                            <div className='d-flex justify-content-center w-full'>
                              <Spinner />
                            </div>
                          ) : companyListOfId.length > 0 ? (
                            <div className='slide-cntnr'>
                              <h3 className='d-flex'>
                                <div
                                  style={{
                                    aspectRatio: profileAspect,
                                    height: '30px',
                                    width: '30px',
                                    position: 'relative',
                                  }}
                                  className='me-2'
                                >
                                 
                                  <Image
                                    src={OldCategory.logo}
                                    fill
                                    alt='Infinity'
                                    className='rounded-circle'
                                  />
                                </div>
                                {OldCategory.name}
                              </h3>
                              <div className='slid-bg d-flex justify-content-center flex-wrap '>
                                <Web3ListbyCategoryId
                                  relatedDirectory={companyListOfId}
                                  trendingDirectriesIds={trendingDirectriesIds}
                                />
                              </div>
                            </div>
                          ) : (
                            <p className='text-center'>
                              {t('No Company Found')}
                            </p>
                          )}
                        </Col>
                        <div className='pagination-container mystyle d-flex justify-content-center mt-3'>
                          {!isGetting && companyListOfId.length > 0 && (
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
                      </Row>
                    )}
                  </div>
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
