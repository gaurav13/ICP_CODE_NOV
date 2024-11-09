'use client';
import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Spinner, Table, Modal } from 'react-bootstrap';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { ConnectPlugWalletSlice } from '@/types/store';
import ReactPaginate from 'react-paginate';
import Link from 'next/link';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { toast } from 'react-toastify';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';

// function CategoriesList({
//   categories,
//   defaultEntryActor,
//   setCategoriesSize,
// }: {
//   categories: any[];
//   defaultEntryActor: any;
//   setCategoriesSize: React.Dispatch<React.SetStateAction<number>>;
// }) {
//   const [showModal, setShowModal] = useState(false);
//   const [categoryItem, setCategoryItem] = useState({
//     id: '',
//     name: '',
//   });
//   const [myCategories, setmyCategories] = useState(categories);
//   const [deleting, setDeleting] = useState(false);
//   const handleShow = () => {
//     setShowModal(true);
//   };
//   const handleClose = () => {
//     setShowModal(false);
//   };
//   const handleDelete = async () => {
//     setDeleting(true);
//     const deletedCategory = await defaultEntryActor.delete_category(
//       categoryItem.id,
//       userCanisterId
//     );
//     if (deletedCategory?.ok) {
//       toast.success('Category Deleted Successfully');
//       categories = categories.filter((category: any) => {
//         return category[0] !== categoryItem.id;
//       });
//       setmyCategories(categories);
//       logger({ categories }, 'filtered');
//       setCategoriesSize((prev) => prev--);
//       handleClose();
//     } else {
//       toast.error(deletedCategory?.err);
//     }
//     setDeleting(false);
//   };
//   return (
//     <Col xl='12' lg='12' md='12'>
//       <div className='full-div'>
//         <div className='table-container lg'>
//           <div className='table-inner-container'>
//             <Table striped hover className='article-table'>
//               <thead>
//                 <tr>
//                   <th>
//                     <p>Name</p>
//                   </th>
//                   <th>
//                     <p>Description</p>
//                   </th>
//                   <th>
//                     <p>Slug</p>
//                   </th>
//                   <th>
//                     <p>Count</p>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {myCategories.map((item) => {
//                   let category = item[1];
//                   let id = item[0];

//                   return (
//                     <tr key={id}>
//                       <td className='category-item'>
//                         {/* <Link
//                           href={`/manage-category?categoryId=${id}`}
//                           className='removeUl'
//                         > */}
//                         <p>
//                           {category.name.length > 20
//                             ? category.name.slice(0, 20) + '...'
//                             : category.name}
//                         </p>
//                         <span className='item-menu'>
//                           <Link
//                             href={`/super-admin/manage-category?categoryId=${id}`}
//                             className='removeUl'
//                           >
//                             Edit
//                           </Link>
//                           <span>|</span>
//                           <Button
//                             onClick={() => {
//                               handleShow();
//                               setCategoryItem({
//                                 id,
//                                 name: category.name,
//                               });
//                             }}
//                             className='removeUl text-danger'
//                           >
//                             Delete
//                           </Button>
//                         </span>
//                         {/* </Link> */}
//                       </td>
//                       <td>{category.description}</td>
//                       <td>
//                         {' '}
//                         {category.slug.length > 20
//                           ? category.slug.slice(0, 20) + '...'
//                           : category.slug}
//                       </td>
//                       <td>
//                         <p>{0}</p>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </Table>
//           </div>
//         </div>
//       </div>

//       <Modal
//         show={showModal}
//         // size='md'
//         centered
//         onHide={handleClose}
//       >
//         <Modal.Header closeButton>
//           <h3 className='text-center'>
//             Delete <i>{categoryItem.name}</i>
//           </h3>
//         </Modal.Header>
//         <Modal.Body>
//           <p>Are you sure you want to delete this category?</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button className='publish-btn' onClick={handleDelete}>
//             {deleting ? <Spinner size='sm' /> : 'Delete'}
//           </Button>
//           <Button
//             disabled={deleting}
//             className='default-btn'
//             onClick={handleClose}
//           >
//             Cancel
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Col>
//   );
// }

const itemsPerPage = 20;
export default function CategoriesList({
  selectedCategory,
  selectedCategoriesNames,
  setSelectedCategory,
  setSelectedCategoriesNames,
}: {
  selectedCategory: string[];
  selectedCategoriesNames: string[];
  setSelectedCategory: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedCategoriesNames: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [categories, setCategories] = useState<any[]>([]);
  const [forcePaginate, setForcePaginate] = useState(0);
  const { t, changeLocale } = useLocalization(LANG);
  const [isGetting, setIsGetting] = useState(true);
  const [search, setSearch] = useState('');
  const [categoriesSize, setCategoriesSize] = useState(0);

  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const defaultEntryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });

  const router = useRouter();
  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });

  let pageCount = Math.ceil(categoriesSize / itemsPerPage);
  function setCategoryName(CateList: any) {
    if (!(selectedCategory || CateList)) return;
    let tempArry = [];
    for (let index = 0; index < CateList.length; index++) {
      logger(
        { tempName: CateList[index][1].name, selectedCategory },
        'tempNametempName'
      );

      if (selectedCategory.includes(CateList[index][0])) {
        let tempName = CateList[index][1].name;
        tempArry.push(tempName);
      }
    }
    setSelectedCategoriesNames(tempArry);
  }
  async function getCategories(reset?: boolean) {
    setIsGetting(true);
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const searched = reset ? '' : search;
    const resp = await entryActor.get_list_categories(
      searched,
      0,
      itemsPerPage,
      false
    );
    const categories = resp.entries;

    logger({ categories }, 'sadfdsfsdafdsaf');
    const categoriesSize = parseInt(resp.amount);
    setCategoriesSize(categoriesSize);
    setCategories(categories);
    setIsGetting(false);

    logger(resp, 'CATEGGG');
  }
  function handleSearch(reset?: boolean) {
    setForcePaginate(0);
    getCategories(reset);
  }
  const handlePageClick = async (event: any) => {
    setIsGetting(true);

    setForcePaginate(event.selected);
    // setItemOffset(newOffset);
    // if ()
    let list: any = [];
    const newOffset = (event.selected * itemsPerPage) % categoriesSize;
    const resp = await defaultEntryActor.get_list_categories(
      search,
      newOffset,
      itemsPerPage,
      false
    );

    list = resp.entries;
    logger({ resp, newOffset, categoriesSize }, 'sadfdsfsdafdsaf');
    setCategories(list);

    setIsGetting(false);
  };
  useEffect(() => {
    pageCount = Math.ceil(categoriesSize / itemsPerPage);
  }, [categoriesSize]);

  useEffect(() => {
    getCategories();
  }, []);
  useEffect(() => {
    setCategoryName(categories);
  }, [selectedCategory]);

  return (
    <>
      <Row>
        <Col xl='12' lg='12' md='12' className='mt-2 mb-4'>
          <div className='full-div text-left-md'>
            <div className='search-post-pnl'>
              <input
                type='text'
                placeholder={t('Search Categories')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              {search.length >= 1 && (
                <button
                  onClick={() => {
                    setSearch('');
                    handleSearch(true);
                  }}
                >
                  <i className='fa fa-xmark mx-1' />
                </button>
              )}
              <button onClick={() => handleSearch()}>
                <i className='fa fa-search' />
              </button>
            </div>
          </div>
        </Col>
        <Col xxl='12'>
          {isGetting ? (
            <div className='d-flex justify-content-center w-full'>
              <Spinner />
            </div>
          ) : categories.length > 0 ? (
            categories.map((item, index) => {
              const category = item[0];
              const name = item[1].name;
              return (
                <p
                  className={`category ps-1 ${
                    selectedCategory.includes(category)
                      ? 'active selectedBgClr'
                      : ''
                  }`}
                  key={category}
                  onClick={() => {
                    // setSelectedComany('');
                    let tempCategories = [...selectedCategory]; // Create a copy to avoid mutating state directly
                    let tempNames = [...selectedCategoriesNames]; // Create a copy to avoid mutating state directly

                    if (tempCategories.includes(category)) {
                      let filtered = tempCategories.filter(
                        (item: string) => item !== category
                      );
                      setSelectedCategory(filtered);
                    } else {
                      tempCategories.push(category);
                      setSelectedCategory(tempCategories);
                    }
                    // if (tempNames.includes(name)) {
                    //   let filtered = tempNames.filter(
                    //     (item: string) => item !== name
                    //   );
                    //   setSelectedCategoriesNames(filtered);
                    // } else {
                    //   tempNames.push(name);
                    //   setSelectedCategoriesNames((pre)=>[...pre,...tempNames]);
                    // }
                  }}
                >
                  {name}
                </p>
              );
            })
          ) : (
            <p>{t('No Categories Found')}</p>
          )}
          <div className='pagination-container mystyle d-flex justify-content-end'>
            <ReactPaginate
              breakLabel='...'
              nextLabel=''
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel=''
              renderOnZeroPageCount={null}
              forcePage={forcePaginate}
            />
          </div>
        </Col>
      </Row>
    </>
  );
}
