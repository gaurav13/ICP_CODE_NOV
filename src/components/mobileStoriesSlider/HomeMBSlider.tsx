import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import iconthumb from '@/assets/Img/Icons/icon-thumb.png';
import iconmessage from '@/assets/Img/Icons/icon-comment.png';
import { Col } from 'react-bootstrap';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeCommentActor, makeEntryActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import parse from 'html-react-parser';
import { formatLikesCount, utcToLocal } from '@/components/utils/utcToLocal';
import { getImageById } from '@/components/utils/getImage';
import { ARTICLE_FEATURED_IMAGE_ASPECT } from '@/constant/sizes';
import Slider from 'react-slick';
import { Date_m_d_y_h_m } from '@/constant/DateFormates';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { ARTICLE_DINAMIC_PATH, ARTICLE_STATIC_PATH } from '@/constant/routes';

export default function HomeMBSlider({ isArticle }: { isArticle: boolean }) {
  let [entries, setEntries] = useState<any>([]);

  const { auth, setAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
    identity: state.identity,
  }));
  const entryActorDefault = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const commentsActor = makeCommentActor({
    agentOptions: {
      identity,
    },
  });
  const { t, changeLocale } = useLocalization(LANG);
  let getTrendingAricle = async () => {
    let tempComments = 0;
    let result = [];
    let res = await entryActorDefault.trendingEntryItemSidebar(12);
    if (res.length != 0) {
      for (let index = 0; index < res.length; index++) {
        let entryimg = null;
        if (res[index][1].image.length != 0) {
          entryimg = await getImageById(res[index][1].image[0]);
        }
        res[index][1].image = entryimg;
        res[index][1].creation_time = utcToLocal(
          res[index][1].creation_time,
          Date_m_d_y_h_m
        );
        res[index][1].views = formatLikesCount(parseInt(res[index][1].views));
        const comments = await commentsActor.getComments(res[index][0]);
        if (comments.ok) {
          // logger(comments.ok, 'trendingEntryItemSidebar');

          res[index][1].comments = comments.ok[0].length;
        } else {
          res[index][1].comments = tempComments;
        }
      }
      result = res;
    }
    const chunkSize = 3;

    const nestedArray = [];
    for (let i = 0; i < result.length; i += chunkSize) {
      nestedArray.push(result.slice(i, i + chunkSize));
    }
    setEntries(nestedArray);
    logger(nestedArray, 'trendingEntryI34temSidebar');
  };
  let getTrendingPressRelease = async () => {
    let tempComments = 0;
    let result = [];
    let res = await entryActorDefault.trendingPressReleaseItemSidebar(12);
    if (res.length != 0) {
      for (let index = 0; index < res.length; index++) {
        res[index][1].creation_time = utcToLocal(
          res[index][1].creation_time,
          Date_m_d_y_h_m
        );
        res[index][1].views = formatLikesCount(parseInt(res[index][1].views));

        const comments = await commentsActor.getComments(res[index][0]);
        if (comments.ok) {
          // logger(comments.ok, 'trendingEntryItemSidebar');

          res[index][1].comments = comments.ok[0].length;
        } else {
          res[index][1].comments = tempComments;
        }
      }
      result = res;
    }
    const chunkSize = 3;

    const nestedArray = [];
    for (let i = 0; i < result.length; i += chunkSize) {
      nestedArray.push(result.slice(i, i + chunkSize));
    }
    setEntries(nestedArray);

    logger(res, 'trendingEntryItemSidebar');
  };

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
  useEffect(() => {
    if (isArticle) {
      getTrendingAricle();
    } else {
      getTrendingPressRelease();
    }
  }, [isArticle]);
  return (
    <>
      {entries.length != 0 && (
        <Slider {...Featued} lazyLoad='anticipated'>
          {entries.map((entry1: any) => {
            return (
              <div className='Post-padding'>
                {entry1.length != 0 &&
                  entry1.map((entry: any) => {
                    return (
                      <div className='general-post auto news-wala'>
                        {entry[1].image ? (
                          <div className='img-pnl'>
                            <Image
                              src={entry[1].image}
                              fill={true}
                              alt='image'
                            />
                          </div>
                        ) : (
                          <div className='img-pnl' />
                        )}
                        <div className='txt-pnl'>
                          <span className='mobile-view-display  red-span'>
                            {t('Latest News')}
                          </span>
                          <Link
                            href={
                              entry[1]?.isStatic
                                ? `${ARTICLE_STATIC_PATH + entry[0]}`
                                : `${ARTICLE_DINAMIC_PATH + entry[0]}`
                            }
                          >
                            <h6
                              style={{ maxHeight: '20px', overflow: 'hidden' }}
                            >
                              {entry[1].title}
                            </h6>
                          </Link>
                          <p className='web-view-display'>
                            {entry[1].creation_time}
                          </p>
                          <p
                            className='customstyle'
                            style={{ maxHeight: '39px', overflow: 'hidden' }}
                          >
                            {entry[1]?.seoExcerpt}{' '}
                            {/* {entry
                              ? entry[1]?.seoExcerpt.length > 50
                                ? `${entry[1]?.seoExcerpt.slice(0, 50)}...`
                                : entry[1]?.seoExcerpt
                              : ''} */}
                          </p>
                          <span className='mobile-view-display'>
                            {entry[1].creation_time}
                          </span>
                          <ul className='thumb-list'>
                            <li className=''>
                              <Link
                                href={
                                  entry[1]?.isStatic
                                    ? `${ARTICLE_STATIC_PATH + entry[0]}`
                                    : `${ARTICLE_DINAMIC_PATH + entry[0]}`
                                }
                              >
                                <Image src={iconthumb} alt='Icon Thumb' />{' '}
                                {formatLikesCount(Number(entry[1].likes))}
                              </Link>
                              <Link
                                className='web-view-display'
                                href={
                                  entry[1]?.isStatic
                                    ? `${ARTICLE_STATIC_PATH + entry[0]}`
                                    : `${
                                        ARTICLE_DINAMIC_PATH + entry[0]
                                      }&route=comments`
                                }
                              >
                                <Image src={iconmessage} alt='Icon Comment' />{' '}
                                {entry[1].comments} {t('Comments')}
                              </Link>
                            </li>
                            <li>
                              <Link
                                href={
                                  entry[1]?.isStatic
                                    ? `${ARTICLE_STATIC_PATH + entry[0]}`
                                    : `${ARTICLE_DINAMIC_PATH + entry[0]}`
                                }
                                className='ms-1'
                              >
                                <div className='viewbox'>
                                  <i className='fa fa-eye fill blue-icon fa-lg me-1' />
                                  {t('Views')} <span className='mx-1'>|</span>
                                  {entry[1].views ? entry[1].views : 0}
                                </div>
                              </Link>
                              <Link
                                className='mobile-view-display-flex mobile-cmnt-btn mb-0'
                                href={
                                  entry[1]?.isStatic
                                    ? `${
                                        ARTICLE_STATIC_PATH + entry[0]
                                      }?route=comments`
                                    : `${
                                        ARTICLE_DINAMIC_PATH + entry[0]
                                      }&route=comments`
                                }
                              >
                                <Image src={iconmessage} alt='Icon Comment' />{' '}
                                {entry[1].comments} {t('Comments')}
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </Slider>
      )}
    </>
  );
}
