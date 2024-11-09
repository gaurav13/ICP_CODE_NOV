// components/GlobalSearch.tsx
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { LANG } from '@/constant/language';
import logger from '@/lib/logger';
import useLocalization from '@/lib/UseLocalization';
import { debounce } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';


const GlobalSearch: React.FC = () => {
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  let query="q";
  const searchString = searchParams.get(query);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const router = useRouter();
  const { t, changeLocale } = useLocalization(LANG);

  const toggleSearch = () => {
    setIsOpen(!isOpen);
  };

  
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRoute(search)
    }
  };
      /**
   * handleRoute use to route the page
   * @parms search
   * @return   null;
   */
  let handleRoute=(search:string)=>{
handleClose()
router.push(`/search/?q=${search}`)
  }
  useEffect(()=>{
if(searchString){
  setSearch(searchString)
}else{
  setSearch("")

}
  },[searchString]);

  return (
    <>
    <div className="searchContainer me-2">
         <button onClick={handleShow}>
             <i className='fa fa-search' />
           </button> 
      
    
    </div>

<Modal
show={show}
onHide={handleClose}
// backdrop="static"
keyboard={false}
>
<Modal.Header >
  <Modal.Title className='w-100'><div className='search-pnl small globalsearch w-100'>

<input
     type='text'
     className='form-control'
     placeholder={t('Search')}
     value={search}
     onChange={(e) => setSearch(e.target.value)}
     onKeyDown={handleSearch}
   />
   {search.length >= 1 && (
     <button
       onClick={() => {
         setSearch('');
        
       }}
     >
       <i className='fa fa-xmark mx-1' />
     </button>
   )}
   <button onClick={()=>handleRoute(search)}>
     <i className='fa fa-search' />
   </button> 
   </div></Modal.Title>
</Modal.Header>


</Modal>
</>
  );
};

export default GlobalSearch;
