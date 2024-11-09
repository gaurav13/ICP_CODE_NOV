import React, { useEffect, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import Slider from 'react-slick';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';

export default function WebstoriesSlider() {
  const { t, changeLocale } = useLocalization(LANG);
  const [shortsVidesLink, setShortsVidesLink] = useState<string[]>([]);
  var Webstories = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 7,
    responsive: [
      {
        breakpoint: 2000,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
          infinite: false,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: false,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: false,
        },
      },
      {
        breakpoint: 1090,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: false,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
    ],
  };
  let jpShortsVidesLink = [
    'https://www.youtube.com/embed/O1KiW_sfqO8',
    'https://www.youtube.com/embed/ZFNzFaHtS2E',
    'https://www.youtube.com/embed/SN6jQH-SyMA',
    'https://www.youtube.com/embed/CzM5ZoWOkU8',
    'https://www.youtube.com/embed/3w92GIff6eM',
    'https://www.youtube.com/embed/vqTvvAXlTPM',
    'https://www.youtube.com/embed/-H-MQOr_a3o',
    'https://www.youtube.com/embed/edGuNFXdgvc',
    'https://www.youtube.com/embed/bMxXjhH0ars',
    'https://www.youtube.com/embed/naB1LzbJpBg',
    'https://www.youtube.com/embed/egLGAFdBqD0',
    'https://www.youtube.com/embed/YyuU3xheZi4',
    'https://www.youtube.com/embed/PlpHx-FGpR4',
    'https://www.youtube.com/embed/3bdwxg8KKbk',
    'https://www.youtube.com/embed/CbhfMOST3Ls',
  ];
  let ShortsVidesLink = [
    'https://www.youtube.com/embed/aF5PWYYMpjQ',
    'https://www.youtube.com/embed/gXEfU0pKnbU',
    'https://www.youtube.com/embed/vs10ddo5c_8',
    'https://www.youtube.com/embed/6MKljLRujz0',
    'https://www.youtube.com/embed/qYVP2J6sEgs',
    'https://www.youtube.com/embed/H4ygVSWlbr0',
    'https://www.youtube.com/embed/ME75JUTOQ9A',
    'https://www.youtube.com/embed/9PaLyYmWCp4',
    'https://www.youtube.com/embed/cCNM6KBltE4',
    'https://www.youtube.com/embed/YdVXtDcDgaQ',
    'https://www.youtube.com/embed/c1ViBzmP7Og',
    'https://www.youtube.com/embed/mKMCbZDMMeE',
    'https://www.youtube.com/embed/AM8uzo62rz8',
    'https://www.youtube.com/embed/lFxF-CBlOCA',
    'https://www.youtube.com/embed/I4PfkPnWb48',
  ];
  useEffect(() => {
    if (LANG == 'jp') {
      setShortsVidesLink(jpShortsVidesLink);
    } else {
      setShortsVidesLink(ShortsVidesLink);
    }
  }, [LANG]);

  return (
    <Slider {...Webstories} lazyLoad='anticipated'>
      {shortsVidesLink &&
        shortsVidesLink.length != 0 &&
        shortsVidesLink.map((e, index) => {
          return (
            <div className='Stories-post' key={index}>
              <div className='Stories-post-inner shortCls'>
                <iframe
                  width='100%'
                  height='300'
                  src={e}
                  title='YouTube Shorts Video Player'
                  allowFullScreen
                />

                {/* </Link> */}
              </div>
            </div>
          );
        })}
    </Slider>
  );
}
