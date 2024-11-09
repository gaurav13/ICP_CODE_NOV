'use client';
import { EDITOR_POLICY, EDITOR_POLICY_ROUTE } from '@/constant/routes';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const page_JP = () => {
  const location = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (location.startsWith(EDITOR_POLICY_ROUTE) && !location.endsWith('/')) {
     router.push(EDITOR_POLICY);
   }
     }, [])
  return (
    <>
        <main id='main'>
        <div className='main-inner detail-inner-Pages pri-term-pnl'>
          <div className='inner-content'>
            <div className='pri-term-inner'>
    
   <h1> 編集方針</h1>
<h3>ミッション</h3>
<p>
BlockZa Japanのミッションは、信頼性の高いニュースやデータを配信し、ブロックチェーン・コミュニティに技術的進歩に関する情報を提供し、業界内での議論や知識の機会を育成するイベントプロバイダーとしての役割を果たすことです。
</p>
<h3>
編集の独立性
</h3>
<p>
BlockZa JapanはDaiki Co., Ltd.が運営しております。その運営に際しては、編集上の独立性を確保しており、パートナーや投資家が編集内容に影響を及ぼすことはありません。また、編集内容に関して関連会社から助言を得ることも、掲載前に事前情報を共有することもありません。
</p>
<h3>
行動指針
</h3>
<p>

私たちは、すべてのジャーナリズムにおいて、公正さ、正確さ、客観性、責任ある報道の最高水準を維持することを約束します。
当社は、ニュース記事、特集、製品レビューの掲載には関与せず、報酬も支払いません。広告として作成された記事には、その旨が明記されます。BlockZa Japanは企業として、特定の仮想通貨やブロックチェーン・プロジェクトの経済的価値について意見を述べることはありません。編集スタッフは、BlockZa Japanでの役割以外の個人的な意見を自由に述べることができます。また、ブロックチェーン開発プロジェクトへの投資や仮想通貨の保有も制限されていません。ただし、編集部員が投資している仮想通貨やトークンについて記事を執筆する場合は、社内規定に従って投資内容を開示する義務があります。

</p>
<h3>
収益モデル
</h3>
<p>
BlockZa Japanは、主に広告、リサーチ、データ販売、メディアサービスを通じて収益を得ています。当社は仮想通貨取引を事業としておりません
</p>
</div>
</div>
</div>
</main>
    </>
  )
}

export default page_JP