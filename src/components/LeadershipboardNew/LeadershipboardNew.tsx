import Image from 'next/image';
import icondollar from '@/assets/Img/icon-dollar.png';
import iconcoin from '@/assets/Img/coin-image.png';
import coinicon from '@/assets/Img/coin-image.png';
import icontest from '@/assets/Img/Icons/icon-test.png';
import iconcheck from '@/assets/Img/Icons/icon-check.png';
import iconrefresh from '@/assets/Img/Icons/icon-refresh.png';
import React, { useEffect, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import icpimage from '@/assets/Img/coin-image.png';
// import infinity1 from '@/assets/Img/Icons/icon-infinite3.png';
import infinity1 from '@/assets/Img/coin-image.png';
import cup from '@/assets/Img/icon-cup-1.png';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import leadership from '@/assets/Img/leader.png';
import Girl from '@/assets/Img/Icons/icon-woman.png';
import { Table } from 'react-bootstrap';
import Link from 'next/link';
import { profileAspect } from '@/constant/sizes';
import { makeUserActor } from '@/dfx/service/actor-locator';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { getImage } from '@/components/utils/getImage';
import { E8S } from '@/constant/config';
import { Button } from 'react-bootstrap';
import { formatLikesCount } from '@/components/utils/utcToLocal';
import { QUIZ } from '@/constant/routes';
export default function LeadershipboardNew({ more }: { more?: boolean }) {
  const { t, changeLocale } = useLocalization(LANG);
  const [topuserlist, setTopuserList] = useState<any>([]);
  const { auth, setAuth, identity, principal } = useConnectPlugWalletStore(
    (state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
    })
  );
  let refinetopuser = (userList: any) => {
    let refinedAry = [];
    for (let user = 0; user < userList.length; user++) {
      let image = null;
      if (userList[user][1].profileImg.length != 0) {
        image = getImage(userList[user][1].profileImg[0]);
      }
      const amount = parseInt(userList[user][1].totalReward) ;
      let tempUser = {
        image,
        name: userList[user][1].name,
        id: userList[user][0].toString(),
        amount,
        level: user,
      };
      refinedAry.push(tempUser);
      // logger(userList[user],"topwinnerUser")
    }
    return refinedAry;
  };
  let getWinnerUser = async () => {
    const userActor = makeUserActor({
      agentOptions: {
        identity,
      },
    });
    let topwinner = await userActor.get_winner_users('', 0, 3);
    if (topwinner?.users.length > 0) {
      let tempUser = refinetopuser(topwinner.users);
      // logger(tempUser,"topwinnerUser")
      setTopuserList(tempUser);
    }
  };
  useEffect(() => {
    getWinnerUser();
  }, []);
  return (
    <>
      <div className='Take-Quiz-Pnl leadrship-quiz'>
        <span>
          <Image src={coinicon} alt='Coin' />
        </span>
        <span>
          <Image src={coinicon} alt='Coin' />
        </span>
        <span>
          <Image src={coinicon} alt='Coin' />
        </span>
        <span>
          <Image src={coinicon} alt='Coin' />
        </span>
        <div className='hddr'>
          <Link className='learnmore-bt' href='#'>
            {t('Learn More')} <i className='fa fa-angle-right' />
          </Link>
          <div className='im'>
            <Image src={cup} alt='Coin' />
          </div>
          <div className='txt'>
            <div>
              <strong>{t('TOP 10')}</strong>
            </div>
            <strong className='h3'>{t('THIS WEEK')}</strong>
            <p className='h2txt'>
              {t(
                'The leaderboard exclusively monitors the Additional Weekly NS24 points gained from user activities over a span of 7 days.'
              )}
            </p>
          </div>
        </div>
        <div className='table-container'>
          <div className='table-container-inner'>
            <Table className='mb-1'>
              <tbody>
                {more ? (
                  <>
                    <tr>
                      <td>
                        <b>5</b>
                      </td>
                      <td>
                        <div className='d-flex align-items-start'>
                          <div className='img-pnl' style={{ minWidth: '33px' }}>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <p className='h4txt'>Mfo imo</p>
                            <p className='h5txt'>#54134</p>
                          </div>
                        </div>
                      </td>
                      <td className='text-right'>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>6</b>
                      </td>
                      <td>
                        <div className='d-flex align-items-start'>
                          <div className='img-pnl' style={{ minWidth: '33px' }}>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <p className='h4txt'>Mfo imo</p>
                            <p className='h5txt'>#54134</p>
                          </div>
                        </div>
                      </td>
                      <td className='d-flex text-right'>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>7</b>
                      </td>
                      <td>
                        <div className='d-flex align-items-start'>
                          <div className='img-pnl' style={{ minWidth: '33px' }}>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <p className='h4txt'>Mfo imo</p>
                            <p className='h5txt'>#54134</p>
                          </div>
                        </div>
                      </td>
                      <td className='text-right'>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    {topuserlist.length != 0 &&
                      topuserlist.map((user: any, index: any) => {
                        return (
                          <tr>
                            <td>
                              <b>{index + 1}</b>
                            </td>
                            <td>
                              <div className='d-flex align-items-start'>
                                <div
                                  className='img-pnl position-relative'
                                  style={{
                                    aspectRatio: profileAspect,
                                    width: '33px',
                                    minWidth: '33px',
                                  }}
                                >
                                  <Image
                                    src={user.image ? user.image : Girl}
                                    alt='icp'
                                    fill
                                  />
                                </div>
                                <div className='txt-pnl'>
                                  <p className='h4txt'>{user.name}</p>
                                  <p className='h5txt'>#56743</p>
                                  {/* <h5>#{user.level}</h5> */}
                                </div>
                              </div>
                            </td>
                            <td className='text-right'>
                              +{formatLikesCount(user.amount)} <Image src={infinity1} alt='icp' />
                            </td>
                          </tr>
                        );
                      })}
                    {/* <tr>
                      <td>
                        <b>1</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td className='text-right'>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>2</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td className='text-right'>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>3</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td className='text-right'>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <b>4</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td className='text-right'>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr> */}
                  </>
                )}
              </tbody>
            </Table>
          </div>
        </div>
        <div>
          <Link href={QUIZ} style={{ color: 'black' }}>
            {t('show more')} <i className='fa fa-caret-down' />
          </Link>
        </div>
        <div className='spacer-20' />
        <Link href={QUIZ} className='blue-button' >
          {LANG === 'en' ? (
            <Image src={leadership} alt='leadership' />
          ) : (
            'リーダーボード'
          )}
        </Link>
      </div>
    </>
  );
}
