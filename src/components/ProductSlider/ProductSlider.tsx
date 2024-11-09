import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Slider from 'react-slick';
import logger from '@/lib/logger';
import { profileAspect } from '@/constant/sizes';
import { formatLikesCount } from '@/components/utils/utcToLocal';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import {
  DIRECTORY_DINAMIC_PATH,
  DIRECTORY_STATIC_PATH,
} from '@/constant/routes';
export default function ProductSlider({
  trendingDirectries,
}: {
  trendingDirectries: any;
}) {
  var Product = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 2500,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 1800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },

      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 1330,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
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
  logger(trendingDirectries, 'trendingDirectries22');
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <>
      <Slider {...Product} lazyLoad='anticipated'>
        {trendingDirectries.length != 0 &&
          trendingDirectries.map((item: any) => {
            return (
              <div
                className='Post-padding d-flex justify-content-center'
                key={item[0]}
              >
                <Link
                  href={
                    item[1].isStatic
                      ? `${DIRECTORY_STATIC_PATH + item[0]}`
                      : `${DIRECTORY_DINAMIC_PATH + item[0]}`
                  }
                  className='Product-post'
                >
                  <div className='Product-post-inner'>
                    <div className='img-pnl'>
                      <Image
                        src={
                          item[1].companyBanner
                            ? item[1].companyBanner
                            : '/images/b-b.png'
                        }
                        height={100}
                        width={100}
                        className='h-100 w-100'
                        alt='Blockza'
                      />
                    </div>
                    <div className='text-pnl'>
                      <div className='d-flex'>
                        <div
                          className='logo-img'
                          style={{
                            aspectRatio: profileAspect,
                            width: '40px',
                            height: '40px',
                            position: 'relative',
                          }}
                        >
                          <Image
                            src={
                              item[1].companyLogo
                                ? item[1].companyLogo
                                : '/images/l-b.png'
                            }
                            fill
                            alt='Blockza'
                          />
                        </div>
                        <div className='heading-txt-pnl'>
                          <h3 style={{ height: 19.19, overflow: 'hidden' }}>
                            {item[1].company ?? ''}
                          </h3>
                          <p style={{ height: 84, overflow: 'hidden' }}>
                            {item[1].shortDescription ?? ''}
                          </p>
                        </div>
                      </div>
                      <div className='txt-pnl'>
                        <p style={{ height: 21, overflow: 'hidden' }}>
                          <i>{item[1].founderDetail ?? ''}</i>
                        </p>
                        <div className='img-pl'>
                          
                          <Image
                       src={
                        item[1].founderImage
                          ? item[1].founderImage
                          : '/images/l-n.png'
                      }
                        width={20}
                        height={20}
                        alt='Girl'
                      />

                          <h5 className='ms-2 mx40'>{item[1].founderName ?? ''}</h5>
                        </div>
                      </div>
                      <ul>
                        <li>
                          {formatLikesCount(Number(item[1]?.totalCount)) ?? 0}
                          <span>{t('Posts')}</span>
                        </li>
                        <li>
                          {formatLikesCount(Number(item[1].views ?? 0))}
                          <span>{t('Views')}</span>
                        </li>
                        <li>
                          {formatLikesCount(Number(item[1].likes) ?? 0)}
                          <span>{t('Likes')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
      </Slider>
    </>
  );
}
