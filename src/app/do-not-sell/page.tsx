'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Breadcrumb, Dropdown, Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Link from 'next/link';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { usePathname, useRouter } from 'next/navigation';

export default function DoNotSellMyPersonalInfo() {
  const { t, changeLocale } = useLocalization(LANG);
  const location = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (location.startsWith("/do-not-sell") && !location.endsWith('/')) {
     router.push(`/do-not-sell/`);
   }
     }, [])
  return (
    <>
      <main id='main'>
        <div className='main-inner detail-inner-Pages pri-term-pnl not-sell-pnl'>
          <div className='inner-content'>
            <div className='pri-term-inner'>
              <Row>
                <Col xl='12' lg='12'>
                  <div className='event-innr'>
                    <div className='flex-details-pnl'>
                      <div className='left-side-pnl'>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant='success'
                            className='fill'
                            id='dropdown-basic'
                          >
                            {t('All Content')}
                            <i className='fa fa-angle-down' />
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
                        <ul className='tab-blue-list'>
                          <li>
                            <Link className='active' href='#'>
                              <i className='fa fa-angle-right' />{' '}
                              {t('Do Not Sell My Personal Info')}
                            </Link>
                          </li>
                          {/* <li>
                        <Link href='#companySecrch'>
                          <i className='fa fa-angle-right'/> Search for
                          Company
                        </Link>
                      </li> */}
                        </ul>
                      </div>

                      <div className='right-detail-pnl'>
                        <div className='spacer-50' />
                        <h1>{t('Do Not Sell My Personal Info')}</h1>
                        <div className='spacer-30' />
                        <h2>
                          {t(
                            'Sale of Personal Information and Right to Opt Out:'
                          )}
                        </h2>
                        <p>
                          {t(
                            'State law requires companies to include certain disclosures including a'
                          )}{' '}
                          <i>“{t('Do Not Sell My Personal Info')}”</i>{' '}
                          {t(
                            'links on their websites. We do not knowingly sell the personal information of consumers under 16 years of age. To opt out of the sale to third parties, please sending us an email at'
                          )}{' '}
                          <Link href='mailto:support@blockza.io'>
                            <b>support@blockza.io</b>
                          </Link>{' '}
                          {t(
                            'and using the cookie manager on our Website to disable non-necessary cookies. Please note that your right to opt out does not apply to our sharing of data with service providers, with whom we work and who are required to use the data on our behalf.'
                          )}
                        </p>
                        <p>
                          {t(
                            'The following categories of personal information that are disclosed for a business purpose or “sold” and the related categories of third parties:'
                          )}
                        </p>
                        <p>
                          {t(
                            'Identifiers: Name, email, unique personal identifiers,online identifiers, IP address, or other similar identifiers to affiliates, business partners,advertising and marketing companies, data analytics providers, and social networks.'
                          )}
                        </p>
                        <p>
                          {t(
                            'Internet or other electronic network activity information: info regarding your interaction with an internet website, application, or advertisement to affiliates, business partners, advertising and marketing companies, data analytics providers, and social networks.'
                          )}
                        </p>
                        <div className='spacer-30' />
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
