import React from 'react';
import 'slick-carousel/slick/slick.css';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
import logger from '@/lib/logger';
import post1 from '@/assets/Img/placeholder-img.jpg';
import { ARTICLE_FEATURED_IMAGE_ASPECT } from '@/constant/sizes';
import useLocalization from "@/lib/UseLocalization"
import { LANG } from '@/constant/language';
import { Event_DINAMIC_PATH } from '@/constant/routes';
export default function EventSlider({ eventList }: { eventList: any }) {
  var Event = {
    dots: null,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 4000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
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
  logger(eventList, 'eventList88');
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <>
      <Slider {...Event}>
        {eventList && eventList.length != 0 ? (
          eventList.map((event: any, index: number) => {
            return (
              <div className='Post-padding' key={index}>
                <div className='Event-Post-small'>
                  <div className='Event-Post-inner'>
                    <Link
                      href={`${Event_DINAMIC_PATH+event.id}`}
                      className='img-pnl'
                      style={{
                        aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT,
                        width: '100%',
                        position: 'relative',
                      }}
                    >
                      {/* <Image src={post12} alt='Post' /> */}
                      <Image
                        src={event ? event.image : post1}
                        // className='backend-img'
                        // height={100}
                        // width={100}
                        fill
                        alt={`feature image`}
                      />
                    </Link>
                    <div className='txt-pnl'>
                      <p>{event.date}</p>
                      <Link href={`${Event_DINAMIC_PATH+event.id}`} className='text-decoration-no'>
                        {event.title}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className='d-flex justify-content-center'>
            <p>{t('No Events Found')}</p>
          </div>
        )}
        {/* <div className='Post-padding'>
          <div className='Event-Post-small'>
            <div className='Event-Post-inner'>
              <Link href='/' className='img-pnl'>
                <Image src={post2} alt='Post' />
              </Link>
              <div className='txt-pnl'>
                <p>April 18, 2024 - April 19, 2024</p>
                <Link href='#'>
                  TOKEN2049 Returns to Dubai in 2024 with Premier Crypto
                  Conference
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className='Post-padding'>
          <div className='Event-Post-small'>
            <div className='Event-Post-inner'>
              <Link href='/' className='img-pnl'>
                <Image src={post3} alt='Post' />
              </Link>
              <div className='txt-pnl'>
                <p>September 16, 2024 - September 18, 2024</p>
                <Link href='#'>
                  Web 3.0 & IoT Conferences at Webs Week 2024
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className='Post-padding'>
          <div className='Event-Post-small'>
            <div className='Event-Post-inner'>
              <Link href='/' className='img-pnl'>
                <Image src={post4} alt='Post' />
              </Link>
              <div className='txt-pnl'>
                <p>March 7, 2024</p>
                <Link href='#'>HYFI 2024 Singapore</Link>
              </div>
            </div>
          </div>
        </div> */}
      </Slider>
    </>
  );
}
