const getToken = () => {
  return localStorage.getItem('token');
};
let openLink=(link:any)=>{
  window.open(link);

}
let openLinkInCurrentTab=(link:any)=>{
  window.open(link,"_self");
  
}
export { getToken,openLink ,openLinkInCurrentTab};
