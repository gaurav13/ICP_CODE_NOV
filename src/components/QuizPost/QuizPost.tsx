'use client';
import React from 'react';
import Image from 'next/image';
import quiz from '@/assets/Img/quiz.png';
import coinicon from '@/assets/Img/coin-image.png';
import icontest from '@/assets/Img/Icons/icon-test.png';
import iconcheck from '@/assets/Img/Icons/icon-check.png';
import iconrefresh from '@/assets/Img/Icons/icon-refresh.png';
import { Button } from 'react-bootstrap';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useConnectPlugWalletStore } from '@/store/useStore';
import Link from 'next/link';
import { QUIZ_ROUTE } from '@/constant/routes';

export default function QuizPost() {

  const { t, changeLocale } = useLocalization(LANG);
  return (
    <>
      <div className='Quiz-Post-pnl'>
        <Image src={quiz} alt='Quiz' />
        <div className='grey-heading'>
          <h2>
            {t(
              'NIGERIAN LOCAL TRARDERS COMMENT ON THE USE OF CRYPTOCURRENCY FOR RECIECVING PAYMENTS'
            )}
          </h2>
        </div>
        <span className='blue-span'>
          <h3>
            {t('About the')} <b>{t('Quiz')}</b>
          </h3>
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
              {t(
                'Each quiz will have single or multiple correct answers, choose wisely.'
              )}
            </p>
          </li>
          <li>
            <div className='img-pnl'>
              <Image src={iconrefresh} alt='icon test' />
            </div>
            <p>
              {t(
                'You will be able to retry multiple times if you fail the quiz.'
              )}
            </p>
          </li>
        </ul>

        <h6>
          <Image
            src={coinicon}
            alt='Infinite'
            style={{ height: '20px', width: '20px' }}
          />{' '}
          +500 ICP
        </h6>
        
        <Link href={QUIZ_ROUTE} className='blue-button'>
          {t('take quiz')}
        </Link>
     
      
       
        <h2 className='comingsoonlb'>{t('Comming Soon')}</h2>
      </div>
    </>
  );
}
