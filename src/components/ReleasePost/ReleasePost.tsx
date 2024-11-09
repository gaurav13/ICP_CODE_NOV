import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import smallpost1 from '@/assets/Img/event1.jpg';
import smallpost2 from '@/assets/Img/event2.jpg';
import smallpost3 from '@/assets/Img/event3.jpg';
export default function ReleasePost({ small }: { small?: boolean }) {
  return (
    <>
      <div className='release-post'>
        <div className={`release-post-inner ${small ? 'small' : ''}`}>
          <div className='img-pnl'>
            <Link href='https://blockza.io/meetups/hyfi-2024-singapore'>
              <Image src={smallpost1} alt='Post' />
            </Link>
          </div>
          <div className='txt-pnl'>
            <span>March 7, 2024</span>
            <h6>
              <Link
                href='https://blockza.io/meetups/hyfi-2024-singapore'
                className='text-primary'
              >
                {/* ONE°15 Marina Sentosa... */}
                ONE°15 Marina Sentosa Cove, Singapore
              </Link>
            </h6>
            {/* <p>HYFI 2024 Singapore is...</p> */}
            <p>HYFI 2024 Singapore is an exclusive Future-tech event[…]</p>
          </div>
        </div>
      </div>
      <div className='release-post'>
        <div className={`release-post-inner ${small ? 'small' : ''}`}>
          <div className='img-pnl'>
            <Link href='https://blockza.io/meetups/token2049-2024-premier-crypto-conference-returns-to-dubai/'>
              <Image src={smallpost2} alt='Post' />
            </Link>
          </div>
          <div className='txt-pnl'>
            {/* <span>April 18, - April 19</span> */}
            <span>April 18, 2024 - April 19</span>
            <h6>
              <Link
                href='https://blockza.io/meetups/token2049-2024-premier-crypto-conference-returns-to-dubai/'
                className='text-primary'
              >
                {/* TOKEN2049 Returns to Dubai in... */}
                TOKEN2049 Returns to Dubai in 2024 with Premier Crypto
                Conference
              </Link>
            </h6>

            {/* <p>Greetings esteemed attendees... </p> */}
            <p>Greetings esteemed attendees and crypto enthusiasts[…]</p>
          </div>
        </div>
      </div>
      <div className='release-post'>
        <div className={`release-post-inner ${small ? 'small' : ''}`}>
          <div className='img-pnl'>
            <Link href='https://blockza.io/meetups/web-3-0-iot-conferences-at-webs-week-2024/'>
              <Image src={smallpost3} alt='Post' />
            </Link>
          </div>
          <div className='txt-pnl'>
            <p className='mb-0'>Web 3.0 & IoT Conferences at WW 2024</p>
            <h6>
              <Link
                href='https://blockza.io/meetups/web-3-0-iot-conferences-at-webs-week-2024/'
                className='text-primary'
              >
                Frankfurt, Germany
              </Link>
            </h6>
            <p>Welcome to Webs Week 2024, the most […]</p>
          </div>
        </div>
      </div>
    </>
  );
}
