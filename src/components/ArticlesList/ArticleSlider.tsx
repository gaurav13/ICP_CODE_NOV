import React, { useEffect, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import post1 from '@/assets/Img/Posts/Post-1.png';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { useConnectPlugWalletStore } from '@/store/useStore';
import {
  makeCommentActor,
  makeEntryActor,
  makeUserActor,
} from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage, iframeimgThumbnail } from '@/components/utils/getImage';
import iconmessage from '@/assets/Img/Icons/icon-comment.png';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import { useRouter } from 'next/navigation';
import { ARTICLE_FEATURED_IMAGE_ASPECT, EntryTypes, FEATURED_ENTRIES } from '@/constant/sizes';
import {
  formatLikesCount,
  isUserConnected,
} from '@/components/utils/utcToLocal';
import ConnectModal from '@/components/Modal';
import { fromNullable } from '@dfinity/utils';
import { ARTICLE_DINAMIC_PATH, ARTICLE_STATIC_PATH, Podcast_DINAMIC_PATH, Podcast_STATIC_PATH } from '@/constant/routes';
import CustomeShimmerSlider from '@/components/Shimmers/CustomeShimmer';
import podcast from '@/assets/Img/Icons/icon-podcast-1.png';
import pressReleaseimg from '@/assets/Img/Icons/icon-press-release.png';
import articleImg from '@/assets/Img/Icons/icon-article-1.png';



function NewsItem({
  entry,
  
}: {
  entry: any;

}) {
  let [likeCount, setLikeCount] = useState<number>(Number(entry[1].likes));
  const [showConnectModal, setShowConnectModal] = useState(false);
  let [isliked, setIsLiked] = useState(false);
  let router = useRouter();
  const { t, changeLocale } = useLocalization(LANG);

  const { auth, setAuth, identity, principal } = useConnectPlugWalletStore(
    (state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
    })
  );

  let openArticleLink = (articleLink: any) => {
    router.push(articleLink);
  };

  const handleConnectModal = () => {
    // e.preventDefault();
    setShowConnectModal(true);
    // setConnectLink(e);
  };
  const handleConnectModalClose = () => {
    setShowConnectModal(false);
  };
/**
 * likeEntry use to like entry
 * @returns null
 */
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
      if (!entry || !entry[1].userId) reject('NO Entry or user ID provided');
      const entryActor = makeEntryActor({
        agentOptions: {
          identity,
        },
      });

      entryActor
        .likeEntry(entry[0], userCanisterId, commentCanisterId)
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
    setLikeCount(Number(entry[1].likes));
    logger(entry, 'entry2546');
  }, [entry]);
  useEffect(() => {
    if (identity) {
      let liked = entry[1].likedUsers.some(
        (u: any) => u.toString() == identity.getPrincipal()
      );
      setIsLiked(liked);
    }
  }, [identity]);
 
  return (
    <>
      <div className={`Post-padding `}>
        <div className='general-post slider'>
          <Link
            className='position-relative'
            style={{
              width: '100%',
              aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT,
            }}
            href={
              entry[1].isStatic
              ?entry[1].isPodcast? `${Podcast_STATIC_PATH + entry[0]}`:`${ARTICLE_STATIC_PATH + entry[0]}`
              :entry[1].isPodcast? `${Podcast_DINAMIC_PATH + entry[0]}`:`${ARTICLE_DINAMIC_PATH + entry[0]}`
          
            }
          >
            <div>
              <Image
                src={entry[1].image ? entry[1].image : post1}
                fill
                sizes=''
                alt={entry[1].caption ? entry[1].caption : `Post`}
              />
            </div>
          </Link>
          <div className='txt-pnl'>
            <Link
              href={
                entry[1].isStatic
                  ?entry[1].isPodcast? `${Podcast_STATIC_PATH + entry[0]}`:`${ARTICLE_STATIC_PATH + entry[0]}`
                  :entry[1].isPodcast? `${Podcast_DINAMIC_PATH + entry[0]}`:`${ARTICLE_DINAMIC_PATH + entry[0]}`
              }
            >
              <h6>
                {entry[1]?.title.length > 50
                  ? `${entry[1]?.title.slice(0, 50)}...`
                  : entry[1]?.title}
              </h6>
            </Link>
            <p
              style={{ maxHeight: '48px', overflow: 'hidden' }}
              className='customstyle'
            >
              {entry[1].seoExcerpt}
              {/* {entry ? entry[1].seoExcerpt.length > 90? `${entry[1].seoExcerpt.slice(0, 90)}...`: entry[1].seoExcerpt: ''} */}
            </p>
            <ul className='thumb-list mid-panel flex'>
              <li
                onClick={likeEntry}
                style={{ cursor: 'pointer' }}
                className='mr-0'
              >
                <a
                  href={`${
                    entry
                      ? entry[0]
                        ?  entry[1].isStatic
                            ?entry[1].isPodcast? `${Podcast_STATIC_PATH + entry[0]}`:`${ARTICLE_STATIC_PATH + entry[0]}`
                            :entry[1].isPodcast? `${Podcast_DINAMIC_PATH + entry[0]}`:`${ARTICLE_DINAMIC_PATH + entry[0]}`
                        
                        : '#'
                      : `#`
                  }`}
                  className='mr-3'
                  style={{ pointerEvents: 'none' }}
                >
                  {/* <Image src={iconthumb} alt='Icon Thumb' /> */}
                  {isliked ? (
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
                  )}
                  {formatLikesCount(likeCount) ?? 0}
                </a>
                <a
                  className='web-view-display'
                  href={`${
                    entry
                      ? entry[0]
                        ? 
                      
                          entry[1].isStatic
                            ?entry[1].isPodcast? `${Podcast_STATIC_PATH + entry[0]}`:`${ARTICLE_STATIC_PATH + entry[0]}`
                            :entry[1].isPodcast? `${Podcast_DINAMIC_PATH + entry[0]}?route=comments`:`${ARTICLE_DINAMIC_PATH + entry[0]}?route=comments`
                        
                     
                        : '#'
                      : `#`
                  }`}
                >
                  <Image src={iconmessage} alt='Icon Comment' />
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {entry[1].commentCount ? entry[1].commentCount : 0}{' '}
                    {t('Comments')}
                  </span>
                </a>
              </li>
              <li>
                <Link
                  href={
                    entry[1].isStatic
                    ?entry[1].isPodcast? `${Podcast_STATIC_PATH + entry[0]}`:`${ARTICLE_STATIC_PATH + entry[0]}`
                    :entry[1].isPodcast? `${Podcast_DINAMIC_PATH + entry[0]}`:`${ARTICLE_DINAMIC_PATH + entry[0]}`
                
                  }
                  className='ms-1'
                >
                  <div className='viewbox'>
                    <i className='fa fa-eye fill blue-icon fa-lg me-1' />
                    {t('Views')} <span className='mx-1'>|</span>
                    {entry[1].views ? entry[1].views : 0}
                  </div>
                </Link>
                <a
                  className='mobile-view-display d-flex'
                  href={`${
                    entry
                      ? entry[0]
                        ?    entry[1].isStatic
                        ?entry[1].isPodcast? `${Podcast_STATIC_PATH + entry[0]}`:`${ARTICLE_STATIC_PATH + entry[0]}`
                        :entry[1].isPodcast? `${Podcast_DINAMIC_PATH + entry[0]}?route=comments`:`${ARTICLE_DINAMIC_PATH + entry[0]}?route=comments`
                    
                        : '#'
                      : `#`
                  }`}
                >
                  <Image src={iconmessage} alt='Icon Comment' />
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {entry[1].commentCount ? entry[1].commentCount : 0}{' '}
                    {t('Comments')}
                  </span>
                </a>
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

export default function EntriesSlider({
  web3Id,
  contentType,
  directoryName
}: {
  web3Id: string;
  contentType: string;
  directoryName:string
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
  const commentsActor = makeCommentActor({
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
    slidesToShow: promotedArticle.length > 1 ? 2 : 1,
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
        breakpoint: 1500,
        settings: {
          slidesToShow:  2,
          slidesToScroll:  2,
          infinite: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow:  2,
          slidesToScroll:  2,
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
  
  /**
   * getEntries use to get list of data por entries {article,podcast,pressrelease,events}
   * @param web3Id 
   * @returns 
   */
  async function getEntries(web3Id: string ) {
    try {
      let res = await entryActor.getEntriesOfWeb3(contentType,web3Id,"",0,FEATURED_ENTRIES);
      let entrylist=res?.entries ?? [];
    
      if (entrylist?.length !== 0) {
        let resultEntries= await Promise.all(
          entrylist.map(async (entry: any, index: any) => {
            let id = entry[1].user.toString();
        

            const comments = await commentsActor.getComments(entry[0]);
            if (comments.ok) {
              entry[1].commentCount = formatLikesCount(
                parseInt(comments.ok[0].length)
              );
            }
            let newUser = await userActor.get_user_details([id]);
            if (newUser.ok) {
              if (newUser.ok[1].profileImg.length != 0) {
                const tempImg = await getImage(newUser.ok[1].profileImg[0]);
                entry[1].userImg = tempImg;
              }
              entry[1].userName = newUser.ok[1].name;
            }
            let articalimg = null;
            if (entry[1].image) {
              articalimg = getImage(entry[1].image[0]);
            }
            if (entry[1].podcastImg.length != 0) {
              articalimg = getImage(entry[1].podcastImg[0]);
            }
            if (entry[1].podcastVideoLink != '') {
              articalimg = iframeimgThumbnail(entry[1].podcastVideoLink);
            }
            entry[1].image = articalimg;
            entry[1].likes = formatLikesCount(parseInt(entry[1].likes));
            entry[1].views = formatLikesCount(parseInt(entry[1].views));
          })
        );
        setPromotedArticle(entrylist);
        logger(entrylist, 'aaaa');
        const timer = setTimeout(() => {
          setIsloaded(false);
        }, 2000);

        return () => clearTimeout(timer);
      } else {
        setIsloaded(false);
      }
    } catch (error) {
      // console.error(error, 'proooo');
    }
  }
  function getContentImage(content:string) {
    switch (content) {
      case EntryTypes.Podcast:
        return podcast;
   
        case EntryTypes.articles:
          return articleImg;
          case EntryTypes.PressRelease:
            return pressReleaseimg;
      default:
        return articleImg;
    }
    
  }
  useEffect(() => {
    if (web3Id && web3Id != '') {
      getEntries(web3Id);
    }
  }, [web3Id]);
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <>
 

      {promotedArticle.length != 0 && (
        <>
           <h3>
                          <Image src={getContentImage(contentType)} alt='Infinity' />
                          {t(`Similar ${contentType} of`)} {" "}
                          {directoryName ?? ''}
                        </h3>
        <Slider
          {...Featued}
          lazyLoad='anticipated'
          className={`${isloaded ? 'd-none' : ''} mt-3`}
        >
          {promotedArticle.map((entry: any, index) => {
            return (
              <NewsItem
                entry={entry}
                key={entry[0]}
              />
            );
          })}
         
        </Slider>
        </>
      )}
    </>
  );
}
