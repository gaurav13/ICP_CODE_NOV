import React, { useEffect, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import icpimage from '@/assets/Img/coin-image.png';
// import infinity1 from '@/assets/Img/Icons/icon-infinite3.png';
import infinity1 from '@/assets/Img/coin-image.png';
import iconcalender from '@/assets/Img/Icons/icon-calender.png';
import coinimage from '@/assets/Img/coin-image.png';
import leadership from '@/assets/Img/leader.png';
import Girl from '@/assets/Img/Icons/icon-woman.png';
import { Table } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { profileAspect } from '@/constant/sizes';
import { makeUserActor } from '@/dfx/service/actor-locator';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { getImage } from '@/components/utils/getImage';
import { E8S } from '@/constant/config';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
export default function LeadershipPost({ more }: { more?: boolean }) {
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
      const amount = parseInt(userList[user][1].totalReward) / E8S;
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
    let topwinner = await userActor.get_winner_users('', 0, 5);
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
      <div className='leader-ship-pnl'>
        <div className='heading-pnl'>
          <span>
            <Image src={coinimage} alt='Coin' />
          </span>
          <span>
            <Image src={coinimage} alt='Coin' />
          </span>
          <span>
            <Image src={coinimage} alt='Coin' />
          </span>
          <span>
            <Image src={coinimage} alt='Coin' />
          </span>

          <strong>
            {LANG === 'en' ? (
              <Image src={leadership} alt='leadership' />
            ) : (
              'リーダーボード'
            )}
          </strong>
          <h6> Additional Weekly BlockZa Tracks</h6>
        </div>
        <div className='table-container'>
          <div className='table-container-inner'>
            <Table>
              <tbody>
                {more ? (
                  <>
                    <tr>
                      <td>
                        <b>5</b>
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
                        <b>6</b>
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
                        <b>7</b>
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
                              <div className='d-flex'>
                                <div
                                  className='img-pnl position-relative'
                                  style={{
                                    aspectRatio: profileAspect,
                                    width: '33px',
                                  }}
                                >
                                  <Image
                                    src={user.image ? user.image : Girl}
                                    alt='icp'
                                    fill
                                  />
                                </div>
                                <div className='txt-pnl'>
                                  <h4>{user.name}</h4>
                                  <h5>#56743</h5>
                                  {/* <h5>#{user.level}</h5> */}
                                </div>
                              </div>
                            </td>
                            <td className='text-right'>
                              +{user.amount} <Image src={infinity1} alt='icp' />
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
        <div className='text-center'>
          {/* <Link href='/nft-article-leader-board' className='show-more-link'>
            {t('show more')} <i className='fa fa-caret-down'/>
          </Link> */}
        </div>
      </div>
    </>
  );
}
