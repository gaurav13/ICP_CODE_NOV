'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Row,
  Col,
  Breadcrumb,
  Dropdown,
  Spinner,
  Form,
  Button,
} from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import smallpost1 from '@/assets/Img/Posts/small-post-16.jpg';
import smallpost2 from '@/assets/Img/Posts/small-post-17.jpg';
import smallpost3 from '@/assets/Img/Posts/small-post-18.jpg';
import smallpost4 from '@/assets/Img/Posts/small-post-19.jpg';
import smallpost5 from '@/assets/Img/Posts/small-post-20.jpg';
import icongift from '@/assets/Img/Icons/icon-giftbox.png';
import bg from '@/assets/Img/bg.jpg';
import bg1 from '@/assets/Img/banner-2.jpg';
import bgblack from '@/assets/Img/bg-black.jpg';
import iconevent from '@/assets/Img/Icons/icon-press-release.png';
import iconcalender from '@/assets/Img/Icons/icon-calender.png';
import logo from '@/assets/Img/Logo/Footer-logo.png';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { EventStatus, ListEvent } from '@/types/article';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import { getImage } from '@/components/utils/getImage';
import { utcToLocal } from '@/components/utils/utcToLocal';
import logger from '@/lib/logger';
import { ARTICLE_FEATURED_IMAGE_ASPECT } from '@/constant/sizes';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import getVariant from '@/components/utils/getEventStatus';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import {
  ARTICLE_STATIC_PATH,
  Event_DINAMIC_PATH,
  Event_STATIC_PATH,
} from '@/constant/routes';
// import CountrySelector from '@/components/CustomCountryandRegion/CountrySelect';
import { REGIONS } from '@/constant/regions';
import { countryTranslations } from '@/constant/coutriesTrans';
import TopEventSlider from '@/components/TopEventSlider/TopEventsSlider';
import { siteConfig } from '@/constant/config';
import "../../styles/events.css";
import { FaMapMarkerAlt,FaWhatsapp,FaShareAlt, FaRegStar,FaEnvelope, FaCopy, FaCalendarAlt, FaTags, FaExternalLinkAlt, FaApple, FaGoogle, FaFacebook, FaInstagram, FaLinkedin, FaTelegram, FaTwitter } from 'react-icons/fa';
import moment from 'moment';
const EVENTS_LEGNTH = 20;
export default function Events() {
  const { t, changeLocale } = useLocalization(LANG);
  const [topEvents, setTopEvents] = useState<null | ListEvent[]>();
  const [articlesList, setArticlesList] = useState<any>([]);
  const [pressReleaseList, setPressReleaseList] = useState<any>([]);
  const [moreEvents, setMoreEvents] = useState(false);
  const [eventAmount, setEventAmount] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [status, setStatus] = useState('all');
  const [tempStatus, setTempStatus] = useState(
    LANG == 'en' ? 'All Events' : '全イベント'
  );

  const [previewEvents, setPreviewEvents] = useState<null | ListEvent[]>();
  const [search, setSearch] = useState('');
  const [regions, setRegions] = useState([]);
  const [filters, setFilters] = useState<{ month: string | number }>({
    month: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [articleLoading, setarticleLoading] = useState(true);
  const location = usePathname();
  const [ccVals, setCcVals] = useState({
    country: '',
    city: '',
  });
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

  const changeCountryHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let val = event.target.value;

    if (val != '' && REGIONS) {
      let regions = REGIONS[val];
      if (regions) {
        setRegions(regions);
      }
    } else {
      setRegions([]);
    }
    handleCChange('country', val);
  };

  // sending the customstatus just sets the preview events
  async function getEvents(
    reset?: boolean,
    more?: number,
    customStatus?: string
  ) {

    let searched = reset ? '' : search;
    let month = filters.month ? [filters.month] : [];
    let queryStatus = customStatus ?? status;
    const country = ccVals.country == '' ? [] : [ccVals.country];
    const city = ccVals.city == '' ? [] : [ccVals.city];
    const startFrom = more ?? startIndex;
    const length = customStatus ? 4 : EVENTS_LEGNTH;
    let statusVariant = getVariant(queryStatus);
    let tags = "";

    setIsLoading(true);

    const resp = await entryActor.get_upcoming_events(
      searched,
      startFrom,
      length,
      statusVariant,
      month,
      country,
      city,
      tags
    );
    const unEvents = resp.entries;

    const amount = resp.amount;
    if (!customStatus) {
      setEventAmount(amount);

      if (
        (more &&
          ((topEvents && unEvents.length + topEvents?.length < amount) ||
            (!topEvents && unEvents.length < amount))) ||
        (!more && unEvents.length < amount)
      ) {
        logger({ topEvents, un: unEvents.length, amount }, 'WHYY TRUEE<<<<,');
        setMoreEvents(true);
      } else {
        logger({ topEvents, un: unEvents.length, amount }, 'WHYY FASE<<<<,');
        setMoreEvents(false);
      }
    }
    if (unEvents.length > 0) {
      const refinedEvents = unEvents.map((raw: any) => {
        const unEvent = raw[1];
        const image = getImage(unEvent.image);
        const date = utcToLocal(unEvent.date.toString(),  'MMM D, YYYY hh:mm A');
        const eventenddate = utcToLocal(unEvent.endDate.toString(),  'MMM D, YYYY hh:mm A');
        const refinedEvent: ListEvent = {
          id: raw[0],
          title: unEvent.title,
          date: date,
          image,
          shortDescription: unEvent.shortDescription,
          website: unEvent.website,
          freeTicket: unEvent.freeTicket,
          applyTicket: unEvent.applyTicket,
          isStatic: unEvent.isStatic,
          discountTicket: unEvent.discountTicket,
          eventLocation: unEvent.location,
          endDate:eventenddate,
        };
        return refinedEvent;
      });
      if (customStatus) {
        logger(refinedEvents, 'refinedEvents');
        let sliced = refinedEvents.slice(0, 3);
        setPreviewEvents(sliced);
        return;
      }
      // if (refinedEvents.length > 3) {
      //   setTopEvents(refinedEvents.slice(0, 10));
      // }
      // setTopEvents(refinedEvents);
      if (more) {
        setTopEvents((prev) => {
          if (prev) return prev.concat(refinedEvents);
          else return refinedEvents;
        });
      } else {
        setTopEvents(refinedEvents);
      }
    } else {
      if (!customStatus) {
        setTopEvents(null);
      }
    }
    setIsLoading(false);
  }
  async function getMoreEvents() {
    if (startIndex + EVENTS_LEGNTH <= eventAmount) {
      setStartIndex((prev) => prev + EVENTS_LEGNTH);
      getEvents(false, startIndex + EVENTS_LEGNTH);
    }
  }
  function handleCChange(cc: string, value: string) {
    setCcVals((prev) => {
      return { ...prev, [cc]: value };
    });
  }
  function handleFilterChange(filter: string, value: string) {
    setFilters((prev) => {
      return { ...prev, [filter]: parseInt(value) };
    });
  }
  let refineEntries = async (entriesList: any) => {
    const userAcotr = makeUserActor({
      agentOptions: {
        identity,
      },
    });
    for (let entry = 0; entry < entriesList.length; entry++) {
      let newUser = null;
      var authorId = entriesList[entry][1].user.toString();
      entriesList[entry][1].userId = authorId;
      newUser = await userAcotr.get_user_details([authorId]);
      if (newUser.ok) {
        if (newUser.ok[1].profileImg.length != 0) {
          newUser.ok[1].profileImg = await getImage(
            newUser.ok[1].profileImg[0]
          );
        }
        entriesList[entry][1].user = newUser.ok[1];
      }
      entriesList[entry][1].image = await getImage(
        entriesList[entry][1].image[0]
      );
    }
    return entriesList;
  };
  let getArticles = async () => {
    let category = ['Event', 'Events'];

    const resp = await entryActor.getOnlyArticles(3, category);
    if (resp.length != 0) {
      let refined = await refineEntries(resp);
      setArticlesList(refined);
    } else {
      setArticlesList([]);
    }
  };
  
  let getPressRelease = async () => {
    let category = ['Event', 'Events'];
    const resp = await entryActor.getOnlyPressRelease(3, category);
    if (resp.length != 0) {
      let refined = await refineEntries(resp);
      setPressReleaseList(refined);
    } else {
      setPressReleaseList([]);
    }
    setarticleLoading(false);
  };
  const handleSearch = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e) {
      if (e.key === 'Enter') {
        setStartIndex(0);
        getEvents(false, 0);
      }
    } else {
      setStartIndex(0);
      getEvents(false, 0);
    }
  };
  function handleStatusChange(e: any) {
    let val = e.target.value;
    let trans = '';
    switch (val) {
      case 'all':
        trans = t('all events');
        break;
      case 'past':
        trans = t('past events');
        break;
      case 'ongoing':
        trans = t('ongoing events');
        break;
      case 'upcoming':
        trans = t('Upcoming event');
        break;
      default:
        trans = t('all events');
        break;
    }
    setTempStatus(trans);
    setStatus(val);
    setStartIndex(0);
  }
  useEffect(() => {
    getEvents();
  }, [status, ccVals, filters]);

  useEffect(() => {
    getEvents();
    setarticleLoading(true);
    getArticles();
    getPressRelease();
    getEvents(true, 0, 'upcoming');
  }, []);
  useEffect(() => {
    if (location.startsWith("/events") && !location.endsWith('/')) {
     router.push(`/events/`);
   }
     }, [])
  return (
    <>
      <main id='main'>
        <div className='main-inner event-detail-page'>
          <div className='inner-content'>
            <div className='event-innr gap-3'>
              <Col xl='12' lg='12' md='12' className="pt-2">
                <Breadcrumb className='new-breadcrumb web'>
                  <Breadcrumb.Item>
                    <Link href='/'>
                      <i className='fa fa-home' />
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active>
                    <Link
                      href='/'
                      style={{
                        pointerEvents: 'none',
                      }}
                    >
                      {t('Events')}
                    </Link>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col xl='12' lg='12' md='12'>
                <h1 className='blue-title'>
                {LANG === 'jp'
      ? '2025年・2026年に開催されるWeb3イベント'
      : 'Web3 Events Happening in 2025/2026'}
                </h1>
                {/* <p>{siteConfig.eventsPgDetail}</p> */}
               {/* <p
                  dangerouslySetInnerHTML={{
                    __html: siteConfig.eventsPgDetail,
                  }}
                />*/}

                <div className='spacer-10' />
              </Col>
             
              <Col xl='12' lg='12' md='12'>
                <div className='flex-div-xs pb-3 fs-14'>
                  <div  style={{border:'1px solid #a1a1a1', borderRadius: '8px', height: '35px', padding: '5px 0px 0px 5px', display: 'flex',alignItems: 'center' 
  }}  className='seelect'>
                    <Form.Select style={{ paddingTop: '10px'}}
                      aria-label='Default select example'
                      className='trans fw-normal'
                      value={status}
                      onChange={handleStatusChange}
                      defaultValue={'all'}
                    >
                      <option value='all'>{t('all events')}</option>
                      <option value='upcoming'>{t('Upcoming event')}</option>
                      <option value='past'>{t('past events')}</option>
                      <option value='ongoing'>{t('ongoing events')}</option>
                    </Form.Select>
                  </div>
                  <div>
                    <div className='d-flex ps-5 pt-3 p-sm-0 d-none d-sm-block'>
                      {/* <div className='search-pnl small'>
                        <input
                          type='text'
                          className='form-control'
                          placeholder='Search for Events'
                        />
                        <button>
                          <i className='fa fa-search'/>
                        </button>
                      </div> */}
                      <div className='search-pnl small  '>
                        <input
                          type='text'
                          className='form-control'
                          placeholder={t('Search for Events')}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          onKeyDown={handleSearch}
                        />
                        {search.length >= 1 && (
                          <button
                            onClick={() => {
                              setSearch('');
                              getEvents(true, 0);
                            }}
                          >
                            <i className='fa fa-xmark mx-1' />
                          </button>
                        )}
                        <button onClick={() => handleSearch()}>
                          <i className='fa fa-search' />
                        </button>
                      </div>

                      {/*<div className='dropdown grey'>
                        <Button onClick={() => handleSearch()}>
                          <i className='fa fa-sliders' /> {t('filter')}
                        </Button>
                      </div>*/}
                    </div>
                    <div className='spacer-10' />
                  </div>
                </div>
                <div>
                  <Row>
                    <Col className="d-none d-sm-block" xl='2' lg='3' md='3' sm='6'>
                      <div className='flex-div align-items-center '>
                        <span className="fs-14">
                          {t('Countries')}
                        </span>
                        {/*<Button
                          onClick={() => {
                            setCcVals((prev) => {
                              return { city: '', country: '' };
                            });
                          }}
                          className='red-link fs-14 fw-light'
                        >
                          {t('Clear')}
                        </Button>*/}
                      </div>
                      {/* <CountryDropdown
                      
                        value={ccVals.country}
                        defaultOptionLabel={t('Select Country')}
                        onChange={(e) => {
                          handleCChange('country', e);
                        }}
                        
                      /> */}

                      <select onChange={changeCountryHandler}>
                        <option value={''}>{t('Select Country')}</option>

                        {countryTranslations &&
                          countryTranslations.map((e: any, i: number) => {
                            return (
                              <option value={e.country} key={i}>
                                {LANG == 'en' ? e.country : e.label}
                              </option>
                            );
                          })}
                      </select>
                    </Col>

                    <Col className="d-none d-sm-block" xl='2' lg='3' md='3' sm='6'>
                      <div className='flex-div align-items-center'>
                      <span className="fs-14">
                         {t('Cities')}
                        </span>
                       {/* <Button
                          onClick={() => {
                            setCcVals((prev) => {
                              return { ...prev, city: '' };
                            });
                          }}
                          className='red-link text-decoration-no m-0'
                        >
                          {t('Clear')}
                        </Button>*/}
                      </div>
                      {/* <RegionDropdown
                        country={ccVals.country}
                        value={ccVals.city}
                        defaultOptionLabel={t('Select City')}
                        blankOptionLabel={t('Select City')}
                        disableWhenEmpty
                        onChange={(e) => {
                          handleCChange('city', e);
                        }}
                      /> */}
                      <select
                        disabled={ccVals.country == '' ? true : false}
                        onChange={(e: any) => {
                          handleCChange('city', e.target.value);
                        }}
                      >
                        <option value=''>{t('Select City')}</option>
                        {regions &&
                          regions.map((e: any, index: number) => {
                            return (
                              <option value={e.name} key={index}>
                                {LANG == 'en' ? e.name : e.label}
                              </option>
                            );
                          })}
                      </select>
                    </Col>
                    <Col className="d-none d-sm-block" xl='2' lg='3' md='3' sm='6'>
                      <div className='flex-div align-items-center'>
                      <span className="fs-14">
                         {t('Months')}
                        </span>
                        <Button
                          onClick={() => {
                            setFilters((prev) => {
                              return { ...prev, month: '' };
                            });
                          }}
                          className='red-link text-decoration-no fs-14 fw-light'
                        >
                          {t('Clear')}
                        </Button>
                      </div>
                      <Form.Select
                        value={filters.month}
                        onChange={(e) =>
                          handleFilterChange('month', e.target.value)
                        }
                        className='category-select'
                        name='category'
                        aria-label='Default select example'
                      >
                        <option value={''}>{t('All Months')}</option>
                        <option value={0}>{t('January')}</option>
                        <option value={1}>{t('February')}</option>
                        <option value={2}>{t('March')}</option>
                        <option value={3}>{t('April')}</option>
                        <option value={4}>{t('May')}</option>
                        <option value={5}>{t('June')}</option>
                        <option value={6}>{t('July')}</option>
                        <option value={7}>{t('August')}</option>
                        <option value={8}>{t('September')}</option>
                        <option value={9}>{t('October')}</option>
                        <option value={10}>{t('November')}</option>
                        <option value={11}>{t('December')}</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </div>
              
              </Col>
              <Col xl='12' lg='12'>
              <div className="event-list-main row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">

    <h4 className="mb-3 w-100 fs-14"><span>
    <i style={{ color: '#1e5fb3' }} className="fa fa-calendar"></i>{' '}
      {tempStatus.charAt(0).toUpperCase() + tempStatus.slice(1)}
    </span></h4>


  {!(topEvents && topEvents?.length > 0) && isLoading ? (
    <div className="d-flex justify-content-center my-4">
      <Spinner />
    </div>
  ) : topEvents && topEvents?.length > 0 ? (
    topEvents.map((event: ListEvent, index: number) => (
      <div className="col d-flex align-items-stretch" key={index}>
        <div className="card event-card shadow-sm d-flex flex-column w-100">
          
          {/* Event Image */}
          <div className="position-relative">
          <a href="/login/" className="star-icon">
  <FaRegStar style={{ color: "#fff", fontSize: "16px" }} />
</a>
            <Link href={event.isStatic ? `${Event_STATIC_PATH + event.id}` : `${Event_DINAMIC_PATH + event.id}`}>
              <Image
                src={event.image || "/default-event.jpg"}
                className="card-img-top event-image"
                alt={event.title}
                width={350}
                height={180}
                style={{ objectFit: "cover" }}
              />
            </Link>
            {event?.date && event?.endDate ? (
                (() => {
                    const parseJapaneseDate = (dateStr) => {
                        if (!dateStr) return moment();
                        return moment(
                            dateStr.replace(/年/g, '-').replace(/月/g, '-').replace(/日/g, ''),
                            'YYYY-MM-DD'
                        );
                    };

                    const startDate = LANG === 'jp' ? parseJapaneseDate(event?.date) : moment(event?.date);
                    const endDate = LANG === 'jp' ? parseJapaneseDate(event?.endDate) : moment(event?.endDate);
                    const now = moment();
                    if (now.isBefore(startDate)) {
                       return <span className="badge upcoming-badge ms-2 mt-2">  {LANG === 'jp' ? '今後の予定' : 'Upcoming'}</span>
                    } else if (now.isBetween(startDate, endDate, "day", "[]")) {
                      return <span className="badge ongoing-badge ms-2 mt-2">{LANG === 'jp' ? '進行中' : 'Ongoing'}</span>
                    } else if (now.isAfter(endDate)) {
                      return <span className="badge ended-badge ms-2 mt-2">{LANG === 'jp' ? '終了' : 'Ended'}</span>;
                  }
                    console.log("Parsed Start Date:", startDate.format());
                    console.log("Parsed End Date:", endDate.format());

                 
                })()
            ) : 'Date not available'}
          </div>

          {/* Event Content */}
          <div className="card-body d-flex flex-column">
    <h5 className="card-title">{event.title}</h5>

    {/* Date & Location Block with Borders */}
    <div className="event_date_price_block">
        <span className="fs-14 fw-semibold d-flex align-items-center">
        <i style={{ color: '#1e5fb3', fontSize: '15px' }} className="fa fa-calendar me-2"></i>
       
            {event?.date && event?.endDate ? (
                (() => {
                    const parseJapaneseDate = (dateStr) => {
                        if (!dateStr) return moment();
                        return moment(
                            dateStr.replace(/年/g, '-').replace(/月/g, '-').replace(/日/g, ''),
                            'YYYY-MM-DD'
                        );
                    };

                    const startDate = LANG === 'jp' ? parseJapaneseDate(event?.date) : moment(event?.date);
                    const endDate = LANG === 'jp' ? parseJapaneseDate(event?.endDate) : moment(event?.endDate);
                   
                    console.log("Parsed Start Date:", startDate.format());
                    console.log("Parsed End Date:", endDate.format());

                    if (startDate.isValid() && endDate.isValid()) {
                      return startDate.format(LANG === 'jp' ? 'YYYY年M月D日' : 'MMM D, YYYY') === 
                      endDate.format(LANG === 'jp' ? 'YYYY年M月D日' : 'MMM D, YYYY')
                   ? `${startDate.format(LANG === 'jp' ? 'YYYY年M月D日' : 'MMM D, YYYY')}`
                   : `${startDate.format(LANG === 'jp' ? 'YYYY年M月D日' : 'MMM D, YYYY')} - 
                      ${endDate.format(LANG === 'jp' ? 'YYYY年M月D日' : 'MMM D, YYYY')}`;
               
                    } else {
                        return 'Invalid Date';
                    }
                })()
            ) : 'Date not available'}
        </span>

        {/* Location Block with Proper Alignment */}
        <p className="fs-14 pt-2 d-flex align-items-start">
        <i style={{ color: '#1e5fb3', fontSize: '15px' }} className="me-2 fa fa-map-marker"></i>
    <span className="text-break">{event.eventLocation}</span>
</p>
    </div>
</div>

      


          {/* Event Actions */}
          <div className="card-footer bg-white border-top-0 mt-auto d-flex justify-content-between">

            <Link className="btn icon-color-blue btn-link text-decoration-none pb-3 ps-0 fs-14" href={event.isStatic ? `${Event_STATIC_PATH + event.id}` : `${Event_DINAMIC_PATH + event.id}`}>
              <i  style={{ color: '#1e5fb3' }} className="fa fa-info-circle me-1"></i>  {LANG === 'jp' ? 'イベントの詳細を見る' : 'View Event Details'}
            </Link>
            {/*<button className="btn btn-light btn-sm">
              <i className="fa fa-share"></i> {t('Share')}
            </button>*/}
          </div>

        </div>
      </div>
    ))
  ) : (
    <p className="text-center fs-14">{t('No Events Found')}</p>
  )}
</div>


              </Col>

              <Col xl='12' lg='12'>
                <div className='spacer-20' />
                <div className='text-center'>
                  {moreEvents && (
                    <Button
                      onClick={getMoreEvents}
                      className='reg-btn yellow auto'
                    >
                      {t('Load More')}
                    </Button>
                  )}
                </div>
              </Col>
              <Col xl='12' lg='12' md='12'>
                {previewEvents && (
                  <div className='eventlist-header pt-5'>
                    {previewEvents?.length > 0 && (
                      <>
                        {/* <div className='img-pnl'>
                          <Link
                            className='img-parent max'
                            style={{
                              aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT,
                            }}
                            href={
                              previewEvents[0].isStatic
                                ? `${Event_STATIC_PATH + previewEvents[0].id}`
                                : `/event-details?eventId=${previewEvents[0].id}`
                            }
                          >
                            <Image
                              src={previewEvents[0].image}
                              fill
                              alt='Post'
                            />
                          </Link>
                        </div>
                        <div className='txt-pnl'>
                          <h4>{previewEvents[0]?.title}</h4>
                          <div>
                            <Link
                              href={
                                previewEvents[0].isStatic
                                  ? `${Event_STATIC_PATH + previewEvents[0].id}`
                                  : `/event-details?eventId=${previewEvents[0].id}`
                              }
                              className='reg-btn white mx-2'
                            >
                              <i className='fa fa-info-circle'/>{' '}
                              {t('Learn More')}
                            </Link>
                            <Link
                              href={previewEvents[0].website}
                              target='_blank'
                              className='reg-btn yellow'
                            >
                              {t('Visit Website')}
                            </Link>
                          </div>
                        </div> */}
                        <TopEventSlider eventList={previewEvents} />
                      </>
                    )}
                    {/* {previewEvents.length > 1 ? (
                      <ul className='my-2 gap-2'>
                        {previewEvents.length > 4
                          ? previewEvents.slice(1, 4).map((event) => (
                              <li key={event.id}>
                                <Link
                                  href={
                                    previewEvents[0].isStatic
                                      ? `${
                                          Event_STATIC_PATH +
                                          previewEvents[0].id 
                                        }`
                                      : `${Event_DINAMIC_PATH+event.id}`
                                  }
                                  className='img-parent'
                                  style={{
                                    aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT,
                                  }}
                                >
                                  <Image fill src={event.image} alt='Bg' />
                                </Link>
                              </li>
                            ))
                          : previewEvents.map((event, index) => {
                              if (index == 0) return null;
                              return (
                                <li key={event.id} className='w-100'>
                                  <Link
                                    href={
                                      previewEvents[0].isStatic
                                        ? `${
                                            Event_STATIC_PATH +
                                            previewEvents[0].id
                                          }`
                                        : `${Event_DINAMIC_PATH+event.id}`
                                    }
                                    style={{
                                      aspectRatio:
                                        ARTICLE_FEATURED_IMAGE_ASPECT,
                                    }}
                                    className='img-parent'
                                  >
                                    <Image fill src={event.image} alt='Bg' />
                                  </Link>
                                </li>
                              );
                            })}
                      </ul>
                    ) : null} */}
                    {/* <ul>
                     
                      <li>
                        <Image src={bg} alt='Bg' />
                      </li>
                      <li>
                        <Image src={bg} alt='Bg' />
                      </li>
                      <li>
                        <Image src={bg} alt='Bg' />
                      </li>
                    </ul> */}
                  </div>
                )}
              </Col>
              <Row>
                <Col xl='12' lg='12'>
                  <div className='spacer-20' />

                  <h4>
                    {' '}
                    <Image src={iconevent} alt='Post' />
                    {t('Event News and Press Release')}
                  </h4>

                  <div className='spacer-20' />
                </Col>
              </Row>
              <div className='press-release-post-container mob-maring-cent'>
                <Row>
                  {articleLoading && (
                    <div className='d-flex justify-content-center'>
                      {' '}
                      <Spinner />
                    </div>
                  )}
                  {articlesList.length != 0 &&
                    articlesList.map((item: any, index: number) => {
                      return (
                        <Col xl='4' lg='6' md='6' key={index}>
                          <div className='Featured-Post max  auto'>
                            <div
                              className='Featured-Post-inner'
                              style={{ height: '340px' }}
                            >
                              <div className='img-pnl new d-flex align-items-center bg-dark'>
                                <Link
                                  href={
                                    item[1].isStatic
                                      ? `${ARTICLE_STATIC_PATH + item[0].id}`
                                      : `/article?articleId=${item[0]}`
                                  }
                                  style={{
                                    aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT,
                                    position: 'relative',
                                  }}
                                >
                                  <Image
                                    src={
                                      item[1].image ? item[1].image : smallpost1
                                    }
                                    alt='Post'
                                    fill
                                  />
                                  <h2 />
                                </Link>
                              </div>
                              <div className='txt-pnl'>
                                <h5 style={{ overflow: 'visible' }}>
                                  {item[1].title}
                                </h5>
                                <p className='d-flex'>
                                  <span>
                                    {/* <Image src={logo} alt='Blockza' /> */}
                                    <Link
                                      href={`/profile?userId=${item[0]}`}
                                      className='mylink'
                                    >
                                      <Image
                                        src={
                                          item[1].user.profileImg.length != 0
                                            ? item[1].user.profileImg
                                            : logo
                                        }
                                        alt='Blockza'
                                        className='myimg'
                                        height={100}
                                        width={100}
                                      />
                                    </Link>
                                  </span>{' '}
                                  {t('News')}
                                  {t('By')}{' '}
                                  <b>
                                    <Link
                                      href={`/profile?userId=${item[1].userId}`}
                                      className='mylink'
                                      style={{ fontSize: '14px' }}
                                    >
                                      {item[1].user.name}
                                    </Link>
                                  </b>
                                </p>
                                <div className='d-flex justify-content-center'>
                                  <Link
                                    href={
                                      item[1].isStatic
                                        ? `${ARTICLE_STATIC_PATH + item[0].id}`
                                        : `/article?articleId=${item[0]}`
                                    }
                                    style={{ width: '270px' }}
                                  >
                                    {t('Read More')}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                </Row>
              </div>
              <div className='press-release-post-container mob-maring-cent'>
                <Row>
                  {pressReleaseList.length != 0 &&
                    pressReleaseList.map((item: any, index: number) => {
                      return (
                        <Col xl='4' lg='6' md='6' key={index}>
                          <div className='Featured-Post max  auto'>
                            <div
                              className='Featured-Post-inner'
                              style={{ height: '340px' }}
                            >
                              <div className='img-pnl new d-flex align-items-center bg-dark'>
                                <Link
                                  href={
                                    item[1].isStatic
                                      ? `${ARTICLE_STATIC_PATH + item[0].id}`
                                      : `/article?articleId=${item[0]}`
                                  }
                                  style={{
                                    aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT,
                                    position: 'relative',
                                  }}
                                >
                                  <Image
                                    src={
                                      item[1].image ? item[1].image : smallpost1
                                    }
                                    alt='Post'
                                    fill
                                  />
                                  <h2> {t('Press Release')}</h2>
                                </Link>
                              </div>
                              <div className='txt-pnl'>
                                <h5 style={{ overflow: 'visible' }}>
                                  {item[1].title}
                                </h5>
                                <p className='d-flex'>
                                  <span>
                                    {/* <Image src={logo} alt='Blockza' /> */}
                                    <Link
                                      href={`/profile?userId=${item[0]}`}
                                      className='mylink'
                                    >
                                      <Image
                                        src={
                                          item[1].user.profileImg.length != 0
                                            ? item[1].user.profileImg
                                            : logo
                                        }
                                        alt='Blockza'
                                        className='myimg'
                                        height={100}
                                        width={100}
                                      />
                                    </Link>
                                  </span>{' '}
                                  {t('Press Release by')}{' '}
                                  <b>
                                    <Link
                                      href={`/profile?userId=${item[1].userId}`}
                                      className='mylink'
                                    >
                                      {item[1].user.name}
                                    </Link>
                                  </b>
                                </p>
                                <div className='d-flex justify-content-center'>
                                  <Link
                                    href={
                                      item[1].isStatic
                                        ? `${ARTICLE_STATIC_PATH + item[0].id}`
                                        : `/article?articleId=${item[0]}`
                                    }
                                    style={{ width: '270px' }}
                                  >
                                    {t('Read More')}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                </Row>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
