import { LANG } from '@/constant/language';
import useLocalization from '@/lib/UseLocalization';
import Link from 'next/link';
import React from 'react'
import { Button } from 'react-bootstrap';

export default function ProfileBoard({userName,completedProfile}:{userName:string,completedProfile:number}) {
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <div className="mycontainer">
      <div className="header">
        <h1>{t("Hi,")} {userName}!</h1>
   
      </div>
      <div className="profileCompletion">
        <h2>{completedProfile ?? 0}% {t("of your profile is complete")}</h2>
        <div className="progressBar">
          <div className="progress" style={{width:`${completedProfile??0}%`}}></div>
        </div>
        <p>
          {t("Complete your profile to receive your token reward! To learn more about building a great profile, check out our Blockza Academy Course and get pro tips on Discord in the #top-notch-profile channel. When you reach 100% completion, you'll receive your token and can start exploring all the benefits!")}
        </p>
        <Link href="/profile-details" > <Button className="completeProfileButton">Complete profile</Button></Link>
     
      </div>

    </div>
  );
}
