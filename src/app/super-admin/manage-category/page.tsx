'use client';
import React, { useEffect, useState } from 'react';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import Head from 'next/head';
import {
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from 'react-bootstrap';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import NavBarDash from '@/components/DashboardNavbar/NavDash';
import SideBarDash from '@/components/SideBarDash/SideBarDash';
import { ConnectPlugWalletSlice } from '@/types/store';
import { UserPermissions } from '@/types/store';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import { array, boolean, object, string } from 'yup';
import {
  MAX_CATEGORY_DESCRIPTION_CHARACTERS,
  MAX_CATEGORY_NAME_CHARACTERS,
  MAX_NAME_CHARACTERS,
} from '@/constant/validations';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import { Roles } from '@/types/profile';
import { Principal } from '@dfinity/principal';
import { toast } from 'react-toastify';
import { BASE_IMG_URL, isValidFileType } from '@/constant/image';
import getCroppedImg from '@/components/Cropper/cropImage';
import resizeImage from '@/components/utils/resizeImage';
import {
  COMPANY_BANNER_IMAGE_ASPECT,
  COMPANY_LOGO_IMAGE_ASPECT,
  MAX_COMPANY_BANNER_SIZES,
  MAX_COMPANY_LOGO_SIZES,
} from '@/constant/sizes';
import { CropperProps } from '@/types/cropper';
import ImageCropper from '@/components/Cropper';
import Image from 'next/image';
import { fileToCanisterBinaryStoreFormat } from '@/dfx/utils/image';
import { fromNullable } from '@dfinity/utils';
import getChildren from '@/components/utils/getChildren';
import uploadImage from '@/components/utils/uploadImage';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { getIdFromUrl } from '@/constant/DateFormates';

const CustomDropdownItem = ({ category, indexed = 0 }: any) => {
  // logger(category, 'DAAAAA CATEGODDD');
  const hasChildren = category[1]?.children && category[1].children.length > 0;
  let myString = '&nbsp;';
  return (
    <>
      <option value={category[0]} key={category[0]}>
        {/* <p style={{ color: 'red' }}>HI there</p> */}

        <p dangerouslySetInnerHTML={{ __html: myString.repeat(indexed) }} />
        {category[1]?.name}
      </option>
      {hasChildren &&
        category[1].children.map((child: any, index: number) => (
          <CustomDropdownItem
            key={index}
            category={child}
            indexed={indexed + 3}
          />
        ))}
    </>
  );
};

export default function ManageCategory() {
  const { t, changeLocale } = useLocalization(LANG);
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [oldCategory, setOldCategory] = useState<any>();
  let [formSubmiting, setFormSubmiting] = useState<boolean>(false);
  const [cropperImg, setCropperImg] = useState<CropperProps | undefined>();
  const [showCropper, setShowCropper] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerLink, setBannerLink] = useState<undefined | string>();
  const [logoLink, setLogoLink] = useState<undefined | string>();

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
  const initialCategoryValues: {
    categoryName: string;
    categorySlug: string;
    categoryDescription: string;
    categoryParent: string;
    banner: string;
    logo: string;
  } = {
    categoryName: oldCategory?.name ?? '',
    categorySlug: oldCategory?.slug ?? '',
    categoryDescription: oldCategory?.description ?? '',
    categoryParent: oldCategory?.parent ?? '',
    banner: '',
    logo: '',
  };
  const categorySchema = object().shape({
    categoryName:
      LANG == 'en'
        ? string()
            .required('Category Name is required')
            .matches(
              /^[a-zA-Z0-9\s]+$/,
              'Only AlphaNumeric characters are allowed'
            )
            .max(
              MAX_CATEGORY_NAME_CHARACTERS,
              'Name can not be more than 100 characters'
            )
        : string()
            .required('Category Name is required')
            .max(
              MAX_CATEGORY_NAME_CHARACTERS,
              'Name can not be more than 100 characters'
            ),
    categorySlug: string()
      .required(t('Slug is required'))
      .max(
        MAX_CATEGORY_NAME_CHARACTERS,
        'Slug can not be more than 100 characters'
      ),
    categoryDescription: string()
      .required('Category Description is required')
      .max(
        MAX_CATEGORY_DESCRIPTION_CHARACTERS,
        `Description can not be more than ${MAX_CATEGORY_DESCRIPTION_CHARACTERS} characters`
      ),
    categoryParent: string(),
  });
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);

  let categoryId = searchParams.get('categoryId');

  async function getCategories() {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const resp = await entryActor.get_list_categories('', 0, 20, true);
    let categories = resp.entries;
    if (categoryId) {
      // Filter the category we are updating
      categories = categories.filter((category: any) => {
        return category[0] !== categoryId;
      });
    }
    const childrenArray = await getChildren(categories, entryActor);
    setCategories(childrenArray);
    logger({ childrenArray }, 'da children mate!!');
    logger(resp, 'CATEGGG');
  }
  const handleShowCropper = () => {
    setShowCropper(true);
  };
  const handleHideCropper = () => {
    setShowCropper(false);
  };
  const bannerUpload = async (
    imgUrl: string,
    imgName: string,
    pixels: any,
    rotation: number = 0
  ) => {
    const croppedImage = await getCroppedImg(imgUrl, imgName, pixels, rotation);
    if (!croppedImage) return;
    const resizedFile = await resizeImage(
      croppedImage,
      MAX_COMPANY_BANNER_SIZES.width,
      MAX_COMPANY_BANNER_SIZES.height
    );

    const newUrl = URL.createObjectURL(resizedFile);
    const _bannerLink = await uploadImage(resizedFile);
    setBannerLink(_bannerLink);
    setBannerPreview(newUrl);
    setBannerFile(resizedFile);
    handleHideCropper();
  };
  const logoUpload = async (
    imgUrl: string,
    imgName: string,
    pixels: any,
    rotation: number = 0
  ) => {
    const croppedImage = await getCroppedImg(imgUrl, imgName, pixels, rotation);
    if (!croppedImage) return;
    const resizedFile = await resizeImage(
      croppedImage,
      MAX_COMPANY_LOGO_SIZES.width,
      MAX_COMPANY_LOGO_SIZES.height
    );

    const newUrl = URL.createObjectURL(resizedFile);
    const _logoLink = await uploadImage(resizedFile);
    setLogoLink(_logoLink);

    setLogoPreview(newUrl);
    setLogoFile(resizedFile);
    handleHideCropper();
  };
  const getCategory = async () => {
    if (!categoryId || !identity) {
      return;
    }
    let resp = await defaultEntryActor.get_category(categoryId);
    let category: any = fromNullable(resp);
    if (category) {
      logger({ category }, 'GINNNNAA');

      setOldCategory({
        name: category.name,
        description: category.description,
        slug: category.slug,
        parent: fromNullable(category.parentCategoryId),
      });
      const logoImg = getImage(category.logo);
      const logofile = new File([category.logo], 'logo.jpg', {
        type: 'image/jpeg',
      });
      const bannerFile = new File([category.banner], 'banner.jpg', {
        type: 'image/jpeg',
      });
      const bannerImg = getImage(category.banner);
      let logoId = getIdFromUrl(category.logo);
      let bannerId = getIdFromUrl(category.banner);
      setLogoLink(logoId);
      setBannerLink(bannerId);

      setLogoPreview(logoImg);
      setLogoFile(logofile);
      setBannerPreview(bannerImg);
      setBannerFile(bannerFile);
    }
  };
  const handleImageChageCommon = (e: any, imgName: string) => {
    const img = e.target.files[0];
    if (!img) return;

    const validType = isValidFileType(img && img.name.toLowerCase(), 'image');
    if (!validType) {
      toast.error(t('Not a valid image type'));
      return;
    }

    const imgUrl = URL.createObjectURL(img);
    switch (imgName) {
      case 'banner':
        setCropperImg({
          imgUrl,
          imgName: img.name,
          aspect: COMPANY_BANNER_IMAGE_ASPECT,
          callBack: bannerUpload,
          maxWidth: MAX_COMPANY_BANNER_SIZES.width,
          maxHeight: MAX_COMPANY_BANNER_SIZES.height,
        });
        break;
      case 'logo':
        setCropperImg({
          imgUrl,
          imgName: img.name,
          aspect: COMPANY_LOGO_IMAGE_ASPECT,
          callBack: logoUpload,
          maxWidth: MAX_COMPANY_LOGO_SIZES.width,
          maxHeight: MAX_COMPANY_LOGO_SIZES.height,
        });
        break;

      default:
        toast.error(t('Errorr while uploading media'));
        logger(
          t(
            'Image name didn not match any of the provided cases please add a case if you want to use this function for more images'
          )
        );
        break;
    }
    handleShowCropper();
    e.target.value = '';
  };
  const resetImages = () => {
    setBannerFile(null);
    setLogoFile(null);
    setBannerPreview('');
    setLogoPreview('');
  };
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

  useEffect(() => {
    if (categoryId && identity) {
      getCategory();
    }
  }, [identity, categoryId]);

  return (
    userAuth.userPerms?.articleManagement &&
    !userAuth.isAdminBlocked && (
      <>
        {cropperImg && (
          <ImageCropper
            show={showCropper}
            handleClose={handleHideCropper}
            cropperProps={cropperImg}
          />
        )}
        <main id='main' className='dark'>
          <div className='main-inner admin-main'>
            <Head>
              <title>Hi</title>
            </Head>
            <div className='section admin-inner-pnl' id='top'>
              <Row>
                <Col xl='9' lg='12' className='text-left'>
                  <h1>
                    Category Management <i className='fa fa-arrow-right' />{' '}
                    <span>{categoryId ? 'Update' : 'Add'} Category</span>
                  </h1>
                  <div className='spacer-20' />
                  {/* <h3 className='mb-4'>Add new Category</h3> */}
                  <Formik
                    initialValues={initialCategoryValues}
                    validationSchema={categorySchema}
                    onSubmit={async (values, { resetForm, setFieldValue }) => {
                      const { categoryName } = values;
                      setFormSubmiting(true);

                      let bannerImg = '';
                      let logoImg = '';
                      if (bannerFile && categoryId) {
                      }
                      if (bannerFile !== null) {
                        // bannerImg = await fileToCanisterBinaryStoreFormat(
                        //   bannerFile
                        // );
                        bannerImg = BASE_IMG_URL + bannerLink;
                        logger(bannerImg, 'ittt');
                      } else {
                        return toast.error('Please select a Banner Image.');
                      }

                      if (logoFile !== null) {
                        // logoImg = await fileToCanisterBinaryStoreFormat(
                        //   logoFile
                        // );
                        logoImg = BASE_IMG_URL + logoLink;
                      } else {
                        return toast.error(t('Please select Logo Image.'));
                      }
                      const entryActor = makeEntryActor({
                        agentOptions: {
                          identity,
                        },
                      });

                      let parentCategoryId =
                        values.categoryParent.length > 0
                          ? [values.categoryParent]
                          : [];
                      let category = {
                        name: values.categoryName,
                        slug: values.categorySlug,
                        description: values.categoryDescription,
                        parentCategoryId,
                        logo: logoImg,
                        banner: bannerImg,
                      };
                      let newCategories = null;
                      if (categoryId) {
                        newCategories = await entryActor.update_category(
                          category,
                          categoryId,
                          userCanisterId,
                          commentCanisterId
                        );
                      } else {
                        newCategories = await entryActor.add_category(
                          category,
                          userCanisterId,
                          commentCanisterId
                        );
                      }

                      if (newCategories?.ok) {
                        toast.success(
                          `Category ${
                            categoryId ? 'updated' : 'created'
                          } successfully`
                        );
                        await getCategories();
                        // setCategories(newCategories);
                        logger(newCategories, 'ADED');
                        setFormSubmiting(false);
                        resetImages();
                        setOldCategory(undefined);
                        resetForm();
                      } else {
                        toast.error('Error while creating category');
                        setFormSubmiting(false);
                      }
                    }}
                    enableReinitialize
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                      isValid,
                      dirty,
                      validateForm,
                      /* and other goodies */
                    }) => (
                      <FormikForm onSubmit={handleSubmit}>
                        <Row>
                          <Col xl='7' lg='7' md='12'>
                            <Field name='categoryName'>
                              {({ field, formProps }: any) => (
                                <Form.Group className='mb-3'>
                                  <Form.Label>Name</Form.Label>
                                  <Form.Control
                                    value={field.value}
                                    onChange={handleChange}
                                    onInput={handleBlur}
                                    type='text'
                                    name='categoryName'
                                    placeholder='Enter Category Name'
                                  />
                                </Form.Group>
                              )}
                            </Field>
                            <div className='text-danger mt-2'>
                              <ErrorMessage
                                className='Mui-err'
                                name='categoryName'
                                component='div'
                              />
                            </div>
                          </Col>
                          <Col xl='7' lg='7' md='12'>
                            <Field name='categorySlug'>
                              {({ field, formProps }: any) => (
                                <Form.Group
                                  className='mb-3'
                                  // controlId='formBasicEmail'
                                >
                                  <Form.Label>Slug</Form.Label>
                                  <Form.Control
                                    value={field.value}
                                    onChange={handleChange}
                                    onInput={handleBlur}
                                    type='text'
                                    name='categorySlug'
                                    placeholder='Enter Category Slug'
                                  />
                                </Form.Group>
                              )}
                            </Field>
                            <div className='text-danger mt-2'>
                              <ErrorMessage
                                className='Mui-err'
                                name='categorySlug'
                                component='div'
                              />
                            </div>
                          </Col>
                          <div>
                            <div className='dropdown' />
                          </div>
                          <Col xl='7' lg='7' md='7'>
                            <Field name='categoryParent'>
                              {({ field, formProps }: any) => (
                                <Form.Group
                                  className='mb-3'
                                  // controlId='formBasicEmail'
                                >
                                  <Form.Label>
                                    Parent Category{' '}
                                    <span className='h6 text-secondary'>
                                      Optional
                                    </span>
                                  </Form.Label>
                                  {/* <Dropdown>
                                    <DropdownToggle>HI</DropdownToggle>
                                    <DropdownMenu>
                                      <DropdownItem>THersd</DropdownItem>
                                    </DropdownMenu>
                                  </Dropdown> */}
                                  <Form.Select
                                    aria-label='All Categories'
                                    value={field.value}
                                    disabled={categoryId && oldCategory?.parent}
                                    onChange={handleChange}
                                    className='category-select'
                                    name='categoryParent'
                                    // multiple
                                  >
                                    <option value={''}>None </option>
                                    {categories &&
                                      categories.map((category, index) => (
                                        <CustomDropdownItem
                                          key={index}
                                          category={category}
                                        />
                                      ))}
                                    {/* {categories &&
                                      categories.map((category, index) => (
                                        <option
                                          value={category[0]}
                                          key={category[0]}
                                        >
                                          {category[1].name}
                                        </option>
                                      ))} */}
                                  </Form.Select>
                                </Form.Group>
                              )}
                            </Field>
                            <div className='text-danger mt-2'>
                              <ErrorMessage
                                className='Mui-err'
                                name='categoryParent'
                                component='div'
                              />
                            </div>
                          </Col>
                          <Col xl='7' lg='7' md='7'>
                            <Field name='categoryDescription'>
                              {({ field, formProps }: any) => (
                                <Form.Group
                                  className='mb-3'
                                  // controlId='formBasicEmail'
                                >
                                  <Form.Label>Description</Form.Label>
                                  <Form.Control
                                    value={field.value}
                                    onChange={handleChange}
                                    onInput={handleBlur}
                                    type='text'
                                    className='darkbr'
                                    as={'textarea'}
                                    name='categoryDescription'
                                    placeholder='Enter Category Description'
                                  />
                                </Form.Group>
                              )}
                            </Field>
                            <div className='text-danger mt-2'>
                              <ErrorMessage
                                className='Mui-err'
                                name='categoryDescription'
                                component='div'
                              />
                            </div>
                          </Col>
                          <Col xl='7' lg='7' md='7'>
                            <Form.Label>Banner</Form.Label>

                            <div className='d-flex flex-column align-items-center'>
                              {bannerPreview && (
                                <div
                                  style={{
                                    // height: '252px',
                                    maxWidth: '300px',
                                    width: '100%',
                                    position: 'relative',
                                    aspectRatio: COMPANY_BANNER_IMAGE_ASPECT,
                                    // overflow: 'hidden',
                                  }}
                                >
                                  <Image
                                    // fill={true}
                                    // style={{ maxHeight: '200px', maxWidth: '200px' }}

                                    fill={true}
                                    src={bannerPreview}
                                    alt='Banner'
                                  />
                                </div>
                              )}
                              <Form.Group
                                //  controlId='formFile'
                                className='mb-3'
                              >
                                {/* <Form.Label>Select Company Banner Image</Form.Label> */}
                                <div className='input-group d-flex justify-content-center'>
                                  <Form.Control
                                    id='previewweb3companyBannerImg'
                                    className='d-none'
                                    // onChange={handleCompanyBannerChange}
                                    onChange={(e) =>
                                      handleImageChageCommon(e, 'banner')
                                    }
                                    name='banner'
                                    type='file'
                                  />
                                  <Button
                                    style={{ background: '#0a58ca' }}
                                    type='button'
                                    className='input-group-text mt-2 rounded'
                                  >
                                    <i className='fa fa-upload me-1' />{' '}
                                    <label
                                      className='text-white'
                                      htmlFor='previewweb3companyBannerImg'
                                    >
                                      Select Category Banner Image
                                    </label>
                                  </Button>
                                </div>
                              </Form.Group>
                            </div>
                          </Col>
                          <Col xl='7' lg='7' md='7'>
                            <Form.Label>Logo</Form.Label>

                            <div className='d-flex flex-column align-items-center'>
                              {logoPreview && (
                                <div
                                  style={{
                                    // height: '252px',
                                    width: '200px',
                                    position: 'relative',
                                    aspectRatio: COMPANY_LOGO_IMAGE_ASPECT,
                                    // overflow: 'hidden',
                                  }}
                                >
                                  <Image
                                    // fill={true}
                                    // style={{ maxHeight: '200px', maxWidth: '200px' }}

                                    fill={true}
                                    src={logoPreview}
                                    alt='Banner'
                                  />
                                </div>
                              )}
                              <Form.Group
                                // controlId='logoGroup'
                                className='mb-3'
                              >
                                {/* <Form.Label>Select Company Banner Image</Form.Label> */}
                                <div className='input-group d-flex justify-content-center'>
                                  <Form.Control
                                    id='categoryLogo'
                                    className='d-none'
                                    // onChange={handleCompanyBannerChange}
                                    onChange={(e) =>
                                      handleImageChageCommon(e, 'logo')
                                    }
                                    name='logo'
                                    type='file'
                                  />
                                  <Button
                                    style={{ background: '#0a58ca' }}
                                    type='button'
                                    className='input-group-text mt-2 rounded'
                                  >
                                    <i className='fa fa-upload me-1' />{' '}
                                    <label
                                      className='text-white'
                                      htmlFor='categoryLogo'
                                    >
                                      Select Category Logo Image
                                    </label>
                                  </Button>
                                </div>
                              </Form.Group>
                            </div>
                          </Col>
                          <Col xl='12' lg='12' md='12'>
                            <Form.Group
                              className='mb-3'
                              // controlId='formBasicPassword'
                            >
                              <div className='spacer-30'> </div>
                              <Button
                                className='reg-btn fill-not ble-brdr'
                                type='submit'
                                disabled={
                                  isSubmitting ||
                                  // !(isValid && dirty) ||
                                  !logoFile ||
                                  !bannerFile
                                }
                              >
                                {isSubmitting ? (
                                  <Spinner size='sm' />
                                ) : categoryId ? (
                                  'Update Category'
                                ) : (
                                  'Add New Category'
                                )}
                              </Button>
                            </Form.Group>
                          </Col>
                        </Row>
                        <div className='spacer-20'> </div>
                      </FormikForm>
                    )}
                  </Formik>
                </Col>
              </Row>
              <div className='mt-4' />
              <div className='d-flex flex-row'>
                {/* <div className='d-flex justify-content-center flex-column border-1 '>
                  <Form.Label className='p-1'>Current Categories</Form.Label>
                  <div className='d-flex flex-wrap gap-3'>
                    {categories &&
                      categories.map((category: any, index) => (
                        <div
                          style={{
                            border: '1px #1e5fb3 solid ',
                            borderRadius: '15px',
                          }}
                          className='px-3 py-1'
                          key={category[0]}
                        >
                          <p className='m-0'>{category[1]?.name}</p>
                        </div>
                      ))}
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </main>
      </>
    )
  );
}
