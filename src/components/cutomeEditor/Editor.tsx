import logger from '@/lib/logger';
import dynamic from 'next/dynamic';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import useLocalization from '@/lib/UseLocalization';
// import { LANG } from '@/constant/language';
import { usePathname } from 'next/navigation'
import { isDescription } from '@/constant/image';
import { LANG } from '@/constant/language';
// import JoditEditor from 'jodit-react';:"jodit-pro-react"
const JoditEditor = dynamic(() => LANG=="en"?import('jodit-react'):import("jodit-pro-react"), { ssr: false });

export interface JoditConfig {
  readonly?: boolean;
  placeholder?: string;
  license?: string
  // Add other Jodit configuration options here
}

const Texteditor: React.FC<{
  placeholder?: string;
  onChangefn: any;
  initialValue: string;
  value: string;
  errorState?:any
}> = ({ placeholder, onChangefn, initialValue, value ,errorState}) => {
  const location = usePathname();
  const language = location.includes('super-admin/') ? 'en' : 'jp';
  const { t, changeLocale } = useLocalization(language);
  const [content, setContent] = useState<any>('');
  //  editor
  const config: JoditConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || t('start typing'),
      ...(LANG === "jp" ? { license: 'ABA0K-0CKI0-BJ5MK-OCKHZ' } : {})
      // Add other Jodit configuration options here
    }),
    [placeholder]
  );
let handleChangefn=(data:any)=>{
  let isDec=isDescription(data)

    if (isDec.length <= 0) {
      errorState(true)

    }else{
      errorState(false)

    }
    
}
  const editor = useRef<any>(null);
  useEffect(() => {
    // setContent(initialValue);
  }, [initialValue]);
  return (<div ref={editor}>

    <JoditEditor
   
      value={value}
      config={config}
      onBlur={(newContent) => onChangefn(newContent)}
      // onChange={(e) => {
      //   onChangefn(e);
      // }}
      // tabIndex={3}
      onChange={(newContent) =>handleChangefn(newContent)}
      
    />
      </div>
  );
};
export default React.memo(Texteditor);
