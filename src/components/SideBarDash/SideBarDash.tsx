'use client';
// import * as React from 'react';
import React, { useState } from 'react';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import Link from 'next/link';
import Image from 'next/image';
import Dashboard from '@/assets/Img/Icons/icon-dashboard-2.png';
import Dashboard1 from '@/assets/Img/Icons/icon-dashboard.png';
// import user1 from '@/assets/Img/Icons/icon-user-4.png';
// import user2 from '@/assets/Img/Icons/icon-user-5.png';
import user1 from '@/assets/Img/Icons/Group 1015.png';
import user2 from '@/assets/Img/Icons/Group 954.png';
// import article1 from '@/assets/Img/Icons/icon-article-3.png';
// import article2 from '@/assets/Img/Icons/icon-article-4.png';
import article1 from '@/assets/Img/Icons/Group 1016.png';
import article2 from '@/assets/Img/Icons/Group 955.png';
// import admin1 from '@/assets/Img/Icons/icon-admin-1.png';
// import admin2 from '@/assets/Img/Icons/icon-admin-2.png';
import admin1 from '@/assets/Img/Icons/Group 1017.png';
import admin2 from '@/assets/Img/Icons/Group 956.png';
import iconlist1 from '@/assets/Img/Icons/icon-list-1.png';
import iconlist2 from '@/assets/Img/Icons/icon-list-2.png';
import iconlist3 from '@/assets/Img/Icons/icon-list-3.png';
import iconlist4 from '@/assets/Img/Icons/icon-list-4.png';
import { usePathname, useRouter } from 'next/navigation';
import { Dropdown } from 'react-bootstrap';
import { useConnectPlugWalletStore, useThemeStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import {
  ADD_QUIZ_ROUTE_ADMIN,
  ADD_SURVEY_ROUTE_ADMIN,
  ALL_QUIZ_ROUTE_ADMIN,
  MANAGE_SURVEY_ADMIN,
  token_claims_page,
} from '@/constant/routes';
export default function SideBarDash() {
  const [isThemeActive, setIsThemeActive] = useState(false);
  const { t, changeLocale } = useLocalization(LANG);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>();
  const [isConnectLoading, setIsConnectLoading] = useState<boolean>(false);
  const [toggle, settoggle] = React.useState(false);
  const [connected, setConnected] = useState(false);
  const [tab, setTab] = React.useState<string>('');
  const router = useRouter();
  const location = usePathname();
  const sidebarRef = React.useRef<HTMLElement | null>();
  const [adminMenueShow, setAdminMenueShow] = React.useState(false);
  const [rewardmenue, setRewardmenue] = React.useState(false);

  const [articleMenueShow, setArticleMenueShow] = React.useState(false);
  const [categoryMenuShow, setCategoryMenuShow] = useState(false);
  const [userMenuShow, setUserMenuShow] = useState(false);
  const [deployMenuShow, setDeployMenuShow] = useState(false);
  const [featuredCampaignShow, featuredCampaignMenuShow] = useState(false);
  const [transetionMenueShow, setTransetionMenueShow] = useState(false);

  const [eventMenuShow, setEventMenuShow] = useState(false);
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const { isOpen, setIsOpen } = useThemeStore((state) => ({
    isOpen: state.isOpen,
    setIsOpen: state.setIsOpen,
  }));
  let tabsPath = {
    articlelist: '/super-admin/article-list/',
    pendingList: '/super-admin/pending-list/',
    manageDir: '/super-admin/manage-directory/',
    manageView: '/super-admin/manage-views/',
    managePocast: '/super-admin/manage-podcast/',
    makeAdmin: '/super-admin/make-admin/',
    trackAdmin: '/super-admin/track-admin/',
    ManageCategory: '/super-admin/manage-category/',
    allCategory: '/super-admin/all-categories/',
    manageReward: '/super-admin/reward-management/',
    artificialReward: '/super-admin/artificial-reward/',
    events: '/super-admin/events/',
    addEvent: '/super-admin/add-event/',
    manageUser: '/super-admin/user-managment/',
    userVerification: '/super-admin/user-verification/',
    manageWeb3View: '/super-admin/manage-web3-views/',
    deployNFTStudio24: '/super-admin/deploy-nftstudio24/',
    deployNFTStudio24JP: '/super-admin/deploy-nftstudio24-jp/',
    coinsInIcp: '/super-admin/coins-in-icp/',
    menualReward: '/super-admin/manual-reward/',
    addquiz: ADD_QUIZ_ROUTE_ADMIN,
    quizmanage: '/super-admin/manage-quiz/',
    quizQuestions: '/super-admin/quiz-questions/',
    addServay: ADD_SURVEY_ROUTE_ADMIN,
    manageServay: MANAGE_SURVEY_ADMIN,
    dashboarddata: '/super-admin/dashboard-data/',
    addCampaign: '/super-admin/add-featured-campaign/',
    manageCampaigns: '/super-admin/manage-campaigns/',
    transectionsTab: '/super-admin/transactions/',
    tokenTab: '/super-admin/manage-token/',
    tokenClaimsPage:token_claims_page

  };
  React.useEffect(() => {
    const currentTab = location;
    currentTab === tabsPath.articlelist ||
    currentTab === tabsPath.pendingList ||
    currentTab === tabsPath.manageDir ||
    currentTab === tabsPath.manageView ||
    currentTab === tabsPath.managePocast ||
    currentTab === tabsPath.quizmanage ||
    currentTab === tabsPath.addquiz ||
    currentTab === tabsPath.dashboarddata ||
    currentTab === tabsPath.quizQuestions ||
    currentTab === tabsPath.manageWeb3View ||
    currentTab === tabsPath.addServay ||
    currentTab === tabsPath.manageServay
      ? setArticleMenueShow(true)
      : setArticleMenueShow(false);
    currentTab === tabsPath.makeAdmin || currentTab === tabsPath.trackAdmin
      ? setAdminMenueShow(true)
      : setAdminMenueShow(false);
    currentTab === tabsPath.ManageCategory ||
    currentTab === tabsPath.allCategory
      ? setCategoryMenuShow(true)
      : setCategoryMenuShow(false);
    currentTab === tabsPath.manageReward ||
    currentTab === tabsPath.artificialReward ||
    currentTab === tabsPath.coinsInIcp ||
    currentTab === tabsPath.tokenTab ||
    currentTab === tabsPath.menualReward ||
    currentTab === tabsPath.tokenClaimsPage

      ? setRewardmenue(true)
      : setRewardmenue(false);
    currentTab === tabsPath.addEvent || currentTab === tabsPath.events
      ? setEventMenuShow(true)
      : setEventMenuShow(false);
    currentTab === tabsPath.manageUser ||
    currentTab === tabsPath.userVerification
      ? setUserMenuShow(true)
      : setUserMenuShow(false);
    currentTab === tabsPath.deployNFTStudio24 ||
    currentTab === tabsPath.deployNFTStudio24JP
      ? setDeployMenuShow(true)
      : setDeployMenuShow(false);
    currentTab === tabsPath.addCampaign ||
    currentTab === tabsPath.manageCampaigns
      ? featuredCampaignMenuShow(true)
      : featuredCampaignMenuShow(false);
    currentTab === tabsPath.transectionsTab
      ? setTransetionMenueShow(true)
      : setTransetionMenueShow(false);
    setTab(currentTab);
    console.error(currentTab);
  }, [location]);
  return (
    <>
      <div
        ref={sidebarRef as React.RefObject<HTMLDivElement>}
        className={
          toggle
            ? 'sidebar-home active dark rmt scroll'
            : 'sidebar-home dark rmt scroll'
        }
      >
        {tab !== '/super-admin' && (
          <div className='sidebar-inner'>
            <button
              className='toggler'
              onClick={() => settoggle((pre) => !pre)}
            >
              <p className='m-0'>
                <span />
                <span />
                <span />
              </p>
            </button>
            <ul className='new'>
              {/* <li>
              <Link href='/super-admin' className={`${tab=='/super-admin'? 'active':""}`}>
                <Image src={Dashboard1} alt='dashboard' />
                <Image src={Dashboard} alt='dashboard' /> Dashboard
              </Link>
            </li> */}

              {userAuth.userPerms?.userManagement && (
                <li>
                  <Dropdown
                    show={userMenuShow}
                    onClick={() => setUserMenuShow((pre) => !pre)}
                  >
                    <Dropdown.Toggle
                      variant='success'
                      id='dropdown-basic'
                      className={`${
                        location === tabsPath.manageUser ||
                        location === tabsPath.userVerification
                          ? 'active'
                          : ''
                      } rmrounded `}
                    >
                      <Image
                        src={'/images/svgs/categoryManagement.svg'}
                        width={25}
                        height={25}
                        alt='Mange Icon'
                      />
                      <Image
                        src={'/images/svgs/categoryManagement.svg'}
                        width={25}
                        height={25}
                        className='black-svg'
                        alt='Manage dark icon'
                      />
                      User Management
                    </Dropdown.Toggle>
                    <i className='fa fa-angle-down' />
                    <Dropdown.Menu>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.manageUser}
                        className={`${
                          location === tabsPath.manageUser ? 'active' : ''
                        }`}
                      >
                        <Image src={user1} alt='User' />
                        <Image src={user2} alt='User' />
                        User list
                      </Dropdown.Item>

                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.userVerification}
                        className={`${
                          location === tabsPath.userVerification ? 'active' : ''
                        }`}
                      >
                        <Image src={user1} alt='User' />
                        <Image src={user2} alt='User' />
                        User Verification
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              )}

              {userAuth.userPerms?.userManagement && (
                <li>
                  <Dropdown
                    show={transetionMenueShow}
                    onClick={() => setTransetionMenueShow((pre) => !pre)}
                  >
                    <Dropdown.Toggle
                      variant='success'
                      id='dropdown-basic'
                      className={`${
                        location === tabsPath.transectionsTab ? 'active' : ''
                      } rmrounded `}
                    >
                      <Image
                        src={'/images/svgs/categoryManagement.svg'}
                        width={25}
                        height={25}
                        alt='Mange Icon'
                      />
                      <Image
                        src={'/images/svgs/categoryManagement.svg'}
                        width={25}
                        height={25}
                        className='black-svg'
                        alt='Manage dark icon'
                      />
                      Transactions
                    </Dropdown.Toggle>
                    <i className='fa fa-angle-down' />
                    <Dropdown.Menu>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.transectionsTab}
                        className={`${
                          location === tabsPath.transectionsTab ? 'active' : ''
                        }`}
                      >
                        <Image src={user1} alt='User' />
                        <Image src={user2} alt='User' />
                        All Transactions
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              )}
              {userAuth.userPerms?.articleManagement && (
                <li>
                  {/* <Link href="#" >
                <Image src={article1} alt="Article" />
                <Image src={article2} alt="Article" />
                Article Management
              </Link> */}
                  <Dropdown
                    show={articleMenueShow}
                    onClick={() => setArticleMenueShow((pre) => !pre)}
                  >
                    <Dropdown.Toggle
                      variant='success'
                      id='dropdown-basic'
                      className={`${articleMenueShow ? 'active' : ''}rmrounded`}
                    >
                      <Image src={article1} alt='Article' />
                      <Image src={article2} alt='Article' />
                      Article Management
                    </Dropdown.Toggle>
                    <i className='fa fa-angle-down' />
                    <Dropdown.Menu>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.articlelist}
                        className={`${
                          location === tabsPath.articlelist ? 'active' : ''
                        }`}
                      >
                        <Image src={iconlist1} alt='ICon' />
                        <Image src={iconlist1} alt='ICon' /> Articles list
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.pendingList}
                        className={`${
                          location === tabsPath.pendingList ? 'active' : ''
                        }`}
                      >
                        <Image src={iconlist2} alt='ICon' />
                        <Image src={iconlist2} alt='ICon' /> Pending articles
                      </Dropdown.Item>{' '}
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.manageView}
                        className={`${
                          location === tabsPath.manageView ? 'active' : ''
                        }`}
                      >
                        <Image
                          src={'/images/Group1773.svg'}
                          width={25}
                          height={25}
                          alt='Manage Views Icon'
                        />
                        <Image
                          src={'/images/Group1773.svg'}
                          width={25}
                          height={25}
                          className='black-svg'
                          alt='Manage Views Icon'
                        />{' '}
                        Manage Views
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.manageWeb3View}
                        className={`${
                          location === tabsPath.manageWeb3View ? 'active' : ''
                        }`}
                      >
                        <Image
                          src={'/images/Group1773.svg'}
                          width={25}
                          height={25}
                          alt='Manage Views Icon'
                        />
                        <Image
                          src={'/images/Group1773.svg'}
                          width={25}
                          height={25}
                          className='black-svg'
                          alt='Manage Views Icon'
                        />{' '}
                        Manage Web3 Views
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.manageDir}
                        className={`${
                          location === tabsPath.manageDir ? 'active' : ''
                        }`}
                      >
                        <Image src={iconlist2} alt='ICon' />
                        <Image src={iconlist2} alt='ICon' /> Manage Web3
                        Directory
                      </Dropdown.Item>{' '}
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.managePocast}
                        className={`${
                          location === tabsPath.managePocast ? 'active' : ''
                        }`}
                      >
                        <Image src={iconlist2} alt='ICon' />
                        <Image src={iconlist2} alt='ICon' /> Manage Podcast
                      </Dropdown.Item>{' '}
                      {/* <Dropdown.Item
                        as={Link}
                        href={tabsPath.addquiz}
                        className={`${
                          location === tabsPath.addquiz ? 'active' : ''
                        }`}
                      >
                        <Image src={iconlist2} alt='ICon' />
                        <Image src={iconlist2} alt='ICon' />
                        add Quiz
                      </Dropdown.Item>{' '} */}
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.quizmanage}
                        className={`${
                          location === tabsPath.quizmanage ? 'active' : ''
                        }`}
                      >
                        <Image src={iconlist2} alt='ICon' />
                        <Image src={iconlist2} alt='ICon' /> Manage Quiz
                      </Dropdown.Item>{' '}
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.manageServay}
                        className={`${
                          location === tabsPath.manageServay ? 'active' : ''
                        }`}
                      >
                        <Image src={iconlist2} alt='ICon' />
                        <Image src={iconlist2} alt='ICon' /> Manage Survey
                      </Dropdown.Item>{' '}
                      {/* <Dropdown.Item
                        as={Link}
                        href='/super-admin/manage-category'
                        className={`${
                          location === '/super-admin/manage-category'
                            ? 'active'
                            : ''
                        }`}
                      >
                        <Image src={iconlist2} alt='ICon' />
                        <Image src={iconlist2} alt='ICon' /> Manage Category
                      </Dropdown.Item> */}
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              )}
              {userAuth.userPerms?.userManagement && (
                <li>
                  <Dropdown
                    show={featuredCampaignShow}
                    onClick={() => featuredCampaignMenuShow((pre) => !pre)}
                  >
                    <Dropdown.Toggle
                      variant='success'
                      id='dropdown-basic'
                      className={`${
                        location === tabsPath.addCampaign ||
                        location === tabsPath.manageCampaigns
                          ? 'active'
                          : ''
                      } rmrounded `}
                    >
                      <Image
                        src={'/images/svgs/categoryManagement.svg'}
                        width={25}
                        height={25}
                        alt='Mange Icon'
                      />
                      <Image
                        src={'/images/svgs/categoryManagement.svg'}
                        width={25}
                        height={25}
                        className='black-svg'
                        alt='Manage dark icon'
                      />
                      Campaigns Management
                    </Dropdown.Toggle>
                    <i className='fa fa-angle-down' />
                    <Dropdown.Menu>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.addCampaign}
                        className={`${
                          location === tabsPath.addCampaign ? 'active' : ''
                        }`}
                      >
                        <Image src={user1} alt='User' />
                        <Image src={user2} alt='User' />
                        Add Campaign
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.manageCampaigns}
                        className={`${
                          location === tabsPath.manageCampaigns ? 'active' : ''
                        }`}
                      >
                        <Image src={user1} alt='User' />
                        <Image src={user2} alt='User' />
                        Manage Campaigns
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              )}
              {userAuth.userPerms?.articleManagement && (
                <li>
                  {/* <Link href="#" >
                <Image src={article1} alt="Article" />
                <Image src={article2} alt="Article" />
                Article Management
              </Link> */}
                  <Dropdown
                    show={categoryMenuShow}
                    onClick={() => setCategoryMenuShow((pre) => !pre)}
                  >
                    <Dropdown.Toggle
                      variant='success'
                      id='dropdown-basic'
                      className={`${
                        location === tabsPath.ManageCategory ||
                        location === tabsPath.allCategory
                          ? 'active'
                          : ''
                      }rmrounded `}
                    >
                      <Image
                        src={'/images/svgs/categoryManagement.svg'}
                        width={25}
                        height={25}
                        alt='Mange Icon'
                      />
                      <Image
                        src={'/images/svgs/categoryManagement.svg'}
                        width={25}
                        height={25}
                        className='black-svg'
                        alt='Manage dark icon'
                      />
                      Category Management
                    </Dropdown.Toggle>
                    <i className='fa fa-angle-down' />
                    <Dropdown.Menu>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.ManageCategory}
                        className={`${
                          location === tabsPath.ManageCategory ? 'active' : ''
                        }`}
                      >
                        <Image
                          src={'/images/svgs/addCategory.svg'}
                          width={25}
                          height={25}
                          alt='Add Icon'
                        />
                        <Image
                          src={'/images/svgs/addCategory.svg'}
                          width={25}
                          height={25}
                          className='black-svg'
                          alt='Add dark icon'
                        />
                        Add Category
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.allCategory}
                        className={`${
                          location === tabsPath.allCategory ? 'active' : ''
                        }`}
                      >
                        <Image
                          src={'/images/svgs/allCategories.svg'}
                          width={25}
                          height={25}
                          alt='All Icon'
                        />
                        <Image
                          src={'/images/svgs/allCategories.svg'}
                          width={25}
                          height={25}
                          className='black-svg'
                          alt='All dark icon'
                        />
                        All Categories
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              )}
              {userAuth.userPerms?.articleManagement && (
                <li>
                  <Dropdown
                    show={eventMenuShow}
                    onClick={() => setEventMenuShow((pre) => !pre)}
                  >
                    <Dropdown.Toggle
                      variant='success'
                      id='dropdown-basic'
                      className={`${
                        location === tabsPath.addEvent ||
                        location === tabsPath.events
                          ? 'active'
                          : ''
                      }rmrounded `}
                    >
                      <Image src={article1} alt='Article' />
                      <Image src={article2} alt='Article' />
                      Event Management
                    </Dropdown.Toggle>
                    <i className='fa fa-angle-down' />
                    <Dropdown.Menu>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.events}
                        className={`${
                          location === tabsPath.events ? 'active' : ''
                        }`}
                      >
                        <Image src={iconlist2} alt='ICon' />
                        <Image src={iconlist2} alt='ICon' /> Events
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.addEvent}
                        className={`${
                          location === tabsPath.addEvent ? 'active' : ''
                        }`}
                      >
                        <Image src={iconlist2} alt='ICon' />
                        <Image src={iconlist2} alt='ICon' /> Add Event
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              )}
              {userAuth.userPerms?.adminManagement && (
                <li>
                  <Dropdown
                    show={adminMenueShow}
                    onClick={() => setAdminMenueShow((pre) => !pre)}
                  >
                    <Dropdown.Toggle
                      variant='success'
                      id='dropdown-basic'
                      className={`${
                        location === tabsPath.makeAdmin ||
                        location === tabsPath.trackAdmin
                          ? 'active'
                          : ''
                      } rmrounded`}
                    >
                      <Image src={admin1} alt='admin' />
                      <Image src={admin2} alt='admin' />
                      Admin Management
                    </Dropdown.Toggle>
                    <i className='fa fa-angle-down' />
                    <Dropdown.Menu>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.makeAdmin}
                        className={`${
                          location === tabsPath.makeAdmin ? 'active' : ''
                        }`}
                      >
                        <Image src={iconlist3} alt='admin' />
                        <Image src={iconlist3} alt='admin' /> Make Admin
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.trackAdmin}
                        className={`${
                          location === tabsPath.trackAdmin ? 'active' : ''
                        }`}
                      >
                        <Image src={iconlist4} alt='admin' />
                        <Image src={iconlist4} alt='admin' /> Track Admin
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.dashboarddata}
                        className={`${
                          location === tabsPath.dashboarddata ? 'active' : ''
                        }`}
                      >
                        <Image src={iconlist4} alt='admin' />
                        <Image src={iconlist4} alt='admin' /> Track Data
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              )}
              {userAuth.userPerms?.adminManagement && (
                <li>
                  <Dropdown
                    show={rewardmenue}
                    onClick={() => setRewardmenue((pre) => !pre)}
                  >
                    <Dropdown.Toggle
                      variant='success'
                      id='dropdown-basic'
                      className={`${
                        location === tabsPath.manageReward ||
                        location === tabsPath.artificialReward ||
                        location === tabsPath.coinsInIcp ||
                        location === tabsPath.menualReward || location === tabsPath.tokenClaimsPage  
                          ? 'active'
                          : ''
                      } rmrounded`}
                    >
                      <Image src={admin1} alt='admin' />
                      <Image src={admin2} alt='admin' />
                      Reward Management
                    </Dropdown.Toggle>
                    <i className='fa fa-angle-down' />
                    <Dropdown.Menu>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.manageReward}
                        className={`${
                          location == tabsPath.manageReward ? 'active' : ''
                        }`}
                      >
                        <Image src={user1} alt='User' />
                        <Image src={user2} alt='User' />
                        Reward Management
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.artificialReward}
                        className={`${
                          location == tabsPath.artificialReward ? 'active' : ''
                        }`}
                      >
                        <Image src={user1} alt='User' />
                        <Image src={user2} alt='User' /> Artificial Reward
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.menualReward}
                        className={`${
                          location == tabsPath.menualReward ? 'active' : ''
                        }`}
                      >
                        <Image src={user1} alt='User' />
                        <Image src={user2} alt='User' /> Manual Reward
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.coinsInIcp}
                        className={`${
                          location == tabsPath.coinsInIcp ? 'active' : ''
                        }`}
                      >
                        <Image src={user1} alt='User' />
                        <Image src={user2} alt='User' /> Coins in ICP
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.tokenTab}
                        className={`${
                          location == tabsPath.tokenTab ? 'active' : ''
                        }`}
                      >
                        <Image src={user1} alt='User' />
                        <Image src={user2} alt='User' /> Manage Token
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.tokenClaimsPage}
                        className={`${
                          location == tabsPath.tokenClaimsPage ? 'active' : ''
                        }`}
                      >
                        <Image src={user1} alt='User' />
                        <Image src={user2} alt='User' /> Claims Request
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              )}
              {userAuth.userPerms?.adminManagement && (
                <li>
                  <Dropdown
                    show={deployMenuShow}
                    onClick={() => setDeployMenuShow((pre) => !pre)}
                  >
                    <Dropdown.Toggle
                      variant='success'
                      id='dropdown-basic'
                      className={`${deployMenuShow ? 'active' : ''} rmrounded`}
                    >
                      <Image src={admin1} alt='admin' />
                      <Image src={admin2} alt='admin' />
                      Build Deployment
                    </Dropdown.Toggle>
                    <i className='fa fa-angle-down' />
                    <Dropdown.Menu>
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.deployNFTStudio24}
                        className={`${
                          location == tabsPath.deployNFTStudio24 ? 'active' : ''
                        }`}
                      >
                        <Image src={user1} alt='User' />
                        <Image src={user2} alt='User' />
                        Deploy BlockZa
                      </Dropdown.Item>{' '}
                      <Dropdown.Item
                        as={Link}
                        href={tabsPath.deployNFTStudio24JP}
                        className={`${
                          location == tabsPath.deployNFTStudio24JP
                            ? 'active'
                            : ''
                        }`}
                      >
                        <Image src={user1} alt='User' />
                        <Image src={user2} alt='User' />
                        Deploy BlockZa_JP
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
