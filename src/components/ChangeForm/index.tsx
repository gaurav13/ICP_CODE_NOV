import * as React from 'react';
import useLocalization from "@/lib/UseLocalization"
import { LANG } from '@/constant/language';

export default function ChangeForm({
  setisRegister,
  isRegister,
}: {
  setisRegister: any;
  isRegister: boolean;
}) {
  const { t, changeLocale } = useLocalization(LANG);
  return isRegister ? (
    <p className={LANG=="jp"?"jpFont":""}>
      {t('Already have an account?')}{' '}
      <span
        className='focused-text simple-anchor'
        onClick={() => setisRegister(false)}
      >
        {t('Sign In')}
      </span>
    </p>
  ) : (
    <p className={LANG=="jp"?"jpFont":""}>
      {t('Do not have an account?')}{' '}
      <span
        className='focused-text simple-anchor'
        onClick={() => setisRegister(true)}
      >
       {t('Sign Up')} 
      </span>
    </p>
  );
}
