'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Breadcrumb, Dropdown, Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import arb from '@/assets/Img/Icons/diamond.gif';
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
import DirectorySlider from '@/components/DirectorySliderNew/DirectorySlider';
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
import { redirect } from 'next/navigation';	
import '../../styles/custom_directory.css';
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
  const [isLoading, setIsLoading] = useState(true); 
  const [companyList, setCompanyList] = useState([]);
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
  let getDirectoriesTopCategories = async (reset = false) => { 
    try {
        const entryActor = makeEntryActor({
            agentOptions: {
                identity,
            },
        });

        // Fetch categories from the backend
        let listCategory = await entryActor.get_categories('', 0, TOP_CATEGORIES_PER_PAGE, true); // Set `isParentOnly` to `true`

        if (listCategory?.entries && listCategory.entries.length > 0) {
            const resultsWeb3 = [];

            for (const category of listCategory.entries) {
                try {
                    // Check if the category is a parent category (exclude subcategories)
                    if (!category[1]?.parentId || category[1]?.parentId === null) {
                        // Fetch associated companies for the category
                        const companyList = await getWeb3ByCategory(category[0], reset);

                        // Fetch and assign the category logo
                        if (category[1]?.logo) {
                            category[1].logo = await getImage(category[1].logo);
                        }

                        // Create a new object with category details and associated company list
                        const categoryResult = {
                            category, // Parent category details
                            companyList, // Associated companies
                        };

                        // Add the result to the final list
                        resultsWeb3.push(categoryResult);
                    }
                } catch (error) {
                    console.error(`Error processing category ${category[0]}:`, error);
                }
            }

            // Update state with results
            setResults(resultsWeb3);
        } else {
            // If no categories found, reset results
            setResults([]);
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
    } finally {
        // Set loading state to false
        setIsGetting(false);
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
  let getWeb3ByCategory = async (categoryId: string, reset?: boolean) => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
  
    try {
      let TempDirectory = [];
  
      // Fetch all categories to find subcategories
      const categoryResp = await entryActor.get_list_categories("", 0, 100, false);
      const allCategories = categoryResp.entries || [];
  
      // Find parent category
      const parentCategory = allCategories.find(
        ([id]: [string, any]) => id === categoryId
      );
  
      if (!parentCategory) {
        console.warn(`Parent category with ID ${categoryId} not found.`);
        return [];
      }
  
      // Get subcategory IDs
      const subcategoryIds = parentCategory[1]?.children?.flat() || [];
      console.log(`Subcategories for parent category (${categoryId}):`, subcategoryIds);
  
      // Fetch Web3 companies for parent category
      console.log(`Fetching companies for parent category (${categoryId})...`);
      const parentCompaniesResp = await entryActor.getWeb3ListOfAllUsers(
        categoryId,
        reset ? "" : search,
        0,
        10
      );
      const parentCompanies = parentCompaniesResp?.web3List || [];
      console.log(`Parent category companies (${categoryId}):`, parentCompanies);
  
      // Fetch Web3 companies for each subcategory
      const subcategoryCompanies = await Promise.all(
        subcategoryIds.map(async (subcategoryId: string) => {
          const resp = await entryActor.getWeb3ListOfAllUsers(
            subcategoryId,
            reset ? "" : search,
            0,
            10
          );
          console.log(`Companies for subcategory (${subcategoryId}):`, resp?.web3List);
          return resp?.web3List || [];
        })
      );
  
      // Flatten subcategory company results
      const allSubcategoryCompanies = subcategoryCompanies.flat();
  
      // Combine parent and subcategory companies
      const allCompanies = [...parentCompanies, ...allSubcategoryCompanies];
      console.log(`Combined companies (parent + subcategories):`, allCompanies);
  
      // Process images for all companies
      for (let dirc = 0; dirc < allCompanies.length; dirc++) {
        allCompanies[dirc][1].companyBanner = await getImage(
          allCompanies[dirc][1].companyBanner
        );
        allCompanies[dirc][1].founderImage = await getImage(
          allCompanies[dirc][1].founderImage
        );
        allCompanies[dirc][1].companyLogo = await getImage(
          allCompanies[dirc][1].companyLogo
        );
      }
  
      // Update TempDirectory with the combined results
      TempDirectory = allCompanies;
  
      return TempDirectory;
    } catch (error) {
      console.error("Error fetching companies for category and subcategories:", error);
      return [];
    }
    finally {
      setIsLoading(false); // End loading
    }
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
  if (LANG === 'jp') {
    if (categoryId === "1710822432496415429") {
      redirect("/web3-directory/blockchain/");
    } else if (categoryId === "1710137112381095238") {
      redirect("/web3-directory/web3/");
    } else if (categoryId === "1710822461756881598") {
      redirect("/web3-directory/metaverse/");
    } else if (categoryId === "1710822512655241150") {
      redirect("/web3-directory/defi/");
    } else if (categoryId === "1710822374423109041") {
      redirect("/web3-directory/nft/");
    } else if (categoryId === "1710822404046076093") {
      redirect("/web3-directory/blockchain_games/");
    } else if (categoryId === "1710822326165086912") {
      redirect("/web3-directory/dao/");
    } else if (categoryId === "1710821043195619936") {
      redirect("/web3-directory/artificial_intelligence/");
    } else if (categoryId === "1710822487300013125") {
      redirect("/web3-directory/cryptocurrency/");
    }
}
else {

  if (categoryId === "1718641457527889243") {
    redirect("/web3-directory/blockchain/");
  } else if (categoryId === "1718641230817970431") {
    redirect("/web3-directory/web3/");
  } else if (categoryId === "1718641722539268658") {
    redirect("/web3-directory/metaverse/");
  } else if (categoryId === "1719210427243611048") {
    redirect("/web3-directory/defi/");
  } else if (categoryId === "1718968029182069160") {
    redirect("/web3-directory/nft/");
  } else if (categoryId === "1719210909413102943") {
    redirect("/web3-directory/blockchain_games/");
  } else if (categoryId === "1719211072131510431") {
    redirect("/web3-directory/dao/");
  } else if (categoryId === "1718645044417924753") {
    redirect("/web3-directory/artificial_intelligence/");
  } else if (categoryId === "1719210557164450999") {
    redirect("/web3-directory/cryptocurrency/");
  } else if (categoryId === "1733372612188333953") {
    redirect("/web3-directory/crypto_casinos/");
  } else if (categoryId === "1719996329928054919") {
    redirect("/web3-directory/crypto_exchange/");
  } else if (categoryId === "1733811680276587369") {
    redirect("/web3-directory/metaverse_event/");
  } else if (categoryId === "1733812308626822422") {
    redirect("/web3-directory/decentralized_identity/");
  } else if (categoryId === "1733812196425088158") {
    redirect("/web3-directory/play_to_earn_platform/");
  } else if (categoryId === "1733812098678890519") {
    redirect("/web3-directory/yield_aggregators/");
  } else if (categoryId === "1733812032008771908") {
    redirect("/web3-directory/stablecoins/");
  } else if (categoryId === "1733893281096454324") {
    redirect("/web3-directory/web3_quest_platforms/");
  } else if (categoryId === "1734755238584631722") {
    redirect("/web3-directory/art_and_collectibles/");
  } else if (categoryId === "1734694106651227147") {
    redirect("/web3-directory/trading_tools/");
  } else if (categoryId === "1734693999550706547") {
    redirect("/web3-directory/crypto_staking/");
  } else if (categoryId === "1734693916560140791") {
    redirect("/web3-directory/crypto_launchpad/");
  } else if (categoryId === "1734693792312640861") {
    redirect("/web3-directory/rwa_token/");
  } else if (categoryId === "1734693690370917845") {
    redirect("/web3-directory/ai_token/");
  } else if (categoryId === "1734693633491771452") {
    redirect("/web3-directory/memes_token/");
  } else if (categoryId === "1734693506407308537") {
    redirect("/web3-directory/crypto_influencer/");
  } else if (categoryId === "1734693434218287154") {
    redirect("/web3-directory/crypto_researcher/");
  } else if (categoryId === "1734693367505013990") {
    redirect("/web3-directory/crypto_wallets/");
  } else if (categoryId === "1734693286462153755") {
    redirect("/web3-directory/crypto_payment/");
  } else if (categoryId === "1734693187972887198") {
    redirect("/web3-directory/crypto_exchanges/");
  } else if (categoryId === "1734691423559751365") {
    redirect("/web3-directory/game_yield/");
  } else if (categoryId === "1734691336642323972") {
    redirect("/web3-directory/game_developers/");
  } else if (categoryId === "1734691245391613588") {
    redirect("/web3-directory/game_nfts/");
  } else if (categoryId === "1734691156243443891") {
    redirect("/web3-directory/esports/");
  } else if (categoryId === "1734691021602384200") {
    redirect("/web3-directory/play_to_earn_platforms/");
  } else if (categoryId === "1734690830682032730") {
    redirect("/web3-directory/ai_tools/");
  } else if (categoryId === "1734687473022341658") {
    redirect("/web3-directory/tokenized_global_bonds/");
  } else if (categoryId === "1734687085396474546") {
    redirect("/web3-directory/us_treasuries/");
  } else if (categoryId === "1734686933366281010") {
    redirect("/web3-directory/tokenization_protocols/");
  }

}
    
    
  
  const totalCompanies = companyListOfIdSize > 0
  ? companyListOfIdSize
  : results.reduce((sum: number, company: any) => {
      return sum + (Array.isArray(company?.companyList) ? company.companyList.length : 0);
    }, 0);


  
  results.forEach((company) => {
    console.log("Current Company Object:", company.companyList); // Debug: Log the full company objec
    
  });
  
  //const web3categoryId = "1719210909413102943"; // Example ID

  const getCategoryLinkById = (categoryId) => {
    const web3categories = LANG === 'jp'
  ? [{ name: "blockchain", id: "1710822432496415429" },
    { name: "web3", id: "1710137112381095238" },
    { name: "metaverse", id: "1710822461756881598" },
    { name: "defi", id: "1710822512655241150" },
    { name: "nft", id: "1710822374423109041" },
    { name: "blockchain_games", id: "1710822404046076093" },
    { name: "dao", id: "1710822326165086912" },
    { name: "artificial_intelligence", id: "1710821043195619936" },
    { name: "cryptocurrency", id: "1710822487300013125" }] 
  :[
      { name: "blockchain", id: "1718641457527889243" },
      { name: "web3", id: "1718641230817970431" },
      { name: "metaverse", id: "1718641722539268658" },
      { name: "defi", id: "1719210427243611048" },
      { name: "nft", id: "1718968029182069160" },
      { name: "blockchain_games", id: "1719210909413102943" },
      { name: "dao", id: "1719211072131510431" },
      { name: "artificial_intelligence", id: "1718645044417924753" },
      { name: "cryptocurrency", id: "1719210557164450999" },
      { name: "crypto_casinos", id: "1733372612188333953" },
      { name: "crypto_exchange", id: "1719996329928054919" },
      { name: "metaverse_event", id: "1733811680276587369" },
      { name: "decentralized_identity", id: "1733812308626822422" },
      { name: "play_to_earn_platform", id: "1733812196425088158" },
      { name: "yield_aggregators", id: "1733812098678890519" },
      { name: "stabelcoins", id: "1733812032008771908" },
      { name: "web3_quest_platforms", id: "1733893281096454324" },
      { name: "art_and_collectibles", id: "1734755238584631722" },
      { name: "trading_tools", id: "1734694106651227147" },
      { name: "crypto_staking", id: "1734693999550706547" },
      { name: "crypto_launchpad", id: "1734693916560140791" },
      { name: "rwa_token", id: "1734693792312640861" },
      { name: "ai_token", id: "1734693690370917845" },
      { name: "memes_token", id: "1734693633491771452" },
      { name: "crypto_influencer", id: "1734693506407308537" },
      { name: "crypto_researcher", id: "1734693434218287154" },
      { name: "crypto_wallets", id: "1734693367505013990" },
      { name: "crypto_payment", id: "1734693286462153755" },
      { name: "crypto_exchanges", id: "1734693187972887198" },
      { name: "game_yield", id: "1734691423559751365" },
      { name: "game_developers", id: "1734691336642323972" },
      { name: "game_nfts", id: "1734691245391613588" },
      { name: "esports", id: "1734691156243443891" },
      { name: "play_to_earn_platforms", id: "1734691021602384200" },
      { name: "ai_tools", id: "1734690830682032730" },
      { name: "tokenized_global_bonds", id: "1734687473022341658" },
      { name: "us_treasuries", id: "1734687085396474546" },
      { name: "tokenization_protocols", id: "1734686933366281010" },
    ];
    
    const category = web3categories.find((cat) => cat.id === categoryId);
    if (category) {
      return `${category.name}/`;
    }
    return ""; // Fallback link if no match is found
  };
  
 
  // router.push('/route')
  return (
    <>
    <style jsx>{`
.category-directory {
  width:100%;
}

.view-more{
    transform: translateY(-50%);
    font-size: 14px;
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
    text-decoration: underline;
    cursor: pointer;
    }
  
      `}</style>
      <main id='main'>
        <div className='main-inner web-page manus'>
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
                  {t('Web3')}&nbsp;{t('webDirectory')}
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
   
               

   
                {<p>
                  {t(
                    'Welcome to our Web3 Directory! Your go-to resource for discovering companies working in the fields of blockchain technology, decentralized finance (DeFi), GameFi, NFTs, DAOs, and dApps. Here, you will find the detailed information about each project, including its objectives, technology stack, team, and community. Whether you are an investor, a developer, or simply a Web3 enthusiast, this database is your one-stop destination.Explore a comprehensive list of companies actively contributing to the evolution of the Web3 through blockchain technology. Embark upon the Web3 journey today by listing your project with us.'
                  )}
                </p>}
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
                  <Image  style={{ marginRight: "0px", maxWidth: "35px" }}  src={arb} alt='Arb' />
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
              <h2 className="text-center pt-4">  {LANG === 'jp' ? 'Web3ディレクトリの使い方' : 'How to use Web3 Directory'}</h2>
              <div className="row">
  <div className="col-md-4 d-flex">
    <div className="info-box text-start flex-grow-1 d-flex flex-column">
      <h5>
        {LANG === 'jp' ? '1. 適切なパートナーを見つける' : '1. Find the Right Partner'}
      </h5>
      <p>
        {LANG === 'jp'
          ? 'あなたのニーズやプロジェクト要件に合った理想的なパートナーを見つけましょう。興味に最も適したカテゴリを選択して、適切な専門家とつながりましょう。'
          : 'Discover the ideal partner that aligns with your needs and project requirements. Select the category that best suits your interest to connect with the right experts.'}
      </p>
    </div>
  </div>
  <div className="col-md-4 d-flex">
    <div className="info-box flex-grow-1 text-start d-flex flex-column">
      <h5>
        {LANG === 'jp' ? '2. チームとつながる' : '2. Connect with the Team'}
      </h5>
      <p>
        {LANG === 'jp'
          ? '登録して潜在的なクライアントと会議をスケジュールするか、専門家との1対1のビデオ通話を予約して個別のアドバイスを受けましょう。'
          : 'Sign up and schedule a meeting with a potential client or book a 1:1 video call with an expert to get personalized advice.'}
      </p>
      <button className="btn btn-primary text-button-background mt-auto">
        {LANG === 'jp' ? '法人アカウントを申し込む' : 'Apply for corporate account'}
      </button>
    </div>
  </div>
  <div className="col-md-4 d-flex">
    <div className="info-box text-start flex-grow-1 d-flex flex-column">
      <h5>
        {LANG === 'jp' ? '3. パートナーシップを築く' : '3. Build Your Partnership'}
      </h5>
      <p>
        {LANG === 'jp'
          ? '提案を詳しく話し合い、専門家と協力して成長と成功の機会を探りましょう。'
          : 'Discuss your proposal in detail and collaborate with the expert to explore opportunities for growth and success.'}
      </p>
    </div>
  </div>
</div>

<p className="text-center mt-4">
  {LANG === 'jp'
    ? 'お困りですか？適切なパートナーが見つかりませんか？今すぐアカウントを作成して、ビジネスに最適なマッチング相手とつながりましょう！'
    : 'Need help? Can’t find the right partner? Create your account now and connect with the perfect match for your business!'}
</p>

              <Col xl="12" lg="12">
              <div className="flex-details-pnl d-flex justify-content-between align-items-center py-3 flex-wrap border-0">
  {/* Left Panel */}
  <div className="left-side-pnl d-flex align-items-center mb-3 mb-lg-0">
  <div
                  className='w-90 search-post-pnl search-pnl small'
                  id='companySecrch'
                >
               <input
                    type='text'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='form-control form-control border-start-0'
                    placeholder={inputText}
                    onKeyDown={handleSearch}
                    ref={inputRef}
                  />
                  {search.length >= 1 && (
                    <button onClick={resetbtnclicked}>
                               <span className="border-2 input-group-text bg-white border-end-0">
          <i className="bi bi-search">&#x21BA;</i>
        </span>
                    </button>
                  )}
              
                  <button onClick={searchbtnclicked}>
                    <i className='fa fa-search' />
                  </button>
        
      
                </div>

                           
  </div>

  {/* Right Panel */}
  <div className="right-side-pnl d-flex align-items-center flex-wrap justify-content-end">
  
    <Link
      href={ADD_WEB3}
      className="reg-btn trans me-2"
    >
      {t("Submit your Listing")}
    </Link>
    <Link href={CONTACT_US} className="reg-btn faq-btn">
      {t("FAQ")}
    </Link>
    <div>&nbsp; Total {/*{totalCompanies}*/} 420 results &nbsp;</div> 
  </div>
</div>

</Col>
              <div className="scroll-container border-bottom">
      <div className="icon-item d-block">
      <svg viewBox="0 0 512 512.00013" className="techicons" xmlns="http://www.w3.org/2000/svg"><path d="m0 457.726562c0 5.683594 3.207031 10.871094 8.292969 13.417969l82.707031 40.855469v-110.726562l-91-45zm0 0"></path><path d="m121 401.273438v110.726562l81.710938-40.855469c5.082031-2.546875 8.289062-7.730469 8.289062-13.417969v-35.726562h90v35.726562c0 5.6875 3.207031 10.871094 8.292969 13.417969l81.707031 40.855469v-110.726562l-90-45v35.726562h-90v-35.730469zm0 0"></path><path d="m112.710938 273.585938c-4.226563-2.113282-9.195313-2.113282-13.417969 0l-97.519531 50.027343 104.226562 51.613281 103.226562-51.613281-43.800781-22.707031 42.042969-76.675781 33.53125 17.769531v-111.726562l-90-45v101.453124c0 5.683594 3.207031 10.871094 8.292969 13.417969l21.320312 10.664063-41.828125 76.292968zm0 0"></path><path d="m421 512 82.710938-40.855469c5.082031-2.546875 8.289062-7.730469 8.289062-13.417969v-101.457031l-91 45.003907zm0 0"></path><path d="m361 186.726562v-101.457031l-90 45.003907v111.726562l33.535156-17.765625 42.039063 76.675781-43.800781 22.703125 103.226562 51.613281 104.226562-51.613281-97.515624-50.03125c-4.226563-2.113281-9.195313-2.113281-13.417969 0l-26.078125 13.519531-41.828125-76.292968 21.324219-10.664063c5.082031-2.546875 8.289062-7.734375 8.289062-13.417969zm0 0"></path><path d="m249.292969 1.585938-96.519531 51.027343 103.226562 51.613281 103.226562-51.613281-96.515624-51.03125c-4.226563-2.109375-9.195313-2.109375-13.417969.003907zm0 0"></path></svg> <Link  href="/web3-directory/blockchain/">
        Blockchain</Link>
      </div>
      <div className="icon-item d-block">
      <svg id="Icons" className='techicons' enable-background="new 0 0 128 128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><path id="Web_Browser" d="m108 12h-88c-6.617 0-12 5.383-12 12v80c0 6.617 5.383 12 12 12h88c6.617 0 12-5.383 12-12v-80c0-6.617-5.383-12-12-12zm-88 8h88c2.205 0 4 1.795 4 4v20h-96v-20c0-2.205 1.795-4 4-4zm88 88h-88c-2.205 0-4-1.795-4-4v-52h96v52c0 2.205-1.795 4-4 4zm-44-76c0-2.209 1.791-4 4-4h32c2.209 0 4 1.791 4 4s-1.791 4-4 4h-32c-2.209 0-4-1.791-4-4zm-40 0c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zm12 0c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zm12 0c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zm52 28h-72c-2.209 0-4 1.791-4 4v16c0 2.209 1.791 4 4 4h72c2.209 0 4-1.791 4-4v-16c0-2.209-1.791-4-4-4zm-4 16h-64v-8h64zm-16 20c0 2.209-1.791 4-4 4h-48c-2.209 0-4-1.791-4-4s1.791-4 4-4h48c2.209 0 4 1.791 4 4zm24 0c0 2.209-1.791 4-4 4h-8c-2.209 0-4-1.791-4-4s1.791-4 4-4h8c2.209 0 4 1.791 4 4z"></path></svg> <Link href="/web3-directory/web3/"> Web3 </Link>
      </div>
      <div className="icon-item d-block"> 
      <span className='techicons'>&#8383;</span><Link href="/web3-directory/cryptocurrency/">Crypto</Link>
      </div>
      <div className="icon-item d-block">
        <svg version="1.1" id="Capa_1" className='techicons' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 469.333 469.333"><g><g><g><path d="M192,138.09c0,35.071,69.76,53.426,138.667,53.426s138.667-18.355,138.667-53.426C469.333,67.947,192,67.947,192,138.09z     "></path><path d="M464.188,189.836c-3.177-1.92-7.167-2.056-10.469-0.323c-28.729,15.068-72.427,23.374-123.052,23.374     s-94.323-8.306-123.052-23.374c-3.302-1.732-7.292-1.597-10.469,0.323c-3.198,1.93-5.146,5.405-5.146,9.141v3.224     c0,35.071,69.76,53.426,138.667,53.426s138.667-18.355,138.667-53.426v-3.224C469.333,195.241,467.385,191.766,464.188,189.836z"></path><path d="M64,351.795c0,35.072,69.76,53.426,138.667,53.426s138.667-18.355,138.667-53.426C341.333,281.652,64,281.652,64,351.795     z"></path><path d="M336.188,403.542c-3.188-1.91-7.167-2.056-10.469-0.323c-28.729,15.068-72.427,23.374-123.052,23.374     s-94.323-8.306-123.052-23.374c-3.302-1.732-7.292-1.586-10.469,0.323c-3.198,1.93-5.146,5.405-5.146,9.141v3.224     c0,35.072,69.76,53.426,138.667,53.426s138.667-18.355,138.667-53.426v-3.224C341.333,408.947,339.385,405.472,336.188,403.542z"></path><path d="M138.667,106.034c14.406,0,28.813-0.814,42.823-2.431c2.281-0.261,4.417-1.252,6.094-2.828     c16.156-15.235,43.76-26.473,79.823-32.494c3.813-0.637,6.99-3.287,8.292-6.939c1.104-3.078,1.635-5.937,1.635-8.734     C277.333-17.536,0-17.536,0,52.607C0,87.679,69.76,106.034,138.667,106.034z"></path><path d="M138.667,170.145c8.833,0,17.448-0.303,25.792-0.856c3.365-0.23,6.417-2.024,8.25-4.863     c1.823-2.828,2.208-6.365,1.042-9.527c-2.073-5.583-3.083-11.082-3.031-17.384c0-2.922-1.198-5.718-3.313-7.732     c-2.104-2.014-5.073-3.235-7.865-2.943c-6.969,0.334-13.938,0.563-20.875,0.563c-50.625,0-94.323-8.306-123.052-23.374     c-3.302-1.732-7.292-1.596-10.469,0.323C1.948,106.284,0,109.759,0,113.495v3.224C0,151.791,69.76,170.145,138.667,170.145z"></path><path d="M138.667,234.257c8.833,0,17.448-0.303,25.792-0.856c3.365-0.23,6.417-2.024,8.25-4.863     c1.823-2.828,2.208-6.365,1.042-9.527c-2.073-5.583-3.083-11.082-3.083-17.384c0-2.922-1.198-5.718-3.313-7.732     c-2.104-2.014-5.021-3.162-7.865-2.943c-6.948,0.334-13.896,0.563-20.823,0.563c-50.625,0-94.323-8.306-123.052-23.374     c-3.302-1.732-7.292-1.596-10.469,0.323C1.948,170.396,0,173.871,0,177.606v3.224C0,215.902,69.76,234.257,138.667,234.257z"></path><path d="M464.188,318.059c-3.198-1.951-7.167-2.056-10.469-0.323c-20.073,10.529-48.313,17.885-81.656,21.256     c-5.625,0.574-9.635,7.148-9.396,12.804c0,5.416-0.875,10.591-2.667,15.798c-1.188,3.454-0.531,7.284,1.74,10.143     c2.042,2.557,5.115,4.028,8.344,4.028c0.375,0,0.76-0.021,1.146-0.063c61.427-6.637,98.104-25.805,98.104-51.277V327.2     C469.333,323.465,467.385,319.99,464.188,318.059z"></path><path d="M202.667,276.998l7.073,0.125c0.063,0,0.125,0,0.188,0c4.979,0,9.302-3.454,10.406-8.327     c1.115-4.946-1.385-9.986-5.99-12.084l-2.281-1.023c-1.521-0.668-3.052-1.336-4.469-2.077c-3.323-1.743-7.26-1.586-10.458,0.344     c-3.188,1.93-5.135,5.395-5.135,9.13v3.224C192,272.219,196.771,276.998,202.667,276.998z"></path><path d="M464.188,253.948c-3.177-1.92-7.167-2.056-10.469-0.323c-28.729,15.068-72.427,23.374-123.052,23.374l-7.042-0.136     c-4.302-0.365-9.448,3.423-10.542,8.358c-1.104,4.936,1.396,9.965,5.99,12.052c11.552,5.259,20.99,11.51,28.042,18.574     c2.01,2.004,4.719,3.12,7.542,3.12c0.219,0,0.448-0.01,0.677-0.021c52.583-3.339,114-19.127,114-52.633v-3.224     C469.333,259.353,467.385,255.878,464.188,253.948z"></path><path d="M89.208,295.051c1.333,0,2.667-0.25,3.927-0.751c18.792-7.44,41.708-12.564,68.125-15.224     c5.625-0.563,9.646-7.68,9.406-13.336c0-2.922-1.198-5.718-3.313-7.732c-2.104-2.014-5.021-3.089-7.865-2.943     c-6.948,0.334-13.896,0.563-20.823,0.563c-50.625,0-94.323-8.306-123.052-23.374c-3.302-1.732-7.292-1.596-10.469,0.323     C1.948,234.508,0,237.982,0,241.718v3.224c0,23.614,32.792,42.313,87.729,50.004C88.219,295.019,88.719,295.051,89.208,295.051z"></path></g></g></g></svg><Link href="/web3-directory/defi/"> DeFi </Link>
      </div>
      <div className="icon-item d-block">
      <svg xmlns="http://www.w3.org/2000/svg" className='techicons' id="Filled" viewBox="0 0 512 512"><title></title><g data-name="11. DAO (Decentralized Autonomous Organization)" id="_11._DAO_Decentralized_Autonomous_Organization_"><path d="M486.61,229.05,469,157.43a27,27,0,1,0-37.85-35.25L282.71,99.06a27,27,0,0,0-53.42,0L80.85,122.18A27,27,0,1,0,43,157.43L25.39,229.05a27,27,0,0,0,0,53.9L43,354.57a27.19,27.19,0,0,0-5.45,4.19c-17,17-4.85,46.08,19.1,46.08a27,27,0,0,0,24.2-15l148.44,23.12a27,27,0,0,0,53.42,0l148.44-23.13a26.93,26.93,0,0,0,24.2,15c27.16,0,37.54-36.26,13.65-50.27L486.61,283a27,27,0,0,0,0-53.9Zm-43.84-71a26.85,26.85,0,0,0,10.65,3l17.65,71.8A26.91,26.91,0,0,0,459.22,248H415V206a31.78,31.78,0,0,0-4.25-15.93ZM280.24,114.87,428.65,138a27.1,27.1,0,0,0,2.82,8.72l-31.9,31.9A31.73,31.73,0,0,0,383,174H264V128.76A27.36,27.36,0,0,0,280.24,114.87ZM369,251v10a33,33,0,0,1-66,0V251a33,33,0,0,1,66,0ZM240,277v9a8,8,0,0,1-16,0V252a32,32,0,0,1,64,0v34a8,8,0,0,1-16,0v-9Zm-31-21a38,38,0,0,1-38,38H151a8,8,0,0,1-8-8V226a8,8,0,0,1,8-8h20A38,38,0,0,1,209,256ZM83.35,138l148.39-23.12A26.72,26.72,0,0,0,248,128.79V174H129a31.73,31.73,0,0,0-16.57,4.61l-31.9-31.9A27.1,27.1,0,0,0,83.35,138ZM58.58,161.08a26.66,26.66,0,0,0,10.65-3l32,32C95.82,199.5,97,202.93,97,248H52.78a26.87,26.87,0,0,0-11.85-15.12Zm-17.65,118A26.91,26.91,0,0,0,52.78,264H97c0,44.6-1.25,48.39,4.25,57.93l-32,32a26.75,26.75,0,0,0-10.65-3Zm190.82,118L83.35,374a27.1,27.1,0,0,0-2.82-8.72l31.9-31.9A31.73,31.73,0,0,0,129,338H248v45.21A26.76,26.76,0,0,0,231.75,397.13ZM428.65,374,280.23,397.13A27.4,27.4,0,0,0,264,383.24V338H383a31.73,31.73,0,0,0,16.57-4.61l31.9,31.9A27.1,27.1,0,0,0,428.65,374Zm24.77-23.08a26.85,26.85,0,0,0-10.65,3l-32-32C416.19,312.5,415,309.07,415,264h44.22a26.93,26.93,0,0,0,11.85,15.13Z"></path><path d="M159,234v44h12a22,22,0,0,0,0-44Z"></path><path d="M272,252a16,16,0,0,0-32,0v9h32Z"></path><path d="M324,239c-6,6-5,12.26-5,22a17,17,0,0,0,34,0V251C353,235.82,334.58,228.37,324,239Z"></path></g></svg> <Link href="/web3-directory/dao/">DAO</Link>      </div>
      <div className="icon-item d-block">
      <svg clip-rule="evenodd" className='techicons' fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="Icon"><path d="m20.25 9.5c0-.729-.29-1.429-.805-1.945-.516-.515-1.216-.805-1.945-.805-2.871 0-8.129 0-11 0-.729 0-1.429.29-1.945.805-.515.516-.805 1.216-.805 1.945v5c0 .729.29 1.429.805 1.945.516.515 1.216.805 1.945.805h1.667c.378 0 .747-.123 1.05-.35l1.466-1.1c.044-.032.096-.05.15-.05h2.334c.054 0 .106.018.15.05l1.466 1.1c.303.227.672.35 1.05.35h1.667c.729 0 1.429-.29 1.945-.805.515-.516.805-1.216.805-1.945zm-9.75 1.75h3c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3c-.414 0-.75.336-.75.75s.336.75.75.75z"></path><path d="m2.869 8.561-.212.043c-.818.163-1.407.882-1.407 1.716v3.36c0 .834.589 1.553 1.407 1.716l.212.043c-.078-.304-.119-.62-.119-.939 0-1.488 0-3.512 0-5 0-.319.041-.635.119-.939z"></path><path d="m21.131 8.561c.078.304.119.62.119.939v5c0 .319-.041.635-.119.939l.212-.043c.818-.163 1.407-.882 1.407-1.716v-3.36c0-.834-.589-1.553-1.407-1.716z"></path></g></svg><Link href="/web3-directory/metaverse/">Metaverse</Link>
      </div>
      <div className="icon-item d-block">
        <svg id="svg2581" className='techicons'  enable-background="new 0 0 100 100" viewBox="0 0 100 100"><path id="polygon2557" d="m41.549 33.432 8.449 5.304 8.45-5.304-8.45-5.303z"></path><path id="polygon2559" d="m40.668 45.589 8.33 5.228v-10.347l-8.33-5.229z"></path><path id="polygon2561" d="m59.329 35.241-8.331 5.229v10.347l8.331-5.228z"></path><path id="path2563" d="m53.783 5.681c-.937-1.362-2.346-2.276-3.97-2.576-1.621-.299-3.268.053-4.627.992l-4.9 3.376h14.734z"></path><path id="path2565" d="m7.224 37.758 12.506 18.148v-34.275l-10.924 7.53c-2.802 1.941-3.513 5.798-1.582 8.597z"></path><path id="path2567" d="m31.551 60.281h36.896v-40.987h-36.896zm7.117-26.849c0-.089.012-.175.035-.259.008-.029.022-.054.032-.082.02-.053.038-.106.066-.155.018-.031.042-.058.064-.087.029-.04.056-.081.091-.116.027-.028.06-.049.09-.074.031-.025.057-.053.091-.075l10.33-6.484c.324-.204.738-.204 1.063 0l10.33 6.484c.034.021.06.05.091.074.031.025.063.047.091.074.035.035.062.076.09.115.021.03.046.056.064.088.027.048.045.101.065.153.01.028.025.054.033.084.022.083.035.17.035.258v12.709c0 .344-.177.664-.469.847l-10.33 6.484c-.03.019-.063.027-.094.042s-.061.029-.093.042c-.112.041-.227.07-.344.07s-.233-.028-.344-.07c-.032-.012-.062-.026-.093-.042-.031-.015-.064-.023-.094-.042l-10.33-6.484c-.292-.183-.469-.503-.469-.847v-12.707z"></path><path id="path2569" d="m92.766 62.241-12.495-18.129v34.245l10.913-7.519c1.362-.937 2.276-2.347 2.575-3.971.299-1.623-.054-3.266-.993-4.626z"></path><path id="path2571" d="m75.741 25.078c0 4.524 3.681 8.206 8.205 8.206s8.206-3.681 8.206-8.206-3.682-8.206-8.206-8.206-8.205 3.682-8.205 8.206zm4.634-.378c.391-.391 1.023-.391 1.414 0l.983.983 3.33-3.331c.391-.391 1.023-.391 1.414 0s.391 1.023 0 1.414l-4.037 4.038c-.188.188-.441.293-.707.293s-.52-.105-.707-.293l-1.69-1.69c-.39-.391-.39-1.024 0-1.414z"></path><path id="path2573" d="m73.741 25.078c0-3.528 1.801-6.643 4.53-8.477v-.949c0-3.408-2.772-6.18-6.18-6.18h-44.181c-3.407 0-6.18 2.772-6.18 6.18v68.693c0 3.413 2.772 6.19 6.18 6.19h44.182c3.407 0 6.18-2.777 6.18-6.19v-50.79c-2.731-1.834-4.531-4.949-4.531-8.477zm-30.842 56.59c0 .442-.29.832-.714.958-.095.028-.191.042-.286.042-.331 0-.648-.165-.837-.452l-4.708-7.194v6.646c0 .552-.447 1-1 1s-1-.448-1-1v-10c0-.442.29-.832.714-.958.427-.125.881.042 1.123.411l4.708 7.194v-6.646c0-.552.447-1 1-1s1 .448 1 1zm9.84-6c.553 0 1 .448 1 1s-.447 1-1 1h-4.006v4c0 .552-.447 1-1 1s-1-.448-1-1v-10c0-.552.447-1 1-1h5.006c.553 0 1 .448 1 1s-.447 1-1 1h-4.006v3zm11.905-3h-2.554v9c0 .552-.447 1-1 1s-1-.448-1-1v-9h-2.555c-.553 0-1-.448-1-1s.447-1 1-1h7.108c.553 0 1 .448 1 1s-.446 1-.999 1zm5.803-11.387c0 .552-.447 1-1 1h-38.896c-.553 0-1-.448-1-1v-42.987c0-.552.447-1 1-1h38.896c.553 0 1 .448 1 1z"></path><path id="path2575" d="m46.207 94.328c1.937 2.804 5.796 3.516 8.608 1.583l4.893-3.375h-14.737z"></path></svg> <Link href="/web3-directory/nft/">NFT</Link>
      </div>
      <div className="icon-item d-block">
       <svg id="Layer_1" className='techicons' enable-background="new 0 0 512 512" viewBox="0 0 512 512"><path clip-rule="evenodd" d="m511.253 307.432c-5.951-73.038-30.406-153.697-62.303-205.489-6.287-10.208-16.771-16.063-28.761-16.063h-36.774c-15.706 0-29.218 10.672-32.856 25.952-3.019 12.676-14.657 21.875-27.674 21.875h-133.769c-13.017 0-24.656-9.2-27.675-21.873-3.638-15.281-17.148-25.954-32.856-25.954h-36.774c-11.99 0-22.474 5.855-28.761 16.063-31.897 51.792-56.352 132.452-62.303 205.489-4.959 60.859 15.017 107.938 49.706 117.148 11.552 3.066 29.676 3.09 50.4-14.221 15.53-12.973 30.051-33.749 43.157-61.751 14.66-31.319 23.29-44.075 50.027-44.075h123.924c26.737 0 35.367 12.756 50.027 44.075 13.106 28.002 27.627 48.778 43.157 61.751 14.571 12.172 27.855 15.774 38.476 15.773 4.484 0 8.495-.643 11.925-1.553 34.69-9.21 54.666-56.288 49.707-117.147zm-57.918 86.219c-11.875 3.153-33.755-10.307-56.363-58.609-13.036-27.85-29.26-62.509-79.01-62.509h-123.924c-49.75 0-65.974 34.659-79.01 62.509-22.608 48.303-44.482 61.769-56.363 58.609-15.8-4.195-29.854-36.62-26.023-83.621 5.486-67.339 28.656-144.22 57.656-191.307.418-.679.715-.845 1.513-.845h36.774c.93 0 1.511.459 1.727 1.366 6.516 27.355 30.697 46.461 58.805 46.461h133.769c28.107 0 52.288-19.105 58.803-46.461.216-.906.797-1.366 1.728-1.366h36.774c.798 0 1.095.166 1.513.845 28.999 47.086 52.17 123.967 57.656 191.308 3.828 47-10.225 79.425-26.025 83.62zm-142.147-172.492c0 8.837-7.163 16-16 16h-78.375c-8.837 0-16-7.163-16-16s7.163-16 16-16h78.375c8.836 0 16 7.163 16 16zm-142.313 0c0 8.837-7.163 16-16 16h-19.625v19.625c0 8.837-7.163 16-16 16s-16-7.163-16-16v-19.625h-19.625c-8.837 0-16-7.163-16-16s7.163-16 16-16h19.625v-19.625c0-8.837 7.163-16 16-16s16 7.163 16 16v19.625h19.625c8.837 0 16 7.163 16 16zm208.375-34.125c0-9.639 7.861-17.5 17.5-17.5s17.5 7.861 17.5 17.5-7.861 17.5-17.5 17.5-17.5-7.861-17.5-17.5zm35 68.25c0 9.639-7.861 17.5-17.5 17.5s-17.5-7.862-17.5-17.5c0-9.639 7.861-17.5 17.5-17.5s17.5 7.862 17.5 17.5zm34.125-34.125c0 9.639-7.861 17.5-17.5 17.5s-17.5-7.861-17.5-17.5 7.861-17.5 17.5-17.5c9.64 0 17.5 7.861 17.5 17.5zm-68.25 0c0 9.639-7.861 17.5-17.5 17.5s-17.5-7.861-17.5-17.5 7.861-17.5 17.5-17.5 17.5 7.861 17.5 17.5z" fill-rule="evenodd"></path></svg><Link href="/web3-directory/blockchain_games/">Blockchain Game</Link>
      </div>
      <div className="icon-item d-block">
       <svg version="1.1" id="Capa_3" className='techicons' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512.009 512.009"><g><g><g><path d="M495.617,367.387H436.84V172.604c0-9.052-7.331-16.383-16.383-16.383c-9.052,0-16.392,7.331-16.392,16.383V387     c0,9.185-9.144,16.947-20.024,17.08c-0.095-0.002-0.186-0.014-0.281-0.014c-0.178,0-0.351,0.021-0.528,0.027h-62.816     c-0.177-0.006-0.349-0.027-0.528-0.027s-0.351,0.021-0.528,0.027h-62.834c-0.177-0.006-0.349-0.027-0.527-0.027     s-0.35,0.021-0.527,0.027h-62.826c-0.177-0.006-0.349-0.027-0.527-0.027s-0.35,0.021-0.527,0.027h-62.826     c-0.177-0.006-0.349-0.027-0.527-0.027c-0.095,0-0.187,0.013-0.281,0.014c-10.889-0.133-20.024-7.895-20.024-17.08V125.045     c0-9.265,9.301-17.093,20.305-17.093H383.76c11.005,0,20.305,7.828,20.305,17.093v3.213c0,9.052,7.339,16.383,16.392,16.383     h75.16c9.052,0,16.392-7.331,16.392-16.383s-7.339-16.383-16.392-16.383h-60.659c-4.723-16.174-17.922-29.08-34.807-34.244     V25.612c0-9.052-7.339-16.383-16.392-16.383c-9.052,0-16.383,7.331-16.383,16.383v49.574h-31.106V25.612     c0-9.052-7.331-16.383-16.383-16.383c-9.052,0-16.392,7.331-16.392,16.383v49.574h-31.115V25.612     c0-9.052-7.339-16.383-16.383-16.383s-16.383,7.331-16.383,16.383v49.574h-31.115V25.612c0-9.052-7.339-16.383-16.383-16.383     s-16.383,7.331-16.383,16.383v49.574h-31.115V25.612c0-9.052-7.331-16.383-16.383-16.383s-16.383,7.331-16.383,16.383v52.016     c-16.884,5.16-30.073,18.065-34.795,34.238H16.383C7.339,111.866,0,119.196,0,128.249c0,9.052,7.339,16.383,16.383,16.383h58.786     v222.755H16.383C7.339,367.387,0,374.717,0,383.769c0,9.052,7.339,16.383,16.383,16.383H77.06     c4.721,16.173,17.91,29.083,34.796,34.246v51.999c0,9.052,7.331,16.383,16.383,16.383c9.043,0,16.383-7.331,16.383-16.383V436.84     h31.115v49.556c0,9.052,7.331,16.383,16.383,16.383c9.043,0,16.383-7.331,16.383-16.383V436.84h31.115v49.556     c0,9.052,7.331,16.383,16.383,16.383s16.383-7.331,16.383-16.383V436.84h31.115v49.556c0,9.052,7.339,16.383,16.392,16.383     c9.043,0,16.383-7.331,16.383-16.383V436.84h31.106v49.556c0,9.052,7.331,16.383,16.383,16.383     c9.052,0,16.392-7.331,16.392-16.383v-52c16.886-5.163,30.073-18.071,34.795-34.244h60.67c9.043,0,16.392-7.331,16.392-16.383     C512.009,374.717,504.669,367.387,495.617,367.387z"></path><path d="M495.617,303.506h-31.771c-9.052,0-16.383,7.331-16.383,16.383c0,9.052,7.331,16.383,16.383,16.383h31.771     c9.043,0,16.392-7.331,16.392-16.383C512.009,310.837,504.669,303.506,495.617,303.506z"></path><path d="M495.617,239.617h-31.771c-9.052,0-16.383,7.331-16.383,16.383c0,9.052,7.331,16.383,16.383,16.383h31.771     c9.043,0,16.392-7.331,16.392-16.383C512.009,246.948,504.669,239.617,495.617,239.617z"></path><path d="M495.617,175.737h-31.771c-9.052,0-16.383,7.331-16.383,16.383c0,9.052,7.331,16.383,16.383,16.383h31.771     c9.043,0,16.392-7.331,16.392-16.383C512.009,183.068,504.669,175.737,495.617,175.737z"></path><path d="M16.383,336.272h31.78c9.043,0,16.383-7.331,16.383-16.383c0-9.052-7.331-16.383-16.383-16.383h-31.78     C7.339,303.506,0,310.846,0,319.889C0,328.932,7.339,336.272,16.383,336.272z"></path><path d="M16.383,272.383h31.78c9.043,0,16.383-7.322,16.383-16.374c0-9.052-7.331-16.383-16.383-16.383h-31.78     C7.339,239.626,0,246.965,0,256.009C0,265.052,7.339,272.383,16.383,272.383z"></path><path d="M16.383,208.503h31.78c9.043,0,16.383-7.331,16.383-16.383c0-9.052-7.331-16.383-16.383-16.383h-31.78     C7.339,175.737,0,183.068,0,192.12C0,201.172,7.339,208.503,16.383,208.503z"></path><path d="M203.08,170.27c-6.754,0-12.815,4.136-15.265,10.428l-54.091,138.703c-3.284,8.44,0.879,17.936,9.31,21.219     c8.44,3.284,17.936-0.887,21.219-9.31l8.583-22.009h60.488l8.583,22.009c2.52,6.479,8.706,10.437,15.264,10.437     c1.979,0,3.994-0.364,5.955-1.127c8.422-3.284,12.602-12.788,9.31-21.219l-54.091-138.703     C215.886,174.406,209.834,170.27,203.08,170.27z M185.613,276.536l17.467-44.791l17.467,44.791H185.613z"></path><path d="M348.723,203.036c9.043,0,16.392-7.331,16.392-16.383c0-9.052-7.339-16.383-16.392-16.383H302.85     c-9.052,0-16.383,7.331-16.383,16.383c0,9.052,7.331,16.383,16.383,16.383h6.55v105.946h-6.55     c-9.052,0-16.383,7.331-16.383,16.383c0,9.052,7.331,16.383,16.383,16.383h45.873c9.043,0,16.392-7.331,16.392-16.383     c0-9.052-7.339-16.383-16.392-16.383h-6.541V203.036H348.723z"></path></g></g></g></svg><Link href="/web3-directory/artificial_intelligence/" >AI</Link>
      </div>
    </div>
    {categoryId ? ( // Check if categoryId exists
  <Row>
    <Col xxl="12">
      {isGetting ? (
        <div className="d-flex justify-content-center w-full">
          <Spinner />
        </div>
      ) : companyListOfId.length > 0 ? (
        <div className="slide-cntnr">
          <h3 className="d-flex">
            <div
              style={{
                aspectRatio: profileAspect,
                height: "30px",
                width: "30px",
                position: "relative",
              }}
              className="me-2"
            >
              <Image
                src={OldCategory.logo}
                fill
                alt="Infinity"
                className="rounded-circle"
              />
            </div>
            {OldCategory.name}
          </h3>
          <div className="slid-bg d-flex justify-content-center flex-wrap">
            <Web3ListbyCategoryId
              relatedDirectory={companyListOfId}
              trendingDirectriesIds={trendingDirectriesIds}
            />
          </div>
        </div>
      ) : (
        <p className="text-center">{t("No Company Found")}</p>
      )}
    </Col>
    <div className="pagination-container mystyle d-flex justify-content-center mt-3">
      {!isGetting && companyListOfId.length > 0 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel=""
          renderOnZeroPageCount={null}
          forcePage={forcePaginate}
        />
      )}
    </div>
  </Row>
) : (
  // If categoryId does not exist
  <Col xl="12" lg="12">
    <div className="flex-details-pnl">
      <div className="category-directory">
        {isLoading ||
        results.every((company) => company.companyList.length === 0) ? (
          <div className="spinner-container">
            <div className="loading-title">Loading Data</div>
            <div className="loading-subtitle">
              We are fetching data from ICP blockchain.
            </div>
            <div className="spinner"></div>
          </div>
        ) : (
          results.map((company: any, index: string) => {
            return (
              company.companyList.length > 0 && (
                <div className="slide-cntnr" key={index}>
                  <h3 className="d-flex align-items-center">
                    <div
                      style={{
                        aspectRatio: profileAspect,
                        height: "30px",
                        width: "30px",
                        position: "relative",
                      }}
                      className="me-2"
                    >
                      <Image
                        src={
                          company.category[1].logo
                            ? company.category[1].logo
                            : blockchain1
                        }
                        fill
                        alt="Infinity"
                        className="rounded-circle"
                      />
                    </div>
                    {company.category[1].name}
                    <span className="text-secondary">
                      {" "}
                      &nbsp;| Total:{" "}
                      {company.companyListSize ||
                        company.companyList.length ||
                        0}{" "}
                      results
                    </span>
                  </h3>
                  <a
                    href={`/web3-directory/${getCategoryLinkById(
                      company.category[0]
                    )}`}
                    className="ps-2 mb-n3 view-more d-flex align-items-center"
                  >
                    View More
                  </a>
                  <div className="slid-bg position-relative">
                    <DirectorySlider
                      relatedDirectory={company.companyList}
                      trendingDirectriesIds={trendingDirectriesIds}
                      categoryId={company.category[0]}
                    />
                  </div>
                </div>
              )
            );
          })
        )}
      </div>
    </div>
  </Col>
)}

              
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
