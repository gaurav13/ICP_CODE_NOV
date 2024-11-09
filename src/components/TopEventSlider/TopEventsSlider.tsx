import React, { useEffect, useRef } from 'react';
import 'slick-carousel/slick/slick.css';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
import logger from '@/lib/logger';
import { ARTICLE_FEATURED_IMAGE_ASPECT } from '@/constant/sizes';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { Event_DINAMIC_PATH, Event_STATIC_PATH } from '@/constant/routes';
export default function TopEventSlider({ eventList }: { eventList: any }) {
  const sliderRef = useRef<Slider>(null);
  var Event = {
    dots: eventList.length > 1 ? true : false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    customPaging: (index: any) => (
      <>
        <div
          onClick={() => handleImageClick(index)}
          className='img-parent'
          style={{
            aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT,
          }}
        >
          <Image fill src={eventList[index].image} alt='Bg' />
        </div>
      </>
    ),
    responsive: [
      {
        breakpoint: 4000,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },

      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const handleImageClick = (index: number) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <>
      <Slider {...Event} ref={sliderRef}>
        {eventList && eventList.length != 0 ? (
          eventList.map((event: any, index: number) => {
            return (
              <div className='Post-padding' key={index}>
                <div className='img-pnl'>
                  <Link
                    className='img-parent max'
                    style={{
                      aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT,
                    }}
                    href={
                      event.isStatic
                        ? `${Event_STATIC_PATH + event.id}`
                        : `${Event_DINAMIC_PATH + event.id}`
                    }
                  >
                    <Image src={event.image} fill alt='Post' />
                  </Link>
                </div>
                <div className='txt-pnl'>
                  <h4>{event?.title}</h4>
                  <div>
                    <Link
                      href={
                        event.isStatic
                          ? `${Event_STATIC_PATH + event.id}`
                          : `${Event_DINAMIC_PATH + event.id}`
                      }
                      className='reg-btn white mx-2'
                    >
                      <i className='fa fa-info-circle' /> {t('Learn More')}
                    </Link>
                    <Link
                      href={event.website}
                      target='_blank'
                      className='reg-btn yellow'
                    >
                      {t('Visit Website')}
                    </Link>
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
      </Slider>
    </>
  );
}
