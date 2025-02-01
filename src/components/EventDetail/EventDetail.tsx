'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Breadcrumb, Dropdown, Spinner, Form } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Calander from '@/assets/Img/Icons/icon-calender.png';
import GiftBox from '@/assets/Img/Icons/icon-gift-box.png';
import bg from '@/assets/Img/bg.jpg';
import EventSlider from '@/components/EventSlider/EventSlider';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import post1 from '@/assets/Img/placeholder-img.jpg';
import { utcToLocal } from '@/components/utils/utcToLocal';
import parse from 'html-react-parser';
import { ARTICLE_FEATURED_IMAGE_ASPECT } from '@/constant/sizes';
import { TopEvent } from '@/types/article';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import Tippy from '@tippyjs/react';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import "../../styles/event-detail.css";
import { FaMapMarkerAlt,FaWhatsapp,FaShareAlt, FaRegStar,FaEnvelope, FaCopy, FaCalendarAlt, FaTags, FaExternalLinkAlt, FaApple, FaGoogle, FaFacebook, FaInstagram, FaLinkedin, FaTelegram, FaTwitter } from 'react-icons/fa';

import MyComponent from '@/components/testingMap/MapTesting';
import { EVENT_DYNAMIC_PATH_2, Event_STATIC_PATH, EVENT_TAG_CONTENT_ROUTE, EVENTS, GOOGLEMAP_URL, TAG_CONTENT_ROUTE } from '@/constant/routes';
import moment from 'moment';
export default function EventDetails({ eventId }: { eventId: string }) {
  const { t, changeLocale } = useLocalization(LANG);
  const { auth, setAuth, identity, articleHeadingsHierarchy } =
    useConnectPlugWalletStore((state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      articleHeadingsHierarchy: state.articleHeadingsHierarchy,
    }));
    
  let [event, setEvent] = useState<any>(null);
  const urlparama = useSearchParamsHook();
  const router = useRouter();
  const location = usePathname();

  const [isLoading, setIsLoading] = useState(false);
  const [topEvents, setTopEvents] = useState<null | TopEvent[]>();
  const [search, setSearch] = useState('');
  const getEvent = async () => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    if (eventId) {
      const tempEntry = await entryActor.get_event(eventId);

      if (tempEntry.length != 0) {
        if (
           EVENT_DYNAMIC_PATH_2.startsWith(location)  &&
          tempEntry[0] &&
          tempEntry[0].isStatic
        ) {
          return router.push(Event_STATIC_PATH + eventId+"/");
        }
        tempEntry[0].image = await getImage(tempEntry[0].image);
        tempEntry[0].date = utcToLocal(
          tempEntry[0].date.toString(),
          'MMM D, YYYY'
        );
        tempEntry[0].endDate = utcToLocal(
          tempEntry[0].endDate.toString(),
          'MMM D, YYYY'
        );
        setEvent(tempEntry[0]);
      }
    }
  };
  async function getEvents(reset?: boolean) {
    let searched = reset ? '' : search;
    let tags = "";

    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const resp = await entryActor.get_events(searched, 0, 6, [], [], [],tags);
    setIsLoading(true);
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
      if (refinedEvents.length > 6) {
        setTopEvents(refinedEvents.slice(0, 6));
      } else {
        setTopEvents(refinedEvents);
      }
      setTopEvents(refinedEvents);
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
  const [currentUrl, setCurrentUrl] = useState('');
  useEffect(() => {
    // Use the existing logic for path
    if (typeof window !== 'undefined') {
      const location = window.location.pathname;
      if (location.startsWith(Event_STATIC_PATH) && !location.endsWith('/')) {
        setCurrentUrl(`${window.location.origin}${Event_STATIC_PATH}${eventId}/`);
      } else {
        setCurrentUrl(`${window.location.origin}${location}`);
      }
    }
  }, [eventId]);

  const [showModal, setShowModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    });
  };


  
  useEffect(() => {
    getEvents();
  }, []);
  useEffect(() => {
    if (auth.state == 'anonymous' || auth.state === 'initialized') getEvent();
  }, [eventId, auth]);
  let openMapFn = (id: string) => {
    let link = GOOGLEMAP_URL + id;
    window.open(link);
  };
  useEffect(() => {
    console.log("Event details:", event);

  }, [event]);

  useEffect(() => {
    if (location.startsWith(Event_STATIC_PATH) && !location.endsWith('/')) {
     router.push(`${Event_STATIC_PATH + eventId}/`);
   }
     }, [])
     const CountdownTimer = ({ eventDate }: { eventDate: string }) => {
      // Function to convert Japanese date format to ISO format
      const parseDate = (dateString: string) => {
        if (LANG === 'jp') {
          // Convert "2025年4月16日" to "2025-04-16"
          const formattedDate = dateString
            .replace(/年/g, '-') // Replace 年 with -
            .replace(/月/g, '-') // Replace 月 with -
            .replace(/日/g, ''); // Remove 日
          return new Date(formattedDate);
        }
        return new Date(dateString); // Use standard parsing for English dates
      };
    
      const calculateTimeLeft = () => {
        const eventTime = parseDate(eventDate).getTime();
        const now = new Date().getTime();
        const difference = eventTime - now;
    
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      };
    
      const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    
      useEffect(() => {
        const timer = setInterval(() => {
          setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
      }, [eventDate]);
    
      return (
        <div className="countdown-timer bg-light rounded p-3 mb-4">
          <div className="d-flex align-items-center mb-3">
            <FaCalendarAlt className="fs-5 me-2" />
            <h5 className="m-0">
              {LANG === 'jp' ? 'イベント開始まで' : 'Event Starts in'}
            </h5>
          </div>
          <div className="d-flex justify-content-between">
            <div className="text-center">
              <h4 className="m-0 fw-bold">{timeLeft.days}</h4>
              <span>{LANG === 'jp' ? '日' : 'Days'}</span>
            </div>
            <div className="text-center">
              <h4 className="m-0 fw-bold">{timeLeft.hours}</h4>
              <span>{LANG === 'jp' ? '時間' : 'Hrs'}</span>
            </div>
            <div className="text-center">
              <h4 className="m-0 fw-bold">{timeLeft.minutes}</h4>
              <span>{LANG === 'jp' ? '分' : 'Mins'}</span>
            </div>
            <div className="text-center">
              <h4 className="m-0 fw-bold">{timeLeft.seconds}</h4>
              <span>{LANG === 'jp' ? '秒' : 'Secs'}</span>
            </div>
          </div>
        </div>
      );
    };
    
    const [organization, setOrganization] = useState<any>(null);
    const fetchOrganizationDetails = async () => {
      if (!event?.organiser) {
        console.log("Organizer ID is not available.");
        return;
      }
    
      try {
        console.log("Fetching organization details for ID:", event?.organiser);
    
        // Create an actor instance to call the backend
        const entryActor = makeEntryActor({
          agentOptions: {
            identity, // Pass the user's identity
          },
        });
    
        // Call the `getWeb3` method with the organizer ID
        const organizationData = await entryActor.getWeb3(event?.organiser);
    
        if (organizationData && organizationData.length > 0) {
          console.log("Organization data fetched successfully:", organizationData);
    
          // Process organization details
          const orgDetails = organizationData[0];
          orgDetails.logo = await getImage(orgDetails.logo);
          orgDetails.banner = await getImage(orgDetails.banner);
    
          // Fetch category ID and category name
          if (orgDetails.category && orgDetails.category.length > 0) {
            const categoryId = event.category[0]; // Get the first category ID
            const categoryName = await entryActor.getCategory(categoryId);
            console.log("cat:", categoryName);
            orgDetails.categoryName = categoryName || "No category"; // Add category name
          } else {
            orgDetails.categoryName = "No category"; // Default if no category ID
          }
    
          setOrganization(orgDetails); // Save the organization details in state
          console.log("Processed Organization Details:", orgDetails); // Debugging
        } else {
          console.log("No organization data found for ID:", event?.organiser);
        }
      } catch (error) {
        console.error("Error fetching organization details:", error);
      }
    };
    
    useEffect(() => {
      if (event?.organiser) {
        fetchOrganizationDetails();
      }
    }, [event?.organiser]);
    

  return (
    <>
      <main id='main'>
        <ins
          className='adsbygoogle'
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-layout='in-article'
          data-ad-format='fluid'
          data-ad-client='ca-pub-8110270797239445'
          data-ad-slot='3863906898'
        />

        <div className='main-inner event-detail-page'>
          <div className='inner-content'>
            <Row>
              <Col xl='12' lg='12' md='12'>
                <Breadcrumb className='new-breadcrumb web'>
                  <Breadcrumb.Item>
                    <Link href='/'>
                      <i className='fa fa-home' />
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active>
                    <Link href={EVENTS}>{t('Events')}</Link>
                  </Breadcrumb.Item>
                  {event && (
                    <Breadcrumb.Item active>
                      <Tippy
                        content={event.title.length != 0 ? event.title : ''}
                      >
                        <Link
                          href='/'
                          style={{
                            pointerEvents: 'none',
                          }}
                        >
                          {event.title.length > 8
                            ? `${event.title.slice(0, 8).trim()}` + '...'
                            : event.title}
                        </Link>
                      </Tippy>
                    </Breadcrumb.Item>
                  )}
                </Breadcrumb>
              </Col>
            
            </Row>


            {event ? (
                    <div className="container">
                   
                   
      <Row>
        {/* Left Section */}
        <Col lg={8} md={12}>
        <div className='share-event'>
            <div className="top-0 end-0 d-flex gap-2 float-end">
      <button onClick={toggleModal} className="btn btn-light d-flex align-items-center gap-2 border rounded shadow-sm">
        <FaShareAlt className="text-primary" />
        <span className="text-primary"> {LANG === 'jp' ? '共有する' : 'Share'}</span>
    
      </button>
      <a href="/login/"><button className="btn btn-light d-flex align-items-center gap-2 border rounded shadow-sm">
        <FaRegStar className="text-muted" />
     <span className="text-muted">{LANG === 'jp' ? 'ウォッチリスト' : 'Watchlists'}</span>
      </button> </a></div>
      {showModal && (
        <div className="share-modal">
          <div className="modal-content">
            <button onClick={toggleModal} className="close-button">
              &times;
            </button>
            <h4 className="mb-3">Share Event</h4>
            <div className="d-flex justify-content-between mb-3">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className="fs-4 text-primary" />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="fs-4 text-primary" />
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="fs-4 text-success" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="fs-4 text-primary" />
              </a>
              <a href={`mailto:?body=${encodeURIComponent(currentUrl)}`}>
                <FaEnvelope className="fs-4 text-danger" />
              </a>
            </div>
            <div className="copy-section">
              <input
                type="text"
                value={currentUrl}
                readOnly
                className="form-control mb-2"
              />
              <button onClick={handleCopy} className="btn btn-outline-secondary">
                <FaCopy /> {copySuccess ? 'Copied!' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
      </div><br /><br />
          <div className="event-header">
            <h1>{event?.title || 'Event Title'}</h1>
            <div className="mt-3">
              <p>
                <FaMapMarkerAlt className="text-primary" /> {event?.location || 'Location Details'}{' '}
                <Link href="#">
                  <FaExternalLinkAlt className="text-secondary ms-1" />
                </Link>
              </p>
              <p>
              <span className="small-text fw-semibold">
  <FaCalendarAlt style={{ color: '#1e5fb3' }} className="text-primary me-1" />

  {event?.date && event?.endDate ? (
    (() => {
      
      const parseJapaneseDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return moment(); // Fallback to current date
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
          ? `${startDate.format(LANG === 'jp' ? 'YYYY年M月D日' : 'MMM D, YYYY')} 
             (${startDate.format('hh:mm A')} - ${endDate.format('hh:mm A')})`
          : `${startDate.format(LANG === 'jp' ? 'YYYY年M月D日' : 'MMM D, YYYY')} - 
             ${endDate.format(LANG === 'jp' ? 'YYYY年M月D日' : 'MMM D, YYYY')} 
             (${startDate.format('hh:mm A')} - ${endDate.format('hh:mm A')})`;
      } else {
        return '';
      }
    })()
  ) : 'Date not available'}
</span>        
                {/*<Link href="#">
                  Add to your calendar
                </Link>*/}
              </p>
              <p>
                <FaTags className="text-primary" /> {' '}
                <Link href={event?.website || '#'}>Visit Website</Link>
              </p>
            </div>
          </div>

          <div className="mt-3 bg-light rounded p-3 d-flex align-items-center justify-content-between">
            <div>
              <h6 className="mb-1 fw-bold">{LANG === 'jp'
    ? 'ようこそ！イベントに参加するには、登録してください'
    : 'Welcome! To join the event, please register'}</h6>
              <p className="mb-0 text-muted"> {LANG === 'jp'
      ? '登録すると、確認メールが送信されます'
      : 'Register and confirmation will be sent on your mail'}</p>
            </div>
            <a href={event?.applyTicket || '#'} className="btn btn-primary">
            {LANG === 'jp' ? '登録' : 'Register'}
            </a>
          </div>

          <div className="mt-4">
            <Image
              src={event?.image || '/default-banner.jpg'}
              alt="Event Banner"
              width={800}
              height={400}
              className="rounded"
            />
          </div>

          <div className="mt-4 p-3 border rounded bg-white shadow-sm">
            <h3>{LANG === 'jp' ? 'イベントの説明' : 'Event Description'}</h3>
            <p>{parse(event.description) || 'No description available.'}</p>
          </div>
        </Col>

        {/* Right Section */}
        <Col lg={4} md={12} style={{ height: "max-content" }} className="p-3 border rounded bg-white shadow-sm">
        {(() => {
  // ✅ Function to properly parse Japanese dates
  const parseJapaneseDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return null; // Return null if date is not available
    return moment(dateStr.replace(/年/g, '-').replace(/月/g, '-').replace(/日/g, ''), 'YYYY-MM-DD');
  };

  
  const parsedEndDate = LANG === 'jp' ? parseJapaneseDate(event?.endDate) : moment(event?.endDate);

  console.log("Parsed End Date:", parsedEndDate?.format()); // Debugging

 
  if (parsedEndDate?.isValid() && parsedEndDate.isBefore(moment())) {
    return (
      <span style={{ color: 'red', fontWeight: 'bold' }}>
        {LANG === 'jp' ? 'イベント終了日' : 'Event ended on'}: {parsedEndDate.format(LANG === 'jp' ? 'YYYY年M月D日' : 'MMM D, YYYY')}
      </span>
    );
  } else {
    
    return <CountdownTimer eventDate={event?.endDate || ''} />;
  }
})()}


          {organization?.company && (
  <>
    <h3> {LANG === 'jp' ? '主催者' : 'Organized By'}</h3>
    <p>
       <a href={`/directory/${event?.organiser}/`}>
    <strong>{organization.company}</strong>
  </a>
    </p>
  </>
)}

          <p></p>
         {/* <hr className="my-3" />
          <h3>Tags</h3>
          <div className="d-flex flex-wrap gap-2">
          {event?.tags?.map((tag: string, index: number) => (
          <span key={index} className="badge bg-light text-dark">#{tag}</span>
        ))}
          </div>*/}
          <hr className="my-3" />
          <h3>{LANG === 'jp' ? '場所' : 'Location'}</h3>
          <p>{event?.location || 'Location Details'}</p>

          <div className="mt-3">
  <iframe
    src={`https://www.google.com/maps?q=${encodeURIComponent(event?.location || 'Location Details')}&output=embed`}
    height="200"
    style={{ border: '0', width: '100%' }}
    loading="lazy"
    allowFullScreen
  />
</div>


          <h4 className="mt-3">{LANG === 'jp' ? 'ソーシャルリンク' : 'Social Links'}</h4>
          <div className="d-flex align-items-center gap-3">
            {event?.facebook && (
              <Link href={event.facebook} target="_blank">
                <FaFacebook className="text-primary fs-4" />
              </Link>
            )}
            {event?.instagram && (
              <Link href={event.instagram} target="_blank">
                <FaInstagram className="text-danger fs-4" />
              </Link>
            )}
            {event?.linkedin && (
              <Link href={event.linkedin} target="_blank">
                <FaLinkedin className="text-info fs-4" />
              </Link>
            )}
            {event?.telegram && (
              <Link href={event.telegram} target="_blank">
                <FaTelegram className="text-primary fs-4" />
              </Link>
            )}
            {event?.twitter && (
              <Link href={event.twitter} target="_blank">
                <FaTwitter className="text-primary fs-4" />
              </Link>
            )}
          </div>

         
          
          
        </Col>
      </Row>
      <Row>
      <Col xl='12' lg='12' md='12' className='pt-5'>
                <div className='event-innr'>
                  <EventSlider eventList={topEvents} />
                </div>
              </Col>
              </Row>

                  </div>
            ) : (
              <div className='d-flex justify-content-center mt-5'>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
