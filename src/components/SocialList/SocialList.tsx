import React, { useState } from 'react';
import Link from 'next/link';
import TwitterSVGIcon from '@/components/twitterIconSVG/TwitterSVGIcon';
import { LANG } from '@/constant/language';

export default function SocialList() {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };
  return (
    <>
      <ul className='social-list '>
        <li>
          <Link href='mailto:support@blockza.io' target='_blank'>
            <i className='fa fa-envelope' />
          </Link>
        </li>
        <li
          className='d-lg-flex justify-content-lg-center'
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <a
            href={
              LANG == 'jp'
                ? 'https://x.com/blockza_jp/'
                : 'https://x.com/blockza_io/'
            }
            target='_blank'
            className='mb-0'
          >
            {/* <i className='fa-brands fa-x-twitter'/> */}
            <TwitterSVGIcon color='blue' />
            {/* {isHovered ? (
              <TwitterSVGIcon color='whiteHover' />
            ) : (
              <TwitterSVGIcon color='blue' />
            )} */}
          </a>
        </li>
        <li>
          <Link href='https://t.me/blockza_io/' target='_blank'>
            <i className='fa fa-telegram' />
          </Link>
        </li>
        <li>
          <Link
            href='https://www.linkedin.com/company/blockza-io/'
            target='_blank'
          >
            <i className='fa fa-linkedin-square' />
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
            <i className='fa fa-youtube-play' />
          </Link>
        </li>
        <li>
          <Link href='https://www.instagram.com/nftstudio24/' target='_blank'>
            <i className='fa fa-instagram' />
          </Link>
        </li>
      </ul>
    </>
  );
}
