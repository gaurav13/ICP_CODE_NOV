'use client';
// import * as React from 'react';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Articles1 from '@/assets/Img/Icons/icon-article-2.png';
import Articles2 from '@/assets/Img/Icons/icon-article-1.png';
import crypto1 from '@/assets/Img/sidebar-icons/icon-crypto-1.png';
import crypto2 from '@/assets/Img/sidebar-icons/icon-crypto-2.png';
import Contact1 from '@/assets/Img/sidebar-icons/icon-contact-1.png';
import Contact2 from '@/assets/Img/sidebar-icons/icon-contact-2.png';
import iconlogo from '@/assets/Img/Icons/icon-logo.png';
import Infinity from '@/assets/Img/Icons/infinity.png';
import Wallet from '@/assets/Img/Icons/plug-wallet.png';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Modal, Spinner } from 'react-bootstrap';
import SocialList from '@/components/SocialList/SocialList';
import ArticlesPost from '@/components/ArticlesPost/ArticlesPost';
import { useConnectPlugWalletStore, useThemeStore } from '@/store/useStore';
import authMethods from '@/lib/auth';
import logger from '@/lib/logger';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import {
  ALL_ARTICLES,
  CAREERS,
  CATEGORY_PATH,
  CONTACT_US,
  LATEST_NEW_PAGE,
  Blockchain_Category_Link,
  Web3_Category_Link,
  crypto_Category_Link,
  defi_Category_Link,
  dao_Category_Link,
  nft_Category_Link,
  metaverse_Category_Link,
  blockchaingame_Category_Link,
  ai_Category_Link,
} from '@/constant/routes';
import LanguageBtn from '@/components/LanguageBtn/LanguageBtn';
import ConfirmationModel from '@/components/Modal/ConfirmationModel';

export default function NewSidebarHome() {
  const { t, changeLocale } = useLocalization(LANG);

  const [isThemeActive, setIsThemeActive] = useState(false);
  const [show, setShow] = useState(false);

  const [isLoading, setIsLoading] = React.useState<boolean>();
  const [isConnectLoading, setIsConnectLoading] = useState<boolean>(false);
  const [toggle, settoggle] = React.useState(false);
  const [connected, setConnected] = useState(false);
  const [tab, setTab] = React.useState<string>('');
  const router = useRouter();
  const location = usePathname();
  const path = usePathname();
  const [loginModalShow, setLoginModalShow] = React.useState(false);

  const route = location.split('/')[1];
  const sidebarRef = React.useRef<HTMLElement | null>();

  const { auth, setAuth, setIdentity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
    setIdentity: state.setIdentity,
  }));
  const { isBlack, setIsBlack, isOpen, setIsOpen } = useThemeStore((state) => ({
    isBlack: state.isBlack,
    isOpen: state.isOpen,
    setIsBlack: state.setIsBlack,
    setIsOpen: state.setIsOpen,
  }));
  const handleConnectClose = () => {
    setIsConnectLoading(false);
  };
  const sectionRef = useRef<any>(null);
  const methods = authMethods({
    useConnectPlugWalletStore,
    setIsLoading: setIsConnectLoading,
    handleClose: handleConnectClose,
  });

  const toggleHandle = () => {
    if (isOpen !== 'Navbar') {
      settoggle((prev) => {
        if (!prev) {
          setIsOpen('Sidebar');
          return true;
        } else {
          setIsOpen('');
          return false;
        }
      });
    }
  };
  const handleTabChange = (tab: string) => {
    setTab(tab);
  };
  // Dark Theme

  let routes: {
    latest: string;
    web3: string;
    blockchain: string;
    crypto: string;
    defi: string;
    dao: string;
    nft: string;
    metaverse: string;
    games: string;
    ai: string;
    career: string;
    advertise: string;
    contact: string;
    blockchaincate:string;
    web3cat:string;
    cryptocat:string;
    deficat:string;
    daocat:string;
    nftcat:string;
    metaversecat:string;
    blockchaingamecat:string;
    aicat:string;
  } = {
    latest: 'https://blockza.io/news/',
    web3: '#web3',
    blockchain: '#blockchain',
    crypto: 'https://blockza.io/news/cryptopedia/',
    defi: 'https://blockza.io/?s=defi',
    dao: 'https://blockza.io/?s=dao',
    nft: 'https://blockza.io/news/latest-nft-news/',
    metaverse: 'https://blockza.io/news/latest-nft-news/virtual-land/',
    games: 'https://blockza.io/news/latest-nft-news/metaverse-nft-games/',
    ai: 'https://blockza.io/?s=AI',
    career: CAREERS,
    advertise: 'https://blockza.io/advertise-with-us/',
    contact: CONTACT_US,
    blockchaincate: Blockchain_Category_Link,
    web3cat:Web3_Category_Link,
    cryptocat:crypto_Category_Link,
    deficat:defi_Category_Link,
    daocat:dao_Category_Link,
    nftcat:nft_Category_Link,
    metaversecat:metaverse_Category_Link,
    blockchaingamecat:blockchaingame_Category_Link,
    aicat:ai_Category_Link,
  };
  if (path !== '/') {
    if (auth.state === 'initialized') {
      routes = {
        latest: 'https://blockza.io/news/',
        web3: '/?route=blockchain',
        blockchain: '/?route=blockchain',
        crypto: 'https://blockza.io/news/cryptopedia/',
        defi: 'https://blockza.io/?s=defi',
        dao: 'https://blockza.io/?s=dao',
        nft: 'https://blockza.io/news/latest-nft-news/',
        metaverse: 'https://blockza.io/news/latest-nft-news/virtual-land/',
        games: 'https://blockza.io/news/latest-nft-news/metaverse-nft-games/',
        ai: 'https://blockza.io/?s=AI',
        career: CAREERS,
        advertise: 'https://blockza.io/advertise-with-us/',
        contact: CONTACT_US,
        blockchaincate: Blockchain_Category_Link,
        web3cat:Web3_Category_Link,
        cryptocat:crypto_Category_Link,
        deficat:defi_Category_Link,
        daocat:dao_Category_Link,
        nftcat:nft_Category_Link,
        metaversecat:metaverse_Category_Link,
        blockchaingamecat:blockchaingame_Category_Link,
        aicat:ai_Category_Link,
      };
    } else {
      routes = {
        latest: 'https://blockza.io/news/',
        web3: '/?route=web3',
        blockchain: '/?route=blockchain',
        crypto: 'https://blockza.io/news/cryptopedia/',
        defi: 'https://blockza.io/?s=defi',
        dao: 'https://blockza.io/?s=dao',
        nft: 'https://blockza.io/news/latest-nft-news/',
        metaverse: 'https://blockza.io/news/latest-nft-news/virtual-land/',
        games: 'https://blockza.io/news/latest-nft-news/metaverse-nft-games/',
        ai: 'https://blockza.io/?s=AI',
        career: CAREERS,
        advertise: 'https://blockza.io/advertise-with-us/',
        contact: CONTACT_US,
        blockchaincate: Blockchain_Category_Link,
        web3cat:Web3_Category_Link,
        cryptocat:crypto_Category_Link,
        deficat:defi_Category_Link,
        daocat:dao_Category_Link,
        nftcat:nft_Category_Link,
        metaversecat:metaverse_Category_Link,
        blockchaingamecat:blockchaingame_Category_Link,
        aicat:ai_Category_Link,
      };
    }
  } else {
    if (auth.state === 'initialized') {
      routes = {
        latest: 'https://blockza.io/news/',
        web3: '#blockchain',
        blockchain: '#blockchain',
        crypto: 'https://blockza.io/news/cryptopedia/',
        defi: 'https://blockza.io/?s=defi',
        dao: 'https://blockza.io/?s=dao',
        nft: 'https://blockza.io/news/latest-nft-news/',
        metaverse: 'https://blockza.io/news/latest-nft-news/virtual-land/',
        games: 'https://blockza.io/news/latest-nft-news/metaverse-nft-games/',
        ai: 'https://blockza.io/?s=AI',
        career: CAREERS,
        advertise: 'https://blockza.io/advertise-with-us/',
        contact: CONTACT_US,
        blockchaincate: Blockchain_Category_Link,
        web3cat:Web3_Category_Link,
        cryptocat:crypto_Category_Link,
        deficat:defi_Category_Link,
        daocat:dao_Category_Link,
        nftcat:nft_Category_Link,
        metaversecat:metaverse_Category_Link,
        blockchaingamecat:blockchaingame_Category_Link,
        aicat:ai_Category_Link,
      };
    }
  }
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // Function to toggle the class
  const toggleThemeClass = () => {
    setIsThemeActive(!isThemeActive);
  };
  // Dark Theme

  const connect = async () => {
    setLoginModalShow(false);
    setIsConnectLoading(true);
    const login = await methods.login();
  };

  const closeNavbar = (event: any) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      toggleHandle();
    }
  };
  useEffect(() => {
    if (toggle) {
      document.addEventListener('click', closeNavbar);
    } else {
      document.removeEventListener('click', closeNavbar);
    }

    return () => {
      document.removeEventListener('click', closeNavbar);
    };
  }, [toggle]);

  const [isSubMenuVisible, setSubMenuVisibility] = useState(false);

  const toggleSubMenu = (e: any) => {
    e.preventDefault();
    setSubMenuVisibility((prevVisibility) => !prevVisibility);
  };
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (sectionRef.current && !sectionRef.current.contains(event.target)) {
        setSubMenuVisibility(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    // const token = getToken();
    // if (window.ic) {
    // window.ic.plug.isConnected();
    // }
    const getIdentity = async () => {
      if (auth.client) {
        const con = await auth.client.isAuthenticated();
        setConnected(con);
      }
    };
    getIdentity();
  }, [auth]);
  React.useEffect(() => {
    const currentTab = location;

    setTab(currentTab);
  }, []);
  let confirmationModelOpen = () => {
    setLoginModalShow(true);
  };
  return (
    route != 'blocked' &&
    route != 'super-admin' && (
      <>
        <div
          ref={sidebarRef as React.RefObject<HTMLDivElement>}
          className={toggle ? 'sidebar-home new active' : 'sidebar-home new'}
        >
          <div className='sidebar-inner '>
            <button className='toggler' onClick={toggleHandle}>
              <p className='m-0'>
                <span />
                <span />
                <span />
              </p>
            </button>
            <ul ref={sectionRef}>
              <li>
                <Button
                  onClick={confirmationModelOpen}
                  className={`connect-btn `}
                  disabled={isConnectLoading || connected}
                >
                  <span>
                    <Image src={iconlogo} alt='Blockza' />
                  </span>
                  {isConnectLoading ? (
                    <span className='japnes-btn'>
                      <Spinner size='sm' className='text-primary ' />
                    </span>
                  ) : connected ? (
                    <span className='japnes-btn'>{t('Connected')}</span>
                  ) : (
                    <span
                      className={`japnes-btn ${LANG === 'jp' ? 'fontFix' : ''}`}
                    >
                      {LANG === 'en' ? 'Connect' : 'Wallet Connect'}
                    </span>
                  )}
                </Button>
              </li>
              <li>
                <div className='sidebarLng'>
                  <LanguageBtn id='sidebarLngBtn' />
                </div>
              </li>
              <li>
                <Link
                  className={location === '/allarticlesss' ? 'active' : ''}
                  href={LATEST_NEW_PAGE}
                >
                  <div className='img-pnl'>
                    <svg
                      version='1.1'
                      id='Capa_2'
                      xmlns='http://www.w3.org/2000/svg'
                      x='0px'
                      y='0px'
                      viewBox='0 0 442 442'
                    >
                      <g>
                        <path d='M171,336H70c-5.523,0-10,4.477-10,10s4.477,10,10,10h101c5.523,0,10-4.477,10-10S176.523,336,171,336z' />
                        <path d='M322,336H221c-5.523,0-10,4.477-10,10s4.477,10,10,10h101c5.522,0,10-4.477,10-10S327.522,336,322,336z' />
                        <path d='M322,86H70c-5.523,0-10,4.477-10,10s4.477,10,10,10h252c5.522,0,10-4.477,10-10S327.522,86,322,86z' />
                        <path d='M322,136H221c-5.523,0-10,4.477-10,10s4.477,10,10,10h101c5.522,0,10-4.477,10-10S327.522,136,322,136z' />
                        <path d='M322,186H221c-5.523,0-10,4.477-10,10s4.477,10,10,10h101c5.522,0,10-4.477,10-10S327.522,186,322,186z' />
                        <path d='M322,236H221c-5.523,0-10,4.477-10,10s4.477,10,10,10h101c5.522,0,10-4.477,10-10S327.522,236,322,236z' />
                        <path d='M322,286H221c-5.523,0-10,4.477-10,10s4.477,10,10,10h101c5.522,0,10-4.477,10-10S327.522,286,322,286z' />
                        <path d='M171,286H70c-5.523,0-10,4.477-10,10s4.477,10,10,10h101c5.523,0,10-4.477,10-10S176.523,286,171,286z' />
                        <path
                          d='M171,136H70c-5.523,0-10,4.477-10,10v101c0,5.523,4.477,10,10,10h101c5.523,0,10-4.477,10-10V146
		C181,140.477,176.523,136,171,136z M161,237H80v-81h81V237z'
                        />
                        <path
                          d='M422,76h-30V46c0-11.028-8.972-20-20-20H20C8.972,26,0,34.972,0,46v320c0,27.57,22.43,50,50,50h342c27.57,0,50-22.43,50-50
		V96C442,84.972,433.028,76,422,76z M422,366c0,16.542-13.458,30-30,30H50c-16.542,0-30-13.458-30-30V46h352v305
		c0,13.785,11.215,25,25,25c5.522,0,10-4.477,10-10s-4.478-10-10-10c-2.757,0-5-2.243-5-5V96h30V366z'
                        />
                      </g>
                    </svg>
                    {/* <Image src={News1} alt={t('Articles')} />
                    <Image src={News2} alt={t('Articles')} /> */}
                  </div>
                  {t('Latest News')}
                </Link>
              </li>
              {auth.state === 'initialized' ? (
                <li>
                  <Link
                    onClick={(e: any) => {
                      e.preventDefault();
                      settoggle(false);
                      router.push(ALL_ARTICLES);
                    }}
                    className={location === ALL_ARTICLES ? 'active' : ''}
                    href={ALL_ARTICLES}
                  >
                    <div className='img-pnl'>
                      <Image src={Articles1} alt='Articles' />
                      <Image src={Articles2} alt='Articles' />
                    </div>
                    {t('My Articles')}
                  </Link>
                </li>
              ) : null}
              <li>
                <Link
                  className={location === '/search' ? 'active' : ''}
                  onClick={(e: any) => {
                    e.preventDefault();
                    settoggle(false);
                    router.push(routes.web3cat);
                  }}
                  href={routes.web3cat}
                >
                  <div className='img-pnl'>
                    <svg
                      id='Icons'
                      enableBackground='new 0 0 128 128'
                      viewBox='0 0 128 128'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        id='Web_Browser'
                        d='m108 12h-88c-6.617 0-12 5.383-12 12v80c0 6.617 5.383 12 12 12h88c6.617 0 12-5.383 12-12v-80c0-6.617-5.383-12-12-12zm-88 8h88c2.205 0 4 1.795 4 4v20h-96v-20c0-2.205 1.795-4 4-4zm88 88h-88c-2.205 0-4-1.795-4-4v-52h96v52c0 2.205-1.795 4-4 4zm-44-76c0-2.209 1.791-4 4-4h32c2.209 0 4 1.791 4 4s-1.791 4-4 4h-32c-2.209 0-4-1.791-4-4zm-40 0c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zm12 0c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zm12 0c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zm52 28h-72c-2.209 0-4 1.791-4 4v16c0 2.209 1.791 4 4 4h72c2.209 0 4-1.791 4-4v-16c0-2.209-1.791-4-4-4zm-4 16h-64v-8h64zm-16 20c0 2.209-1.791 4-4 4h-48c-2.209 0-4-1.791-4-4s1.791-4 4-4h48c2.209 0 4 1.791 4 4zm24 0c0 2.209-1.791 4-4 4h-8c-2.209 0-4-1.791-4-4s1.791-4 4-4h8c2.209 0 4 1.791 4 4z'
                      />
                    </svg>
                  </div>
                  {t('Web3 ')}
                </Link>
              </li>
              <li>
              <Link
                    onClick={(e: any) => {
                        e.preventDefault();
                        settoggle(false);
                        router.push(routes.blockchaincate);
                      }}
                      href={routes.blockchaincate}
                    >
                  <div className='img-pnl'>
                    <svg
                      viewBox='0 0 512 512.00013'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='m0 457.726562c0 5.683594 3.207031 10.871094 8.292969 13.417969l82.707031 40.855469v-110.726562l-91-45zm0 0' />
                      <path d='m121 401.273438v110.726562l81.710938-40.855469c5.082031-2.546875 8.289062-7.730469 8.289062-13.417969v-35.726562h90v35.726562c0 5.6875 3.207031 10.871094 8.292969 13.417969l81.707031 40.855469v-110.726562l-90-45v35.726562h-90v-35.730469zm0 0' />
                      <path d='m112.710938 273.585938c-4.226563-2.113282-9.195313-2.113282-13.417969 0l-97.519531 50.027343 104.226562 51.613281 103.226562-51.613281-43.800781-22.707031 42.042969-76.675781 33.53125 17.769531v-111.726562l-90-45v101.453124c0 5.683594 3.207031 10.871094 8.292969 13.417969l21.320312 10.664063-41.828125 76.292968zm0 0' />
                      <path d='m421 512 82.710938-40.855469c5.082031-2.546875 8.289062-7.730469 8.289062-13.417969v-101.457031l-91 45.003907zm0 0' />
                      <path d='m361 186.726562v-101.457031l-90 45.003907v111.726562l33.535156-17.765625 42.039063 76.675781-43.800781 22.703125 103.226562 51.613281 104.226562-51.613281-97.515624-50.03125c-4.226563-2.113281-9.195313-2.113281-13.417969 0l-26.078125 13.519531-41.828125-76.292968 21.324219-10.664063c5.082031-2.546875 8.289062-7.734375 8.289062-13.417969zm0 0' />
                      <path d='m249.292969 1.585938-96.519531 51.027343 103.226562 51.613281 103.226562-51.613281-96.515624-51.03125c-4.226563-2.109375-9.195313-2.109375-13.417969.003907zm0 0' />
                    </svg>
                  </div>
                  {t('Blockchain')}
                </Link>
              </li>
              <li>
                <Link
                  onClick={(e: any) => {
                    e.preventDefault();
                    settoggle(false);
                    router.push(routes.cryptocat);
                  }}
                  href={routes.cryptocat}
                >
                  <div className='img-pnl'>
                    <Image src={crypto2} alt='Crypto Icon' />
                    <Image src={crypto1} alt='Crypto Icon' />
                  </div>
                  {t('Crypto')}
                </Link>
              </li>
              <li>
                <Link
                  onClick={(e: any) => {
                    e.preventDefault();
                    settoggle(false);
                    router.push(routes.deficat);
                  }}
                  href={routes.deficat}
                >
                  <div className='img-pnl'>
                    <svg
                      version='1.1'
                      id='Capa_1'
                      xmlns='http://www.w3.org/2000/svg'
                      x='0px'
                      y='0px'
                      viewBox='0 0 469.333 469.333'
                    >
                      <g>
                        <g>
                          <g>
                            <path
                              d='M192,138.09c0,35.071,69.76,53.426,138.667,53.426s138.667-18.355,138.667-53.426C469.333,67.947,192,67.947,192,138.09z
				'
                            />
                            <path
                              d='M464.188,189.836c-3.177-1.92-7.167-2.056-10.469-0.323c-28.729,15.068-72.427,23.374-123.052,23.374
				s-94.323-8.306-123.052-23.374c-3.302-1.732-7.292-1.597-10.469,0.323c-3.198,1.93-5.146,5.405-5.146,9.141v3.224
				c0,35.071,69.76,53.426,138.667,53.426s138.667-18.355,138.667-53.426v-3.224C469.333,195.241,467.385,191.766,464.188,189.836z'
                            />
                            <path
                              d='M64,351.795c0,35.072,69.76,53.426,138.667,53.426s138.667-18.355,138.667-53.426C341.333,281.652,64,281.652,64,351.795
				z'
                            />
                            <path
                              d='M336.188,403.542c-3.188-1.91-7.167-2.056-10.469-0.323c-28.729,15.068-72.427,23.374-123.052,23.374
				s-94.323-8.306-123.052-23.374c-3.302-1.732-7.292-1.586-10.469,0.323c-3.198,1.93-5.146,5.405-5.146,9.141v3.224
				c0,35.072,69.76,53.426,138.667,53.426s138.667-18.355,138.667-53.426v-3.224C341.333,408.947,339.385,405.472,336.188,403.542z'
                            />
                            <path
                              d='M138.667,106.034c14.406,0,28.813-0.814,42.823-2.431c2.281-0.261,4.417-1.252,6.094-2.828
				c16.156-15.235,43.76-26.473,79.823-32.494c3.813-0.637,6.99-3.287,8.292-6.939c1.104-3.078,1.635-5.937,1.635-8.734
				C277.333-17.536,0-17.536,0,52.607C0,87.679,69.76,106.034,138.667,106.034z'
                            />
                            <path
                              d='M138.667,170.145c8.833,0,17.448-0.303,25.792-0.856c3.365-0.23,6.417-2.024,8.25-4.863
				c1.823-2.828,2.208-6.365,1.042-9.527c-2.073-5.583-3.083-11.082-3.031-17.384c0-2.922-1.198-5.718-3.313-7.732
				c-2.104-2.014-5.073-3.235-7.865-2.943c-6.969,0.334-13.938,0.563-20.875,0.563c-50.625,0-94.323-8.306-123.052-23.374
				c-3.302-1.732-7.292-1.596-10.469,0.323C1.948,106.284,0,109.759,0,113.495v3.224C0,151.791,69.76,170.145,138.667,170.145z'
                            />
                            <path
                              d='M138.667,234.257c8.833,0,17.448-0.303,25.792-0.856c3.365-0.23,6.417-2.024,8.25-4.863
				c1.823-2.828,2.208-6.365,1.042-9.527c-2.073-5.583-3.083-11.082-3.083-17.384c0-2.922-1.198-5.718-3.313-7.732
				c-2.104-2.014-5.021-3.162-7.865-2.943c-6.948,0.334-13.896,0.563-20.823,0.563c-50.625,0-94.323-8.306-123.052-23.374
				c-3.302-1.732-7.292-1.596-10.469,0.323C1.948,170.396,0,173.871,0,177.606v3.224C0,215.902,69.76,234.257,138.667,234.257z'
                            />
                            <path
                              d='M464.188,318.059c-3.198-1.951-7.167-2.056-10.469-0.323c-20.073,10.529-48.313,17.885-81.656,21.256
				c-5.625,0.574-9.635,7.148-9.396,12.804c0,5.416-0.875,10.591-2.667,15.798c-1.188,3.454-0.531,7.284,1.74,10.143
				c2.042,2.557,5.115,4.028,8.344,4.028c0.375,0,0.76-0.021,1.146-0.063c61.427-6.637,98.104-25.805,98.104-51.277V327.2
				C469.333,323.465,467.385,319.99,464.188,318.059z'
                            />
                            <path
                              d='M202.667,276.998l7.073,0.125c0.063,0,0.125,0,0.188,0c4.979,0,9.302-3.454,10.406-8.327
				c1.115-4.946-1.385-9.986-5.99-12.084l-2.281-1.023c-1.521-0.668-3.052-1.336-4.469-2.077c-3.323-1.743-7.26-1.586-10.458,0.344
				c-3.188,1.93-5.135,5.395-5.135,9.13v3.224C192,272.219,196.771,276.998,202.667,276.998z'
                            />
                            <path
                              d='M464.188,253.948c-3.177-1.92-7.167-2.056-10.469-0.323c-28.729,15.068-72.427,23.374-123.052,23.374l-7.042-0.136
				c-4.302-0.365-9.448,3.423-10.542,8.358c-1.104,4.936,1.396,9.965,5.99,12.052c11.552,5.259,20.99,11.51,28.042,18.574
				c2.01,2.004,4.719,3.12,7.542,3.12c0.219,0,0.448-0.01,0.677-0.021c52.583-3.339,114-19.127,114-52.633v-3.224
				C469.333,259.353,467.385,255.878,464.188,253.948z'
                            />
                            <path
                              d='M89.208,295.051c1.333,0,2.667-0.25,3.927-0.751c18.792-7.44,41.708-12.564,68.125-15.224
				c5.625-0.563,9.646-7.68,9.406-13.336c0-2.922-1.198-5.718-3.313-7.732c-2.104-2.014-5.021-3.089-7.865-2.943
				c-6.948,0.334-13.896,0.563-20.823,0.563c-50.625,0-94.323-8.306-123.052-23.374c-3.302-1.732-7.292-1.596-10.469,0.323
				C1.948,234.508,0,237.982,0,241.718v3.224c0,23.614,32.792,42.313,87.729,50.004C88.219,295.019,88.719,295.051,89.208,295.051z'
                            />
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  {t('Defi')}
                </Link>
              </li>
              <li>
                <Link
                  onClick={(e: any) => {
                    e.preventDefault();
                    settoggle(false);
                    router.push(routes.daocat);
                  }}
                  href={routes.daocat}
                >
                  <div className='img-pnl'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      id='Filled'
                      viewBox='0 0 512 512'
                    >
                      <title />
                      <g
                        data-name='11. DAO (Decentralized Autonomous Organization)'
                        id='_11._DAO_Decentralized_Autonomous_Organization_'
                      >
                        <path d='M486.61,229.05,469,157.43a27,27,0,1,0-37.85-35.25L282.71,99.06a27,27,0,0,0-53.42,0L80.85,122.18A27,27,0,1,0,43,157.43L25.39,229.05a27,27,0,0,0,0,53.9L43,354.57a27.19,27.19,0,0,0-5.45,4.19c-17,17-4.85,46.08,19.1,46.08a27,27,0,0,0,24.2-15l148.44,23.12a27,27,0,0,0,53.42,0l148.44-23.13a26.93,26.93,0,0,0,24.2,15c27.16,0,37.54-36.26,13.65-50.27L486.61,283a27,27,0,0,0,0-53.9Zm-43.84-71a26.85,26.85,0,0,0,10.65,3l17.65,71.8A26.91,26.91,0,0,0,459.22,248H415V206a31.78,31.78,0,0,0-4.25-15.93ZM280.24,114.87,428.65,138a27.1,27.1,0,0,0,2.82,8.72l-31.9,31.9A31.73,31.73,0,0,0,383,174H264V128.76A27.36,27.36,0,0,0,280.24,114.87ZM369,251v10a33,33,0,0,1-66,0V251a33,33,0,0,1,66,0ZM240,277v9a8,8,0,0,1-16,0V252a32,32,0,0,1,64,0v34a8,8,0,0,1-16,0v-9Zm-31-21a38,38,0,0,1-38,38H151a8,8,0,0,1-8-8V226a8,8,0,0,1,8-8h20A38,38,0,0,1,209,256ZM83.35,138l148.39-23.12A26.72,26.72,0,0,0,248,128.79V174H129a31.73,31.73,0,0,0-16.57,4.61l-31.9-31.9A27.1,27.1,0,0,0,83.35,138ZM58.58,161.08a26.66,26.66,0,0,0,10.65-3l32,32C95.82,199.5,97,202.93,97,248H52.78a26.87,26.87,0,0,0-11.85-15.12Zm-17.65,118A26.91,26.91,0,0,0,52.78,264H97c0,44.6-1.25,48.39,4.25,57.93l-32,32a26.75,26.75,0,0,0-10.65-3Zm190.82,118L83.35,374a27.1,27.1,0,0,0-2.82-8.72l31.9-31.9A31.73,31.73,0,0,0,129,338H248v45.21A26.76,26.76,0,0,0,231.75,397.13ZM428.65,374,280.23,397.13A27.4,27.4,0,0,0,264,383.24V338H383a31.73,31.73,0,0,0,16.57-4.61l31.9,31.9A27.1,27.1,0,0,0,428.65,374Zm24.77-23.08a26.85,26.85,0,0,0-10.65,3l-32-32C416.19,312.5,415,309.07,415,264h44.22a26.93,26.93,0,0,0,11.85,15.13Z' />
                        <path d='M159,234v44h12a22,22,0,0,0,0-44Z' />
                        <path d='M272,252a16,16,0,0,0-32,0v9h32Z' />
                        <path d='M324,239c-6,6-5,12.26-5,22a17,17,0,0,0,34,0V251C353,235.82,334.58,228.37,324,239Z' />
                      </g>
                    </svg>
                  </div>
                  {t('Dao')}
                </Link>
              </li>
              <li>
                <Link
                  onClick={(e: any) => {
                    e.preventDefault();
                    settoggle(false);
                    router.push(routes.nftcat);
                  }}
                  href={routes.nftcat}
                >
                  <div className='img-pnl'>
                    <svg
                      id='svg2581'
                      enableBackground='new 0 0 100 100'
                      viewBox='0 0 100 100'
                    >
                      <path
                        id='polygon2557'
                        d='m41.549 33.432 8.449 5.304 8.45-5.304-8.45-5.303z'
                      />
                      <path
                        id='polygon2559'
                        d='m40.668 45.589 8.33 5.228v-10.347l-8.33-5.229z'
                      />
                      <path
                        id='polygon2561'
                        d='m59.329 35.241-8.331 5.229v10.347l8.331-5.228z'
                      />
                      <path
                        id='path2563'
                        d='m53.783 5.681c-.937-1.362-2.346-2.276-3.97-2.576-1.621-.299-3.268.053-4.627.992l-4.9 3.376h14.734z'
                      />
                      <path
                        id='path2565'
                        d='m7.224 37.758 12.506 18.148v-34.275l-10.924 7.53c-2.802 1.941-3.513 5.798-1.582 8.597z'
                      />
                      <path
                        id='path2567'
                        d='m31.551 60.281h36.896v-40.987h-36.896zm7.117-26.849c0-.089.012-.175.035-.259.008-.029.022-.054.032-.082.02-.053.038-.106.066-.155.018-.031.042-.058.064-.087.029-.04.056-.081.091-.116.027-.028.06-.049.09-.074.031-.025.057-.053.091-.075l10.33-6.484c.324-.204.738-.204 1.063 0l10.33 6.484c.034.021.06.05.091.074.031.025.063.047.091.074.035.035.062.076.09.115.021.03.046.056.064.088.027.048.045.101.065.153.01.028.025.054.033.084.022.083.035.17.035.258v12.709c0 .344-.177.664-.469.847l-10.33 6.484c-.03.019-.063.027-.094.042s-.061.029-.093.042c-.112.041-.227.07-.344.07s-.233-.028-.344-.07c-.032-.012-.062-.026-.093-.042-.031-.015-.064-.023-.094-.042l-10.33-6.484c-.292-.183-.469-.503-.469-.847v-12.707z'
                      />
                      <path
                        id='path2569'
                        d='m92.766 62.241-12.495-18.129v34.245l10.913-7.519c1.362-.937 2.276-2.347 2.575-3.971.299-1.623-.054-3.266-.993-4.626z'
                      />
                      <path
                        id='path2571'
                        d='m75.741 25.078c0 4.524 3.681 8.206 8.205 8.206s8.206-3.681 8.206-8.206-3.682-8.206-8.206-8.206-8.205 3.682-8.205 8.206zm4.634-.378c.391-.391 1.023-.391 1.414 0l.983.983 3.33-3.331c.391-.391 1.023-.391 1.414 0s.391 1.023 0 1.414l-4.037 4.038c-.188.188-.441.293-.707.293s-.52-.105-.707-.293l-1.69-1.69c-.39-.391-.39-1.024 0-1.414z'
                      />
                      <path
                        id='path2573'
                        d='m73.741 25.078c0-3.528 1.801-6.643 4.53-8.477v-.949c0-3.408-2.772-6.18-6.18-6.18h-44.181c-3.407 0-6.18 2.772-6.18 6.18v68.693c0 3.413 2.772 6.19 6.18 6.19h44.182c3.407 0 6.18-2.777 6.18-6.19v-50.79c-2.731-1.834-4.531-4.949-4.531-8.477zm-30.842 56.59c0 .442-.29.832-.714.958-.095.028-.191.042-.286.042-.331 0-.648-.165-.837-.452l-4.708-7.194v6.646c0 .552-.447 1-1 1s-1-.448-1-1v-10c0-.442.29-.832.714-.958.427-.125.881.042 1.123.411l4.708 7.194v-6.646c0-.552.447-1 1-1s1 .448 1 1zm9.84-6c.553 0 1 .448 1 1s-.447 1-1 1h-4.006v4c0 .552-.447 1-1 1s-1-.448-1-1v-10c0-.552.447-1 1-1h5.006c.553 0 1 .448 1 1s-.447 1-1 1h-4.006v3zm11.905-3h-2.554v9c0 .552-.447 1-1 1s-1-.448-1-1v-9h-2.555c-.553 0-1-.448-1-1s.447-1 1-1h7.108c.553 0 1 .448 1 1s-.446 1-.999 1zm5.803-11.387c0 .552-.447 1-1 1h-38.896c-.553 0-1-.448-1-1v-42.987c0-.552.447-1 1-1h38.896c.553 0 1 .448 1 1z'
                      />
                      <path
                        id='path2575'
                        d='m46.207 94.328c1.937 2.804 5.796 3.516 8.608 1.583l4.893-3.375h-14.737z'
                      />
                    </svg>
                  </div>
                  {t('NFT')}
                </Link>
              </li>
              <li>
                <Link
                  onClick={(e: any) => {
                    e.preventDefault();
                    settoggle(false);
                    router.push(routes.metaversecat);
                  }}
                  href={routes.metaversecat}
                >
                  <div className='img-pnl'>
                    <svg
                      clip-rule='evenodd'
                      fill-rule='evenodd'
                      stroke-linejoin='round'
                      stroke-miterlimit='2'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <g id='Icon'>
                        <path d='m20.25 9.5c0-.729-.29-1.429-.805-1.945-.516-.515-1.216-.805-1.945-.805-2.871 0-8.129 0-11 0-.729 0-1.429.29-1.945.805-.515.516-.805 1.216-.805 1.945v5c0 .729.29 1.429.805 1.945.516.515 1.216.805 1.945.805h1.667c.378 0 .747-.123 1.05-.35l1.466-1.1c.044-.032.096-.05.15-.05h2.334c.054 0 .106.018.15.05l1.466 1.1c.303.227.672.35 1.05.35h1.667c.729 0 1.429-.29 1.945-.805.515-.516.805-1.216.805-1.945zm-9.75 1.75h3c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3c-.414 0-.75.336-.75.75s.336.75.75.75z' />
                        <path d='m2.869 8.561-.212.043c-.818.163-1.407.882-1.407 1.716v3.36c0 .834.589 1.553 1.407 1.716l.212.043c-.078-.304-.119-.62-.119-.939 0-1.488 0-3.512 0-5 0-.319.041-.635.119-.939z' />
                        <path d='m21.131 8.561c.078.304.119.62.119.939v5c0 .319-.041.635-.119.939l.212-.043c.818-.163 1.407-.882 1.407-1.716v-3.36c0-.834-.589-1.553-1.407-1.716z' />
                      </g>
                    </svg>
                  </div>
                  {t('Metaverse')}
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  onClick={toggleSubMenu}
                  className='exclude-from-closing'
                >
                  <div className='img-pnl'>
                    <i className='fa fa-ellipsis-h' />
                  </div>{' '}
                  {t('More')}
                </Link>
              </li>
              {isSubMenuVisible && (
                <div className='sidebar-submenu'>
                  <li>
                    <Link
                      onClick={(e: any) => {
                        e.preventDefault();
                        settoggle(false);
                        router.push(routes.blockchaingamecat);
                      }}
                      href={routes.blockchaingamecat}
                    >
                      <div className='img-pnl'>
                        <svg
                          id='Layer_1'
                          enableBackground='new 0 0 512 512'
                          viewBox='0 0 512 512'
                        >
                          <path
                            clip-rule='evenodd'
                            d='m511.253 307.432c-5.951-73.038-30.406-153.697-62.303-205.489-6.287-10.208-16.771-16.063-28.761-16.063h-36.774c-15.706 0-29.218 10.672-32.856 25.952-3.019 12.676-14.657 21.875-27.674 21.875h-133.769c-13.017 0-24.656-9.2-27.675-21.873-3.638-15.281-17.148-25.954-32.856-25.954h-36.774c-11.99 0-22.474 5.855-28.761 16.063-31.897 51.792-56.352 132.452-62.303 205.489-4.959 60.859 15.017 107.938 49.706 117.148 11.552 3.066 29.676 3.09 50.4-14.221 15.53-12.973 30.051-33.749 43.157-61.751 14.66-31.319 23.29-44.075 50.027-44.075h123.924c26.737 0 35.367 12.756 50.027 44.075 13.106 28.002 27.627 48.778 43.157 61.751 14.571 12.172 27.855 15.774 38.476 15.773 4.484 0 8.495-.643 11.925-1.553 34.69-9.21 54.666-56.288 49.707-117.147zm-57.918 86.219c-11.875 3.153-33.755-10.307-56.363-58.609-13.036-27.85-29.26-62.509-79.01-62.509h-123.924c-49.75 0-65.974 34.659-79.01 62.509-22.608 48.303-44.482 61.769-56.363 58.609-15.8-4.195-29.854-36.62-26.023-83.621 5.486-67.339 28.656-144.22 57.656-191.307.418-.679.715-.845 1.513-.845h36.774c.93 0 1.511.459 1.727 1.366 6.516 27.355 30.697 46.461 58.805 46.461h133.769c28.107 0 52.288-19.105 58.803-46.461.216-.906.797-1.366 1.728-1.366h36.774c.798 0 1.095.166 1.513.845 28.999 47.086 52.17 123.967 57.656 191.308 3.828 47-10.225 79.425-26.025 83.62zm-142.147-172.492c0 8.837-7.163 16-16 16h-78.375c-8.837 0-16-7.163-16-16s7.163-16 16-16h78.375c8.836 0 16 7.163 16 16zm-142.313 0c0 8.837-7.163 16-16 16h-19.625v19.625c0 8.837-7.163 16-16 16s-16-7.163-16-16v-19.625h-19.625c-8.837 0-16-7.163-16-16s7.163-16 16-16h19.625v-19.625c0-8.837 7.163-16 16-16s16 7.163 16 16v19.625h19.625c8.837 0 16 7.163 16 16zm208.375-34.125c0-9.639 7.861-17.5 17.5-17.5s17.5 7.861 17.5 17.5-7.861 17.5-17.5 17.5-17.5-7.861-17.5-17.5zm35 68.25c0 9.639-7.861 17.5-17.5 17.5s-17.5-7.862-17.5-17.5c0-9.639 7.861-17.5 17.5-17.5s17.5 7.862 17.5 17.5zm34.125-34.125c0 9.639-7.861 17.5-17.5 17.5s-17.5-7.861-17.5-17.5 7.861-17.5 17.5-17.5c9.64 0 17.5 7.861 17.5 17.5zm-68.25 0c0 9.639-7.861 17.5-17.5 17.5s-17.5-7.861-17.5-17.5 7.861-17.5 17.5-17.5 17.5 7.861 17.5 17.5z'
                            fill-rule='evenodd'
                          />
                        </svg>
                      </div>
                      {t('Blockchain Game')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={(e: any) => {
                        e.preventDefault();
                        settoggle(false);
                        router.push(routes.aicat);
                      }}
                      href={routes.aicat}
                    >
                      <div className='img-pnl'>
                        <svg
                          version='1.1'
                          id='Capa_3'
                          xmlns='http://www.w3.org/2000/svg'
                          x='0px'
                          y='0px'
                          viewBox='0 0 512.009 512.009'
                        >
                          <g>
                            <g>
                              <g>
                                <path
                                  d='M495.617,367.387H436.84V172.604c0-9.052-7.331-16.383-16.383-16.383c-9.052,0-16.392,7.331-16.392,16.383V387
				c0,9.185-9.144,16.947-20.024,17.08c-0.095-0.002-0.186-0.014-0.281-0.014c-0.178,0-0.351,0.021-0.528,0.027h-62.816
				c-0.177-0.006-0.349-0.027-0.528-0.027s-0.351,0.021-0.528,0.027h-62.834c-0.177-0.006-0.349-0.027-0.527-0.027
				s-0.35,0.021-0.527,0.027h-62.826c-0.177-0.006-0.349-0.027-0.527-0.027s-0.35,0.021-0.527,0.027h-62.826
				c-0.177-0.006-0.349-0.027-0.527-0.027c-0.095,0-0.187,0.013-0.281,0.014c-10.889-0.133-20.024-7.895-20.024-17.08V125.045
				c0-9.265,9.301-17.093,20.305-17.093H383.76c11.005,0,20.305,7.828,20.305,17.093v3.213c0,9.052,7.339,16.383,16.392,16.383
				h75.16c9.052,0,16.392-7.331,16.392-16.383s-7.339-16.383-16.392-16.383h-60.659c-4.723-16.174-17.922-29.08-34.807-34.244
				V25.612c0-9.052-7.339-16.383-16.392-16.383c-9.052,0-16.383,7.331-16.383,16.383v49.574h-31.106V25.612
				c0-9.052-7.331-16.383-16.383-16.383c-9.052,0-16.392,7.331-16.392,16.383v49.574h-31.115V25.612
				c0-9.052-7.339-16.383-16.383-16.383s-16.383,7.331-16.383,16.383v49.574h-31.115V25.612c0-9.052-7.339-16.383-16.383-16.383
				s-16.383,7.331-16.383,16.383v49.574h-31.115V25.612c0-9.052-7.331-16.383-16.383-16.383s-16.383,7.331-16.383,16.383v52.016
				c-16.884,5.16-30.073,18.065-34.795,34.238H16.383C7.339,111.866,0,119.196,0,128.249c0,9.052,7.339,16.383,16.383,16.383h58.786
				v222.755H16.383C7.339,367.387,0,374.717,0,383.769c0,9.052,7.339,16.383,16.383,16.383H77.06
				c4.721,16.173,17.91,29.083,34.796,34.246v51.999c0,9.052,7.331,16.383,16.383,16.383c9.043,0,16.383-7.331,16.383-16.383V436.84
				h31.115v49.556c0,9.052,7.331,16.383,16.383,16.383c9.043,0,16.383-7.331,16.383-16.383V436.84h31.115v49.556
				c0,9.052,7.331,16.383,16.383,16.383s16.383-7.331,16.383-16.383V436.84h31.115v49.556c0,9.052,7.339,16.383,16.392,16.383
				c9.043,0,16.383-7.331,16.383-16.383V436.84h31.106v49.556c0,9.052,7.331,16.383,16.383,16.383
				c9.052,0,16.392-7.331,16.392-16.383v-52c16.886-5.163,30.073-18.071,34.795-34.244h60.67c9.043,0,16.392-7.331,16.392-16.383
				C512.009,374.717,504.669,367.387,495.617,367.387z'
                                />
                                <path
                                  d='M495.617,303.506h-31.771c-9.052,0-16.383,7.331-16.383,16.383c0,9.052,7.331,16.383,16.383,16.383h31.771
				c9.043,0,16.392-7.331,16.392-16.383C512.009,310.837,504.669,303.506,495.617,303.506z'
                                />
                                <path
                                  d='M495.617,239.617h-31.771c-9.052,0-16.383,7.331-16.383,16.383c0,9.052,7.331,16.383,16.383,16.383h31.771
				c9.043,0,16.392-7.331,16.392-16.383C512.009,246.948,504.669,239.617,495.617,239.617z'
                                />
                                <path
                                  d='M495.617,175.737h-31.771c-9.052,0-16.383,7.331-16.383,16.383c0,9.052,7.331,16.383,16.383,16.383h31.771
				c9.043,0,16.392-7.331,16.392-16.383C512.009,183.068,504.669,175.737,495.617,175.737z'
                                />
                                <path
                                  d='M16.383,336.272h31.78c9.043,0,16.383-7.331,16.383-16.383c0-9.052-7.331-16.383-16.383-16.383h-31.78
				C7.339,303.506,0,310.846,0,319.889C0,328.932,7.339,336.272,16.383,336.272z'
                                />
                                <path
                                  d='M16.383,272.383h31.78c9.043,0,16.383-7.322,16.383-16.374c0-9.052-7.331-16.383-16.383-16.383h-31.78
				C7.339,239.626,0,246.965,0,256.009C0,265.052,7.339,272.383,16.383,272.383z'
                                />
                                <path
                                  d='M16.383,208.503h31.78c9.043,0,16.383-7.331,16.383-16.383c0-9.052-7.331-16.383-16.383-16.383h-31.78
				C7.339,175.737,0,183.068,0,192.12C0,201.172,7.339,208.503,16.383,208.503z'
                                />
                                <path
                                  d='M203.08,170.27c-6.754,0-12.815,4.136-15.265,10.428l-54.091,138.703c-3.284,8.44,0.879,17.936,9.31,21.219
				c8.44,3.284,17.936-0.887,21.219-9.31l8.583-22.009h60.488l8.583,22.009c2.52,6.479,8.706,10.437,15.264,10.437
				c1.979,0,3.994-0.364,5.955-1.127c8.422-3.284,12.602-12.788,9.31-21.219l-54.091-138.703
				C215.886,174.406,209.834,170.27,203.08,170.27z M185.613,276.536l17.467-44.791l17.467,44.791H185.613z'
                                />
                                <path
                                  d='M348.723,203.036c9.043,0,16.392-7.331,16.392-16.383c0-9.052-7.339-16.383-16.392-16.383H302.85
				c-9.052,0-16.383,7.331-16.383,16.383c0,9.052,7.331,16.383,16.383,16.383h6.55v105.946h-6.55
				c-9.052,0-16.383,7.331-16.383,16.383c0,9.052,7.331,16.383,16.383,16.383h45.873c9.043,0,16.392-7.331,16.392-16.383
				c0-9.052-7.339-16.383-16.392-16.383h-6.541V203.036H348.723z'
                                />
                              </g>
                            </g>
                          </g>
                        </svg>
                      </div>
                      {t('AI')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={(e: any) => {
                        e.preventDefault();
                        settoggle(false);
                        router.push(routes.career);
                      }}
                      href={routes.career}
                    >
                      <div className='img-pnl'>
                        <svg viewBox='0 0 512 512'>
                          <g id='Layer_9' data-name='Layer 9'>
                            <path d='m505.64 429.32-.91-1.23c-18.76-21.72-41.81-37.63-64.1-53-9.1-6.28-25.27-16.4-36.71-24.54a221.24 221.24 0 0 0 40.69-128.25c0-122.77-99.53-222.3-222.31-222.3s-222.3 99.53-222.3 222.3 99.53 222.31 222.3 222.31a221.33 221.33 0 0 0 128.11-40.61c8.15 11.43 18.26 27.57 24.55 36.67 15.41 22.33 31.34 45.33 53.04 64.07l1.23.9a43.33 43.33 0 0 0 23 6.36 49.55 49.55 0 0 0 33.15-12.86l13.42-13.39.32-.33c14.29-15.64 17.03-39.23 6.52-56.1zm-283.34-42.71a164.33 164.33 0 1 1 116.18-48.13 163.23 163.23 0 0 1 -116.18 48.13z' />
                            <circle cx='222.3' cy='177.56' r='65.25' />
                            <path d='m329.79 296.61a40.13 40.13 0 0 0 -11.6-24.18 40.84 40.84 0 0 0 -24.36-11.74c-13.49-1.43-47-2.21-67.87-2.21s-61.94.78-75.44 2.21a40.89 40.89 0 0 0 -24.36 11.73 40.12 40.12 0 0 0 -11.59 24.18v.28c-.32 3.1-.51 5.79-.63 8.09a138.59 138.59 0 0 0 12 13.72 136.32 136.32 0 0 0 192.77 0 139.11 139.11 0 0 0 11.83-13.49c-.15-2.35-.37-5.11-.7-8.31z' />
                          </g>
                        </svg>
                      </div>
                      {t('Career')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={(e: any) => {
                        e.preventDefault();
                        settoggle(false);
                        router.push(routes.advertise);
                      }}
                      href={routes.advertise}
                    >
                      <div className='img-pnl'>
                        <svg viewBox='0 0 32 32'>
                          <g id='megaphone'>
                            <path d='m15.1914063 3.0454102c-.2246094-.2246094-.5415039-.3320313-.855957-.2817383-.3134766.046875-.5864258.2402344-.7348633.5209961l-6.2929688 11.8876953-3.4301758 3.4296875c-1.0551758 1.0561523-1.3779297 2.5556641-1.0048828 3.9003906-1.2348633 1.5683594-1.1469727 3.8452148.2983398 5.2924805.7802735.7792969 1.8046875 1.1689453 2.8291016 1.1689453.875 0 1.7402344-.3022461 2.4628906-.8710938.3510742.0976563.7094727.1640625 1.0717773.1640625.7016602-.0004883 1.3979492-.1972656 2.0209961-.5629883l2.5761719 2.5751953c.4868164.4873047 1.1269531.7304688 1.7670898.7304688s1.2807617-.2431641 1.7680664-.7304688c.9746094-.9746094.9746094-2.5605469 0-3.5351563l-2.4750977-2.4750977.6010742-.6010742 11.8876953-6.2939453c.2802734-.1484375.4736328-.4213867.5214844-.7353516.046875-.3134766-.0576172-.6313477-.2822266-.8554688zm-10.6059571 23.3349609c-.5209961-.5214844-.6860352-1.2592773-.5107422-1.925293l2.4355469 2.4355469c-.6655273.175293-1.4033203.0107422-1.9248047-.5102539zm3.5356446-.7070313-2.8291016-2.8291016c-.7792969-.7792969-.7792969-2.0483398 0-2.828125l2.8291016-2.8291016 5.6572266 5.6572266-2.8291016 2.8286133c-.7792969.7802735-2.0478516.7807618-2.828125.0004883zm8.1318359 2.4746094c.1254883.1254883.1445313.2753906.1445313.3535156s-.019043.2280273-.144043.3530273c-.1914063.1904297-.5151367.1928711-.7075195.0004883l-2.4755859-2.4746094.7075195-.7075195zm-.8759766-6.5327148-6.0263672-6.0273438 5.3842773-10.1708984 10.8139648 10.8129883zm3.6230469-17.6147461v-2c0-.5522461.4472656-1 1-1s1 .4477539 1 1v2c0 .5522461-.4472656 1-1 1s-1-.4477539-1-1zm11 6.9995117c0 .5522461-.4472656 1-1 1h-2c-.5527344 0-1-.4477539-1-1s.4472656-1 1-1h2c.5527344 0 1 .4477539 1 1zm-6.7070312-3.2929687c-.390625-.390625-.390625-1.0234375 0-1.4140625l2-2c.390625-.390625 1.0234375-.390625 1.4140625 0s.390625 1.0234375 0 1.4140625l-2 2c-.1953125.1953125-.4511719.2929687-.7070313.2929687s-.5117187-.0976562-.7070312-.2929687z' />
                          </g>
                        </svg>
                      </div>
                      {t('Advertisement')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={(e: any) => {
                        e.preventDefault();
                        settoggle(false);
                        router.push(routes.contact);
                      }}
                      href={routes.contact}
                    >
                      <div className='img-pnl'>
                        <Image src={Contact2} alt='Contact Icon' />
                        <Image src={Contact1} alt='Contact Icon' />
                      </div>
                      {t('Contact Us')}
                    </Link>
                  </li>
                </div>
              )}
            </ul>
            <SocialList />
          </div>
          {/* {location === '/' && (
            <div className='trending-side-panel'>
              <div className='spacer-20'/>
              <h4>
                trending Stories <i className='fa fa-angle-down'/>
              </h4>
              <ArticlesPost />
            </div>
          )} */}
        </div>

        {/* Connect Modal */}
        <Modal show={show} centered onHide={handleClose}>
          <Modal.Body>
            <div className='flex-div connect-heading-pnl'>
              <i className='fa fa-question-circle-o' />
              <p>{t('Connect Wallet')}</p>
              <Button className='close-btn' onClick={handleClose}>
                <i className='fa fa-close' />
              </Button>
            </div>
            <div className='full-div'>
              <Button className='grey-btn'>
                <p>{t('Plug Wallet')}</p>
                <Image src={Wallet} alt='Wallet' />
              </Button>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                }}
                href='/entriesn'
                className='grey-btn'
              >
                <p>{t('Internet Identity')}</p>
                <Image src={Infinity} alt='Infinity' />
              </Link>
            </div>
          </Modal.Body>
        </Modal>
        <ConfirmationModel
          show={loginModalShow}
          handleClose={() => setLoginModalShow(false)}
          handleConfirm={connect}
        />

        {/* Connect Modal */}
      </>
    )
  );
}
