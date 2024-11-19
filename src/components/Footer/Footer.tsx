'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import mobile1 from '@/assets/Img/mobile-1.png';
import mobile2 from '@/assets/Img/mobile-2.png';
import mobile3 from '@/assets/Img/mobile-3.png';
import mobile4 from '@/assets/Img/ai-chatbot.png';
import mobile5 from '@/assets/Img/mobile-5.png';
import Footerlogo from '@/assets/Img/Logo/footerlogo-new.png';
import Link from 'next/link';
import Image from 'next/image';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { usePathname, useRouter } from 'next/navigation';
import TwitterSVGIcon from '@/components/twitterIconSVG/TwitterSVGIcon';
import logger from '@/lib/logger';
import {
  CAMPAIGNS,
  CAREERS,
  CATEGORY_PATH,
  CONTACT_US,
  DISCLAIMER,
  DONTNOTSELL,
  EDITOR_POLICY,
  ETHICS_POLICY,
  EVENTS,
  HINZAASIF,
  PATHS,
  PRESSRELEASE,
  PRIVACY_POLICY,
  QUIZ,
  QUIZ_ROUTE,
  TERMSOFUSE,
  Web3_Category_Link,
  nft_Category_Link,
  blockchaingame_Category_Link,
} from '@/constant/routes';
import ScrollToTopbtn from '@/components/ScrollToTopBtn/ScrollToTopbtn';

export default function Footer() {
  const { t, changeLocale } = useLocalization(LANG);
  const path = usePathname();

  const route = path.split('/')[1];
  const [isDetailPage, setIsDetailPage] = useState(true);
  const [btnShow, setBtnShow] = useState(true);

  useEffect(() => {
    let isExcit = PATHS.some((p) => path.startsWith(p));
    if (isExcit) {
      setIsDetailPage(true);
      setBtnShow(true);
    } else {
      setIsDetailPage(false);
      setBtnShow(false);
    }
  }, [path]);
  let routes: {
    ethicspolicy: string;
    editorpolicy: string;
    privacypolicy: string;
    termOfUse: string;
    doNOtSell: string;
    career: string;
    contactUs: string;
    hinzaAsif: string;
    pressRelease: string;
    event: string;
    disclaimer: string;
    quiz: string;
    web3url:string;
    nfturl:string;
    blockchaingameurl:string;
  } = {
    ethicspolicy: ETHICS_POLICY,
    editorpolicy: EDITOR_POLICY,
    pressRelease: PRESSRELEASE,
    event: EVENTS,
    privacypolicy: PRIVACY_POLICY,
    termOfUse: TERMSOFUSE,
    doNOtSell: DONTNOTSELL,
    career: CAREERS,
    contactUs: CONTACT_US,
    hinzaAsif: HINZAASIF,
    disclaimer: DISCLAIMER,
    quiz: QUIZ,
    web3url:Web3_Category_Link,
    nfturl:nft_Category_Link,
    blockchaingameurl:blockchaingame_Category_Link,
  };
  let router=useRouter()
let openLinkfn=(l:string)=>{
  router.push(l)
}
  return (
    <>
      {route !== 'super-admin' && (
        <>
          <div className='footer scroll-anime full-div'>
            <div className='footer-inner'>
              <Row>
                <Col xl='3' lg='12' md='12'>
                  <div className='mobile-scl-cntnr'>
                    <div>
                      <Link href='/' className='footer-logo'>
                        <Image src={Footerlogo} alt='Blockza' />
                      </Link>
                      <div className='blue-text'>
                        {t(
                          'Your go-to for Web3, Blockchain, Crypto, & Metaverse AI news and insights. Stay informed and ahead with us!'
                        )}
                      </div>
                    </div>
                    {/* {LANG == 'en' && ( */}
                    <ul className='footer-social-list align-items-center mobile-view-display-flex'>
                      {/* <li>
                          <h4>{t('Follow Us')}</h4>
                        </li> */}
                      <li>
                        <Link
                          target='_blank'
                          href='https://www.facebook.com/nftstudio24.eth'
                        >
                          <i className='fa fa-facebook' />
                        </Link>
                      </li>
                      <li>
                        <Link
                          target='_blank'
                          href='https://x.com/blockza_io/'
                        >
                          {/* <i className='fa-brands fa-x-twitter'/> */}
                          <TwitterSVGIcon color='white' />
                        </Link>
                      </li>
                      <li>
                        <Link
                          target='_blank'
                          href='https://www.instagram.com/nftstudio24/'
                        >
                          <i className='fa fa-instagram' />
                        </Link>
                      </li>
                      <li>
                        <Link
                          target='_blank'
                          href='https://www.youtube.com/@blockza-io'
                        >
                          <i className='fa fa-youtube-play' />
                        </Link>
                      </li>
                      <li>
                        <Link
                          target='_blank'
                          href='https://www.linkedin.com/company/blockza-io/'
                        >
                          <i className='fa fa-linkedin' />
                        </Link>
                      </li>
                      <li>
                        <Link
                          target='_blank'
                          href='https://t.me/blockza_io/'
                        >
                          <i className='fa fa-telegram' />
                        </Link>
                      </li>
                    </ul>
                    {/* )} */}
                  </div>
                </Col>
                <Col xl='9' lg='12' md='12'>
                  <Row>
                    <Col xl={'3'} lg={'3'} md={'3'} sm={'3'} xs={'6'}>
                      <div className='heading6'>{t('About Us')}</div>
                      <ul>
                        <li>
                          <Link href='https://blockza.io/about/'>
                            {t('About BlockZa')}
                          </Link>
                        </li>
                        <li>
                          {/* <Link href='/hinza-asif'> */}
                          <Link href={routes.hinzaAsif}>
                            {t('About Hinza Asif')}
                          </Link>
                        </li>
                        <li>
                          {/* <Link href='/careers'> */}
                          <Link href={routes.career}>{t('Career')}</Link>
                        </li>
                        <li>
                          {/* <Link href='/contact-us'> */}
                          <Link href={routes.contactUs}>{t('Contact Us')}</Link>
                        </li>
                      </ul>
                    </Col>
                    <Col xl={'3'} lg={'3'} md={'3'} sm={'3'} xs={'6'}>
                      <div className='heading6'>{t('Our Services')}</div>
                      <ul>
                        <li>
                          <Link href='https://blockza.io/about/advertise-with-us/'>
                            {t('Advertise with Us')}
                          </Link>
                        </li>
                        {/* <li>
                          <Link href='https://blockza.io/hackathon/'>
                            {t('Hackathon')}
                          </Link>
                        </li> */}
                      </ul>
                    </Col>
                    <Col xl={'3'} lg={'3'} md={'3'} sm={'3'} xs={'6'}>
                      <div className='heading6'>{t('Top Categories')}</div>
                      <ul>
                        <li>
                          <Link href="/latest-news/">
                            {t('News')}
                          </Link>
                        </li>
                        <li>
                          <Link href={routes.pressRelease}>
                            {t('Press Release')}
                          </Link>
                        </li>
                        <li>
                          <Link href={routes.nfturl}>
                            {t('NFT Collection Review')}
                          </Link>
                        </li>
                        <li>
                          <Link href={routes.blockchaingameurl}>
                            {t('Blockchain Game Review')}
                          </Link>
                        </li>
                        <li>
                          <Link href={routes.web3url}>
                            {t('WEB3 Guide')}
                          </Link>
                        </li>
                        <li>
                          <Link href={routes.event}>{t('Events')}</Link>
                        </li>
                      </ul>
                    </Col>

                    <Col xl='3' lg='3' md='3' sm='3' xs='6'>
                      <div className='heading6'>{t('Our Policy')}</div>
                      <ul>
                        <li>
                          {/* <Link href='/privacy-policy'> */}
                          <Link href={routes.privacypolicy}>
                            {t('Privacy Policy')}
                          </Link>
                        </li>
                        <li>
                          {/* <Link href='/terms-of-use'> */}
                          <Link href={routes.termOfUse}>
                            {t('Terms of Use')}
                          </Link>
                        </li>
                        <li>
                          {/* <Link href='/ethics-policy'> */}
                          <Link
                            href={
                              LANG == 'jp'
                                ? routes.editorpolicy
                                : routes.ethicspolicy
                            }
                          >
                            {LANG == 'jp'
                              ? t('Editor Policy')
                              : t('Ethics Policy')}
                          </Link>
                        </li>
                        <li>
                          {/* <Link href='/do-not-sell'> */}
                          <Link href={routes.doNOtSell}>
                            {t('Do Not Sell My Personal Info')}
                          </Link>
                        </li>
                        <li>
                          {/* <Link href='/disclaimer'> */}
                          <Link href={routes.disclaimer}>
                            {t('Disclaimer')}
                          </Link>
                        </li>
                        <li>
                          {/* <Link href='/contact-us'> */}
                          <Link href={routes.contactUs}>{t('Contact Us')}</Link>
                        </li>
                      </ul>
                    </Col>
                  </Row>
                </Col>
                <Col xl='12' lg='12' md='12'>
                  <div className='spacer-20' />
                  <div className='flex-div-sm'>
                    <p>{t('© 2024 BlockZa.io . All Rights Reserved.')}</p>
                    {/* {LANG == 'en' && ( */}
                    <div>
                      <ul className='footer-social-list align-items-center web-view-display'>
                        {/* <li>
                            <h4>{t('Follow Us')}</h4>
                          </li> */}
                        <li>
                          <Link
                            target='_blank'
                            href='https://www.facebook.com/nftstudio24.eth'
                          >
                            <i className='fa fa-facebook' />
                          </Link>
                        </li>
                        <li>
                          <Link
                            target='_blank'
                            href={
                              LANG == 'jp'
                                ? 'https://x.com/blockza_jp/'
                                : 'https://x.com/blockza_io/'
                            }
                          >
                            {/* <i className='fa-brands fa-x-twitter'/> */}
                            <TwitterSVGIcon color='white' />
                          </Link>
                        </li>
                        <li>
                          <Link
                            target='_blank'
                            href='https://www.instagram.com/nftstudio24/'
                          >
                            <i className='fa fa-instagram' />
                          </Link>
                        </li>
                        <li>
                        <Link
                            href={
                              LANG == 'jp'
                                ? 'https://www.youtube.com/@BlockZa-Japan'
                                : 'https://www.youtube.com/@blockza-io'
                            }
                            target='_blank'
                          >
                            <i className='fa fa-youtube-play' />
                          </Link>
                        </li>
                        <li>
                          <Link
                            target='_blank'
                            href='https://www.linkedin.com/company/blockza-io/'
                          >
                            <i className='fa fa-linkedin' />
                          </Link>
                        </li>
                        <li>
                          <Link
                            target='_blank'
                            href='https://t.me/blockza_io/'
                          >
                            <i className='fa fa-telegram' />
                          </Link>
                        </li>
                      </ul>
                    </div>
                    {/* )} */}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xl='12' lg='12' md='12'>
                  <div className='footer-bottom'>
                    <p className='m-0'>
                      {t('Please note that our')}{' '}
                      {/* <Link href='/privacy-policy'> */}
                      <Link href={routes.privacypolicy}>
                        {t('Privacy Policy')}
                      </Link>
                      , {/* <Link href='/terms-of-use'> */}
                      <Link href={routes.termOfUse}>
                        {t('Terms of Use')}
                      </Link>{' '}
                      {/* {LANG === 'en' && ( */}
                      <>
                        {t(', cookies, and')}{' '}
                        <Link href={routes.doNOtSell}>
                          {t('do not sell my personal information')}
                        </Link>{' '}
                        {t('has been updated')}
                      </>
                      {/* )} */}
                    </p>

                    <div className='spacer-20' />
                    <p>
                      {t(
                        'The leader in news and information on cryptocurrency, digital assets and the future of money, BlockZa is a decentralized media outlet that strives for the highest journalistic standards and abides by a'
                      )}{' '}
                      {/* <Link href='/ethics-policy'> */}
                      {LANG == 'en' && (
                        <>
                          {' '}
                          <Link href={routes.ethicspolicy}>
                            {t('strict set of editorial policies')}
                          </Link>{' '}
                          BlockZa is an independent operating subsidiary of Diki
                          Co ltd Japan, which invests in cryptocurrencies and
                          blockchain startups. As part of their compensation,
                          certain BlockZa employees, including editorial
                          employees, may receive exposure to Daiki Co Ltd equity
                          in the form of stock appreciation rights, which vest
                          over a multi-year period. BlockZa journalists are not
                          allowed to purchase stock outright in Daiki Co Ltd'
                        </>
                      )}
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
            {btnShow && (
              <Button
                className='filter-btn footerbtn'
                onClick={() => setIsDetailPage((pre) => !pre)}
              >
                <Image
                  src='/images/bars-solid.png'
                  alt='Mobile'
                  height={30}
                  width={40}
                  className='mybtn'
                />
              </Button>
            )}
            <div className={`footer-scroller ${isDetailPage ? 'trans' : ''}`}>
              <ul>
              <li onClick={()=>openLinkfn("/")}>
                  <Image src={mobile1} alt='Mobile' />
                  <p>{t('Home')} </p>
                </li>
                <li onClick={()=>openLinkfn(CAMPAIGNS)}>
                  <Image src={mobile2} alt='Mobile' />
                  <p>{t('Campaigns')}</p>
                </li>
                <li>
                  {' '}
                  <div className='img-pnl'>
                    <Image src={mobile3} alt='Mobile' />
                  </div>
                </li>
                <li>
            <Link href="/ai-assistant/">
              <Image src={mobile4} alt="Mobile" />
              <p>{t('ChatBot')}</p>
            </Link>
          </li>
            
                <li onClick={()=>openLinkfn(CONTACT_US)}>
                  <Image src={mobile5} alt='Mobile' />
                  <p>{t('join us')}</p>
                </li>
              </ul>
            </div>
          </div>
          <ScrollToTopbtn />
        </>
      )}
    </>
  );
}