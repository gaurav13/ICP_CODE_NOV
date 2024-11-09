import { useState, useEffect } from 'react';
const loadLocaleData = async (locale) => {
  const res = await import(`../transalation/${locale}.json`);
  return res.default || res;
};

const useLocalization = (initialLocale) => {
  // const initialLocale = 'jp';
  const [locale, setLocale] = useState(initialLocale);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const fetchLocaleData = async () => {
      const data = await loadLocaleData(locale);
      setMessages(data);
    };
    if (locale) {
      fetchLocaleData();
    }
  }, [locale]);

  const changeLocale = (newLocale) => {
    setLocale(newLocale);
  };

  const t = (key) => {
    // console.log( initialLocale1,"initialLocaleinitialLocale")
    if (initialLocale == 'jp') {
      if (messages[key]) {
        return messages[key];
      } else {
        return '';
      }
    } else {
      return messages[key] || key;
    }
  };

  return { t, changeLocale };
};

export default useLocalization;
