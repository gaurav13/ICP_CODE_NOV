import NewArticleComments from '@/components/ArticleComments/NewArticleComments';
import { profileAspect } from '@/constant/sizes';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Button, Spinner, Form } from 'react-bootstrap';
import girl from '@/assets/Img/user-img.png';
import user from '@/assets/Img/user.png';
import { makeCommentActor } from '@/dfx/service/actor-locator';
import { useConnectPlugWalletStore } from '@/store/useStore';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { toast } from 'react-toastify';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import {
  commentTime,
  isUserConnected,
  utcToLocal,
} from '@/components/utils/utcToLocal';
import logger from '@/lib/logger';
import moment from 'moment';
import { getImage } from '@/components/utils/getImage';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import ConnectModal from '@/components/Modal';
import { Date_m_d_y_h_m, dateTranslate } from '@/constant/DateFormates';
import { canisterId as entryCanisterId } from '@/dfx/declarations/entry';

export default function CommentBox({
  isArticle,
  entryId,
  isOpen,
  entryTitle,
  entryType,
  increaseCount,
  isRejected,
  isPending,
  useRef,
}: {
  isArticle?: boolean;
  entryId: string;
  isOpen?: boolean;
  entryTitle: Text;
  entryType: any;
  increaseCount?: any;
  isRejected: boolean;
  isPending: boolean;
  useRef?: any;
}) {
  const { auth, setAuth, identity, principal } = useConnectPlugWalletStore(
    (state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
    })
  );
  const [currentComment, setCurrentComment] = useState('');
  const { t, changeLocale } = useLocalization(LANG);
  const [isCommenting, setIsCommenting] = useState(false);
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const articleId = entryId;
  const [userImage, setuserImage] = useState('');
  const [userArticleComments, setUserArticleComments] = useState<any>([]);
  const [loadmorecomments, setloadMoreComments] = useState<any>([]);
  const [articleComments, setArticleComments] = useState([]);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);

  const [userArticleCommentsLoading, setUserArticleCommentsLoading] =
    useState<boolean>(true);
  const handleConnectModal = () => {
    // e.preventDefault();
    setShowConnectModal(true);
    // setConnectLink(e);
  };
  const handleConnectModalClose = () => {
    setShowConnectModal(false);
  };

  const handleCommented = () => {
    setIsCommenting(false);
    setCurrentComment('');
  };
  let onfoucs = () => {};
  const addComment = async () => {
    try {
      if (!isUserConnected(auth, handleConnectModal)) return;
      if (isPending) {
        return toast.error(
          ` ${t('You can not add comment on pending')} ${entryType}.`
        );
      }
      if (isRejected) {
        return toast.error(
          ` ${t('You can not add comment on rejected ')} ${entryType}.`
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
        entryTitle,
        entryType
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
      setShowCommentBox(true);
      if (increaseCount) {
        logger(addedComment, ' addDommented');

        increaseCount();
      }
      handleCommented();
    } catch (err) {
      logger(err, 'ERR');
      handleCommented();
    }
  };
  const getUserComments = async () => {
    const tempComments = await Promise.all(
      articleComments.reverse().map(async (comment: any) => {
        const userId = comment?.user.toString();
        const user = await auth.actor.get_user_details([userId]);
        const creatDate = comment.creation_time.toString();

        let tempCreation = commentTime(creatDate);
        // logger({ tempCreation, stillUtc }, 'asdfsdfsdsfsad');
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
  const getComments = async () => {
    const commentsActor = makeCommentActor({
      agentOptions: {
        identity,
      },
    });
    const comments = await commentsActor.getComments(articleId);
    logger(comments, 'comments22');
    if (comments.ok) {
      setArticleComments(comments.ok[0]);
      logger({ Comment: comments.ok[0], identity }, 'THEM DOMMENTS');
    }
    setUserArticleCommentsLoading(false);
    if (userArticleComments.length > 10) {
      setloadMoreComments(userArticleComments.slice(0, 10));
    } else {
      setloadMoreComments(userArticleComments);
    }
  };
  const getUser = async (userId: string) => {
    let newUser = null;
    if (!userId) return;
    newUser = await auth.actor.get_user_details([userId]);
    if (newUser.ok) {
      if (newUser.ok[1].profileImg.length != 0) {
        let userImg = getImage(newUser.ok[1].profileImg[0]);
        setuserImage(userImg);
      }
    }
  };
  useEffect(() => {
    if (identity) {
      getUser(identity?._principal?.toString());
    }
  }, [auth, identity]);
  useEffect(() => {
    if (isOpen) {
      setShowCommentBox(true);
    }
  }, [isOpen]);
  useEffect(() => {
    if (articleComments.length > 0) {
      const tempFun = async () => {
        const newComments = await getUserComments();
        setUserArticleComments(newComments);
        logger(newComments, 'WE GOT THEM COMMENTS');
      };
      setUserArticleCommentsLoading(false);

      tempFun();
    }
  }, [articleComments]);
  useEffect(() => {
    if (userArticleComments.length > 10) {
      setloadMoreComments(userArticleComments);
    } else {
      setloadMoreComments(userArticleComments);
    }
  }, [userArticleComments]);
  useEffect(() => {
    logger(articleId, 'comments22');

    if (auth.client) {
      getComments();
    }
  }, [auth, articleId]);
  return (
    <>
      <div className='comment-card' style={{ width: '100%' }} id='comment'>
        <div
          className='card-header'
          style={{
            borderBottom: showCommentBox ? '' : 0,
            paddingBottom: showCommentBox ? '' : 0,
          }}
        >
          {/* <span style={{ maxHeight: 18 }}>
            <Image src={'/images/idea.png'} alt='idea' width={18} height={18} />
          </span>

          <p className='m-0'>
            Share your thoughts with top leaders in this feature
          </p> */}
          <div className='mobile-share-header'>
            <div
              className='me-2 img-pnl'
              style={{
                aspectRatio: profileAspect,
                position: 'relative',
              }}
            >
              <Image
                src={userImage != '' ? userImage : girl}
                alt='notice'
                fill
                className='rounded-circle'
              />
            </div>
            <Form.Control
              type='text'
              placeholder={t('Share your opinions')}
              value={currentComment}
              ref={useRef}
              onChange={(e) => setCurrentComment(e.target.value)}
              onClick={() => {
                setShowCommentBox(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addComment();
                }
              }}
            />
            {showCommentBox && (
              <Button
                className='cancel-btn'
                onClick={() => setShowCommentBox(false)}
              >
                <i className='fa fa-commenting-o' aria-hidden='true' />
              </Button>
            )}
            <Button
              disabled={isCommenting || currentComment.length <= 0}
              onClick={addComment}
            >
              {' '}
              {isCommenting ? (
                <Spinner animation='border' size='sm' />
              ) : (
                <i className='fa fa-plus-square-o' aria-hidden='true' />
              )}
            </Button>
          </div>
        </div>
        {showCommentBox && (
          <>
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
          </>
        )}
      </div>
      <ConnectModal
        handleClose={handleConnectModalClose}
        showModal={showConnectModal}
      />
    </>
  );
}
