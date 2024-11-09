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
import { fromNullable } from '@dfinity/utils';
import { MdOutlinePhonelinkErase } from 'react-icons/md';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';

function CategoriesList({
  categories,
  defaultEntryActor,
  setCategoriesSize,
  setCategories,
}: {
  categories: any[];
  defaultEntryActor: any;
  setCategoriesSize: React.Dispatch<React.SetStateAction<number>>;
  setCategories: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [showModal, setShowModal] = useState(false);
  let router = useRouter();
  const [categoryItem, setCategoryItem] = useState({
    id: '',
    name: '',
  });
  // const [myCategories, setmyCategories] = useState(categories);
  const [deleting, setDeleting] = useState(false);
  const { t, changeLocale } = useLocalization(LANG);
  const handleShow = () => {
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const handleDelete = async () => {
    setDeleting(true);
    const deletedCategory = await defaultEntryActor.delete_category(
      categoryItem.id,
      userCanisterId,
      commentCanisterId
    );
    if (deletedCategory?.ok) {
      toast.success('Category Deleted Successfully');
      let _myCategories = categories.filter((category: any) => {
        return category[0] !== categoryItem.id;
      });
      setCategories(_myCategories);
      setCategoriesSize((prev) => prev--);
      handleClose();
    } else {
      toast.error(deletedCategory?.err);
    }
    setDeleting(false);
  };
  let openLink = (link: any) => {
    if (link) {
      // router.push(`/super-admin/manage-category?categoryId=${link}`)
    }
  };
  return (
    <Col xl='12' lg='12' md='12'>
      <div className='full-div'>
        <div className='table-container lg'>
          <div className='table-inner-container'>
            <Table striped hover className='article-table'>
              <thead>
                <tr>
                  <th>
                    {/* <p>{t('name')}</p> */}
                    <p>Name</p>
                  </th>
                  <th>
                    <p>Description</p>
                  </th>
                  <th>
                    <p>Parent category</p>
                  </th>
                  <th>
                    {/* <p>{t('slug')}</p> */}
                    <p>Slug</p>
                  </th>
                  <th>
                    <p>Count</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((item) => {
                  let category = item[1];
                  let id = item[0];
                  logger(item, 'category-item');
                  let count = Number(item[1].totalCount);
                  return (
                    <tr key={id}>
                      <td className='category-item'>
                        {/* <Link
                          href={`/manage-category?categoryId=${id}`}
                          className='removeUl'
                        > */}
                        <p>
                          {category.name.length > 20
                            ? category.name.slice(0, 20) + '...'
                            : category.name}
                        </p>
                        <span className='item-menu'>
                          <Link
                            href={`/category-details?category=${id}`}
                            className='removeUl'
                          >
                            View
                          </Link>
                          <span>|</span>
                          <Link
                            href={`/super-admin/manage-category?categoryId=${id}`}
                            className='removeUl'
                          >
                            Edit
                          </Link>
                          <span>|</span>
                          <Button
                            onClick={() => {
                              handleShow();
                              setCategoryItem({
                                id,
                                name: category.name,
                              });
                            }}
                            className='removeUl text-danger'
                          >
                            Delete
                          </Button>
                        </span>
                        {/* </Link> */}
                      </td>
                      <td>{category.description}</td>
                      <td onClick={() => openLink(category.parentCatId)}>
                        {category.parentName
                          ? category.parentName
                          : 'No Parent category'}
                      </td>

                      <td>
                        {' '}
                        {category.slug.length > 20
                          ? category.slug.slice(0, 20) + '...'
                          : category.slug}
                      </td>
                      <td>
                        <p>{count}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        // size='md'
        centered
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <h3 className='text-center'>
            Delete <i>{categoryItem.name}</i>
          </h3>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this category?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className='publish-btn' onClick={handleDelete}>
            {deleting ? <Spinner size='sm' /> : 'Delete'}
          </Button>
          <Button
            disabled={deleting}
            className='default-btn'
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Col>
  );
}

const itemsPerPage = 10;
export default function AllCategories() {
  const { t, changeLocale } = useLocalization(LANG);
  const [categories, setCategories] = useState<any[]>([]);
  const [forcePaginate, setForcePaginate] = useState(0);
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
    const categoriesSize = parseInt(resp.amount);
    setCategoriesSize(categoriesSize);
    for (let cat = 0; cat < categories.length; cat++) {
      let parentCatId = null;
      let parentName = null;
      if (categories[cat][1].parentCategoryId.length != 0) {
        parentCatId = categories[cat][1].parentCategoryId[0];
        let resp = await entryActor.get_category(parentCatId);
        let category: any = fromNullable(resp);
        if (category) {
          logger(resp, '36456453');
          parentName = category.name;
        }
      }
      categories[cat][1].parentCatId = parentCatId;
      categories[cat][1].parentName = parentName;
    }
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
    logger({ resp, newOffset, categoriesSize });
    setCategories(list);

    setIsGetting(false);
  };
  useEffect(() => {
    pageCount = Math.ceil(categoriesSize / itemsPerPage);
  }, [categoriesSize]);

  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.articleManagement && !userAuth.isAdminBlocked) {
        getCategories();
      } else {
        router.replace('/super-admin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/super-admin');
    }
  }, [userAuth, auth]);

  return (
    userAuth.userPerms?.articleManagement &&
    !userAuth.isAdminBlocked && (
      <>
        <main id='main' className='dark'>
          <div className='main-inner admin-main'>
            <div className='section admin-inner-pnl' id='top'>
              <Row>
                <Col xl='9' lg='12' className='text-left'>
                  <h1>
                    Category Management <i className='fa fa-arrow-right' />{' '}
                    <span>All Categories</span>
                  </h1>
                  <div className='spacer-20' />
                </Col>
                <Col xl='12' lg='12' md='12' className='mt-2 mb-4'>
                  <div className='full-div text-right-md'>
                    <div className='search-post-pnl'>
                      <input
                        type='text'
                        placeholder='Search Categories'
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
                    <CategoriesList
                      categories={categories}
                      setCategories={setCategories}
                      defaultEntryActor={defaultEntryActor}
                      setCategoriesSize={setCategoriesSize}
                    />
                  ) : (
                    <p className='text-center'>No Categories Found</p>
                  )}
                  <div className='pagination-container mystyle d-flex justify-content-end'>
                    {categories.length > 0 && (
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
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </main>
      </>
    )
  );
}
