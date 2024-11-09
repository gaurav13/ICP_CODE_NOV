// import axios from '@/components/axios/';
import logger from '@/lib/logger';
// import oAxios from 'axios';
// import { create } from 'ipfs-http-client';
import moment from 'moment';
import numeral from 'numeral';
import { toast } from 'react-toastify';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';

import 'moment/locale/ja';
import 'moment/locale/en-au';
import { Date_m_d_y_h_m } from '@/constant/DateFormates';

// LANG === 'jp'? import('moment/locale/ja'): import('moment/locale/en-au');

const utcToLocal = (date: string, format: string, iso?: boolean): string => {
  let stillUtc;
  let formarTemp = format;
  // if (format == 'DD-MM-yyyy') {
  //   moment.locale('en-au');
  // } else {
  //   if (LANG == 'jp') {
  //     moment.locale('ja');

  //     if (!(format == 'hh:mm A' || format==Date_m_d_y_h_m)) {
  //       formarTemp = 'YYYY,MMMM D';
  //     }
  //   } else {
  //     moment.locale('en-au');
  //   }
  // }

  if (LANG == 'jp') {
    let local;
    if (format == Date_m_d_y_h_m) {
      local = JpDateFormat(date, 2);
    } else if (format == 'hh:mm A') {
      local = JpDateFormat(date, 4);
    } else if (
      format == 'DD-MM-yyyy hh:mm A' ||
      format == 'YYYY/MM/DD  hh:mm a'
    ) {
      local = JpDateFormat(date, 5);
    } else {
      local = JpDateFormat(date, 1);
    }
    return local;
  } else {
    if (date === '') {
      stillUtc = moment.utc();
    } else {
      stillUtc = moment.utc(parseInt(date)).toDate();
    }

    if (iso) {
      var local = moment(stillUtc).local().toISOString();
    } else {
      var local = moment(stillUtc).local().format(formarTemp);
    }

    return local;
  }
};
export const utcToLocalAdmin = (
  date: string,
  format: string,
  iso?: boolean
): string => {
  let stillUtc;
  let formarTemp = format;

  if (date === '') {
    stillUtc = moment.utc();
  } else {
    stillUtc = moment.utc(parseInt(date)).toDate();
  }

  if (iso) {
    var local = moment(stillUtc).local().toISOString();
  } else {
    var local = moment(stillUtc).local().format(formarTemp);
  }

  return local;
};

export function JpDateFormat(date: string, format: number) {
  let tempdate;
  //! Don't remove this
  // format
  // 1 only date
  // 2 date and time
  // 3 only time
  // 4 hh:mm A
  // 5 'DD-MM-yyyy hh:mm A'

  if (date == '') {
    tempdate = new Date();
  } else {
    tempdate = new Date(Number(date));
  }
  let years = tempdate.getFullYear();
  let months = tempdate.getMonth();
  let dayes = tempdate.getDate();
  let hourse = tempdate.getHours();
  let mints = tempdate.getMinutes();
  // if (LANG == 'jp') {
  months++
  // }
  let templng = 'en';
  const ampm =
    hourse >= 12
      ? LANG == templng
        ? 'PM'
        : '午後'
      : LANG == templng
        ? 'AM'
        : '午前';

  let yearFormat = LANG == templng ? 'Year' : '年';
  let monthFormat = LANG == templng ? 'Month' : '月';
  let dayesFormat = LANG == templng ? 'Date' : '日';
  let hourseFormat = LANG == templng ? 'Hours' : '時間';
  let mintsFormat = LANG == templng ? 'Minutes' : '分';
  let formattedDate;

  if (format == 1) {
    formattedDate =
      years + yearFormat + months + monthFormat + dayes + dayesFormat;
  } else if (format == 4) {
    formattedDate =
      hourse + hourseFormat + ':' + mints + mintsFormat + ' ' + ampm;
  } else if (format == 5) {
    formattedDate =
      years +
      yearFormat +
      months +
      monthFormat +
      dayes +
      dayesFormat +
      hourse +
      hourseFormat +
      ':' +
      mints +
      mintsFormat +
      ' ' +
      ampm;
  } else {
    formattedDate =
      years +
      yearFormat +
      months +
      monthFormat +
      dayes +
      dayesFormat +
      hourse +
      hourseFormat +
      ':' +
      mints +
      mintsFormat;
  }
  return formattedDate;
}
const commentTime = (creatDate: any) => {
  if (LANG == 'jp') {
    moment.locale('ja');
  } else {
    moment.locale('en-au');
  }
  const stillUtc = moment.utc(parseInt(creatDate)).toDate();
  let tempCreation = moment(stillUtc).local().fromNow();
  return tempCreation;
};
function formatLikesCount(value: any) {
  return value < 1000
  ? numeral(value).format('0a').toUpperCase()
  : numeral(value).format('0.0a').toUpperCase();
}

// its comman function to check is user connected
const isUserConnected = (auth: any, handleConnectModal: any) => {
  const translate = `${LANG === 'jp'
    ? 'この操作を行うには、Internet Identityに接続してください'
    : 'To perform this action, kindly connect to Internet Identity.'
    }`;
  if (auth.state === 'anonymous') {
    toast.error(translate);
    handleConnectModal();
    return false;
  }
  return true;
};
export { utcToLocal, formatLikesCount, isUserConnected, commentTime };
