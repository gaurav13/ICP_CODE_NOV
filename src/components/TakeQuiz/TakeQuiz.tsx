import React from 'react';
import Image from 'next/image';
import icondollar from '@/assets/Img/icon-dollar.png';
import iconcoin from '@/assets/Img/coin-image.png';
import coinicon from '@/assets/Img/coin-image.png';
import icontest from '@/assets/Img/Icons/icon-test.png';
import iconcheck from '@/assets/Img/Icons/icon-check.png';
import iconrefresh from '@/assets/Img/Icons/icon-refresh.png';
import { Button } from 'react-bootstrap';
import useLocalization from "@/lib/UseLocalization"
import { LANG } from '@/constant/language';
import Link from 'next/link';
import { QUIZ_ROUTE } from '@/constant/routes';
export default function TakeQuiz() {
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <>
      <div className='Take-Quiz-Pnl'>
        <span>
          <Image src={coinicon} alt='Coin' />
        </span>
        <span>
          <Image src={coinicon} alt='Coin' />
        </span>
        <span>
          <Image src={coinicon} alt='Coin' />
        </span>
        <span>
          <Image src={coinicon} alt='Coin' />
        </span>
        <span>
          <Image src={coinicon} alt='Coin' />
        </span>
        <span>
          <Image src={coinicon} alt='Coin' />
        </span>
        <span>
          <Image src={coinicon} alt='Coin' />
        </span>
        <div>
          <div className='h1takequiz'>
            <Image src={iconcoin} alt='Quiz' /> <p className={`custom ${LANG === 'jp' ? 'fs-max' : ""}`}>{t('Quiz')}</p>{' '}
            <Image src={icondollar} alt='Quiz' />
          </div>
        </div>
        {/* <p className='p.h2txt text-white' >
          {t('Comming Soon')}
        </p> */}
        <p className='text-dark margin'>{t('A review of crucial points stated in the article')}</p>
        <ul>
          <li>
            <div className='img-pnl'>
              <Image src={iconcheck} alt='icon test' />
            </div>
            <p>{t('You need to answer all questions in the quiz to earn 500 XP')}</p>
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
        <div className='full-div'>
          <div className='h6takequiz'>
            <Image src={coinicon} alt='Infinite' /> +500 BlockZa
          </div>
        </div>
        <Link href={QUIZ_ROUTE} className='blue-button'>{t('take quiz')}</Link>
      </div>
    </>
  );
}
