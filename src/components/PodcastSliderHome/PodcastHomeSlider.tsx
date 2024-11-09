import React, { useEffect, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import post1 from '@/assets/Img/Posts/Post-1.png';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage, iframeimgThumbnail } from '@/components/utils/getImage';
import iconmessage from '@/assets/Img/Icons/icon-comment.png';
import iconcoin from '@/assets/Img/coin-image.png';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import { ARTICLE_FEATURED_IMAGE_ASPECT, profileAspect } from '@/constant/sizes';
import {
  formatLikesCount,
  isUserConnected,
  utcToLocal,
} from '@/components/utils/utcToLocal';
import { toast } from 'react-toastify';
import ConnectModal from '@/components/Modal';
import { fromNullable } from '@dfinity/utils';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { Podcast_DINAMIC_PATH, Podcast_STATIC_PATH } from '@/constant/routes';

function NewsItem({ entry }: any) {
  let [likeCount, setLikeCount] = useState<number>(entry.likes ?? 0);
  const [showConnectModal, setShowConnectModal] = useState(false);
  let [isliked, setIsLiked] = useState(false);

  const { t, changeLocale } = useLocalization(LANG);
  const { auth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    identity: state.identity,
  }));

  const handleConnectModal = () => {
    // e.preventDefault();
    setShowConnectModal(true);
    // setConnectLink(e);
  };
  const handleConnectModalClose = () => {
    setShowConnectModal(false);
  };

  const likeEntry = async () => {
    if (!isUserConnected(auth, handleConnectModal)) return;

    if (!isliked) {
      setLikeCount((pre) => pre + 1);
      setIsLiked(true);
    } else {
      setLikeCount((pre) => pre - 1);
      setIsLiked(false);
    }

    return new Promise(async (resolve, reject) => {
      if (!entry || !entry.userId) reject('NO Entry or user ID provided');
      const entryActor = makeEntryActor({
        agentOptions: {
          identity,
        },
      });

      entryActor
        .likeEntry(entry.entryId, userCanisterId, commentCanisterId)
        .then(async (entry: any) => {
          // logger(entry, 'een');
          resolve(entry);
        })
        .catch((err: any) => {
          logger(err);
          if (!isliked) {
            setLikeCount((pre) => pre + 1);
            setIsLiked(true);
          } else {
            setLikeCount((pre) => pre - 1);
            setIsLiked(false);
          }
          reject(err);
        });
    });
  };
  useEffect(() => {
    if (identity) {
      let liked = entry.likedUsers.some(
        (u: any) => u.toString() == identity?.getPrincipal()
      );
      setIsLiked(liked);
    }
  }, [identity]);
  useEffect(() => {
    setLikeCount(Number(entry.likes));
    logger(entry, 'entry2');
  }, [entry]);
  return (
    <>
      <div className='Post-padding'>
        <div className='general-post slider'>
          <Link
            className='position-relative'
            style={{
              width: '100%',
              aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT,
            }}
            href={
              entry?.isStatic
                ? `${Podcast_STATIC_PATH + entry.entryId}`
                : `${Podcast_DINAMIC_PATH + entry.entryId}`
            }
          >
            <div>
              <Image
                src={entry.image ? entry.image : post1}
                fill
                sizes=''
                alt={entry.caption ? entry.caption : `Post`}
              />
            </div>
          </Link>
          <div className='txt-pnl'>
            <Link
              href={
                entry?.isStatic
                  ? `${Podcast_STATIC_PATH + entry.entryId}`
                  : `${Podcast_DINAMIC_PATH + entry[0]}`
              }
            >
              <h6>
                {entry?.title.length > 50
                  ? `${entry?.title.slice(0, 50)}...`
                  : entry?.title}
              </h6>
            </Link>
            <p style={{ maxHeight: '48px', overflowY: 'hidden' }}>
              {entry ? entry.seoExcerpt : ''}
            </p>
            <ul className='thumb-list flex'>
              <li
                onClick={likeEntry}
                style={{ cursor: 'pointer' }}
                className='mr-0'
              >
                <a
                  href={`${
                    entry
                      ? entry.entryId
                        ? entry?.isStatic
                          ? `${Podcast_STATIC_PATH + entry.entryId}`
                          : `${Podcast_DINAMIC_PATH + entry.entryId}`
                        : '#'
                      : `#`
                  }`}
                  className='mr-3'
                  style={{ pointerEvents: 'none' }}
                >
                  {isliked ? (
                    <Image
                      src={'/images/liked.svg'}
                      alt='Icon Thumb'
                      style={{ maxWidth: 25 }}
                      height={25}
                      width={25}
                    />
                  ) : (
                    <Image
                      src={'/images/like.svg'}
                      alt='Icon Thumb'
                      style={{ maxWidth: 25 }}
                      height={25}
                      width={25}
                    />
                  )}
                  {formatLikesCount(likeCount) ?? 0}
                </a>
                {/* <a style={{ pointerEvents: 'none' }}>
                <i className='fa fa-eye blue-icon fa-lg me-1'/>
                {'  '}
                {entry[1]?.views ? entry[1]?.views : 0}
              </a> */}

                <a
                  href={`${
                    entry
                      ? entry.entryId
                        ? entry?.isStatic
                          ? `${
                              Podcast_STATIC_PATH + entry.entryId
                            }?route=comments`
                          : `${
                              Podcast_DINAMIC_PATH + entry.entryId
                            }&route=comments`
                        : '#'
                      : `#`
                  }`}
                >
                  <Image src={iconmessage} alt='Icon Comment' /> {t('Comments')}
                </a>
                <Link
                  href={
                    entry?.isStatic
                      ? `${Podcast_STATIC_PATH + entry.entryId}`
                      : `${Podcast_DINAMIC_PATH + entry.entryId}`
                  }
                  className='ms-1'
                >
                  <div className='viewbox'>
                    <i className='fa fa-eye fill blue-icon fa-lg me-1' />
                    {t('Views')} <span className='mx-1'>|</span>
                    {entry.views ? entry.views : 0}
                  </div>
                </Link>
              </li>
              <li>
                <Image src={iconcoin} alt='Icon Comment' /> +500 BlockZa
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ConnectModal
        handleClose={handleConnectModalClose}
        showModal={showConnectModal}
      />
    </>
  );
}

export default function PodcastHomeSlider({ catagory }: { catagory?: string }) {
  let [ProcessedList, setProcessedList] = useState<any>([]);
  let [isloaded, setIsloaded] = useState(true);
  let [categoryName, setCategoryName] = useState<any>(null);

  const { identity } = useConnectPlugWalletStore((state) => ({
    identity: state.identity,
  }));

  var Featued = {
    dots: false,
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
  const getAllPodcastList = async (catagory: string) => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    //  dataType for below function
    // 1 =pressRelease
    // 2 =podcast
    // 3 =article

    const resp = await entryActor.getUniqueDataList(
      catagory,
      false,
      '',
      0,
      6,
      2
    );

    const tempList = resp.entries;
    return tempList;
  };
  const getRefinedList = async (tempEntriesList: any[]) => {
    if (tempEntriesList.length === 0) {
      return [];
    }
    logger(tempEntriesList, 'tempEntriesList363');
    const userActor = makeUserActor({
      agentOptions: {
        identity,
      },
    });
    const refinedPromise = await Promise.all(
      tempEntriesList.map(async (entry: any) => {
        let image = null;
        if (entry[1].podcastVideoLink != '') {
          image = iframeimgThumbnail(entry[1].podcastVideoLink);
        }
        if (entry[1]?.podcastImg.length != 0) {
          image = getImage(entry[1].podcastImg[0]);
        }

        const userId = entry[1].user.toString();

        // const user = await userActor.get_user_details([userId]);
        let date = utcToLocal(entry[1].creation_time.toString(), 'MMM D, YYYY');

        let newItem = {
          title: entry[1].title,
          entryId: entry[0],
          image: image,
          likes: formatLikesCount(Number(entry[1].likes)),
          views: formatLikesCount(Number(entry[1].views)),
          creation_time: date,
          userName: entry[1].userName,
          categories: entry[1].category,
          isDraft: entry[1].isDraft,
          minters: entry[1].minters,
          status: entry[1].status,
          pressRelease: entry[1].pressRelease,
          userId,
          isCompanySelected: entry[1].isCompanySelected,
          companyId: entry[1].companyId,
          isPodcast: entry[1].isPodcast,
          podcastVideoLink: entry[1].podcastVideoLink,
          seoExcerpt: entry[1].seoExcerpt,
          likedUsers: entry[1].likedUsers,
          isStatic: entry[1].isStatic,
        };
        // if (user.ok) {
        //   newItem.userName = user.ok[1].name ?? entry[1].userName;
        // }
        return newItem;
      })
    );

    return refinedPromise;
  };
  let getPodcastList = async (catagory: string) => {
    let podcastList = await getAllPodcastList(catagory);
    const tempList = await getRefinedList(podcastList);
    logger(tempList, 'podcastList1212');
    setProcessedList(tempList);
    setIsloaded(false);
  };
  async function categoryNamefn(cat: string) {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    let resp = await entryActor.get_category(cat);
    let resCategory: any = fromNullable(resp);
    let categoryName = null;
    if (resCategory) {
      categoryName = resCategory.name;
    }
    setCategoryName(categoryName);
  }
  useEffect(() => {
    logger(catagory, 'catagoryslider');
    if (catagory && catagory != '') {
      getPodcastList(catagory);
      categoryNamefn(catagory);
    } else {
      getPodcastList('All');
    }
  }, [catagory]);
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <>
      {ProcessedList.length != 0 ? (
        <Slider
          {...Featued}
          lazyLoad='anticipated'
          className={`${isloaded ? 'd-none' : ''}`}
        >
          {ProcessedList.map((entry: any, index: any) => {
            return <NewsItem entry={entry} key={index} />;
          })}
        </Slider>
      ) : (
        <p>
          {t('No Podcast Found')}
          {categoryName ? `${t('ON')} ${categoryName} ${t('Category')}` : ''}
        </p>
      )}
    </>
  );
}
