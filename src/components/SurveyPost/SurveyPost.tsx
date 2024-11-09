import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import survey from '@/assets/Img/Icons/icon-survey.png';
import iconclock from '@/assets/Img/Icons/icon-clock.png';
import iconquestion from '@/assets/Img/Icons/icon-question.png';
import user from '@/assets/Img/Profile/user.png';
import iconcap from '@/assets/Img/Icons/icon-cap.png';
import iconshare from '@/assets/Img/Icons/icon-share.png';
import infinite from '@/assets/Img/Icons/infinity.png';
import icpimage from '@/assets/Img/coin-image.png';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { SURVEY_ROUTE } from '@/constant/routes';

export default function SurveyPost() {
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <>
      <div className='servey-post position-relative pannelRes'>
        {/* <h2 className='comingsoonlb'>{t('Comming Soon')}</h2> */}

        <div className='servey-post-inner'>
          <div className='servey-post-head'>
            <div className='left-pnl'>
              <div className='img-pnl'>
                <Image src={user} alt='User' />
              </div>
              <div className='txt-pnl'>
                <h6>
                  {t('surveyer name')}
                  {/* <Link href="#"><Image src={iconcap} alt="Cap" />Expert</Link> */}
                </h6>
                <p>
                  {t('content by')} <span>BlockZa</span>
                </p>
              </div>
            </div>
            <div className='share'>
              <a href='#'>
                {t('Share')} <Image src={iconshare} alt='Share Icon' />
              </a>
            </div>
          </div>
          <div className='servey-post-body'>
            <Image src={survey} alt='Survey' />
            <p>{t('Blockza Survey')}</p>
            <h3>{t('Major Attractions in Web3')}</h3>
            <h4>
              <Image src={icpimage} alt='infinite' /> +500 BlockZa
            </h4>
            <ul>
              <li>
                <Image src={iconclock} alt='infinite' /> {t('15 minutes')}
              </li>
              <li>
                <Image src={iconquestion} alt='infinite' /> {t('5 questions')}
              </li>
            </ul>
            <Link
              href={SURVEY_ROUTE}
          
              className='servey-btn'
            >
              {t('Do Survey')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
