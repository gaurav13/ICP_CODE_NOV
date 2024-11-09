import React, { useEffect, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import post1 from '@/assets/Img/Posts/Post-1.png';
import post2 from '@/assets/Img/Posts/Post-2.png';
import logo from '@/assets/Img/Logo/Footer-logo.png';
import box from '@/assets/Img/Icons/icon-giftbox.png';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { Date_m_d_y_h_m } from '@/constant/DateFormates';
import { utcToLocal } from '@/components/utils/utcToLocal';
import { getImage, iframeimgThumbnail } from '@/components/utils/getImage';
import logger from '@/lib/logger';
import { sliceString } from '@/constant/helperfuntions';
import {
  ARTICLE_DINAMIC_PATH,
  ARTICLE_STATIC_PATH,
  Podcast_DINAMIC_PATH,
  Podcast_STATIC_PATH,
} from '@/constant/routes';
export default function FeaturedSlider({ isHome }: { isHome?: boolean }) {
  let [featuredCampaign, setFeaturedCampaign] = useState<any>(null);
  let [isloaded, setIsloaded] = useState(true);
  let [categoryName, setCategoryName] = useState<any>(null);

  const { identity } = useConnectPlugWalletStore((state) => ({
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
    dots: null,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 3000,
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
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
    ],
  };
  const { t, changeLocale } = useLocalization(LANG);

  async function getFeaturedCampaign() {
    try {
      let entrylist = await entryActor.getFeaturedEntriesList('', 0, 10);
      let entries = entrylist.entries;
      if (entries.length !== 0) {
        await Promise.all(
          entries.map(async (entry: any, index: any) => {
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
              } else {
                entry[1].userImg = null;
              }

              entry[1].userName = newUser.ok[1].name[0];
            }
            let image = null;
            if (entry[1].image) {
              image = getImage(entry[1].image[0]);
            }
            if (entry[1].podcastImg.length != 0) {
              image = getImage(entry[1].podcastImg[0]);
            }
            if (entry[1].podcastVideoLink != '') {
              image = iframeimgThumbnail(entry[1].podcastVideoLink);
            }
            entry[1].image = image;
          })
        );
        setIsloaded(false);
        setFeaturedCampaign(entries);
      } else {
        setIsloaded(false);
        setFeaturedCampaign(null);
      }
    } catch (error) {
      setIsloaded(false);
      setFeaturedCampaign(null);
    }
  }

  useEffect(() => {
    getFeaturedCampaign();
  }, []);
  return (
    <>
      {featuredCampaign && featuredCampaign?.length != 0 && (
        <Slider {...Featued}>
          {featuredCampaign.map((item: any, index: number) => {
            let entry = item[1];
            return (
              <div className='Post-padding' key={index}>
                <div className='Featured-Post'>
                  <div className='Featured-Post-inner'>
                    <Link
                      href={
                        entry?.isPodcast
                          ? entry.isStatic
                            ? `${Podcast_STATIC_PATH + item[0]}`
                            : `${Podcast_DINAMIC_PATH + item[0]}`
                          : entry.isStatic
                          ? `${ARTICLE_STATIC_PATH + item[0]}`
                          : `${ARTICLE_DINAMIC_PATH + item[0]}`
                      }
                      className='img-pnl'
                    >
                      <Image src={entry.image} fill alt='Post' />
                    </Link>
                    <div className='txt-pnl'>
                      <h5>{sliceString(entry?.title, 0, 50)}</h5>
                      <p>
                        <span>
                          <Image
                            src={entry?.userImg ? entry?.userImg : logo}
                            alt='Blockza'
                            height={20}
                            width={20}
                            className='borderRadius10'
                          />
                        </span>{' '}
                        {entry?.userName}
                      </p>
                      <Link
                        href={
                          entry?.isPodcast
                            ? entry.isStatic
                              ? `${Podcast_STATIC_PATH + item[0]}`
                              : `${Podcast_DINAMIC_PATH + item[0]}`
                            : entry.isStatic
                            ? `${ARTICLE_STATIC_PATH + item[0]}`
                            : `${ARTICLE_DINAMIC_PATH + item[0]}`
                        }
                      >
                        {t('Read More')}
                      </Link>
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
