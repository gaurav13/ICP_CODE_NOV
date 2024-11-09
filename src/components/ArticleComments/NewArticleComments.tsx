import { getImage } from '@/components/utils/getImage';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import girl from '@/assets/Img/user-img.png';
import logger from '@/lib/logger';
import { dateTranslate } from '@/constant/DateFormates';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';

let ArticleComments: React.FC<any> = ({
  userArticleComments,
  totalcomment,
}) => {
  const { t, changeLocale } = useLocalization(LANG);


  return (
    <>
      <ul className='comment-list new'>
        {userArticleComments.length > 0 &&
          userArticleComments.map((comment: any, index: number) => {
            logger(comment, 'comment');
            let image = null;
            if (comment.user?.profileImg[0]) {
              image = comment.user?.profileImg[0];
            }
            return (
              <li key={index}>
                <div className='user-inf-cntnr'>
                  <Link href={`/profile?userId=${comment?.userId}`}>
                    <div className='img-pnl'>
                      {/* <div
                  style={{
                    width: '20px',
                    height: '20x',
                    position: 'relative',
                  }}
                >
                  <Image src={image} fill alt='User' />
                </div> */}
                      <div
                        className='w-full'
                        style={{
                          height: '40px',
                          width: '40x',
                          position: 'relative',
                        }}
                      >
                        {image ? (
                          <Image fill={true} src={image} alt='Banner' />
                        ) : (
                          <Image src={girl} alt='Banner' fill={true} />
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className='txt-pnl'>
                    <Link
                      className='d-flex'
                      href={`/profile?userId=${comment?.userId}`}
                    >
                      <h6>{comment.user?.name[0] ?? ''}</h6>
                    </Link>

                    <p className='status m-0'>
                      {comment ? comment.user?.designation[0] ?? '' : ''}
                    </p>
                    <p>{comment.content ?? ''}</p>
                  </div>
                  <span className='just-now-span'>
                     {comment.newCreation ?? t('Just now')}
                  </span>
                </div>
              </li>
            );
          })}
      </ul>
    </>
  );
};
export default React.memo(ArticleComments);
