'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Breadcrumb, Dropdown, Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Link from 'next/link';
import logger from '@/lib/logger';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { usePathname, useRouter } from 'next/navigation';

export default function PrivacyPolicy() {
  const { t, changeLocale } = useLocalization(LANG);
  const [hideMyContent, setHideMyContent] = useState(true);
  const [activeSection, setActiveSection] = useState('top'); // Default to the first section
  const location = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (location.startsWith("/privacy-policy") && !location.endsWith('/')) {
     router.push(`/privacy-policy/`);
   }
     }, [])
  useEffect(() => {
    let currentSection = 'top'; // Default to the first section

    const handleScroll = () => {
      const sections = [
        'top',
        'top1',
        'top2',
        'top3',
        'top4',
        'top5',
        'top6',
        'top7',
        'top8',
        'top9',
      ]; // Update with your section IDs

      // Determine the currently active section based on scroll position
      sections.forEach((section) => {
        const sectionElement = document.getElementById(section);
        if (sectionElement) {
          const sectionTop = sectionElement.getBoundingClientRect().top;
          if (sectionTop <= 10 && sectionTop >= -5) {
            logger(sectionElement, 'sectionElement');
            currentSection = section;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <main id='main'>
        <div className='main-inner detail-inner-Pages pri-term-pnl'>
          <div className='inner-content'>
            <div className='pri-term-inner'>
              <Row>
                <Col xl='12' lg='12'>
                  <div className='event-innr'>
                    <div className='flex-details-pnl'>
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
                            minHeight: '430px',
                            position: 'sticky',
                            top: '0',
                            display: hideMyContent ? 'block' : 'none',
                          }}
                        >
                          <li>
                            <Link
                              href='#top'
                              className={
                                activeSection === 'top' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' />{' '}
                              {t('Privacy Policy')}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#top1'
                              className={
                                activeSection === 'top1' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' /> Who we are
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#top2'
                              className={
                                activeSection === 'top2' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' />{' '}
                              {t('Comments')}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#top3'
                              className={
                                activeSection === 'top3' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' /> Media
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#top4'
                              className={
                                activeSection === 'top4' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' /> Cookies
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#top5'
                              className={
                                activeSection === 'top5' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' /> Embedded
                              content from other websites
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#top6'
                              className={
                                activeSection === 'top6' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' /> Who do we
                              share your data with
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#top7'
                              className={
                                activeSection === 'top7' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' /> How long do we
                              retain your data?
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#top8'
                              className={
                                activeSection === 'top8' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' /> What rights do
                              you have over your data?
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#top9'
                              className={
                                activeSection === 'top9' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' /> Where do we
                              send your data
                            </Link>
                          </li>
                        </ul>
                      </div>

                      <div className='right-detail-pnl'>
                        <div className='spacer-50 desktop-view-display' />
                        <h1 id='top'>{t('Privacy Policy')}</h1>
                        <div className='spacer-30' />
                        <div id='top1' />
                        <h2> Who we are</h2>
                        <p>
                          {' '}
                          Our website address is{' '}
                          <Link href='https://blockza.io/' target='_blank'>
                            https://blockza.io/.
                          </Link>
                        </p>
                        <div id='top2' />
                        <h2>{t('Comments')}</h2>
                        <p>
                          {' '}
                          When visitors leave comments on the site we collect
                          the data shown in the comments form, and also the
                          visitor’s IP address and browser user agent string to
                          help spam detection.
                        </p>

                        <p>
                          {' '}
                          An anonymized string created from your email address
                          (also called a hash) may be provided to the Gravatar
                          service to see if you are using it. The Gravatar
                          service privacy policy is available here:{' '}
                          <Link
                            href='https://automattic.com/privacy/'
                            target='_blank'
                          >
                            https://automattic.com/privacy/.
                          </Link>
                          After approval of your comment, your profile picture
                          is visible to the public in the context of your
                          comment.
                        </p>
                        <div id='top3' />
                        <h2> Media</h2>
                        <p>
                          {' '}
                          If you upload images to the website, you should avoid
                          uploading images with embedded location data (EXIF
                          GPS) included. Visitors to the website can download
                          and extract any location data from images on the
                          website.
                        </p>
                        <div id='top4' />
                        <h2> Cookies</h2>
                        <p>
                          {' '}
                          If you leave a comment on our site you may opt-in to
                          saving your name, email address and website in
                          cookies. These are for your convenience so that you do
                          not have to fill in your details again when you leave
                          another comment. These cookies will last for one year.
                        </p>

                        <p>
                          {' '}
                          If you visit our login page, we will set a temporary
                          cookie to determine if your browser accepts cookies.
                          This cookie contains no personal data and is discarded
                          when you close your browser.
                        </p>

                        <p>
                          {' '}
                          When you log in, we will also set up several cookies
                          to save your login information and your screen display
                          choices. Login cookies last for two days, and screen
                          options cookies last for a year. If you select
                          “Remember Me”, your login will persist for two weeks.
                          If you log out of your account, the login cookies will
                          be removed.
                        </p>

                        <p>
                          {' '}
                          If you edit or publish an article, an additional
                          cookie will be saved in your browser. This cookie
                          includes no personal data and simply indicates the
                          post ID of the article you just edited. It expires
                          after 1 day.
                        </p>
                        <div id='top5' />
                        <h2> Embedded content from other websites</h2>
                        <p>
                          {' '}
                          Articles on this site may include embedded content
                          (e.g. videos, images, articles, etc.). Embedded
                          content from other websites behaves in the exact same
                          way as if the visitor has visited the other website.
                        </p>
                        <p>
                          {' '}
                          These websites may collect data about you, use
                          cookies, embed additional third-party tracking, and
                          monitor your interaction with that embedded content,
                          including tracking your interaction with the embedded
                          content if you have an account and are logged in to
                          that website.
                        </p>
                        <div id='top6' />
                        <h2> Who do we share your data with</h2>
                        <p>
                          {' '}
                          If you request a password reset, your IP address will
                          be included in the reset email.
                        </p>
                        <div id='top7' />
                        <h2> How long do we retain your data?</h2>
                        <p>
                          If you leave a comment, the comment and its metadata
                          are retained indefinitely. This is so we can recognize
                          and approve any follow-up comments automatically
                          instead of holding them in a moderation queue.
                        </p>
                        <p>
                          For users that register on our website (if any), we
                          also store the personal information they provide in
                          their user profiles. All users can see, edit, or
                          delete their personal information at any time (except
                          they cannot change their username). Website
                          administrators can also see and edit that information.
                        </p>
                        <div id='top8' />
                        <h2>What rights do you have over your data?</h2>
                        <p>
                          If you have an account on this site or have left
                          comments, you can request to receive an exported file
                          of the personal data we hold about you, including any
                          data you have provided to us. You can also request
                          that we erase any personal data we hold about you.
                          This does not include any data we are obliged to keep
                          for administrative, legal, or security purposes.
                        </p>
                        <div id='top9' />
                        <h2>Where do we send your data</h2>
                        <p>
                          Visitor comments may be checked through an automated
                          spam detection service.
                        </p>

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
