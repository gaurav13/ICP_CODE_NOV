import React, { useEffect, useState } from 'react';
import iconcap from '@/assets/Img/Icons/icon-cap.png';
import iconrise from '@/assets/Img/Icons/icon-rise.png';
import infinity from '@/assets/Img/Icons/icon-infinite2.png';
import icpimage from '@/assets/Img/coin-image.png';
import Link from 'next/link';
import Image from 'next/image';
import girl from '@/assets/Img/user-img.png';
import { useRouter } from 'next/navigation';
import logger from '@/lib/logger';
import { useConnectPlugWalletStore } from '@/store/useStore';
import pressicon from '@/assets/Img/Icons/icon-press-release.png';
import { getImage } from '@/components/utils/getImage';
import { User } from '@/types/profile';
import parse from 'html-react-parser';
import { Button, Spinner } from 'react-bootstrap';
import promotedIcon from '@/assets/Img/promoted-icon.png';
import PromotedSVG from '@/components/PromotedSvg/Promoted';
import Tippy from '@tippyjs/react';
import PodcastSVG from '@/components/podcastSVG/Podcastsvg';
import { formatLikesCount } from '@/components/utils/utcToLocal';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { Podcast_DINAMIC_PATH, Podcast_STATIC_PATH, QUIZ_ROUTE } from '@/constant/routes';

export default function ExportPodcast({
  entry,
  entryId,
}: {
  entry: any;
  entryId: string;
}) {
  const [userImg, setUserImg] = useState<string | null>();
  const [user, setUser] = useState<User | null>();
  const [featuredImage, setFeaturedImage] = useState<string | null>();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const { t, changeLocale } = useLocalization(LANG);

  const { auth, setAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
    identity: state.identity,
  }));

  const authorId = entry?.user?.toString();

  // logger();

  const updateImg = async (img: any, name: string) => {
    if (img) {
      const tempImg = await getImage(img);
      if (name === 'user') setUserImg(tempImg);
      else {
        setFeaturedImage(tempImg);
      }
    } else {
      // setProfileFile(null);
      if (name === 'user') setUserImg(null);
      else {
        setFeaturedImage(null);
      }
    }
  };
  const getUser = async () => {
    let newUser = null;

    newUser = await auth.actor.get_user_details([authorId]);

    if (newUser.ok) {
      setUser(newUser.ok[1]);
      updateImg(newUser.ok[1].profileImg[0], 'user');
      setFeaturedImage(entry.image);
    }
  };
  useEffect(() => {
    if (entry?.likedUsers && identity) {
      const likedarray: any = [];
      entry?.likedUsers.map((likedUser: any) => {
        const likedUserText = likedUser.toString();
        likedarray.push(likedUserText);
        // logger(likedUserText,"likedUserText")
        if (identity._principal) {
          if (likedUserText === identity?._principal.toString()) {
            setIsLiked(true);
          }
        }
      });
    }
  }, [entry, identity, auth]);
  useEffect(() => {
    if (authorId && auth.actor) {
      getUser();
    }
  }, [authorId, auth.actor]);
  return (
    <>
      <div className='expert-post'>
        <div
          className='img-pnl'
          style={{ cursor: 'pointer' }}
          onClick={() =>
            router.push(
              entry?.isStatic
                ? `${Podcast_STATIC_PATH + entryId}`
                : `${Podcast_DINAMIC_PATH + entryId}`
            )
          }
        >
          {/* <Image src={Post} alt='Post' />Podcast_DINAMIC_PATH */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              margin: '0 auto',
              height: '220px',
              overflow: 'hidden',
              background: '#000',
              borderRadius: '15px 15px 0 0',
            }}
          >
            {featuredImage ? (
              <Image
                src={featuredImage}
                className='backend-img expert-header-img '
                fill={true}
                alt='Profileicon'
                style={{
                  maxHeight: '100%',
                  // height: 'auto',
                  borderRadius: '15px 15px 0 0',
                  margin: '0 auto',
                }}
              />
            ) : (
              <Spinner animation='border' variant='warning' />
            )}
          </div>
        </div>
        <div className='txt-pnl'>
          <div className='expert-post-head'>
            <div className='left-pnl'>
              <div className='img-pnl'>
                {/* <Image src={defaultUser} alt='User' /> */}
                <Link href={`/profile?userId=${authorId}`}>
                  <div
                    style={{
                      position: 'relative',
                      width: '45px',
                      margin: '0 auto',
                      height: '45px',
                    }}
                  >
                    <Image
                      src={userImg ? userImg : girl}
                      className='backend-img '
                      fill={true}
                      alt='Profileicon'
                    />
                  </div>
                </Link>
              </div>
              <div className='txet-pnl'>
                <h6>
                  <Link href={`/profile?userId=${authorId}`}>
                    {t('By')} {user?.name[0] ?? ''}{' '}
                    <p className='m-0'>{user?.designation[0] ?? ''}</p>
                  </Link>
                  <Button>
                    <Image src={iconcap} alt='Cap' /> {t('Expert')}
                  </Button>
                </h6>
              </div>
            </div>
          </div>
          {/* <h2>Japan Half-Hearted Approach to Stablecoins: A Looming Concern</h2>
          <p>
            In June 2023, the world witnessed a significant development in the
            cryptocurrency realm as Japan passed a bill regarding stablecoins.
            This move, however, left many observers baffled, as it appeared that
            Japan had entered the stablecoin arena with
          </p> */}
          <div className='cut'>
            <h2
              onClick={() =>
                router.push(
                  entry?.isStatic
                    ? `${Podcast_STATIC_PATH + entryId}`
                    : `${Podcast_DINAMIC_PATH + entryId}`
                )
              }
              style={{ cursor: 'pointer' }}
            >
              {entry?.isPodcast && (
                <Tippy content={<p className='mb-0'>{t('podcast')}</p>}>
                  <span
                    className='d-inline-block'
                    style={{ height: '25px', width: '25px' }}
                  >
                    <PodcastSVG />
                  </span>
                </Tippy>

                // <span className='publish-btn table-btn'>
                //   promotedIcon
                // </span>
              )}{' '}
              {entry?.title ?? ''}
            </h2>
            {/* <div
              dangerouslySetInnerHTML={{ __html: entry?.description ?? '' }}
            /> */}
            {parse(entry?.description ?? '')}
            <div style={{ minHeight: 300 }} />
          </div>
          <Link
            href={
              entry?.isStatic
                ? `${Podcast_STATIC_PATH + entryId}`
                : `${Podcast_DINAMIC_PATH + entryId}`
            }
            // onClick={(e) => e.preventDefault()}
            className='show-more-link'
          >
            {t('show more')} <i className='fa fa-caret-down' />
          </Link>
          <div className='count-description-pnl'>
            <div className='flex-wali-div'>
              {/* <ul className='vote-comment-list'>
                <li>
                  <div>
                    <Image src={iconrise} alt='Rise' /> Vote
                  </div>
                  <div>{parseInt(entry?.likes ?? '0')}</div>
                </li>
              </ul> */}
              {/* <div/> */}
              <h6 className='me-2'>
                <div className='viewbox'>
                  <i className='fa fa-eye fill blue-icon fa-lg me-1' />
                  {t('Views')} <span className='mx-1'>|</span>
                  {formatLikesCount(parseInt(entry?.views ?? 0))}
                </div>
              </h6>
              <h6
                style={{
                  pointerEvents: 'none',
                  marginTop: 7,
                  cursor: 'pointer',
                }}
              >
                {isLiked ? (
                  <Image
                    src={'/images/liked.svg'}
                    alt='Icon Thumb'
                    style={{ maxWidth: 25 }}
                    height={25}
                    width={25}
                  />
                ) : (
                  // <i className='fa fa-like'/>
                  // <i
                  //   className='fa-solid  fa-thumbs-up my-fa'
                  //   style={{ fontSize: 20, height: 25, width: 25, maxWidth: 25 }}
                  // />
                  <Image
                    src={'/images/like.svg'}
                    alt='Icon Thumb'
                    style={{ maxWidth: 25 }}
                    height={25}
                    width={25}
                  />
                  // <i
                  //   className='fa-regular  fa-thumbs-up  my-fa'
                  //   style={{ fontSize: 20, height: 25, width: 25, maxWidth: 25 }}
                  // />
                )}{' '}
                <span className='ms-2 mt-2'>
                  {formatLikesCount(parseInt(entry?.likes) ?? '0')}
                </span>
              </h6>

              {/* <h6>
                <Image src={iconcomment} alt='Comment' /> 12 Comments
              </h6> */}
            </div>
            <div>
              <ul className='quiz-list'>
                <li>
                  <Image
                    src={icpimage}
                    alt='icpImage'
                    style={{ height: '25px', width: '30px' }}
                  />{' '}
                  <span>+500 ICP</span>
                </li>
                <li
                // style={{ cursor: 'pointer' }}
                // onClick={() => router.push('/nft-article-quiz')}
                >
                  <Link
                    href={QUIZ_ROUTE}
                  >
                    {t('take quiz')} <i className='fa fa-angle-right' />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
