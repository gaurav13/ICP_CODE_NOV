'use client';
import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Breadcrumb,
  Dropdown,
  Spinner,
  Form,
  Button,
} from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import meeting1 from '@/assets/Img/Profile/hinza-1.jpg';
import meeting2 from '@/assets/Img/Profile/hinza-2.jpg';
import Logo from '@/assets/Img/Logo/Logo.png';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import client1 from '@/assets/Img/Logo/client-logo-1.jpg';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import NewsComponent from '@/components/googlenews/news_old';

export default function HinzaAsif() {
  const { t, changeLocale } = useLocalization(LANG);
  const [hideMyContent, setHideMyContent] = useState(true);
  const [activeSection, setActiveSection] = useState('im-hinza');
  const location = usePathname();
  const router = useRouter();

  return (
    <>
      <main id="main">
        <div className="main-inner detail-inner-Pages pri-term-pnl">
          <div className="inner-content">
            <div>
            <h1 className="fs-3 mb-4 text-wrap text-truncate w-100 overflow-hidden">
            {LANG === 'jp' ? 'Blockza AIアシスタントへようこそ' : 'Welcome to Blockza AI Assistant'}
          </h1>
          <p className="mb-4">
        {LANG === 'jp'
          ? 'BlockZa AIアシスタントは、ブロックチェーンとWeb3を簡単に理解できるようにします。24時間365日のサポート、シンプルな説明、迅速な回答で、分散型の世界をスムーズにナビゲートしましょう。今すぐ探索を始めましょう！'
          : 'BlockZa AI Assistant makes blockchain and Web3 easy to understand. Get 24/7 support, simple explanations, and quick answers to navigate the decentralized world effortlessly. Start exploring today!'}
      </p>
            </div>
            <div className="pri-term-inner mt-4">
              <iframe
                src={
                  LANG === 'en'
                    ? 'https://www.chatbase.co/chatbot-iframe/vXOyMigraOFfiJ7f5O1Il'
                    : 'https://www.chatbase.co/chatbot-iframe/384SXpy6Uf9FJnTpRTgef'
                }
                style={{ border: '0' }}
                className="bootIframe w-100 rounded"
                height="400"
                title="Blockza AI Assistant"
              ></iframe>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
