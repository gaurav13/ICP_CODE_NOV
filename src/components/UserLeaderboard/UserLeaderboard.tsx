import React from 'react';
import Image from 'next/image';
import icondollar from '@/assets/Img/icon-dollar.png';
import iconcoin from '@/assets/Img/coin-image-1.png';
import coinicon from '@/assets/Img/coin-image.png';
import icontest from '@/assets/Img/Icons/icon-test.png';
import iconcheck from '@/assets/Img/Icons/icon-check.png';
import tempuserImg from '@/assets/Img/user-img.png';
import { Button, Col, Container, Row } from 'react-bootstrap';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { profileAspect } from '@/constant/sizes';
import logger from '@/lib/logger';
import { formatLikesCount } from '@/components/utils/utcToLocal';
export default function UserLeaderboard({
  totallReward,
  userImg,
  userId,
}: {
  totallReward: any;
  userImg: any;
  userId: any;
}) {
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <>
      <Container className='leader-board achiv bg-white'>
        <div className='spacer-10' />
        <Row>
          <Col xl='12' className='py-2'>
            {t('my rewards')}
          </Col>
          <Col xl='12' className='py-2'>
            <div className='reward-sec'>
              <Image src={iconcoin} alt='coin' />
              <div>
                <b>{t('Total NS24')}</b>
                <h1>{formatLikesCount(totallReward) ?? 0}</h1>
              </div>
            </div>
          </Col>
          <Col xl='12' className='py-3'>
            {t('My Badge')}{' '}
          </Col>
          <Col xl='12'>
            <div className='profile-sec'>
              <div className='profile-sec-inner'>
                <div className='d-flex justify-content-evenly myclor pb-2'>
                  <span>{t('Token ID')}</span>
                  <span
                    style={{
                      maxWidth: '60px',
                      maxHeight: '24px',
                      overflow: 'hidden',
                    }}
                  >
                    {userId}
                  </span>
                </div>
                <div
                  className='img-pnl'
                  style={{ aspectRatio: profileAspect, width: '105px' }}
                >
                  <Image
                    src={userImg ? userImg : tempuserImg}
                    alt='userImg'
                    fill
                  />
                </div>
                <h5>{t('MEMBER')}</h5>
                <h6>{t('Blockza Badge')}</h6>
                <p>
                  <i>
                    {t(
                      'This Member badge represents a unique registeration on Blockza'
                    )}
                  </i>
                </p>
              </div>
            </div>
          </Col>
          <Col xl='12'>
            <div className='flex-div'>
              <Button className='myBgclor w-100 mright-2'>
                {t('Apply to be an Expert')}
              </Button>

              <Button className='myBgclor'>
                {' '}
                <i className='fa fa-share' />
              </Button>
            </div>
          </Col>
          <Col xl='12' className='py-3 text-center'>
            <p className='m-0'>
              <b>
                {t('More Information')} <i className='fa fa-caret-down' />
              </b>
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
