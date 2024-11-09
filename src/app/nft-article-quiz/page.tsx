'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Breadcrumb } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import iconrelated from '@/assets/Img/Icons/icon-related.png';
import RelatedPost from '@/components/RelatedPost/RelatedPost';
import QuizPost from '@/components/QuizPost/QuizPost';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';

export default function NFTArticle() {
  const { t, changeLocale } = useLocalization(LANG);
  const router = useRouter();
  const [animatedElements, setAnimatedElements] = useState([]);

  function isElementInViewport(elem: any) {
    const scroll = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const elemTop = elem.getBoundingClientRect().top + scroll;
    return elemTop - scroll < windowHeight;
  }

  function animateSections() {
    const elementsToAnimate = document.querySelectorAll('.scroll-anime');
    const elementsInViewport: any = [];
    elementsToAnimate.forEach((elem) => {
      if (isElementInViewport(elem)) {
        elem.classList.add('anime');
        elementsInViewport.push(elem);
      }
    });
    setAnimatedElements(elementsInViewport);
  }

  useEffect(() => {
    animateSections();
    window.addEventListener('scroll', animateSections);
    return () => {
      window.removeEventListener('scroll', animateSections);
    };
  }, []);
  const [isBlack, setIsBlack] = useState(false);
  const handleButtonClick = () => {
    setIsBlack(!isBlack);
  };
  // router.push('/route')
  return (
    <>
      <main id='main' className={isBlack ? 'black' : ''}>
        <div className='main-inner'>
          {/* <SidebarHome /> */}
          <Head>
            <title>{t('Hi')}</title>
          </Head>
          {/* NavBar */}
          {/* <NavBar /> */}
          {/* NavBar */}
          <div className='inner-content'>
            <Row>
              <Col xl='12' lg='12' md='12'>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <Link href='/'>
                      <i className='fa fa-home' />
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item href='#'>POST</Breadcrumb.Item>
                  <Breadcrumb.Item active>
                    NIGERIAN LOCAL TRADERS COMMENT ON THE USE OF CRYPTOCURRENCY
                    FOR RECEIVING PAYMENTS
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col xxl='7' xl='7' lg='12' md='12'>
                {/* <NFTArticlePost /> */}
                <h3>
                  <Image src={iconrelated} alt='icon related' />{' '}
                  {t('Related Posts')}
                </h3>
                <div className='spacer-20' />
                <div className='related-post-container'>
                  <RelatedPost />
                </div>
              </Col>
              <Col xxl='5' xl='5' lg='12' md='12' className='text-right'>
                <QuizPost />
                {/* <LeadershipPost /> */}
              </Col>
            </Row>
          </div>
        </div>
      </main>
    </>
  );
}
