import { Button } from 'react-bootstrap';

import React from 'react';
import blackGlobe from '@/assets/Img/world-globe-line-icon.webp';
import whiteGlobe from '@/assets/Img/world-globe-line-icon2.webp';
import { LANG } from '@/constant/language';
import Image from 'next/image';
import useLocalization from '@/lib/UseLocalization';
import { EN_SITE_URL, JP_SITE_URL, OLD_EN_SITE_URL } from '@/constant/config';

export default function LanguageBtn({ id }: { id: string }) {
  const { t, changeLocale } = useLocalization(LANG);

  let handleSelectChange = (event: any) => {
    const value = event.target.value;
    if (value == 'en') {
      window.open(EN_SITE_URL, '_self');
    } else {
      window.open(JP_SITE_URL, '_self');
    }
  };
  return (
    <>
      <Button className={`language-btn`}>
        <Image src={blackGlobe} alt='Blockza' className='img1' />
        <Image src={whiteGlobe} alt='Blockza' className='img2' />

        <span className='japnes-btn'>
          <select name={id} id={id} onChange={handleSelectChange}>
            <option value='en' selected={LANG == 'en' ? true : false}>
              {t('English')}
            </option>

            <option value='jp' selected={LANG == 'jp' ? true : false}>
              {t('Japanese')}
            </option>
          </select>
        </span>
      </Button>
    </>
  );
}
