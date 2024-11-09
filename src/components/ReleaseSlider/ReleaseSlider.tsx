import React, { useEffect, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import post1 from '@/assets/Img/Posts/Post-1.png';
import post2 from '@/assets/Img/Posts/Post-2.png';
import logo from '@/assets/Img/Logo/Footer-logo.png';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import { Spinner } from 'react-bootstrap';
import { ARTICLE_FEATURED_IMAGE_ASPECT } from '@/constant/sizes';
import { fromNullable } from '@dfinity/utils';
import { utcToLocal } from '@/components/utils/utcToLocal';
import { Date_m_d_y_h_m } from '@/constant/DateFormates';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { ARTICLE_DINAMIC_PATH, ARTICLE_STATIC_PATH } from '@/constant/routes';
export default function ReleaseSlider({
  catagory,
  isHome,
}: {
  catagory?: string;
  isHome?: boolean;
}) {
  let [promotedArticle, setPromotedArticle] = useState([]);
  let [isloaded, setIsloaded] = useState(true);
  let [categoryName, setCategoryName] = useState<any>(null);

  const { auth, setAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
    identity: state.identity,
  }));
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const userActor = makeUserActor({
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
        breakpoint: 1450,
        settings: {
          slidesToShow: isHome ? 2 : 2,
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

  async function getPressReleaseEntries(catagory: string) {
    try {
      let tempList = await entryActor.getPressEntries(catagory);
      let entrylist = tempList.slice(0, 10);
      if (entrylist.length !== 0) {
        await Promise.all(
          entrylist.map(async (entry: any, index: any) => {
            let id = entry[1].user.toString();
            entry[1].creation_time = utcToLocal(
              entry[1].creation_time,
              Date_m_d_y_h_m
            );
            let newUser = await userActor.get_user_details([id]);
            if (newUser.ok) {
              if (newUser.ok[1].profileImg.length != 0) {
                const tempImg = await getImage(newUser.ok[1].profileImg[0]);
                entry[1].userImg = tempImg;
              }

              entry[1].userName = newUser.ok[1].name;
            }
            let articalimg = await getImage(entry[1].image[0]);
            entry[1].image = articalimg;
          })
        );

        setPromotedArticle(entrylist);
        const timer = setTimeout(() => {
          setIsloaded(false);
        }, 2000);

        return () => clearTimeout(timer);
      } else {
        setIsloaded(false);
      }
    } catch (error) {}
  }
  async function categoryNamefn(cat: string) {
    let resp = await entryActor.get_category(cat);
    let resCategory: any = fromNullable(resp);
    let categoryName = null;
    if (resCategory) {
      categoryName = resCategory.name;
    }
    setCategoryName(categoryName);
  }
  useEffect(() => {
    if (catagory && catagory != '') {
      getPressReleaseEntries(catagory);
      categoryNamefn(catagory);
    } else {
      getPressReleaseEntries('All');
    }
  }, [catagory]);
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <>
      {isloaded && (
        <div className='d-flex justify-content-center'>
          <Spinner animation='border' />
        </div>
      )}
      {promotedArticle.length == 0 && !isloaded && (
        <div className='d-flex justify-content-center'>
          <p>
            {t('No Press Release found')}{' '}
            {categoryName ? `${t('ON')} ${categoryName} ${t('Category')}` : ''}
          </p>
        </div>
      )}

      {promotedArticle.length != 0 && (
        <Slider
          {...Featued}
          lazyLoad='anticipated'
          className={`${isloaded ? 'd-none' : ''}`}
        >
          {promotedArticle.map((entry: any, index) => {
            return (
              <div className='Post-padding' key={index}>
                <div className={`Featured-Post press ${isHome ? '' : 'max'}`}>
                  <div
                    className='Featured-Post-inner'
                    style={{ height: '340px' }}
                  >
                    <div
                      className='img-pnl new d-flex align-items-center bg-dark'
                      // style={{ height: '192px' }}
                      style={{
                        aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT,
                      }}
                    >
                      <Link
                        href={
                          entry[1].isStatic
                            ? `${ARTICLE_STATIC_PATH + entry[0]}`
                            : `${ARTICLE_DINAMIC_PATH + entry[0]}`
                        }
                      >
                        <Image
                          src={entry[1].image ? entry[1].image : post1}
                          alt='Post'
                          // height={100}
                          // width={100}
                          fill
                        />
                        <h2>{t('Press Release')}</h2>
                      </Link>
                    </div>
                    <div className='txt-pnl'>
                      <span className='mobile-view-display red-span'>
                        {t('Latest')} {t('Press Release')}
                      </span>
                      <h5>
                        {entry[1]?.title.length > 50
                          ? `${entry[1]?.title.slice(0, 50)}...`
                          : entry[1]?.title}
                      </h5>
                      <p className='d-flex web-view-display'>
                        <span>
                          <Link
                            href={`/profile?userId=${entry[1].user.toString()}`}
                            className='mylink'
                          >
                            <Image
                              src={entry[1].userImg ? entry[1].userImg : logo}
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
                            href={`/profile?userId=${entry[1].user.toString()}`}
                            className='mylink'
                          >
                            {entry[1]?.userName}
                          </Link>
                        </b>
                      </p>
                      <p className='mobile-view-display'>
                        {entry[1].creation_time}
                      </p>
                      <div className='d-flex justify-content-center'>
                        <Link
                          href={
                            entry[1].isStatic
                              ? `${ARTICLE_STATIC_PATH + entry[0]}`
                              : `${ARTICLE_DINAMIC_PATH + entry[0]}`
                          }
                          style={{ width: '270px' }}
                        >
                          {t('Read More')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      )}
    </>
  );
}
