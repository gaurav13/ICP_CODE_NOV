import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import Image from 'next/image';
import post1 from '@/assets/Img/Posts/Post-17.png';
import iconrise from '@/assets/Img/Icons/icon-rise.png';
import infinity from '@/assets/Img/Icons/icon-infinite.png';
import icpimage from '@/assets/Img/coin-image.png';
import iconcomment from '@/assets/Img/Icons/icon-comment.png';
import iconthumb from '@/assets/Img/Icons/icon-thumb.png';
import iconshare from '@/assets/Img/Icons/icon-share-o.png';
import angledown from '@/assets/Img/Icons/angle-down-solid.png';
import angleright from '@/assets/Img/Icons/angle-right-solid.png';
// import iconshare from '@/assets/Img/Icons/icon-share.png';
import iconcap from '@/assets/Img/Icons/icon-cap.png';
import { CATEGORY_PATH, SURVEY, TAKEQUIZPAGE } from '@/constant/routes';
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
  Dropdown,
} from 'react-bootstrap';
import parse from 'html-react-parser';
import promotedIcon from '@/assets/Img/promoted-icon.png';
import girl from '@/assets/Img/user-img.png';

import { useConnectPlugWalletStore } from '@/store/useStore';
import {
  Formik,
  FormikProps,
  Form as FormikForm,
  Field,
  FormikValues,
  ErrorMessage,
  useFormikContext,
  FormikTouched,
  setNestedObjectValues,
} from 'formik';
import {
  makeCommentActor,
  makeDIP721Canister,
  makeEntryActor,
  makeLedgerCanister,
  makeUserActor,
} from '@/dfx/service/actor-locator';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import {
  commentTime,
  formatLikesCount,
  isUserConnected,
  utcToLocal,
} from '@/components/utils/utcToLocal';
import { toast } from 'react-toastify';
import { getImage, getImageById } from '@/components/utils/getImage';
import Tippy from '@tippyjs/react';
import ArticleComments from '@/components/ArticleComments/ArticleComments';
import { E8S, GAS_FEE } from '@/constant/config';
import { number, object } from 'yup';
import { Principal } from '@dfinity/principal';
import { canisterId as entryCanisterId } from '@/dfx/declarations/entry';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { usePathname, useRouter } from 'next/navigation';
import PromotedSVG from '@/components/PromotedSvg/Promoted';
import updateReward from '@/components/utils/updateReward';
import updateBalance from '@/components/utils/updateBalance';
import NewArticleComments from '@/components/ArticleComments/NewArticleComments';
import moment from 'moment';
import { ARTICLE_FEATURED_IMAGE_ASPECT, profileAspect } from '@/constant/sizes';
import CommentBox from '@/components/CommentBox/CommentBox';
import ConnectModal from '@/components/Modal';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { Date_m_d_y_h_m, dateTranslate } from '@/constant/DateFormates';
import TwitterSVGIcon from '@/components/twitterIconSVG/TwitterSVGIcon';
import { TAG_CONTENT_ROUTE } from '@/constant/routes';
import iconmessage from '@/assets/Img/Icons/icon-comment.png';
import InstagramShareButton from '@/components/InstagrameSahreBtn';
import {
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'next-share';
import TwitterShareButton2 from '@/components/TwitterBtn/TwitterBtn';
import logger from '@/lib/logger';
function VoteButton({
  isLiking,
  isLiked,
  handleLikeEntry,
  entry,
  commentsLength,
  tempLike,
  isFooter,
  commmentField,
}: {
  isLiking: boolean;
  isLiked: boolean;
  handleLikeEntry: () => void;
  entry: any;
  commentsLength: number;
  tempLike: number;
  isFooter?: boolean;
  commmentField?: any;
}) {
  const likeEntryMiddleWare = () => {
    if (entry.isPromoted && isLiked) return;
    handleLikeEntry();
    // setToggleLiked((prev) => !prev);
  };
  const disabled = isLiking || (entry.isPromoted && isLiked);
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <>
      {/* <ul className='vote-comment-list'> */}
      {/* <li
      > */}
      {!isFooter ? (
        <>
          <h6
            className={` ${disabled ? 'disabled' : ''}  ${isLiked ? ' liked' : ''
              }`}
            onClick={likeEntryMiddleWare}
            style={{
              pointerEvents: disabled ? 'none' : 'all',
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
            {parseInt(entry?.likes ?? '0') + tempLike}
          </h6>
          {/* </li> */}
          {/* </ul> */}
          <Link
            href='#'
            onClick={(e: any) => {
              e.preventDefault();

              commmentField?.current.focus();
              logger(commmentField?.current,"asdsadsadasdasd")
            }}
          >
            <h6>
              <Image
                src={iconcomment}
                alt='Comment'
                style={{ height: 25, width: 25, maxWidth: 25 }}
              />{' '}
              {commentsLength ?? ''} {t('Comments')}
            </h6>
          </Link>
        </>
      ) : (
        <>
          {' '}
          <li>
            <Link
              href='#'
              style={{
                pointerEvents: disabled ? 'none' : 'all',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.preventDefault();
                likeEntryMiddleWare();
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
                <Image
                  src={'/images/like.svg'}
                  alt='Icon Thumb'
                  style={{ maxWidth: 25 }}
                  height={25}
                  width={25}
                />
              )}{' '}
              {parseInt(entry?.likes ?? '0') + tempLike}
            </Link>
          </li>
          <li>
            <Link href={'#comment'}>
              <Image src={iconmessage} alt='Icon Comment' />{' '}
              {commentsLength ?? ''} {t('Comments')}
            </Link>
          </li>
        </>
      )}
    </>
  );
}

function MintButton({
  isMinting,
  isMinted,
  mintNft,
  entry,
  commentsLength,
  tempLike,
}: {
  isMinting: boolean;
  isMinted: boolean;
  mintNft: () => void;
  entry: any;
  commentsLength: number;
  tempLike: number;
}) {
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <>
      <ul className='vote-comment-list'>
        <Button
          onClick={mintNft}
          disabled={isMinted || isMinting}
          className='yellow-button black'
        >
          {isMinting ? (
            <Spinner size='sm' />
          ) : isMinted ? (
            t('minted')
          ) : (
            t('Mint')
          )}
        </Button>
      </ul>
    </>
  );
}

export default function NFTArticlePost({
  article,
  likeEntry,
}: {
  article: any;
  likeEntry: () => Promise<unknown>;
}) {
  const [isLiking, setIsLiking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [currentComment, setCurrentComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [tempLike, setTempLike] = useState(0);
  const [articleComments, setArticleComments] = useState([]);
  const [userArticleComments, setUserArticleComments] = useState<any>([]);
  const [loadmorecomments, setloadMoreComments] = useState<any>([]);
  const [countcomments, setcountcomments] = useState<number>(2);
  const [isArticleSubmitting, setIsArticleSubmitting] = useState(false);
  const [confirmTransaction, setConfirmTransaction] = useState(false);
  const [headingsHierarchy, setHeadingsHierarchy] = useState<any[]>();
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const CommentRoute = searchParams.get('route');
  const pathName = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [heading, setheading] = useState<any[]>([]);
  const [userImage, setuserImage] = useState('');
  const [hashTags, setHashTags] = useState('');
  const [quizId, setQuizId] = useState<any>(null);
  const [surveyId, setSurveyId] = useState<any>(null);
  const [reward, setRewardperuser] = useState<any>(null);

  const [showContent, setShowContent] = useState(true);
  const [isOldReaderLoading, setIsOldReaderLoading] = useState(false);

  const [promotionValues, setPromotionValues] = useState({
    icp: 0,
    // likes: 0,
  });
  const [userArticleCommentsLoading, setUserArticleCommentsLoading] =
    useState<boolean>(true);
  let gasFee = GAS_FEE / E8S;

  const { entry, user, userImg, featuredImage, userId, articleId, getEntry } =
    article;

  const {
    auth,
    setAuth,
    identity,
    principal,
    setReward,
    setBalance,
    setArticleHeadingsHierarchy,
    articleHeadingsHierarchy,
  } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
    identity: state.identity,
    principal: state.principal,
    setReward: state.setReward,
    setBalance: state.setBalance,
    setArticleHeadingsHierarchy: state.setArticleHeadingsHierarchy,
    articleHeadingsHierarchy: state.articleHeadingsHierarchy,
  }));

  const [adminMenuShows, setAdminMenuShows] = useState(
    articleHeadingsHierarchy
      ? new Array(articleHeadingsHierarchy.length).fill(false)
      : []
  );
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [articleIdList, setArticleIdList] = useState<string[]>([]);
  const [entrytype, setEntrytype] = useState('article');
  const [commentCount, setCommentCount] = useState(0);
  const [shareUrl, setSocialLink] = useState('#');
  const title = 'BlockZa';
  const statusString = Object.keys(entry.status)[0];
  const isPending = statusString == 'pending';
  const isRejected = statusString == 'rejected';
  const formikRef = useRef<FormikProps<FormikValues>>(null);
  const commmentField = useRef<any>(null);
  let [commentVal, setCommentVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const path = usePathname();
  const myDivRef = useRef<HTMLDivElement | null>(null);
  const initialPromoteVales = {
    ICP: 0,
  };

  const promotionSchema = object().shape({
    ICP: number().min(1, 'ICP cannot be less than 1'),
  });
  const [isRewarded, setIsRewarded] = useState(true);
  const myTagsRef = useRef<HTMLUListElement | null>(null);

  const router = useRouter();
  const handleShow = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    if (isArticleSubmitting) {
      return false;
    }
    setShowModal(false);
    setConfirmTransaction(false);
    setPromotionValues({
      icp: 0,
    });
  };

  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const handleConnectModal = () => {
    // e.preventDefault();
    setShowConnectModal(true);
    // setConnectLink(e);
  };
  const handleConnectModalClose = () => {
    setShowConnectModal(false);
  };
  const handleLikeEntry = async () => {
    if (!isUserConnected(auth, handleConnectModal)) return;

    setIsLiking(true);
    setIsLiked((prev) => {
      if (prev) {
        setTempLike(-1);
      } else {
        setTempLike(1);
      }
      return !prev;
    });

    likeEntry()
      .then((res: any) => {
        updateReward({ identity, auth, setReward });
        if (res[1]) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
        setIsLiking(false);
        setTempLike(0);
      })
      .catch(() => {
        setTempLike(0);
        setIsLiking(false);
      });
  };
  const getComments = async () => {
    const commentsActor = makeCommentActor({
      agentOptions: {
        identity,
      },
    });
    const comments = await commentsActor.getComments(articleId);

    if (comments.ok) {
      setArticleComments(comments.ok[0]);
    }
    if (comments.err) {
      setArticleComments([]);
    }
    setUserArticleCommentsLoading(false);
    if (userArticleComments.length > 10) {
      setloadMoreComments(userArticleComments.slice(0, 10));
    } else {
      setloadMoreComments(userArticleComments);
    }
  };
  const sendcomment = async (e: any) => {
    e.preventDefault();
    if (!isUserConnected(auth, handleConnectModal)) return;
    setIsCommenting(true);
    if (commentVal.trim().length < 1) {
      return toast.error(t("Comment can't be empty."));
    }
   
    try {
      if (isPending) {
        return toast.error(
          ` ${t('You can not add comment on pending')} ${entrytype}.`
        );
      }
      if (isRejected) {
        return toast.error(
          ` ${t('You can not add comment on rejected')} ${entrytype}.`
        );
      }
      if (commentVal.trim().length > 400) {
        return toast.error(t('Comment can not be more then 400 characters.'));
      }
      const commentsActor = makeCommentActor({
        agentOptions: {
          identity,
        },
      });
      const addedComment = await commentsActor.addComment(
        commentVal,
        userCanisterId,
        entryCanisterId,
        articleId,
        entry.title,
        entrytype
      );
      const user = await auth.actor.get_user_details([principal]);
      // const dateNow = moment.utc().format('MMMM Do, YYYY');
      const newComment = {
        creation_time: utcToLocal('', Date_m_d_y_h_m),
        user: user.ok[1],
        content: commentVal,
        userId: principal,
      };
      if (addedComment.ok) {
        setIsCommenting(false);
        setcountcomments((pre: any) => pre + 1);
        setCommentVal('');
        toast.success(t('Comment added successfully.'));
      } else {
        setIsCommenting(false);
        toast.error(t('Something went wrong.'));
      }
      setUserArticleComments((prev: any) => {
        return [newComment, ...prev];
      });

      handleCommented();
    } catch (err) {
      handleCommented();
    }
  };

  const handleCommented = () => {
    setIsCommenting(false);
    setCurrentComment('');
  };

  const mintNft = async () => {
    if (!isUserConnected(auth, handleConnectModal)) return;

    setIsMinting(true);
    const DIP721Actor = makeDIP721Canister({
      agentOptions: {
        identity,
      },
    });

    let metadata = {
      purpose: {
        Rendered: null,
      },
      key_val_data: [
        {
          key: 'name',
          val: {
            TextContent: entry.title,
          },
        },
        {
          key: 'contentType',
          val: {
            TextContent: entry.description,
          },
        },
        {
          key: 'locationType',
          val: {
            TextContent: articleId,
          },
        },
        {
          key: 'location',
          val: {
            TextContent:
              'blob:http://localhost:3000/fced82b4-377a-444a-a46b-2f9f96f6e9fd',
          },
        },
      ],
      data: [],
    };
    //console.log(await nftCanister.getMetadataDip721(receipt.Ok.token_id))
    // await window.ic.plug.agent.fetchRootKey()

    // let p = Principal.fromUint8Array(principal_id._arr)
    let receipt = await DIP721Actor.mintDip721(identity._principal, [metadata]);
    try {
      if (receipt.Ok) {
        let newNft = await DIP721Actor.getMetadataDip721(receipt.Ok.token_id);
        let minted = await entryActor.mintEntry(articleId, userCanisterId);
        setIsMinting(false);
        setIsMinted(true);
      } else if (receipt.Err) {
        setIsMinting(false);

        toast.error(
          'Sorry, there was an error while minting please reload the page and try again'
        );
      }
    } catch (error) {
      setIsMinting(false);
    }
  };
  const handleIsMinted = async () => {
    setIsMinting(true);

    let minted = await entryActor.mintEntry(articleId, userCanisterId);
    setIsMinting(false);
    setIsMinted(true);
  };
  const addComment = async () => {
    try {
      if (!isUserConnected(auth, handleConnectModal)) return;
      if (isPending) {
        return toast.error(
          ` ${t('You can not add comment on pending')} ${entrytype}.`
        );
      }
      if (isRejected) {
        return toast.error(
          ` ${t('You can not add comment on rejected')} ${entrytype}.`
        );
      }
      if (currentComment.trim().length > 400) {
        return toast.error(t('Comment can not be more then 400 characters.'));
      }
      setIsCommenting(true);
      const commentsActor = makeCommentActor({
        agentOptions: {
          identity,
        },
      });
      const addedComment = await commentsActor.addComment(
        currentComment,
        userCanisterId,
        entryCanisterId,
        articleId,
        entry.title,
        entrytype
      );
      const user = await auth.actor.get_user_details([principal]);
      // const dateNow = moment.utc().format('MMMM Do, YYYY');
      const newComment = {
        creation_time: utcToLocal('', Date_m_d_y_h_m),
        user: user.ok[1],
        content: currentComment,
        userId: principal,
      };
      setUserArticleComments((prev: any) => {
        return [newComment, ...prev];
      });

      handleCommented();
    } catch (err) {
      handleCommented();
    }
  };
  let increaseCount = () => {
    setCommentCount((pre) => pre + 1);
  };
  const getUserComments = async () => {
    const tempComments = await Promise.all(
      articleComments.reverse().map(async (comment: any) => {
        const userId = comment?.user.toString();
        const user = await auth.actor.get_user_details([userId]);
        const creatDate = comment.creation_time.toString();

        let tempCreation = commentTime(creatDate);
        const newComment = {
          creation_time: utcToLocal(creatDate, Date_m_d_y_h_m),
          newCreation: tempCreation,
          user: user.ok[1],
          userId: userId,
          content: comment.content,
        };
        return newComment;
      })
    );
    return tempComments;
  };
  // loadmore comments
  let loadMoreComments = () => {
    if (userArticleComments.length >= loadmorecomments.length) {
      setloadMoreComments(userArticleComments.slice(0, 10 * countcomments));
      setcountcomments((pre: any) => pre + 1);
    } else {
      toast.error(t('All comments has been loaded.'));
    }
  };

  const handlePromote = async () => {
    let rewardConfig = await entryActor.get_reward();

    let reward = parseFloat(rewardConfig.master);
    let platform = parseFloat(rewardConfig.platform);
    let admin = parseFloat(rewardConfig.admin);

    let promotionE8S = promotionValues.icp * E8S;
    // TODO ADJUST THIS
    // let gasInICP = gasFee * 5;
    // let gasInE8S = gasInICP * E8S;
    // let promotedICP = promotionE8S + gasInE8S;
    // let promotedICP = (reward / 100) * (promotionValues.icp * E8S);

    const article = {
      title: entry.title,
      description: entry.description,
      seoTitle: entry.seoTitle,
      seoSlug: entry.seoSlug,
      seoDescription: entry.seoDescription,
      seoExcerpt: entry.seoExcerpt,
      category: entry.category,
      subscription: entry.subscription,
      image: entry.image,
      isDraft: entry.isDraft,
      isPromoted: true,
      userName: entry.userName,
      imageTags: entry.imageTags,
      caption: entry.caption,
      tags: entry.tags,
      // promotionLikesTarget: promotionentry.likes,
      promotionICP: promotionE8S,
      pressRelease: entry.pressRelease,
      podcastImg: entry.podcastImg,
      isPodcast: entry.isPodcast,
      podcastVideoLink: entry.podcastVideoLink,
      isCompanySelected: entry.isCompanySelected,
      podcastImgCation: entry.podcastImgCation,
      companyId: entry.companyId,
    };
    entryActor
      .insertEntry(article, userCanisterId, true, articleId, commentCanisterId)
      .then((res: any) => {
        toast.success(t('Your article has been promoted successfuly'));
        updateBalance({ identity, auth, setBalance });
        setIsArticleSubmitting(false);
        getEntry();
        handleModalClose();
        // router.replace(`/article?articleId=${res.ok[1]}&promote=true`);

        // setIsArticleSubmitting(false);

        window.scrollTo(0, 0);
      })
      .catch((err: string) => {
        // setIsArticleSubmitting(false);

        setIsArticleSubmitting(false);
      });
  };
  const handleTransaction = async () => {
    try {
      setIsArticleSubmitting(true);

      let ledgerActor = await makeLedgerCanister({
        agentOptions: {
          identity,
        },
      });
      let acc: any = AccountIdentifier.fromPrincipal({
        principal: identity.getPrincipal(),
        // subAccount: identity.getPrincipal(),
      });

      let balance = await ledgerActor.account_balance({
        account: acc.bytes,
      });

      let rewardConfig = await entryActor.get_reward();

      let promotion = parseFloat(rewardConfig.master);
      let platform = parseFloat(rewardConfig.platform);
      let admin = parseFloat(rewardConfig.admin);
      let total = promotion + platform + admin;
      if (total !== 100) {
        setIsArticleSubmitting(false);
        handleModalClose();
        return toast.error(t('Error During Transaction'));
      }
      // let promotedICP = (reward / 100) * promotionValues.icp;
      let promotionE8S = promotionValues.icp * E8S;
      let promotionICP = (promotion / 100) * promotionE8S;
      let platformICP = (platform / 100) * promotionE8S;
      let adminICP = (admin / 100) * promotionE8S;
      let balanceICP = parseInt(balance.e8s) / E8S;
      let gasInE8s = GAS_FEE;
      // TODO ADJUST THIS
      let gasInICP = gasFee * 2 + gasFee / 5;
      let gasInE8S = gasInICP * E8S;
      let requiredICP = balanceICP + gasInICP;
      let approvingPromotionE8S = promotionE8S + gasInE8S;
      if (balance.e8s < approvingPromotionE8S) {
        setConfirmTransaction(false);
        setIsArticleSubmitting(false);
        return toast.error(
          `${t(
            'Insufficient balance to promote. Current Balance'
          )} ${balanceICP} ${t(
            t('please transfer assets to your wallet to promote article')
          )}`
        );
      } else {
      }

      if (!entryCanisterId) return toast.error(t('Error in transaction'));
      let entryPrincipal = Principal.fromText(entryCanisterId);
      let approval = await ledgerActor.icrc2_approve({
        amount: approvingPromotionE8S,
        spender: {
          owner: entryPrincipal,
          subaccount: [],
        },
        fee: [GAS_FEE],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        expected_allowance: [],
        expires_at: [],
      });
      if (approval.Ok) {
        setTimeout(() => {
          handlePromote();
        }, 100);
      }
    } catch (e) {
      console.error(e);
      setIsArticleSubmitting(false);
    }
  };
  const createHeadingId = (headingText: string) => {
    if (!headingText) return;
    return headingText.toLowerCase().replace(/\s+/g, '-');
  };
  function extractHeadingText(node: any): string {
    if (node.children && node.children.length > 0) {
      let headingText = '';

      for (const childNode of node.children) {
        if (childNode.type === 'text') {
          headingText += childNode.data;
        } else if (
          childNode.type === 'tag' &&
          (childNode.name === 'strong' || childNode.name === 'span')
        ) {
          headingText += extractHeadingText(childNode);
        }
      }

      return headingText.trim();
    } else if (node.data) {
      return node.data.trim();
    } else {
      return '';
    }
  }

  const parseOptions = {
    replace: (node: any) => {
      if (node.name === 'h2' || node.name === 'h3') {
        const headingText = extractHeadingText(node);
        const headingId = createHeadingId(headingText);

        node.attribs.id = headingId;
        if (node.attribs.style && typeof node.attribs.style === 'string') {
          delete node.attribs.style;
        }

        let newH1 = React.createElement(node.name, node.attribs, [
          React.createElement('span', { key: 'headingText' }, headingText),
        ]);
        return newH1;
      }

      return undefined;
    },
  };

  const smoothScroll = (targetId: any) => {
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth',
      });
    }
  };
  function getTextValues(data: any) {
    let result: string[] = [];
    data.forEach((item: any) => {
      result.push(item.text);
      if (item.children.length > 0) {
        result = result.concat(getTextValues(item.children));
      }
    });
    return result;
  }

  const handleNavigationClick = (headingText: any) => {
    const headingId = createHeadingId(headingText);
    smoothScroll(headingId);
  };
  const getHeadingsHierarchy = () => {
    if (!myDivRef.current) return;
    const headings = myDivRef.current.querySelectorAll('h2');
    const hierarchy: any[] = [];
    // console.log(headings, 'hhhhhhh');
    headings.forEach((heading: any) => {
      const headingText = heading.innerText;
      const headingLevel = heading.nodeName.toLowerCase();

      if (!hierarchy[headingLevel]) {
        hierarchy[headingLevel] = [];
      }

      hierarchy[headingLevel].push({ text: headingText, level: headingLevel });
    });

    return hierarchy;
  };
  const getHeadingsHierarchy1 = () => {
    // if (!myDivRef.current) return;
    const tempDiv = myDivRef?.current;
    const hierarchy2: any[] = [];
    tempDiv?.childNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        if (node.tagName === 'H2') {
          // Found an H2 heading, update currentH2
          // let temph2 = node.lastChild;
          // if (temph2 instanceof Element) {

          //   let tempObj = {
          //     text: temph2.textContent,
          //     level: 'h2',
          //     children: [],
          //   };
          //   hierarchy2.push(tempObj);
          // }

          let currentH2 = {
            text: node.innerText.trim(),
            level: 'h2',
            children: [],
          };
          hierarchy2.push(currentH2);
        } else if (
          node.tagName === 'H3' ||
          node.tagName === 'H4' ||
          node.tagName === 'H5' ||
          node.tagName === 'H6'
        ) {
          if (hierarchy2.length != 0) {
            const lastItem = hierarchy2[hierarchy2.length - 1];
            if (lastItem.level === 'h3') {
              let tempObjLV2 = {
                text: node.innerText,
                level: 'h3',
                children: [],
              };
              hierarchy2.push(tempObjLV2);
            } else {
              let tempObjLV2 = {
                text: node.innerText,
                level: 'h2',
                children: [],
              };
              lastItem.children.push(tempObjLV2);
            }
          } else {
            let tempObj = {
              text: node.innerText,
              level: 'h3',
              children: [],
            };
            hierarchy2.push(tempObj);
          }
        }
      }
    });

    return hierarchy2;
  };
  const { t, changeLocale } = useLocalization(LANG);
  const generateNestedList = (headings: any) => {
    if (headings.length == 0) {
      return null;
    }
    return headings.map((item: any, outerIndex: any) => {
      // const headingLevel = headings[level];
      // console.log(headingLevel, level, headings, 'hehehe');
      return (
        <li key={outerIndex} className={'no-style'}>
          <div>
            <div className='d-flex align-items-center border-0'>
              <Image
                src={adminMenuShows[outerIndex] ? angledown : angleright}
                alt='admin'
                className='me-2'
                onClick={() => {
                  const updatedAdminMenuShows = [...adminMenuShows];
                  updatedAdminMenuShows[outerIndex] =
                    !updatedAdminMenuShows[outerIndex];
                  setAdminMenuShows(updatedAdminMenuShows);
                }}
                style={{
                  height: '16px',
                  width: adminMenuShows[outerIndex] ? '14px' : '10px',
                }}
              />

              {/* <Image src={admin1} alt='admin' /> */}
              <p
                onClick={() => {
                  handleNavigationClick(item.text);
                }}
                className={` ${activeSection === createHeadingId(item.text) ? 'activeHD' : ''
                  } mb-0`}
              >
                {item.text}
              </p>
            </div>

            <div
              style={{ display: adminMenuShows[outerIndex] ? 'block' : 'none' }}
              className='ms-4'
            >
              {item.children.length != 0 &&
                item.children.map((e: any, index: any) => {
                  return (
                    <div
                      onClick={() => {
                        handleNavigationClick(e.text);
                      }}
                      key={index}

                    // className={headingLevel.length > 1 ? 'no-style' : ''}
                    >
                      <p
                        className={` ${activeSection === createHeadingId(e.text)
                            ? 'activeHD'
                            : ''
                          } mb-0`}
                      >
                        <span> - </span>
                        {e.text}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        </li>
      );
    });
  };
  let copyToClipboard = (e: any, link: string) => {
    e.preventDefault();
    let newPath = path?.split('/');
    // newPath = newPath + link;
    // const currentURL = window.location.href.split('/');
    // const fetched = currentURL[2] + '/';
    let location = window.navigator.clipboard.writeText(window.location.href);
    toast.success(t('URL copied to clipboard'));
  };
  useEffect(() => {
    if (entry?.likedUsers && identity && entry?.minters) {
      setIsMinted(false);

      const likedarray: any = [];
      entry?.likedUsers.map((likedUser: any) => {
        const likedUserText = likedUser.toString();
        likedarray.push(likedUserText);
        if (identity._principal) {
          if (likedUserText === identity?._principal.toString()) {
            setIsLiked(true);
          }
        }
      });
      const mintersArray: any = [];
      entry?.minters.map((minter: any) => {
        const minterUserText = minter.toString();
        mintersArray.push(minterUserText);
        if (minterUserText === identity._principal.toString()) {
          setIsMinted(true);
        }
      });
    }
  }, [entry, identity, auth]);
  useEffect(() => {
    if (auth.client) {
      getComments();

      const _headingsHierarchys = getHeadingsHierarchy1();
      setHeadingsHierarchy(_headingsHierarchys);
      setArticleHeadingsHierarchy(_headingsHierarchys);
      // headingsHierarchy.map((d: any) => {
      //   console.log(d, 'it tried');
      // });
    }
  }, [auth, entry]);
  useEffect(() => {
    let socialLink = window.location.href;
    // setSocialLink(`https://7uioq-vyaaa-aaaal-ac6ea-cai.icp0.io/${path}`)
    setSocialLink(socialLink);
  }, []);
  useEffect(() => {
    if (articleComments.length > 0) {
      const tempFun = async () => {
        const newComments = await getUserComments();
        setUserArticleComments(newComments);
      };
      setUserArticleCommentsLoading(false);

      tempFun();
    } else {
      setUserArticleComments([]);
    }
  }, [articleComments]);
  useEffect(() => {
    if (entry) {
      let entrytype = t('article');
      if (entry?.isPodcast) {
        entrytype = t('podcast');
      }
      if (entry?.pressRelease) {
        entrytype = t('pressRelease');
      }
      setEntrytype(entrytype);
    }
  }, [entry]);
  const getUser = async (userId: string) => {
    let newUser = null;
    if (!userId) return;

    newUser = await auth.actor.get_user_details([userId]);
    if (newUser.ok) {
      if (newUser.ok[1].profileImg.length != 0) {
        let userImg = await getImageById(newUser.ok[1].profileImg[0]);
        setuserImage(userImg);
      }
    }
  };
  let OpenCategory = (id: string) => {
    router.push(`/category-details?category=${id}`);
  };
  useEffect(() => {
    if (identity) {
      getUser(identity?._principal?.toString());
    }
  }, [auth, identity]);
  useEffect(() => {
    if (userArticleComments.length > 10) {
      setloadMoreComments(userArticleComments);
    } else {
      setloadMoreComments(userArticleComments);
    }
    setCommentCount(userArticleComments.length);
  }, [userArticleComments]);
  // copy atrical link to  share
  let copyArticleLink = (e: any) => {
    e.preventDefault();
    const currentURL = window.location.href;
    window.navigator.clipboard.writeText(currentURL);
    toast.success(t('URL copied to clipboard'));
  };
  useEffect(() => {
    if (entry) {
      const stringsArray = entry.tags;
      const hashtagString = stringsArray.map((str: any) => `#${str}`).join(' ');
      setHashTags(hashtagString);
    }
  }, [entry]);
  useEffect(() => {
    if (CommentRoute == 'comments') {
      // var targetElement = document.getElementById('commentbox');
      var targetElement = document.getElementById('commentbox');
      if (targetElement) {
        var yOffset =
          targetElement.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: yOffset, behavior: 'smooth' });
      }
    }
  }, [CommentRoute, entry]);
  useEffect(() => {
    let currentSection = '';

    const handleScroll = () => {
      const sections = articleIdList;

      sections.forEach((section) => {
        const sectionElement = document.getElementById(section);

        if (sectionElement) {
          const sectionTop = sectionElement.getBoundingClientRect().top;
          if (sectionTop <= 10 && sectionTop >= -5) {
            currentSection = section;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [articleIdList]);

  useEffect(() => {
    if (headingsHierarchy) {
      let idsArray = getTextValues(headingsHierarchy);
      idsArray.forEach((hId) => {
        return createHeadingId(hId);
      });
      for (let heading = 0; heading < idsArray.length; heading++) {
        let responseId = createHeadingId(idsArray[heading]);
        if (responseId) {
          idsArray[heading] = responseId;
        }
      }
      setArticleIdList(idsArray);
    } else {
    }
  }, [headingsHierarchy]);
  const entryActorDefault = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  let getQuizOfEntry = async (articleId: any) => {
    let quiz = await entryActorDefault.getOnlyActiveQuizOfArticle(articleId);
    logger(quiz,"jgsdjhfgjhsadgfasdfasdfasdf")

    if (quiz && quiz.length != 0) {
      setQuizId(quiz[0]);
      // setRewardperuser(quiz[1])
    } else {
      setQuizId(null);
    }
  };
  let getSurveyOfEntry = async (articleId: any) => {
    let survey = await entryActorDefault.getOnlyActiveSurveyOfArticle(
      articleId
    );
    if (survey && survey.length != 0) {
      setSurveyId(survey[0]);
    } else {
      setSurveyId(null);
    }
  };
  useEffect(() => {
    if (articleId ) {
      getQuizOfEntry(articleId);
      getSurveyOfEntry(articleId);
      if(identity){

        isAlreadyRead();
      }
    }
  }, [articleId, identity]);
  async function completeReadArticle() {
    const userActor = makeUserActor({
      agentOptions: {
        identity,
      },
    });
    if (countApiCall == 1) {
      let quiz = await userActor.addReaderOfEntry(articleId, entryCanisterId);

    }
  }
  var countApiCall = 0;
  const handleScroll = () => {
    if (isRewarded) return;
    const decEnd = myTagsRef.current;
    if (decEnd) {
      let divBottom = decEnd.getBoundingClientRect().top;
      let scrollBottom = divBottom - window.innerHeight;

      if (scrollBottom <= 0) {
        if (articleId && !isOldReaderLoading && !isRewarded) {
          setIsRewarded(true);
          countApiCall += 1;
          setIsOldReaderLoading(true);
          completeReadArticle();
        }
      }
    }
  };
  async function isAlreadyRead() {
    const userActor = makeUserActor({
      agentOptions: {
        identity,
      },
    });
    let quiz = await userActor.isAlreadyReadTheEntry(articleId);
    setIsRewarded(quiz);
  }

  useEffect(() => {
    if (!isRewarded) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isRewarded]);


  return (
    <>
      <Row>
        <Col
          xxl={{ span: '4', order: 1 }}
          xl={{ span: '4', order: 1 }}
          lg={{ span: '12', order: 3 }}
          md={{ span: '12', order: 3 }}
          sm={{ span: '12', order: 3 }}
          xs={{ span: '12', order: 3 }}
        >
          <div style={{ position: 'sticky', minHeight: '10px', top: '0' }}>
            {articleHeadingsHierarchy &&
              articleHeadingsHierarchy.length != 0 && (
                <div className='d-none d-xl-block'>
                  <Dropdown
                    onClick={() => setShowContent((pre) => !pre)}
                    className='mb-2'
                  >
                    <Dropdown.Toggle
                      variant='success'
                      className='fill'
                      id='dropdown-basic'
                    >
                      {t('All Content')}{' '}
                      {showContent ? (
                        <i className='fa fa-angle-down' />
                      ) : (
                        <i className='fa fa-angle-right' />
                      )}
                    </Dropdown.Toggle>
                  </Dropdown>
                  <ul
                    className='article-menu mt-2'
                    style={{ display: showContent ? 'block' : 'none' }}
                  >
                    {articleHeadingsHierarchy ? (
                      <>{generateNestedList(articleHeadingsHierarchy)}</>
                    ) : null}
                  </ul>
                </div>
              )}

            <div id='comments' />
            <div className='comment-card web-view-display' id='commentbox'>
              <div className='card-header'>
                <span style={{ maxHeight: 18 }}>
                  <Image
                    src={'/images/idea.png'}
                    alt='idea'
                    width={18}
                    height={18}
                  />
                </span>

                <p>
                  {t('Share your thoughts with top leaders in this feature')}
                </p>
              </div>
              <div className='card-body'>
                {userArticleCommentsLoading ? (
                  <div className='d-flex justify-content-center'>
                    {' '}
                    <Spinner animation='border' variant='primary' />
                  </div>
                ) : (
                  <NewArticleComments
                    userArticleComments={loadmorecomments}
                    totalcomment={userArticleComments}
                  />
                )}
              </div>

              <div className='card-footer'>
                <div className='boost-info'>
                  <div className='img-notice'>
                    <Image src='/images/notice.png' alt='notice' fill />
                  </div>
                  <div>
                    {t('Boost your expertise, contribute now!')}{' '}
                    <span>
                      <Image
                        src='/images/crown.png'
                        alt='crown'
                        className='pb-1'
                        width={15}
                        height={15}
                      />{' '}
                      {t('Earn the Web3 Expert Badge')}
                    </span>{' '}
                    {t(
                      'for your insights in this field. – your path to distinction is just a click away!'
                    )}
                  </div>
                </div>
              </div>
              <div className='txt-pnl-input mt-1'>
                <div
                  className=''
                  style={{
                    aspectRatio: profileAspect,
                    position: 'relative',
                    width: '45px',
                  }}
                >
                  <Image
                    src={userImage != '' ? userImage : girl}
                    alt='notice'
                    fill
                    className='rounded-circle'
                  />
                </div>
                <input
                  type='text'
                  placeholder={t('share your opinion')}
                  value={currentComment}
                  onChange={(e) => setCurrentComment(e.target.value)}
                  // value={commentVal}
                  ref={commmentField}
             
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addComment();
                    }
                  }}
                // onChange={(e) => setCommentVal(e.target.value)}
                />
              </div>
              <div className='d-flex justify-content-end'>
                <Button
                  disabled={isCommenting || currentComment.length <= 0}
                  onClick={addComment}
                  className='reg-btn blue-btn font-weight-normal pdng brder0'
                >
                  {isCommenting ? (
                    <Spinner animation='border' size='sm' />
                  ) : (
                    t('ADD')
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Col>
        <Col
          xxl={{ span: '8', order: 2 }}
          xl={{ span: '8', order: 2 }}
          lg={{ span: '12', order: 2 }}
          md={{ span: '12', order: 2 }}
        >
          <div className='article-detail-pnl new '>
            {entry ? (
              <>
                <h1 className='blue-title'>{entry?.title ?? ''}</h1>
                <div className='top-img new'>
                  {/* <Image src={post1} alt='Post' /> */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      margin: '0 auto',
                      aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT,
                    }}
                  >
                    {(isPending || isRejected) && (
                      <div className='status-tip'>
                        <Tippy
                          content={
                            <div>
                              <p className='m-0'>
                                {isPending &&
                                  t('Your Article will be reviewed soon')}
                                {isRejected &&
                                  t('Your Article Review has been rejected')}
                              </p>
                            </div>
                          }
                        >
                          <p className={`${statusString} status`}>
                            {/* {statusString} */}
                            {isPending && t('Pending')}
                            {isRejected && t('Rejected')}
                          </p>
                        </Tippy>
                      </div>
                    )}
                    {entry?.isPromoted && (
                      <div className='promotedlable'>
                        <PromotedSVG />
                        {/* <Image
                      src={promotedIcon2}
                      alt='promoted icon'
                      height={25}
                      width={25}
                      className='me-2 '
                    />{' '} */}
                        <p className='mb-0' style={{ fontWeight: '600' }}>
                          {t('Promoted Article')}
                        </p>
                      </div>
                    )}
                    <Tippy
                      content={
                        <p className='mb-0 ' style={{ overflow: 'hidden' }}>
                          {entry.caption}
                        </p>
                      }
                    >
                      <div>
                        <Image
                          src={featuredImage ? featuredImage : post1}
                          className='backend-img'
                          fill={true}
                          alt={`${entry.caption}`}
                        />
                      </div>
                    </Tippy>
                  </div>
                </div>
                <div
                  className='btnnn'
                  style={{
                    position: 'relative',
                    right: '15px',
                    bottom: '0px',
                    zIndex: '5',
                  }}
                  
                >
        
                  {!(
                    statusString == 'pending' || statusString == 'rejected'
                  ) && (
                      <div className='d-flex justify-content-end'>
                        {!entry.isPromoted &&
                          !entry.pressRelease &&
                          !entry.isPodcast &&
                          identity &&
                          identity._principal &&
                          identity._principal.toString() === userId && (
                            <div>
                              <Button
                                className='yellow-button btn promotebtn'
                                onClick={handleShow}
                              >
                                {t(' Promote Article')}
                              </Button>
                            </div>
                          )}
                        {auth.state === 'initialized' &&
                          !entry.pressRelease &&
                          !entry.isPodcast && (
                            <MintButton
                              isMinted={isMinted}
                              isMinting={isMinting}
                              mintNft={mintNft}
                              entry={entry}
                              commentsLength={userArticleComments.length}
                              tempLike={tempLike}
                            />
                          )}
                      </div>
                    )}
                                 <div className='d-flex justify-content-end'>

{quizId && (
  <div>
    <Button
     
      className='rounded-0 fill dropdown-toggle btn btn-success mb-1 quizandsurveybtns'
      onClick={() => {
        if (!isUserConnected(auth, handleConnectModal)) return;
        router.push(`${TAKEQUIZPAGE+quizId}`);
      }}
    >
      Take Quiz
    </Button>
  </div>
)}

{surveyId && (
  <div>
    <Button
    
      className='ms-3 fill rounded-0 dropdown-toggle btn btn-success mb-1 quizandsurveybtns'
      onClick={() => {
        if (!isUserConnected(auth, handleConnectModal)) return;
        router.push(`${SURVEY}?id=${surveyId}`);
      }}
    >
      Take Survey
    </Button>
  </div>
)}
</div>
                </div>
                {/* Shery */}
                {articleHeadingsHierarchy &&
                  articleHeadingsHierarchy.length != 0 && (
                    <div className='mobile-view-display w-100'>
                      <div className='spacer-20' />
                      <Dropdown
                        onClick={() => setShowContent((pre) => !pre)}
                        className='mb-2'
                      >
                        <Dropdown.Toggle
                          variant='success'
                          className='fill'
                          id='dropdown-basic'
                        >
                          {t('All Content')}{' '}
                          {showContent ? (
                            <i className='fa fa-angle-down' />
                          ) : (
                            <i className='fa fa-angle-right' />
                          )}
                        </Dropdown.Toggle>
                      </Dropdown>
                      <ul
                        className='article-menu mt-2'
                        style={{ display: showContent ? 'block' : 'none' }}
                      >
                        {articleHeadingsHierarchy ? (
                          <>{generateNestedList(articleHeadingsHierarchy)}</>
                        ) : null}
                      </ul>
                    </div>
                  )}

                <div className='post-info-head web-view-display'>
                 
                </div>

                <div className='text-detail-pnl'>
                  <div
                    // style={{ maxHeight: '70vh', overflowY: 'auto' }}
                    id='articalPrev'
                    ref={myDivRef}
                  >
                    {/* <h3>{entry?.title ?? ''}</h3> */}
                    {parse(entry?.description ?? '', parseOptions)}
                  </div>

                  <ul className='hash-list' ref={myTagsRef}>
                    {entry?.tags.map((tag: any, index: number) => (
                      <li
                        key={index}
                        onClick={() =>
                          router.push(`${TAG_CONTENT_ROUTE}?tag=${tag}`)
                        }
                        style={{ cursor: 'pointer' }}
                      >
                        <span>#</span> {tag}
                      </li>
                    )) ?? ''}
                  </ul>
                  <div className='d-flex justify-content-end'>

                    {quizId && (
                      <div>
                        <Button
                          className=' rounded-0 fill dropdown-toggle btn btn-success mb-1 quizandsurveybtns'
                          onClick={() => {
                            if (!isUserConnected(auth, handleConnectModal)) return;
                            router.push(`${TAKEQUIZPAGE+quizId}`);
                          }}
                        >
                          Take Quiz
                        </Button>
                      </div>
                    )}

                    {surveyId && (
                      <div>
                        <Button
                          className='ms-3 fill rounded-0 dropdown-toggle btn btn-success mb-1 quizandsurveybtns'
                          onClick={() => {
                            if (!isUserConnected(auth, handleConnectModal)) return;
                            router.push(`${SURVEY}?id=${surveyId}`);
                          }}
                        >
                          Take Survey
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className='mobile-view-display w-100'>
                    <CommentBox
                      entryId={articleId}
                      isOpen={true}
                      entryTitle={entry?.title}
                      entryType={entrytype}
                      increaseCount={increaseCount}
                      isPending={isPending}
                      isRejected={isRejected}
                      useRef={commmentField}
                    />
                  </div>
                  {!(isPending || isRejected) && (
                    <div className='mobile-view-display w-100 m-0'>
                      <ul className='post-comment-like-pnl'>
                        <li>
                          {isLiked ? (
                            <Image
                              src={'/images/liked.svg'}
                              alt='Icon Thumb'
                              style={{ maxWidth: 18 }}
                              height={18}
                              width={18}
                            />
                          ) : (
                            <Image
                              src={'/images/like.svg'}
                              alt='Icon Thumb'
                              style={{ maxWidth: 18 }}
                              height={18}
                              width={18}
                            />
                          )}{' '}
                          {parseInt(entry?.likes ?? '0') + tempLike}
                        </li>
                        <li>
                          <Link
                            href='#'
                            onClick={(e: any) => {
                              e.preventDefault();
                              commmentField?.current.focus();
                            }}
                          >
                            <h6>
                              <Image
                                src={iconcomment}
                                alt='Comment'
                                style={{ height: 18, width: 18, maxWidth: 18 }}
                              />
                              {parseInt(`${commentCount}`)}
                            </h6>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                  <div className='count-top' />

                  {!(isPending || isRejected) && (
                    <>
                      <div className='count-description-pnl d-flex justify-content-between mm-0'>
                        {/* <div className='d-flex gap-3'> */}
                        <h6>
                          <div className='viewbox py-1'>
                            <i className='fa fa-eye fill blue-icon fa-lg me-1' />
                            {t('Views')}
                            <span className='mx-1'>|</span>
                            {formatLikesCount(parseInt(entry?.views))}
                          </div>
                        </h6>
                        <VoteButton
                          isLiked={isLiked}
                          isLiking={isLiking}
                          handleLikeEntry={handleLikeEntry}
                          entry={entry}
                          commentsLength={commentCount}
                          tempLike={tempLike}
                          commmentField={commmentField}
                        />
                        <h6
                          onClick={(e) =>
                            copyToClipboard(e, `article?articleId=${articleId}`)
                          }
                        >
                          <Image src={iconshare} alt='Icon Comment' />
                          {t('Share')}
                        </h6>
                      </div>
                      <div
            className='footer_pnl_article_detail count-description-pnl pt-2 pb-2'
           
          >
            <div
              className=''
              style={{
                aspectRatio: profileAspect,
                position: 'relative',
                width: '55px',
              }}
            >
              <Image
                src={userImage != '' ? userImage : girl}
                alt='notice'
                fill
                className='rounded-circle userImg'
              />
            </div>
            <div className='txt-pnl'>
              <input
                type='text'
                placeholder={t('share your opinion')}
                value={commentVal}
                ref={inputRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendcomment(e);
                  }
                }}
                onChange={(e) => setCommentVal(e.target.value)}
              />
              {commentVal.length > 0 ? (
                <ul>
                  <li>
                    {isCommenting ? (
                      <Spinner animation='border' size='sm' />
                    ) : (
                      <Link href='#' onClick={sendcomment}>
                        <i className='fa fa-send' />
                      </Link>
                    )}
                  </li>
                </ul>
              ) : (
                <ul>
                  <li>
                    <Link
                      href='#'
                      style={{ pointerEvents: 'none' }}
                      className='disabled'
                    >
                      <i className='fa fa-send' />
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
                      <div className='text-center'>
                        <ul className='mobile-view-display-inline-flex comment-social-list'>
                          <li>
                            {/* <Link href='#' target='_blank'>
                              <i className='fa fa-facebook'/>
                            </Link> */}
                            <FacebookShareButton
                              url={shareUrl}
                              quote={title}
                              hashtag={hashTags}
                            >
                              <i className='fa fa-facebook' />
                            </FacebookShareButton>
                          </li>
                          <li>
                            {/* <Link href='#' target='_blank'>
                              <TwitterSVGIcon color='white' />
                            </Link> */}
                            <TwitterShareButton
                              url={
                                'https://7uioq-vyaaa-aaaal-ac6ea-cai.icp0.io/'
                              }
                              title={title}
                              className='instagramebtn'
                              hashtags={entry?.tags}
                            >
                              <TwitterSVGIcon color='white' />
                            </TwitterShareButton>
                            {/* <TwitterShareButton2
                              url='https://7uioq-vyaaa-aaaal-ac6ea-cai.icp0.io/'
                              text={`${title}`}
                            /> */}
                          </li>
                          <li>
                            {/* <Link href='#' target='_blank'>
                              <i className='fa fa-pinterest'/>
                            </Link> */}
                            <PinterestShareButton
                              url={shareUrl}
                              media={featuredImage}
                              description={title}
                            >
                              <i className='fa fa-pinterest' />
                            </PinterestShareButton>
                          </li>
                          <li>
                            {/* <Link href='#' target='_blank'>
                              <i className='fa fa-instagram'/>
                            </Link> */}
                            <InstagramShareButton url={featuredImage} />
                          </li>
                          <li>
                            {/* <Link href='#' target='_blank'>
                              <i className='fa fa-telegram'/>
                            </Link> */}
                            <TelegramShareButton url={shareUrl} title={title}>
                              <i className='fa fa-telegram' />
                            </TelegramShareButton>
                          </li>
                          <li>
                            {/* <Link href='#' target='_blank'>
                              <i className='fa fa-linkedin'/>
                            </Link> */}
                            <LinkedinShareButton url={window.location.origin}>
                              <i className='fa fa-linkedin' />
                            </LinkedinShareButton>
                          </li>
                          <li>
                            {/* <Link href='#' target='_blank'>
                              <i className='fa fa-whatsapp'/>
                            </Link> */}
                            <WhatsappShareButton url={shareUrl} title={title}>
                              <i className='fa fa-whatsapp' />
                            </WhatsappShareButton>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
                {!(isPending || isRejected) && (
                  <div className='footer-comment-pnl'>
                    <ul>
                      <VoteButton
                        isLiked={isLiked}
                        isLiking={isLiking}
                        handleLikeEntry={handleLikeEntry}
                        entry={entry}
                        commentsLength={commentCount}
                        tempLike={tempLike}
                        isFooter={true}
                      />

                      <li>
                        <Link
                          href='#'
                          onClick={(e) => {
                            e.preventDefault();
                            copyToClipboard(
                              e,
                              `article?articleId=${articleId}`
                            );
                          }}
                        >
                          <Image src={iconshare} alt='Icon Share' /> Share
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className='d-flex justify-content-center my-4'>
                <Spinner animation='border' variant='secondary' />
              </div>
            )}
          </div>
        </Col>
      </Row>
      <Modal show={showModal} centered onHide={handleModalClose}>
        <Modal.Body>
          {confirmTransaction ? (
            <>
              <div className='flex-div connect-heading-pnl mb-3'>
                {/* <i className='fa fa-question-circle-o'/> */}
                <p />
                <p className='text-bold h5 fw-bold m-0'>
                  {t('Confirm Transaction')}
                </p>
                {/* <i onClick={handleModalClose} className='fa fa-close'/> */}
                <i
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={handleModalClose}
                  className='fa fa-close'
                />
                {/* <Button
          className='close-btn'
        /> */}
              </div>
              <div>
                <p className='text-secondary'>
                  {t('Are you sure you want to promote your article for ')}{' '}
                  {(promotionValues.icp + gasFee * 2 + gasFee / 5).toFixed(6)}{' '}
                  {t('Blockza tokens')}?
                </p>
                <p className=' d-flex  justify-content-between mb-0'>
                  <span>{t('Transaction fee:')}</span>{' '}
                  <span className='text-secondary'>
                    {gasFee * 2 + gasFee / 5} ICP
                  </span>
                </p>
                <p className='d-flex justify-content-between mb-1'>
                  {/* <span
                    style={{
                      border: '2px',
                    }}
                  > */}
                  <span>{t('Promotion amount:')}</span>{' '}
                  <span className='text-secondary'>
                    {promotionValues.icp} ICP
                  </span>
                  {/* </span> */}
                </p>
                <div
                  style={{
                    height: 1,
                    backgroundColor: 'gray',
                    width: '100%',
                  }}
                />
                <p className=' d-flex justify-content-between mt-1 mb-0'>
                  <span> </span>{' '}
                  <span className='text-secondary'>
                    {(promotionValues.icp + gasFee * 2 + gasFee / 5).toFixed(6)}{' '}
                    ICP
                  </span>
                </p>
              </div>
              <div className='d-flex justify-content-center mt-2'>
                <Button
                  className='publish-btn w-100 mt-2 py-2'
                  disabled={isArticleSubmitting}
                  onClick={handleTransaction}
                // type='submit'
                >
                  {isArticleSubmitting ? <Spinner size='sm' /> : t('Confirm')}
                </Button>
              </div>
            </>
          ) : (
            <Formik
              initialValues={initialPromoteVales}
              // innerRef={formikRef}
              // enableReinitialize
              validationSchema={promotionSchema}
              onSubmit={async (values, actions) => {
                setPromotionValues({
                  icp: values.ICP,
                  // likes: values.likesCount,
                });
                setConfirmTransaction(true);
                // formikRef.current?.handleSubmit();
                // await uploadEntry(values, actions);
              }}
            >
              {({ errors, touched, handleChange }) => (
                <FormikForm
                  className='flex w-full flex-col items-center justify-center'
                // onChange={(e) => handleImageChange(e)}
                >
                  <Field name='icp'>
                    {({ field, formProps }: any) => (
                      <Form.Group
                        className='mb-2'
                        controlId='exampleForm.ControlInput1'
                      >
                        <div className='d-flex justify-content-between w-100'>
                          <Form.Label>ICP</Form.Label>
                          <i
                            style={{
                              cursor: 'pointer',
                            }}
                            onClick={handleModalClose}
                            className='fa fa-close'
                          />
                        </div>

                        <Form.Control
                          type='number'
                          placeholder={t('Enter ICP Amount')}
                          value={field.value}
                          onChange={handleChange}
                          name='ICP'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mb-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='ICP'
                      component='div'
                    />
                  </div>
                  <Button
                    className='publish-btn'
                    disabled={isArticleSubmitting}
                    type='submit'
                  >
                    {isArticleSubmitting ? <Spinner size='sm' /> : t('Promote')}
                  </Button>
                </FormikForm>
              )}
            </Formik>
          )}
        </Modal.Body>
      </Modal>
      <ConnectModal
        handleClose={handleConnectModalClose}
        showModal={showConnectModal}
      />
    </>
  );
}
