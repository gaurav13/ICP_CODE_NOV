import instance from "@/components/axios";
import axios from "axios";
import { toast } from "react-toastify";
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
// const { t, changeLocale } = useLocalization(LANG);
let sendArticleEmail=async ( {isApproving,email,name,articleTitle,contentType,reason}:{isApproving:boolean,email:string,name:any,articleTitle:string,contentType:string,reason?:string})=>{
try {
  
  let tempPath=window.location.origin;

  if(isApproving){
    const response = await axios.post(`${process.env.BASE_URL}email/articleApproved`, {
      email,
      name,
      articleTitle,
      contentType,
      baseUrl:tempPath

     
    });
    return response;
  }else{
    const response = await instance.post(`${process.env.BASE_URL}email/articleRejected`, {
      email,
      name,
      articleTitle,
      contentType,
      reason,
      baseUrl:tempPath

    });
    return response;
  }
} catch (error) {
  toast.error("There was an issue while sending email.")
}
};

export {sendArticleEmail};