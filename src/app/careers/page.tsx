'use client';
import React, { useEffect, useRef, useState } from 'react';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import {
  Row,
  Col,
  Breadcrumb,
  Dropdown,
  Spinner,
  Form,
  Button,
} from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Link from 'next/link';
import map from '@/assets/Img/Icons/icon-map.png';
import iconmail from '@/assets/Img/Icons/icon-attach.png';
import iconcall from '@/assets/Img/Icons/icon-call.png';
import { siteConfig } from '@/constant/config';
import { CAREERS } from '@/constant/routes';
import { usePathname, useRouter } from 'next/navigation';

export default function Careers() {
  const { t, changeLocale } = useLocalization(LANG);
  const [hideMyContent, setHideMyContent] = useState(true);
  const [activeSection, setActiveSection] = useState('career-pnl'); // Default to the first section
  const location = usePathname();
  const router = useRouter();
  useEffect(() => {
    let currentSection = 'career-pnl'; // Default to the first section

    const handleScroll = () => {
      const sections = ['career-pnl', 'join', 'contact']; // Update with your section IDs

      // Determine the currently active section based on scroll position
      sections.forEach((section) => {
        const sectionElement = document.getElementById(section);
        if (sectionElement) {
          const sectionTop = sectionElement.getBoundingClientRect().top;
          if (sectionTop <= 10 && sectionTop >= -5) {
            currentSection = section;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    if (location.startsWith("/careers") && !location.endsWith('/')) {
     router.push(`/careers/`);
   }
     }, [])
  return (
    <>
    <link  rel="canonical" href={`${siteConfig.url+CAREERS}`}/>
      <main id='main'>
        <div className='main-inner detail-inner-Pages pri-term-pnl'>
          <div className='inner-content'>
            <div className='pri-term-inner'>
              <Row>
                <Col xl='12' lg='12'>
                  <div className='event-innr'>
                    <div
                      className='flex-details-pnl'
                      style={{ minHeight: '1166px' }}
                    >
                      <div className='left-side-pnl'>
                        <Dropdown
                          onClick={() => setHideMyContent((pre: any) => !pre)}
                        >
                          <Dropdown.Toggle
                            variant='success'
                            className='fill'
                            id='dropdown-basic'
                          >
                            {t('All Content')}{' '}
                            {hideMyContent ? (
                              <i className='fa fa-angle-down' />
                            ) : (
                              <i className='fa fa-angle-right' />
                            )}
                          </Dropdown.Toggle>
                          {/* 
                      <Dropdown.Menu>
                        <Dropdown.Item href='#/action-1'>
                          Trending
                        </Dropdown.Item>
                        <Dropdown.Item href='#/action-2'>
                          Trending
                        </Dropdown.Item>
                      </Dropdown.Menu> */}
                        </Dropdown>
                        <div className='spacer-20' />
                        <ul
                          className='tab-blue-list'
                          style={{
                            height: '130px',
                            position: 'sticky',
                            top: '0',
                            display: hideMyContent ? 'block' : 'none',
                          }}
                        >
                          <li>
                            <Link
                              href='#career-pnl'
                              className={
                                activeSection === 'career-pnl' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' />{' '}
                              {t('Careers With Us')}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#join'
                              className={
                                activeSection === 'join' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' />{' '}
                              {t('Join Our Team')}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#contact'
                              className={
                                activeSection === 'contact' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' />{' '}
                              {t('Contact Us')}
                            </Link>
                          </li>
                        </ul>
                      </div>

                      <div className='right-detail-pnl'>
                        <div className='spacer-20' />
                        <div id='career-pnl' className='banner-text-pnl'>
                          <div className='bg-layer career' />
                          <h3 className='m-0'>{t('Careers With Us')}</h3>
                          <p>{t('Come And Join Our Family!')}</p>
                        </div>
                        <h4 id='join' className='yel-head m-0'>
                          {t('Join Our Team')}
                        </h4>
                        <p>
                          {/* Are You Seeking Limitless Opportunities, Dynamic,
                          <br/>
                          Vibrant And Flexible Work Environment? */}
                          {t(
                            'Are You Seeking Limitless Opportunities, Dynamic, Vibrant And Flexible Work Environment'
                          )}
                        </p>
                        <ul className='contact-info-list'>
                          <li>
                            <Link
                              target='_blank'
                              href='https://www.google.com/maps/place/344-0063,+Japan/@35.9718336,139.7635914,16z/data=!3m1!4b1!4m6!3m5!1s0x6018beaea9619b53:0x169cec0083bd0749!8m2!3d35.9741584!4d139.7703197!16s%2Fg%2F1vhkkkj_?entry=ttu'
                            >
                              <div className='img-pnl'>
                                <Image src={map} alt='Map' />
                              </div>
                              <div className='txt-pnl'>
                                <h5>{t('We are On The Map​​​​')}​​​​</h5>
                                <p>
                                {siteConfig.address}
                                </p>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link href={`callto:${siteConfig.phnumber}`}>
                              <div className='img-pnl'>
                                <Image src={iconcall} alt='call' />
                              </div>
                              <div className='txt-pnl'>
                                <h5>{t('Give Us A Call')}​​</h5>
                                <p>{siteConfig.phnumber}</p>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link href='mailto:support@blockza.io'>
                              <div className='img-pnl'>
                                <Image src={iconmail} alt='Mail' />
                              </div>
                              <div className='txt-pnl'>
                                <h5>{t('Send Us A Message​')}​</h5>
                                <p>support@blockza.io</p>
                              </div>
                            </Link>
                          </li>
                        </ul>
                        <div className='spacer-20' />
                        <h2 id='contact'>{t('Contact Us')}</h2>
                        <p className='red-text m-0'>
                          {t('Fields marked with an * are required')}
                        </p>
                        <div className='spacer-10' />
                        <Form>
                          <Form.Group
                            className='mb-3'
                            controlId='exampleForm.ControlInput1'
                          >
                            <Form.Control
                              type='text'
                              placeholder={t('Name*')}
                            />
                          </Form.Group>
                          <Form.Group
                            className='mb-3'
                            controlId='exampleForm.ControlInput1'
                          >
                            <Form.Control
                              type='email'
                              placeholder={t('Email*')}
                            />
                          </Form.Group>
                          <Form.Group
                            className='mb-4'
                            controlId='exampleForm.ControlTextarea1'
                          >
                            <Form.Control
                              as='textarea'
                              placeholder={t('Message*')}
                              rows={1}
                            />
                          </Form.Group>

                          <Form.Group controlId='exampleForm.ControlTextarea1'>
                            <Button type='submit' className='submit-btn'>
                              {t('sbmit')}
                            </Button>
                          </Form.Group>
                        </Form>
                        <div className='spacer-50' />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
