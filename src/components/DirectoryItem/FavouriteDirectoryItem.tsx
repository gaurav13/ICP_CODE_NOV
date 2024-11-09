import Image from 'next/image';
import React from 'react'
import { Col, Row } from 'react-bootstrap';
import usericon from '@/assets/Img/Icons/icon-woman.png';
import { formatLikesCount } from '@/components/utils/utcToLocal';
import { LANG } from '@/constant/language';
import useLocalization from '@/lib/UseLocalization';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { profileAspect } from '@/constant/sizes';
import unverifyicon from '@/assets/Img/Icons/verify.png';
import verifyicon from '@/assets/Img/Icons/verify-1.png';
import bg from '@/assets/Img/Icons/bg.png';
import { DIRECTORY_DINAMIC_PATH, DIRECTORY_STATIC_PATH } from '@/constant/routes';

export default function FavouriteDirectoryItem({directory}:{directory:any}) {
  const { t, changeLocale } = useLocalization(LANG);

  let copyDirectoryLink = (e: any,directoryId:string,isStatic:boolean) => {

    e.preventDefault();
   let tempLink=isStatic ? `${DIRECTORY_STATIC_PATH + directoryId}` : `${DIRECTORY_DINAMIC_PATH+directoryId}`
let completeLink=window.location.host+tempLink;

    if (directoryId) {
   window?.navigator?.clipboard?.writeText(completeLink)
      toast.success(t('Copied successfully.'));
    } else {
      toast.error('Directory Id not found.');
    }
  };

  return (
   
      <Col xl='12' lg='12' className='expert-post px-3 py-3'>
        <Row>
          <Col lg='12'>
            <div>
              <div className='top-us-pnl'>
                <div className='img-pnl'>
                  <Image
                    src={
                      
                         directory?.companyLogo ?? usericon
                    }
                    alt='founder image'
                    height={50}
                    width={50}
                  />
                </div>
                <div className='txt-pnl'>
                  <h1 style={{ fontSize: '18px', fontWeight: 600 }}>
                    {directory
                      ? directory?.company
                      : ''}
                  </h1>
                  <strong>
                    {directory
                      ? directory?.companyUrl.length > 30
                        ? `${directory?.companyUrl.slice(
                            0,
                            30
                          )}...`
                        : directory?.companyUrl
                      : ''}
                  </strong>
                </div>
              </div>
              <ul className='inline-list'>
                <li>
                  <a
                    href='#'
                    className='mr-3'
                    onClick={(e) => {
                      e.preventDefault();
                    
                    }}
                  >
                    <Image
                      src={`${
                     
                           '/images/liked.svg'
                         
                      }`}
                      width={30}
                      height={25}
                      alt='Icon Thumb'
                    />{' '}
                    {formatLikesCount(directory?.likeCount)}
                  </a>
                </li>
                <li>
                  <p className=''>
                    <div className='viewbox'>
                      <i className='fa fa-eye fill blue-icon fa-lg me-1' />
                      {t('Views')} <span className='mx-1'>|</span>
                      {directory[0]
                        ? formatLikesCount(
                            parseInt(directory?.views)
                          )
                        : 0}
                    </div>
                  </p>
                </li>
                <li>
                  <a
                    className='reg-btn blue-btn small'
                    href='#'
                    onClick={(e)=>copyDirectoryLink(e,directory?.id,directory?.isStatic)}
                  >
                    <i className='fa fa-share-alt' /> {t('Share')}
                  </a>
                </li>
                {directory && (
                  <li>
                    <a
                      className='reg-btn yellow small d-flex justify-content-center align-items-center dark'
                      href='#'
                    >
                      {Object.keys(directory?.status).toString() ==
                      'un_verfied' ? (
                        // <i className='fa fa-circle-xmark me-2 fs-5'/>
                        <div
                          style={{
                            aspectRatio: profileAspect,
                            position: 'relative',
                            height: '20px',
                          }}
                          className='me-2'
                        >
                          <Image
                            src={unverifyicon}
                            alt='founder image'
                            fill
                            style={{ height: '100%', width: '100%' }}
                          />
                        </div>
                      ) : (
                        // <i className='fa fa-circle-check fs-5 me-2'/>
                        <div
                          style={{
                            aspectRatio: profileAspect,
                            position: 'relative',
                            height: '20px',
                          }}
                          className='me-2'
                        >
                          <Image
                            src={verifyicon}
                            alt='founder image'
                            fill
                            style={{ height: '100%', width: '100%' }}
                          />{' '}
                        </div>
                      )}
                      {Object.keys(directory?.status).toString() ==
                      'un_verfied'
                        ? t('Unverified')
                        : t('Verified')}
                    </a>
                  </li>
                )}
              </ul>
              <p>
                {directory
                  ? directory?.shortDescription
                  : ''}
              </p>
              {/* <p>
              Blockchain.com (formerly Blockchain.info) is a
              cryptocurrency financial services company. The company
              began as the first Bitcoin blockchain explorer in 2011
              and later created a cryptocurrency wallet that accounted
              for 28% of bitcoin transactions between 2012 and 2020.
            </p>
            <p>
              It also operates a cryptocurrency exchange and provides
              institutional markets lending business and data, charts,
              and analytics.
            </p> */}
              <ul className='post-social-list-2 d-flex flex-wrap'>
                {directory ? (
                  directory?.twitter? (
                    <li>
                      <Link href={directory?.twitter}>
                        <i className='fa fa-twitter' />
                      </Link>
                    </li>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )}
                {directory ? (
                  directory?.telegram ? (
                    <li>
                      <Link href={directory?.telegram}>
                        <i className='fa fa-telegram' />
                      </Link>
                    </li>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )}
                
                {directory? (
                  directory?.instagram? (
                    <li>
                      <Link href={directory?.instagram}>
                        <i className='fa fa-youtube' />
                      </Link>
                    </li>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )}
                {directory? (
                  directory?.facebook? (
                    <li>
                      <Link href={directory?.facebook}>
                        <i className='fa fa-facebook' />
                      </Link>
                    </li>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )}
                {directory ? (
                  directory?.linkedin ? (
                    <li>
                      <Link href={directory?.linkedin}>
                        <i className='fa fa-linkedin' />
                      </Link>
                    </li>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )}
              </ul>
              <ul className='post-social-list'>
                {directory ? (
                  directory?.companyUrl ? (
                    <li>
                      <Link
                        className='reg-btn small yellow dark'
                        href={directory?.companyUrl}
                      >
                        {t('Visit Website')}{' '}
                      </Link>
                    </li>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )}
              </ul>
            </div>
          </Col>
          <Col>
            <div className='img-box-pnl'>
              <Image
                src={
                  directory
                    ? directory?.companyBanner
                    : bg
                }
                alt='founder image'
                height={100}
                width={100}
                style={{ height: '100%', width: '100%' }}
              />
            </div>
            {/* <Image src={bg} alt='Infinity' /> */}
          </Col>
          <Col xl='12'>
            <div className='spacer-40' />
          </Col>
        </Row>
      </Col>
  
  )
}
