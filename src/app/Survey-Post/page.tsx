'use client';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import quiz from '@/assets/Img/quiz-1.png';
import infinity from '@/assets/Img/infinity.png';
import icontest from '@/assets/Img/Icons/icon-test.png';
import iconcheck from '@/assets/Img/Icons/icon-check.png';
import iconrefresh from '@/assets/Img/Icons/icon-refresh.png';
import { Button } from 'react-bootstrap';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import Link from 'next/link';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
export default function QuizPost() {
  const { t, changeLocale } = useLocalization(LANG);
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const Id = searchParams.get('id');
  return (
    <>
      <main id='main'>
        <div className='main-inner detail-inner-Pages pri-term-pnl'>
          <div className='inner-content text-center'>
            <div className='Quiz-PagePost'>
              <Image className='post-img' src={quiz} alt='Quiz' />
              <div className='grey-heading'>
                <h2>
                  {t('NIGERIAN LOCAL TRARDERS COMMENT ON THE USE OF CRYPTOCURRENCY FOR RECIECVING PAYMENTS')}
                </h2>
              </div>
              <span className='blue-span'>
                <h3>{t('About the Quiz')}</h3>
              </span>
              <p>{t('A review of crucial points stated in the article')}</p>
              <ul>
                <li>
                  <div className='img-pnl'>
                    <Image src={iconcheck} alt='icon test' />
                  </div>
                  <p>
                    {t('You need to answer all questions in the quiz to earn 500 XP')}
                  </p>
                </li>
                <li>
                  <div className='img-pnl'>
                    <Image src={icontest} alt='icon test' />
                  </div>
                  <p>
                    {t('Each quiz will have single or multiple correct answers, choose wisely.')}
                  </p>
                </li>
                <li>
                  <div className='img-pnl'>
                    <Image src={iconrefresh} alt='icon test' />
                  </div>
                  <p>
                    {t('You will be able to retry multiple times if you fail the quiz.')}
                  </p>
                </li>
              </ul>

              <h6>
                <Image
                  src={infinity}
                  alt='Infinite'
                  style={{ width: '50px' }}
                />{' '}
                 {t('+500 ICP')}
              </h6>
              <Link href={{ pathname: '/take-survey', query: { id: Id } }}>
               <Button className='blue-button'>
               {t('Take Survey')}
             </Button> 
             </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
