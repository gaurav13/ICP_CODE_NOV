import { LANG } from "@/constant/language";
import { ARTICLE_DINAMIC_PATH, ARTICLE_STATIC_PATH, Podcast_DINAMIC_PATH, Podcast_STATIC_PATH } from "@/constant/routes";
import { ARTICLE_FEATURED_IMAGE_ASPECT, CATEGORY_ICON_SIZE } from "@/constant/sizes";
import useLocalization from "@/lib/UseLocalization";
import { useConnectPlugWalletStore } from "@/store/useStore";
import Link from 'next/link';
import Image from "next/image";
import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import {
  formatLikesCount,
  isUserConnected,
} from '@/components/utils/utcToLocal';
import ConnectModal from '@/components/Modal';
import iconpodcast from '@/assets/Img/Icons/icon-podcast-1.png';
import iconpressrelease from '@/assets/Img/Icons/icon-press-release.png';
import iconmessage from '@/assets/Img/Icons/icon-comment.png';
import LikedImg from "../../../public/images/liked.svg"
import LikeImg from "../../../public/images/like.svg"

export default function GlobalSearchEntryItem({ entry, entryActor }: { entry: any; entryActor: any }) {
  const [likeCount, setLikeCount] = useState<number>(entry.likes);
  const [isliked, setIsLiked] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const { identity, auth } = useConnectPlugWalletStore((state) => ({
    identity: state.identity,
    auth: state.auth,
  }));
  /**
   * handleConnectModal USE to close modal
   * @parms null
   * @return null
   */
  const handleConnectModal = () => {
    setShowConnectModal(true);
  
  };
    /**
   * handleConnectModal USE to open modal
   * @parms null
   * @return null
   */
  const handleConnectModalClose = () => {
    setShowConnectModal(false);
  };
  /**
   * handleConnectModal USE to like entry
   * @parms null
   * @return null
   */
  const likeEntry = async () => {
    if (!isUserConnected(auth, handleConnectModal)) return;
    if (!isliked) {
      setLikeCount((pre: number) => pre + 1);
      setIsLiked(true);
    } else {
      setLikeCount((pre: number) => pre - 1);
      setIsLiked(false);
    }

    return new Promise(async (resolve, reject) => {
      entryActor
        .likeEntry(entry.id, userCanisterId, commentCanisterId)
        .then(async (entry: any) => {
          resolve(entry);
        })
        .catch((err: any) => {
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
  const { t, changeLocale } = useLocalization(LANG);
  useEffect(() => {
    if (identity ) {
      let liked = entry?.likedUsers?.some(
        (u: any) => u.toString() == identity.getPrincipal()
      );
      setIsLiked(liked);
    }
  }, [identity]);

  return (
    <>
      <Col sm={6} md={5} lg={5} xl={4} xxl={3} className='mb-5'>
        <div className='general-post auto'>
          <Link
            className='img-pnl myimages'
            style={{
              width: '100%',
              aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT,
              position: 'relative',
            }}
            href={
              entry.isPodcast
                ? entry.isStatic
                  ? `${Podcast_STATIC_PATH + entry.id}`
                  : `${Podcast_DINAMIC_PATH + entry.id}`
                : entry.isStatic
                ? `${ARTICLE_STATIC_PATH + entry.id}`
                : `${ARTICLE_DINAMIC_PATH + entry.id}`
            }
          >
            <Image fill src={entry?.image} alt='Post' />
          </Link>
          <div className='txt-pnl'>
            <Link
              href={
                entry.isPodcast
                  ? entry.isStatic
                    ? `${Podcast_STATIC_PATH + entry.id}`
                    : `${Podcast_DINAMIC_PATH + entry.id}`
                  : entry.isStatic
                  ? `${ARTICLE_STATIC_PATH + entry.id}`
                  : `${ARTICLE_DINAMIC_PATH + entry.id}`
              }
            >
              <h6>
                {entry.pressRelease ? (
                  <Image
                    src={iconpressrelease}
                    width={CATEGORY_ICON_SIZE.width}
                    height={CATEGORY_ICON_SIZE.height}
                    alt='Icon Press release'
                  />
                ) : entry.isPodcast ? (
                  <Image
                    src={iconpodcast}
                    width={CATEGORY_ICON_SIZE.width}
                    height={CATEGORY_ICON_SIZE.height}
                    alt='Icon podcast'
                  />
                ) : (
                  ''
                )}{' '}
                {entry?.title}
              </h6>
            </Link>
            <p
              style={{ maxHeight: '45px', overflow: 'hidden' }}
              className='customstyle'
            >
              {/* {HTMLReactParser(entry?.description)} */}
              {entry?.seoExcerpt}
            </p>
            <ul className='thumb-list'>
              <li
                style={{
                  cursor: 'pointer',
                }}
                onClick={likeEntry}
              >
                <a
                  style={{
                    pointerEvents: 'none',
                  }}
                  href='#'
                >
                 {isliked? <LikedImg
                 
                 width={CATEGORY_ICON_SIZE.width}
                 height={CATEGORY_ICON_SIZE.height}
                 alt='Icon Thumb'
               />: <LikeImg
                 
                    width={CATEGORY_ICON_SIZE.width}
                    height={CATEGORY_ICON_SIZE.height}
                    alt='Icon Thumb'
                  />}{' '}
                  {formatLikesCount(likeCount) ?? 0}
                </a>
              </li>
              <li>
                <Link
                  href={
                    entry.isPodcast
                      ? entry.isStatic
                        ? `${Podcast_STATIC_PATH + entry.id}?route=comments`
                        : `${Podcast_DINAMIC_PATH + entry.id}?route=comments`
                      : entry.isStatic
                      ? `${ARTICLE_STATIC_PATH + entry.id}?route=comments`
                      : `${ARTICLE_DINAMIC_PATH + entry.id}&route=comments`
                  }
                >
                  <Image src={iconmessage} alt='Icon Comment' />{' '}
                  {entry?.comments} {t('Comments')}
                </Link>
              </li>
              <li>
                <Link
                  href={
                    entry.isPodcast
                      ? entry.isStatic
                        ? `${Podcast_STATIC_PATH + entry.id}?route=comments`
                        : `${Podcast_DINAMIC_PATH + entry.id}?route=comments`
                      : entry.isStatic
                      ? `${ARTICLE_STATIC_PATH + entry.id}?route=comments`
                      : `${ARTICLE_DINAMIC_PATH + entry.id}&route=comments`
                  }
                  className='ms-1'
                >
                  <div className='viewbox'>
                    <i className='fa fa-eye fill blue-icon fa-lg me-1' />
                    {t('Views')} <span className='mx-1'>|</span>
                    {entry?.views ? formatLikesCount(entry?.views) : 0}
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Col>
      <ConnectModal
        handleClose={handleConnectModalClose}
        showModal={showConnectModal}
      />
    </>
  );
}