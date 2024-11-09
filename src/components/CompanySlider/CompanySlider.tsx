import React, { useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
import logger from '@/lib/logger';
import { useRouter } from 'next/navigation';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import {
  DIRECTORY_DINAMIC_PATH,
  DIRECTORY_STATIC_PATH,
} from '@/constant/routes';
export default function DirectorySlider({
  trendingDirectries,
}: {
  trendingDirectries: any;
}) {
  const router = useRouter();

  var Directory = {
    dots: null,
    infinite: true,
    speed: 500,
    slidesToShow: trendingDirectries.length >= 6 ? 9 : 3,
    // slidesToShow: 9,
    slidesToScroll: 9,
    responsive: [
      {
        breakpoint: 4000,
        settings: {
          // slidesToShow: trendingDirectries.length >= 8 ? 8 : trendingDirectries.length,
          slidesToShow: 8,
          slidesToScroll: 8,
          infinite: false,
        },
      },
      {
        breakpoint: 3000,
        settings: {
          // slidesToShow: trendingDirectries.length >= 7 ? 7 : trendingDirectries.length,
          slidesToShow: 7,
          slidesToScroll: 7,
          infinite: false,
        },
      },
      {
        breakpoint: 2200,
        settings: {
          // slidesToShow: trendingDirectries.length >= 6 ? 6 : trendingDirectries.length,

          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: false,
        },
      },
      {
        breakpoint: 1800,
        settings: {
          // slidesToShow: trendingDirectries.length >= 5 ? 5 : trendingDirectries.length,

          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: false,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          // slidesToShow: trendingDirectries.length >= 4 ? 4 : trendingDirectries.length,

          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
        },
      },

      {
        breakpoint: 1200,
        settings: {
          // slidesToShow: trendingDirectries.length >= 3 ? 3 : trendingDirectries.length,

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
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
    ],
  };

  let openArticleLink = (entryLink: any) => {
    router.push(entryLink);
  };
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <>
      {trendingDirectries.length != 0 ? (
        <Slider {...Directory}>
          {trendingDirectries.map((entry: any) => {
            return (
              <div
                className='Post-padding'
                style={{ height: '200px', minWidth: '300px' }}
              >
                <div
                  className='companypostshort'
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.preventDefault();

                    openArticleLink(
                      entry[1].isStatic
                        ? `${DIRECTORY_STATIC_PATH + entry[0]}`
                        : `${
                            entry.length != 0
                              ? DIRECTORY_DINAMIC_PATH + entry[0]
                              : DIRECTORY_DINAMIC_PATH + '#'
                          }`
                    );
                  }}
                >
                  <p>{entry[1]?.catagory ?? ''}</p>
                  <div className='top-info-pnl'>
                    <div className='img-pnl'>
                   
                      <Image
                        src={entry[1]?.companyLogo ?? '/images/l-b.png'}
                        width={15}
                        height={16}
                        alt='Blockza'
                      />
                      <Image
                        src={'/images/l-n.png'}
                        width={18}
                        height={18}
                        alt='Girl'
                      />
                    </div>
                    <div className='txt-pln'>
                      <p>
                        {entry[1].company.length > 30
                          ? `${entry[1].company.slice(0, 30)}...`
                          : entry[1].company}
                      </p>
                    </div>
                  </div>
                  <div style={{ overflow: 'hidden', height: '80px' }}>
                    <p>{entry[1].shortDescription ?? ''}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {/* <div className='Post-padding'>
          <div className='companypostshort'>
            <h6>BLOCKCHAIN</h6>
            <div className='top-info-pnl'>
              <div className='img-pnl'>
                <Image
                  src={'/images/l-b.png'}
                  width={42}
                  height={42}
                  alt='Blockza'
                />
                <Image
                  src={'/images/l-n.png'}
                  width={18}
                  height={18}
                  alt='Girl'
                />
              </div>
              <div className='txt-pln'>
                <h6>Blockchain.com</h6>
              </div>
            </div>
            <div>
              <p>
                Blockchain.com is a developer of a digital assets platform that
                offers ways to buy, hold, and use cryptocurrency.
              </p>
            </div>
          </div>
        </div> */}
          {/* <div className='Post-padding'>
          <div className='companypostshort'>
            <h6>BLOCKCHAIN</h6>
            <div className='top-info-pnl'>
              <div className='img-pnl'>
                <Image
                  src={'/images/l-b.png'}
                  width={42}
                  height={42}
                  alt='Blockza'
                />
                <Image
                  src={'/images/l-n.png'}
                  width={18}
                  height={18}
                  alt='Girl'
                />
              </div>
              <div className='txt-pln'>
                <h6>Blockchain.com</h6>
              </div>
            </div>
            <div>
              <p>
                Blockchain.com is a developer of a digital assets platform that
                offers ways to buy, hold, and use cryptocurrency.
              </p>
            </div>
          </div>
        </div> */}
          {/* <div className='Post-padding'>
          <div className='companypostshort'>
            <h6>BLOCKCHAIN</h6>
            <div className='top-info-pnl'>
              <div className='img-pnl'>
                <Image
                  src={'/images/l-b.png'}
                  width={42}
                  height={42}
                  alt='Blockza'
                />
                <Image
                  src={'/images/l-n.png'}
                  width={18}
                  height={18}
                  alt='Girl'
                />
              </div>
              <div className='txt-pln'>
                <h6>Blockchain.com</h6>
              </div>
            </div>
            <div>
              <p>
                Blockchain.com is a developer of a digital assets platform that
                offers ways to buy, hold, and use cryptocurrency.
              </p>
            </div>
          </div>
        </div> */}
          {/* <div className='Post-padding'>
          <div className='companypostshort'>
            <h6>BLOCKCHAIN</h6>
            <div className='top-info-pnl'>
              <div className='img-pnl'>
                <Image
                  src={'/images/l-b.png'}
                  width={42}
                  height={42}
                  alt='Blockza'
                />
                <Image
                  src={'/images/l-n.png'}
                  width={18}
                  height={18}
                  alt='Girl'
                />
              </div>
              <div className='txt-pln'>
                <h6>Blockchain.com</h6>
              </div>
            </div>
            <div>
              <p>
                Blockchain.com is a developer of a digital assets platform that
                offers ways to buy, hold, and use cryptocurrency.
              </p>
            </div>
          </div>
        </div> */}
          {/* <div className='Post-padding'>
          <div className='companypostshort'>
            <h6>BLOCKCHAIN</h6>
            <div className='top-info-pnl'>
              <div className='img-pnl'>
                <Image
                  src={'/images/l-b.png'}
                  width={42}
                  height={42}
                  alt='Blockza'
                />
                <Image
                  src={'/images/l-n.png'}
                  width={18}
                  height={18}
                  alt='Girl'
                />
              </div>
              <div className='txt-pln'>
                <h6>Blockchain.com</h6>
              </div>
            </div>
            <div>
              <p>
                Blockchain.com is a developer of a digital assets platform that
                offers ways to buy, hold, and use cryptocurrency.
              </p>
            </div>
          </div>
        </div>  */}
        </Slider>
      ) : (
        <h6 className='text-center'>{t('No Related Company found')}</h6>
      )}
    </>
  );
}
