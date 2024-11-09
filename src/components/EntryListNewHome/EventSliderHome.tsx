import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import smallpost1 from '@/assets/Img/event1.jpg';
import smallpost2 from '@/assets/Img/event2.jpg';
import smallpost3 from '@/assets/Img/event3.jpg';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import iconevents from '@/assets/Img/Icons/icon-event.png';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import { utcToLocal } from '@/components/utils/utcToLocal';
import { TopEvent } from '@/types/article';
import { ARTICLE_FEATURED_IMAGE_ASPECT } from '@/constant/sizes';
import { Form, Spinner } from 'react-bootstrap';
import getVariant from '@/components/utils/getEventStatus';
import Slider from 'react-slick';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { Event_DINAMIC_PATH, Event_STATIC_PATH } from '@/constant/routes';

export default function TopEventsSlider({ small }: { small?: boolean }) {
  const { t, changeLocale } = useLocalization(LANG);
  const [topEvents, setTopEvents] = useState<null | TopEvent[]>();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('upcoming');
  const [isLoading, setIsLoading] = useState(false);
  const { auth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    identity: state.identity,
  }));

  const router = useRouter();
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  var Featued = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 5000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 1400,
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
          slidesToShow: 1,
          slidesToScroll: 1,
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
  async function getEvents(reset?: boolean) {
    let searched = reset ? '' : search;
    setIsLoading(true);
    let statusVariant = getVariant(status);
    let tags = "";

    const resp = await entryActor.get_upcoming_events(
      searched,
      0,
      12,
      statusVariant,
      [],
      [],
      [],
      tags
    );
    const unEvents = resp.entries;
    if (unEvents.length > 0) {
      const refinedEvents = unEvents.map((raw: any) => {
        const unEvent = raw[1];
        const image = getImage(unEvent.image);
        const date = utcToLocal(unEvent.date.toString(), 'MMM D, YYYY');
        const endDate = utcToLocal(unEvent.endDate.toString(), 'MMM D, YYYY');

        const refinedEvent: TopEvent = {
          id: raw[0],
          title: unEvent.title,
          date: date,
          endDate,
          image,
          shortDescription: unEvent.shortDescription,
          freeTicket: unEvent.freeTicket,
          applyTicket: unEvent.applyTicket,
          lat: unEvent.lat,
          lng: unEvent.lng,
          isStatic: unEvent.isStatic,
        };
        return refinedEvent;
      });
      // if (refinedEvents.length > 3) {
      //   setTopEvents(refinedEvents.slice(0, 3));
      // }
      const chunkSize = 2;

      const nestedArray = [];
      for (let i = 0; i < refinedEvents.length; i += chunkSize) {
        nestedArray.push(refinedEvents.slice(i, i + chunkSize));
      }
      logger(refinedEvents, 'refinedEvents');
      setTopEvents(nestedArray);
    } else {
      setTopEvents(null);
    }
    setIsLoading(false);
  }
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      getEvents();
    }
  };
  function handleStatusChange(e: any) {
    setStatus(e.target.value);
  }
  useEffect(() => {
    getEvents();
  }, [status]);
  useEffect(() => {
    getEvents();
  }, []);
  return (
    <>
      <h2 className='hedingxt'>
        <Image src={iconevents} alt='Hot' /> {t('Events')}
      </h2>
      <div className='spacer-20' />
      <div className='flex-div align-items-center'>
        <div className='seelect'>
          <Form.Select
            aria-label='Default select example'
            className='trans'
            value={status}
            onChange={handleStatusChange}
          >
            <option value={'all'}>{t('all events')}</option>
            <option value={'upcoming'}>{t('Upcoming event')}</option>
            <option value='past'>{t('past events')}</option>
            <option value='ongoing'>{t('ongoing event')}</option>
          </Form.Select>
        </div>
        <div className='search-pnl'>
          <input
            type='text'
            className='form-control bluewala'
            placeholder={t('find events')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
          {search.length >= 1 && (
            <button
              onClick={() => {
                setSearch('');
                getEvents(true);
              }}
            >
              <i className='fa fa-xmark mx-1' />
            </button>
          )}
          <button onClick={() => getEvents()}>
            <i className='fa fa-search' />
          </button>
        </div>
      </div>
      <div className='spacer-30' />
      {isLoading ? (
        <div className='d-flex justify-content-center'>
          <Spinner size='sm' />
        </div>
      ) : topEvents && topEvents?.length > 0 ? (
        <Slider {...Featued} lazyLoad='anticipated'>
          {topEvents.map((eventarray: any) => {
            return (
              <div className='Post-padding'>
                {eventarray &&
                  eventarray.map((event: TopEvent) => {
                    return (
                      <div className='release-post'>
                        <div
                          className={`release-post-inner ${
                            small ? 'small' : ''
                          }`}
                        >
                          <div className='img-pnl'>
                            <Link
                              style={{
                                position: 'relative',
                                width: '100%',
                                margin: '0 auto',
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
                            <span>{event.date}</span>
                            <h6>
                              <Link
                                href={
                                  event.isStatic
                                    ? `${Event_STATIC_PATH + event.id}`
                                    : `${Event_DINAMIC_PATH + event.id}`
                                }
                                className='text-primary'
                              >
                                {/* ONE°15 Marina Sentosa... */}
                                {/* ONE°15 Marina Sentosa Cove, Singapore */}
                                {event.title}
                              </Link>
                            </h6>
                            {/* <p>HYFI 2024 Singapore is...</p> */}
                            <p
                              style={{
                                maxHeight: 42,
                                margin: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {/* HYFI 2024 Singapore is an exclusive Future-tech event[…] */}
                              {event.shortDescription?.length > 20
                                ? event.shortDescription.slice(0, 20) + '...'
                                : event.shortDescription}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </Slider>
      ) : (
        <p>{t('No Events Found')}</p>
      )}
    </>
  );
}
