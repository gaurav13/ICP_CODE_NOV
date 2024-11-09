'use client';
import React, { useEffect, useRef, useState } from 'react';
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
import meeting1 from '@/assets/Img/Profile/hinza-1.jpg';
import meeting2 from '@/assets/Img/Profile/hinza-2.jpg';
import meeting3 from '@/assets/Img/Profile/hinza-3.jpg';
import meeting4 from '@/assets/Img/Profile/hinza-4.jpg';
import meeting5 from '@/assets/Img/Profile/hinza-5.jpg';
import meeting6 from '@/assets/Img/Profile/hinza-6.jpg';
import meeting7 from '@/assets/Img/Profile/hinza-7.jpg';
import meeting8 from '@/assets/Img/Profile/hinza-8.jpg';
import meeting9 from '@/assets/Img/Profile/hinza-9.jpg';
import Logo from '@/assets/Img/Logo/Logo.png';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import client1 from '@/assets/Img/Logo/client-logo-1.jpg';
import client2 from '@/assets/Img/Logo/client-logo-2.jpg';
import client3 from '@/assets/Img/Logo/client-logo-3.jpg';
import client4 from '@/assets/Img/Logo/client-logo-4.jpg';
import iconsocialmedia1 from '@/assets/Img/Icons/icon-linkedin-b.png';
import iconsocialmedia2 from '@/assets/Img/Icons/icon-twitter-b.png';
import iconsocialmedia3 from '@/assets/Img/Icons/icon-facebook-b.png';
import iconsocialmedia4 from '@/assets/Img/Icons/icon-youtube-b.png';
import iconsocialmedia5 from '@/assets/Img/Icons/icon-telegram-b.png';
import Hinzatext from '@/assets/Img/Icons/hinza.png';
import Hinza from '@/assets/Img/hinza.jpg';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function HinzaAsif() {
  const { t, changeLocale } = useLocalization(LANG);
  const [hideMyContent, setHideMyContent] = useState(true);
  const [activeSection, setActiveSection] = useState('im-hinza'); // Default to the first section
  const location = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (location.startsWith("/events") && !location.endsWith('/')) {
     router.push(`/events/`);
   }
     }, [])
  useEffect(() => {
    let currentSection = 'im-hinza'; // Default to the first section

    const handleScroll = () => {
      const sections = [
        'im-hinza',
        'Get-to-Know-Me',
        'Experienced-Media-Business-Growth-Partnership',
        'Meet-The-Realet-Family',
        'People-Often-Ask-Me-Common-Questions',
        'Pleasure-of-Meeting-Some-Web3-individuals',
      ]; // Update with your section IDs

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
  return (
    <>
      <main id='main'>
        <div className='main-inner detail-inner-Pages hinza-detail'>
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
                            minHeight: '240px',
                            position: 'sticky',
                            top: '0',
                            display: hideMyContent ? 'block' : 'none',
                          }}
                        >
                          <li>
                            <Link
                              href='#im-hinza'
                              className={
                                activeSection === 'im-hinza' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' />{' '}
                              {t('I’m Hinza Asif')}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#Get-to-Know-Me'
                              className={
                                activeSection === 'Get-to-Know-Me'
                                  ? 'active'
                                  : ''
                              }
                            >
                              <i className='fa fa-angle-right' />{' '}
                              {t('Get To Know Me')}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#Experienced-Media-Business-Growth-Partnership'
                              className={
                                activeSection ===
                                'Experienced-Media-Business-Growth-Partnership'
                                  ? 'active'
                                  : ''
                              }
                            >
                              <i className='fa fa-angle-right' />
                              {t(
                                'Experienced Media Business Growth & Partnership.'
                              )}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#Meet-The-Realet-Family'
                              className={
                                activeSection === 'Meet-The-Realet-Family'
                                  ? 'active'
                                  : ''
                              }
                            >
                              <i className='fa fa-angle-right' />{' '}
                              {t('Meet The Realet Family')}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#People-Often-Ask-Me-Common-Questions'
                              className={
                                activeSection ===
                                'People-Often-Ask-Me-Common-Questions'
                                  ? 'active'
                                  : ''
                              }
                            >
                              <i className='fa fa-angle-right' />{' '}
                              {t('People Often Ask Me Common Questions')}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#Pleasure-of-Meeting-Some-Web3-individuals'
                              className={
                                activeSection ===
                                'Pleasure-of-Meeting-Some-Web3-individuals'
                                  ? 'active'
                                  : ''
                              }
                            >
                              <i className='fa fa-angle-right' />
                              {t('Pleasure of Meeting Some Web3 individuals')}
                            </Link>
                          </li>
                        </ul>
                      </div>

                      <div className='right-detail-pnl'>
                        <div id='im-hinza'>
                          <div className='spacer-20' />
                          <div className='intro-pnl'>
                            <h1>
                              {t('I’m Hinza Asif')}
                              <br />
                              アセフ　ㇶンザ
                            </h1>
                            <div className='spacer-30' />
                            <div className='img-pnl'>
                              <Image src={Hinza} alt='Hinza' />
                            </div>
                            <div className='spacer-40' />
                          </div>
                          <div className='full-width'>
                            <ul className='hinza-social-list'>
                              <li>
                                <Link
                                  href='https://www.linkedin.com/in/hinza-asif/'
                                  target='_blank'
                                >
                                  <Image
                                    src={iconsocialmedia1}
                                    alt='Social Media Icon'
                                  />{' '}
                                  LinkedIn
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href='https://twitter.com/the_hinza'
                                  target='_blank'
                                >
                                  <Image
                                    src={iconsocialmedia2}
                                    alt='Social Media Icon'
                                  />{' '}
                                  Twitter
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href='https://www.facebook.com/nftstudio24.eth'
                                  target='_blank'
                                >
                                  <Image
                                    src={iconsocialmedia3}
                                    alt='Social Media Icon'
                                  />{' '}
                                  Facebook
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
                                  <Image
                                    src={iconsocialmedia4}
                                    alt='Social Media Icon'
                                  />{' '}
                                  Youtube
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href='https://t.me/hinza-asif'
                                  target='_blank'
                                >
                                  <Image
                                    src={iconsocialmedia5}
                                    alt='Social Media Icon'
                                  />{' '}
                                  Telegram
                                </Link>
                              </li>
                            </ul>
                          </div>
                          <div className='ww-width'>
                            <p className='m-0'>
                              {t(
                                'Success Only Speaks One Language, And That Language Is Your Strong Passion And Dedication Towards Your Goals.'
                              )}
                            </p>
                          </div>
                        </div>
                        <div id='Get-to-Know-Me'>
                          <div className='spacer-20' />
                          <h4 className='mb-4'>{t('Get To Know Me')}</h4>
                          <p>
                            {t(
                              'I am Hinza Asif, the Founder of NFTStudio24, a mother of three wonderful children, and I reside in Japan. My philosophy on life is straightforward: it’s not enough to simply dream; you must also be dedicated to yourself and your dreams. It’s okay if you currently lack something, but not taking action for your future is where the problem lies.'
                            )}
                          </p>
                        </div>

                        <div
                          id='Experienced-Media-Business-Growth-Partnership'
                          className='ww-width'
                        >
                          <hr />
                          <div className='spacer-20' />
                          <p className='mb-4'>
                            {t(
                              'Do not Feel Shy About Who You Are. Have Confidence And Be Open To Learning New Things.'
                            )}
                          </p>
                          <h4>
                            {t(
                              'Experienced Media Business Growth & Partnership.'
                            )}
                          </h4>
                          <div className='spacer-30' />
                          <Row>
                            <Col xl='4' lg='12' md='4'>
                              <h5>{t('Personal Life')}</h5>
                              <div className='spacer-10' />
                              <p>
                                {t(
                                  'I am a simple person who always wants to help others, regardless of what people may think of me. I am committed to my job and passionate about it. As an Asian woman, I have many responsibilities towards society, but these responsibilities never hinder me from pursuing my passions and dreams.'
                                )}
                              </p>
                            </Col>
                            <Col xl='4' lg='12' md='4'>
                              <h5>{t('Work Experience')}</h5>
                              <div className='spacer-10' />
                              <p>
                                {t(
                                  'I have 8 years of experience in the media industry, specializing in social media marketing and building alliances between businesses and governments. Additionally, I have 5 years of experience in the field of IT and blockchain technology.'
                                )}
                              </p>
                            </Col>
                            <Col xl='4' lg='12' md='4'>
                              <h5>{t('Education')}</h5>
                              <div className='spacer-10' />
                              <ul className='dot-list small m-0'>
                                <li>{t('Bachelor of Commerce')}</li>
                                <li>{t('Certified Business')}</li>
                                <li>
                                  {t(
                                    'Diploma in Journalism from London SCHOOL OF JOURNALISM'
                                  )}
                                </li>
                                <li>{t('Accountant and Tax')}</li>
                                <li>{t('Web Design')}</li>
                                <li>
                                  {t(
                                    'Blockchain Certificate in Business concept'
                                  )}
                                </li>
                                <li>
                                  {t(
                                    'JLPT Japanese-Language Proficiency – N5 (Still learning)'
                                  )}
                                </li>
                              </ul>
                            </Col>
                          </Row>
                        </div>
                        <div className='spacer-20' />
                        <div id='Meet-The-Realet-Family'>
                          <div className='spacer-30' />
                          <h4>{t('Meet The Realet Family')}</h4>
                          <p className='m-0'>
                            {t(
                              'It is important to have friends who support your passion and work.'
                            )}
                          </p>
                          <p>
                            {t(
                              'I am proud to be a member of the following esteemed organizations.'
                            )}
                          </p>
                          <div className='spacer-20' />
                          <Row>
                            <ul className='cleint-ass-list'>
                              <li>
                                <div className='client-ass-pnl'>
                                  <Image src={client1} alt='Client' />
                                  <div className='txt-pnl'>
                                    <p className='m-0'>
                                      <b>{t('Founder')}</b>
                                    </p>
                                    <p className='m-0'>Daiki Co Ltd</p>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className='client-ass-pnl'>
                                  <Image src={Logo} alt='Client' />
                                  <div className='txt-pnl'>
                                    <p className='m-0'>
                                      <b>{t('Co-Founder')}</b>
                                    </p>
                                    <p className='m-0'>NFTStudio24</p>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className='client-ass-pnl'>
                                  <Image src={client2} alt='Client' />
                                  <div className='txt-pnl'>
                                    <p className='m-0'>
                                      <b>{t('Alumni')}</b>
                                    </p>
                                    <p className='m-0'>
                                      London School Of Journalism
                                    </p>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className='client-ass-pnl'>
                                  <Image src={client3} alt='Client' />
                                  <div className='txt-pnl'>
                                    <p className='m-0'>
                                      <b>{t('Supporting Member')}</b>
                                    </p>
                                    <p className='m-0'>
                                      {t('Foreign Press Center Japan')}
                                    </p>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className='client-ass-pnl'>
                                  <Image src={client4} alt='Client' />
                                  <div className='txt-pnl'>
                                    <p className='m-0'>
                                      <b>{t('Associate Member')}</b>
                                    </p>
                                    <p className='m-0'>
                                      {t('The Foreign Correspondents')}
                                    </p>
                                    <p className='m-0'>Club Of Japan | FCCJ</p>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </Row>
                        </div>
                        <div id='People-Often-Ask-Me-Common-Questions'>
                          <div className='spacer-20' />
                          <h4>{t('People Often Ask Me Common Questions')}</h4>
                          <p>
                            {t(
                              'I am Here To Help You With Any Questions You May Have.'
                            )}
                          </p>
                          <div className='spacer-10' />
                          <ul className='question-list'>
                            <li>
                              <div className='question-pnl'>
                                <span>Q.</span>{' '}
                                {t('What Made You Choose To Live In Japan?')}
                              </div>
                              <div className='answer-pnl'>
                                <span>A.</span>
                                {t(
                                  'A.Living in Japan is my destiny. While I had a successful career in my own country, everything changed when I met my husband. It was then that I made the decision to relocate to Japan.'
                                )}
                              </div>
                            </li>
                            <li>
                              <div className='question-pnl'>
                                <span>Q.</span>{' '}
                                {t(
                                  'What Inspired You To Start This Media Platform?'
                                )}
                              </div>
                              <div className='answer-pnl'>
                                <span>A.</span>{' '}
                                {t(
                                  'With my extensive experience in the media industry and a passion for connecting with people, I decided to venture into the realm of Web3 and blockchain. Moreover, Japan offers ample opportunities to bridge the gap between cultures and connect with the world, which is why I am here to make a meaningful contribution in that space.'
                                )}
                              </div>
                            </li>
                            <li>
                              <div className='question-pnl'>
                                <span>Q.</span>{' '}
                                {t(
                                  'What Inspired You To Get Involved In Web3 And Blockchain?'
                                )}
                              </div>
                              <div className='answer-pnl'>
                                <span>A.</span>
                                {t(
                                  'With my 8 years of experience in the media industry, I have witnessed firsthand the arrival of various revolutions. Each new experience has motivated me to contribute my efforts to the world of Web3 and blockchain. Currently, there are many misconceptions surrounding these technologies, and it is our responsibility at NFTStudio24 to provide authentic and trustworthy news and market analysis to a global audience. We strive to educate and inform, ensuring accurate understanding and fostering confidence in the world of Web3 and blockchain.'
                                )}
                              </div>
                            </li>
                            <li>
                              <div className='question-pnl'>
                                <span>Q.</span>
                                {t(
                                  'Can You Share Your Vision For The Future Of Web3 And Blockchain.'
                                )}
                              </div>
                              <div className='answer-pnl'>
                                <span>A.</span>
                                {t(
                                  'Your vision for the future of Web3 and Blockchain should encompass creating a more inclusive and accessible ecosystem. It should involve empowering individuals from all backgrounds, irrespective of their technical expertise, to participate and benefit from the advancements in Web3 and blockchain technologies. Emphasize the importance of education, awareness, and simplifying complex concepts to bridge the knowledge gap. Your vision should also focus on fostering innovation, collaboration, and responsible adoption of these technologies, promoting transparency, security, and trust within the ecosystem. Ultimately, strive to create a future where Web3 and blockchain technologies empower individuals, revolutionize industries, and positively impact society as a whole.'
                                )}
                                .
                              </div>
                            </li>
                            <li>
                              <div className='question-pnl'>
                                <span>Q.</span>{' '}
                                {t('What Sets Me Apart From Others?')}
                              </div>
                              <div className='answer-pnl'>
                                <span>A.</span>{' '}
                                {t(
                                  'what sets you apart from others is your commitment to supporting and educating newcomers and the middle class in the Web3 and blockchain space. While many may focus solely on specific target audiences, your emphasis on inclusivity and providing authentic knowledge and guidance distinguishes you. By creating a better community and addressing the knowledge gap, you are uniquely positioned to empower individuals and help them navigate the world of Web3 and blockchain more effectively.'
                                )}
                              </div>
                            </li>
                            <li>
                              <div className='question-pnl'>
                                <span>Q.</span>
                                {t(
                                  'Why Did You Choose To Live In Kasukabe Instead Of Tokyo?'
                                )}
                              </div>
                              <div className='answer-pnl'>
                                <span>A.</span>{' '}
                                {t(
                                  'I am a person who values tranquility and being close to nature. While Tokyo is great for business, when it comes to finding peace of mind, having a space that feels like home is essential. Kasukabe provides me with that comforting feeling.'
                                )}
                              </div>
                            </li>
                            <li>
                              <div className='question-pnl'>
                                <span>Q.</span>
                                {t('What Is My Mission For NFTStudio24?')}
                              </div>
                              <div className='answer-pnl'>
                                <span>A.</span>
                                {t(
                                  'My mission is straightforward: to connect the world to Japan and Japan to the world in the field of Web3 and blockchain. Many Japanese individuals have a desire to connect with others, but they may feel apprehensive about trying new things. On the other hand, businesses and investors are eager to join the space but struggle to find suitable partners. I aim to bridge these gaps and create fruitful connections between all stakeholders, fostering growth and collaboration in the industry'
                                )}
                              </div>
                            </li>
                            <li>
                              <div className='question-pnl'>
                                <span>Q.</span>
                                {t(
                                  'How Many Web3 And Blockchain Projects Have You Been Involved In?'
                                )}
                              </div>
                              <div className='answer-pnl'>
                                <span>A.</span>{' '}
                                {t(
                                  'As the first lady in Japan to raise your voice in the field of Web3 and blockchain at the Foreign Press Club Japan, I have been involved in various projects such as Sandbox, ETH Global, and different hackathons. In addition, My impact extends globally through partnerships with over 30 events from around the world. This combination of being a trailblazer in Japan and having extensive partnerships demonstrates my commitment to fostering awareness, collaboration, and growth in the Web3 and blockchain space on both local and international levels.'
                                )}
                              </div>
                            </li>
                            <li>
                              <div className='question-pnl'>
                                <span>Q.</span>{' '}
                                {t(
                                  'What Is Future Of NFT And Digital Identity?'
                                )}
                              </div>
                              <div className='answer-pnl'>
                                <span>A.</span>{' '}
                                {t(
                                  'The future of NFTs and digital identity is promising. NFTs will expand into various industries, while blockchain-based digital identity solutions will enhance privacy and empower individuals. The convergence of NFTs and digital identity will create exciting possibilities.'
                                )}
                              </div>
                            </li>
                            <li>
                              <div className='question-pnl'>
                                <span>Q.</span>{' '}
                                {t(
                                  'What Is My Ultimate Goal Towards The Web3 Community?'
                                )}
                              </div>
                              <div className='answer-pnl'>
                                <span>A.</span>
                                {t(
                                  'When someone presents a different perspective from the mainstream, they are often met with denial because people fear the potential for world-changing power they may possess. This scenario is similar to the emerging technologies of Web3 and blockchain. Web3 projects, NFTs, tokens, and more primarily target a specific audience, leaving newcomers and the middle class struggling to navigate this space. The lack of authentic knowledge and guidance leads to financial and time losses. NFTStudio24 aims to address this issue by providing support, education, and fostering a stronger community. Our goal is to empower individuals with the necessary esources and information to thrive in the Web3 and blockchain landscape'
                                )}
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div id='Pleasure-of-Meeting-Some-Web3-individuals'>
                          <div className='spacer-20' />
                          <h4>
                            {t('I have had the pleasure of meeting some')}
                          </h4>
                          <p>{t('truly kind-hearted Web3 individuals.')}</p>
                          <div className='spacer-30' />
                          <Row>
                            <ul className='meeting-list'>
                              <li>
                                <Image src={meeting1} alt='Meeting' />
                              </li>
                              <li>
                                <Image src={meeting2} alt='Meeting' />
                              </li>
                              <li>
                                <Link href='#'>
                                  <Image src={meeting3} alt='Meeting' />
                                </Link>
                              </li>
                              <li>
                                <Image src={meeting4} alt='Meeting' />
                              </li>
                              <li>
                                <Image src={meeting5} alt='Meeting' />
                              </li>
                              <li>
                                <Link href='#'>
                                  <Image src={meeting6} alt='Meeting' />
                                </Link>
                              </li>
                              <li>
                                <Image src={meeting7} alt='Meeting' />
                              </li>
                              <li>
                                <Image src={meeting8} alt='Meeting' />
                              </li>
                              <li>
                                <Link href='#'>
                                  <Image src={meeting9} alt='Meeting' />
                                </Link>
                              </li>
                            </ul>
                          </Row>
                        </div>
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
