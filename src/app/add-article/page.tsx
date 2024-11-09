'use client';
import React, { useEffect, useRef, useState } from 'react';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import Head from 'next/head';
import {
  Row,
  Col,
  Form,
  Button,
  Accordion,
  Spinner,
  Modal,
} from 'react-bootstrap';
import girl from '@/assets/Img/user-img.png';
import iconshare from '@/assets/Img/Icons/icon-share.png';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import post1 from '@/assets/Img/placeholder-img.jpg';
import Image from 'next/image';
import Link from 'next/link';
import parse from 'html-react-parser';
import { useConnectPlugWalletStore } from '@/store/useStore';
import authMethods from '@/lib/auth';
import logger from '@/lib/logger';
import {
  Formik,
  FormikProps,
  Form as FormikForm,
  Field,
  FormikValues,
  ErrorMessage,
  useFormikContext,
  FormikTouched,
  setNestedObjectValues,
} from 'formik';
import { Article } from '@/types/article';
import { number, object, string } from 'yup';
import { toast } from 'react-toastify';
import { fileToCanisterBinaryStoreFormat } from '@/dfx/utils/image';
import {
  makeEntryActor,
  makeLedgerCanister,
} from '@/dfx/service/actor-locator';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import {
  BASE_IMG_URL,
  isDescription,
  isValidFileType,
} from '@/constant/image';
import { getImage } from '@/components/utils/getImage';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { Principal } from '@dfinity/principal';
import { utcToLocal } from '@/components/utils/utcToLocal';
import Texteditor from '@/components/cutomeEditor/Editor';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import { canisterId as entryCanisterId } from '@/dfx/declarations/entry';
import { E8S, GAS_FEE } from '@/constant/config';
import { Typeahead } from 'react-bootstrap-typeahead';
import ImageCropper from '@/components/Cropper';
import { CropperProps } from '@/types/cropper';
import {
  ARTICLE_FEATURED_IMAGE_ASPECT,
  MAX_ARTICLE_FEATURED_SIZES,
} from '@/constant/sizes';
import getCroppedImg from '@/components/Cropper/cropImage';
import resizeImage from '@/components/utils/resizeImage';
import AddCompanyForm from '@/components/addCompanyForm/AddCompanyForm';
import CategoriesList from '@/components/CategoriesList';
import uploadImage from '@/components/utils/uploadImage';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import ReactPaginate from 'react-paginate';
import { Date_m_d_y_h_m } from '@/constant/DateFormates';
import { ARTICLE_DINAMIC_PATH, Podcast_DINAMIC_PATH } from '@/constant/routes';

function ScrollToError() {
  const formik = useFormikContext();
  const submitting = formik?.isSubmitting;

  useEffect(() => {
    const el = document.querySelector('.Mui-err');
    (el?.parentElement ?? el)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [submitting]);
  return null;
}
export default function AddArticle() {
  const { t, changeLocale } = useLocalization(LANG);
  const [isLoading, setIsLoading] = useState(false);
  const [articleContent, setArticleContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedCompany, setSelectedComany] = useState('');

  const [isArticleSubmitting, setIsArticleSubmitting] = useState(false);
  const [editorKey, setEditorKey] = useState(5);
  const [tempPreviewImg, setTempPreviewImg] = useState('');
  const [previewImgId, setPreviewImgId] = useState<undefined | string>();
  const [podcastImgId, setPodcastImgId] = useState<undefined | string>();
  const [tempPodcastPreviewImg, setTempPodcastPreviewImg] = useState('');
  const [podcastPreviewFile, setPodcastPreviewFile] = useState<File | null>(
    null
  );

  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [isArticleDraft, setIsArticleDraft] = useState(true);
  const [draftPreviewImg, setDraftPreviewImg] = useState<File | null>(null);
  const [draftPodcastPreviewImg, setDraftPodcastPreviewImg] =
    useState<File | null>(null);

  const [initialArticleContent, setInitialArticleContent] = useState('');
  const [isDraftSubmitting, setIsDraftSubmitting] = useState(false);
  const [isPromoted, setIsPromoted] = useState(false);
  const [articleStatus, setArticleStatus] = useState(false);
  const [isPressRelease, setIsPressRelease] = useState(false);
  // type can be article,pressRelease,podcast
  const [creationType, setCreationType] = useState('article');
  const [podcastVideoLink, setPodcastVideoLink] = useState('');

  const [profileImg, setProfileImg] = useState<any>();
  const [confirmTransaction, setConfirmTransaction] = useState(false);
  const [showPreviewImg, setShowPreviewImg] = useState(false);
  const [showEditorPreviewImg, setShowEditorPreviewImg] = useState<any>(null);
  const [showEditorImg, setShowEditorImg] = useState<any>(null);
  const [editorImgloading, setEditorImgloading] = useState(false);
  const [showEditorImgLink, setEditorImgLink] = useState<string>('');

  const [user, setUser] = useState<any>();
  const [value, setValue] = useState<any>('');
  const [draftArticleCreator, setDraftArticleCreator] = useState<any>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  // const [selectedTagsImg, setSelectedTagsImg] = useState<string[]>([]);
  const [imgCation, setImgCaption] = useState<string>('');
  const [podcastImgCation, setPodcastImgCaption] = useState<string>('');

  const [showWeb3Model, setShowWeb3Model] = useState(false);
  const [cropperImg, setCropperImg] = useState<CropperProps | undefined>();
  const [showCropper, setShowCropper] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategoriesNames, setSelectedCategoriesNames] = useState<
    string[]
  >([]);

  const [Companies, setCompanies] = useState([]);
  const [wannaPromote, setWannaPromote] = useState(false);
  const [promotionValues, setPromotionValues] = useState({
    icp: 0,
    // likes: 0,
  });
  const [draftContent, setDraftContent] = useState({
    title: '',
    seoTitle: '',
    seoDescription: '',
    seoSlug: '',
    seoExcerpt: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  let draftId = searchParams.get('draftId');
  const editor = useRef<any>();
  const [isGettingweb3, setIsGettingweb3] = useState(true);
  const [forcePaginate, setForcePaginate] = useState(0);
  const [web3Size, setweb3SizeSize] = useState(0);
  const [discriptionErr, setDiscriptionErr] = useState(false);

  const { auth, setAuth, identity, principal, userAuth } =
    useConnectPlugWalletStore((state: any) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
      userAuth: state.userAuth,
    }));
  const defaultEntryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const router = useRouter();
  const formikRef = useRef<FormikProps<FormikValues>>(null);

  let gasFee = GAS_FEE / E8S;

  const handleClose = () => {};
  const handleModalClose = () => {
    if (isArticleSubmitting || isDraftSubmitting) {
      return false;
    }
    setShowModal(false);
    setConfirmTransaction(false);
    setWannaPromote(false);
    setIsPromoted(false);
    setPromotionValues({
      icp: 0,
    });
  };
  const handlePreviewModalClose = () => {
    setShowPreviewModal(false);
  };
  const handleShowPreviewModal = () => {
    setShowPreviewModal(true);
  };
  const handleShowCropper = () => {
    setShowCropper(true);
  };
  const handleHideCropper = () => {
    setShowCropper(false);
  };
  const methods = authMethods({
    useConnectPlugWalletStore,
    setIsLoading,
    handleClose,
  });
  const updateImg = async (img: any, profile?: boolean) => {
    if (profile) {
      if (img) {
        const tempImg = await getImage(img);

        setProfileImg(tempImg);
      } else {
        // setProfileFile(null);
        setProfileImg(null);
      }
    } else {
      if (img) {
        const tempImg = await getImage(img);
        setTempPreviewImg(tempImg);
      } else {
        // setProfileFile(null);
        setTempPreviewImg('');
      }
    }
  };
  const entryWhichWeGot = async (tempEntry: any) => {
    // let tempUser = tempEntry[0].user?.toString();
    // setUserId(tempUser);
    // updateImg(tempEntry[0].image, 'feature');
    let articleCreator = tempEntry[0]?.user.toString();
    if (articleCreator !== principal && !userAuth.userPerms?.articleManagement)
      return router.replace('/');

    if (
      !tempEntry[0].isDraft &&
      !userAuth.userPerms?.articleManagement &&
      articleCreator !== principal
    ) {
      toast.error(t('This action is not allowed'));
      return router.push('/');
    }
    if (tempEntry[0].isDraft) {
      setIsDraft(true);
    }
    setDraftContent(tempEntry[0]);
    // setInitialArticleContent(tempEntry[0].description);
    setArticleContent(tempEntry[0].description);
    // setArticleContent(tempEntry[0].description);
    setSelectedCategory(tempEntry[0].category);
    setSelectedComany(tempEntry[0].companyId);
    updateImg(tempEntry[0].image[0]);
    setIsPressRelease(tempEntry[0].pressRelease);
    // type can be article,pressRelease,podcast

    setCreationType(
      tempEntry[0].isPodcast
        ? 'podcast'
        : tempEntry[0].pressRelease
        ? 'pressRelease'
        : 'article'
    );
    setDraftPreviewImg(tempEntry[0].image[0]);
    if (tempEntry[0].isPodcast && tempEntry[0].podcastImg.length != 0) {
      let tempPodcastimg = getImage(tempEntry[0].podcastImg[0]);
      if (tempPodcastimg) {
        setTempPodcastPreviewImg(tempPodcastimg);
      }
    }

    setPodcastImgCaption(
      tempEntry[0].isPodcast ? tempEntry[0].podcastImgCation : ''
    );
    setDraftArticleCreator(tempEntry[0].user);
    setPodcastVideoLink(
      tempEntry[0].isPodcast ? tempEntry[0].podcastVideoLink : ''
    );
    setSelectedTags(
      tempEntry[0].tags.map((e: any, ind: any) => {
        return { customOption: true, label: e, id: `${ind}` };
      })
    );
    // setSelectedTagsImg(
    //   tempEntry[0].imageTags.map((e: any, ind: any) => {
    //     return { customOption: true, label: e, id: `${ind}` };
    //   })
    // );
    setImgCaption(tempEntry[0].caption);
    setIsArticleDraft(true);
    // setEntry(tempEntry[0]);
  };
  const getEntry = async () => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    if (draftId) {
      if (userAuth.userPerms?.articleManagement) {
        const tempEntry = await entryActor.getEntry_admin(draftId);

        entryWhichWeGot(tempEntry);
      } else {
        const tempEntry = await entryActor.getEntry(draftId);
        entryWhichWeGot(tempEntry);
      }
    }
  };

  // Form

  const initialValues: Article = {
    title: draftContent.title ?? '',
    // description: '',
    seoTitle: draftContent.seoTitle ?? '',
    seoDescription: draftContent.seoDescription ?? '',
    seoExcerpt: draftContent.seoExcerpt ?? '',
    seoSlug: draftContent.seoSlug ?? '',
  };

  const initialPromoteVales = {
    ICP: 0,
  };
  const promotionSchema = object().shape({
    ICP: number().min(1, t('ICP cannot be less than 1')),
  });
  const articleSchema = object().shape({
    title: string()
      .required(t('Title is required'))
      .max(200, t('Title cannot be more than 200 characters')),
    // description: string().required('Description is required'),
    seoTitle: string().max(
      3000,
      t('Seo Title cannot be more than 3000 characters')
    ),
    seoDescription: string().max(
      3000,
      t('Meta Description cannot be more than 3000 characters')
    ),
    seoExcerpt: string()
      .required(t('Short Description is required'))
      .max(
        LANG == 'en' ? 250 : 80,
        LANG == 'en'
          ? 'Short Description cannot be more than 250 characters'
          : '短い説明は 80 文字を超えることはできません'
      ),
    seoSlug: string().max(3000, t('Slug cannot be more than 3000 characters')),
    // img: mixed().required('Image is required'),
  });

  const articlePreviewUpload = async (
    imgUrl: string,
    imgName: string,
    pixels: any,
    rotation: number = 0
  ) => {
    const croppedImage = await getCroppedImg(imgUrl, imgName, pixels, rotation);
    if (!croppedImage) return;
    const resizedProfile = await resizeImage(
      croppedImage,
      MAX_ARTICLE_FEATURED_SIZES.width,
      MAX_ARTICLE_FEATURED_SIZES.height
    );

    const newUrl = URL.createObjectURL(resizedProfile);

    const imgId = await uploadImage(resizedProfile);
    setPreviewImgId(imgId);
    setTempPreviewImg(newUrl);
    setPreviewFile(resizedProfile);
    // setProfileFile(resizedProfile);
    handleHideCropper();
  };
  const itemsPerPage = 20;

  let pageCount = Math.ceil(web3Size / itemsPerPage);
  const handlePageClick = async (event: any) => {
    setIsGettingweb3(true);

    setForcePaginate(event.selected);
    // setItemOffset(newOffset);
    // if ()
    let list: any = [];
    const newOffset = (event.selected * itemsPerPage) % web3Size;

    const tempWeb3 = await defaultEntryActor.getWeb3List(
      '',
      search,
      newOffset,
      itemsPerPage
    );

    list = tempWeb3.web3List;
    setCompanies(list);
    const tempweb3Size = parseInt(tempWeb3.amount);

    setweb3SizeSize(tempweb3Size);

    setIsGettingweb3(false);
  };
  const podcastPreviewUpload = async (
    imgUrl: string,
    imgName: string,
    pixels: any,
    rotation: number = 0
  ) => {
    const croppedImage = await getCroppedImg(imgUrl, imgName, pixels, rotation);
    if (!croppedImage) return;
    const resizedProfile = await resizeImage(
      croppedImage,
      MAX_ARTICLE_FEATURED_SIZES.width,
      MAX_ARTICLE_FEATURED_SIZES.height
    );

    const newUrl = URL.createObjectURL(resizedProfile);

    const imgId = await uploadImage(resizedProfile);
    setPodcastImgId(imgId);
    setTempPodcastPreviewImg(newUrl);
    setPodcastPreviewFile(resizedProfile);
    // setProfileFile(resizedProfile);
    handleHideCropper();
  };
  let getWeb3List = async (searchString = '') => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    const tempWeb3 = await entryActor.getWeb3List(
      '',
      searchString,
      0,
      itemsPerPage
    );
    // const promted = await entryActor.getPromotedEntries();
    if (tempWeb3.web3List.length > 0) {
      setCompanies(tempWeb3.web3List);
      const tempweb3Size = parseInt(tempWeb3.amount);

      setweb3SizeSize(tempweb3Size);
      setIsGettingweb3;
    } else {
      setCompanies([]);
    }
    setIsGettingweb3(false);
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
      case 'article':
        setCropperImg({
          imgUrl,
          imgName: img.name,
          aspect: ARTICLE_FEATURED_IMAGE_ASPECT,
          callBack: articlePreviewUpload,
          maxWidth: MAX_ARTICLE_FEATURED_SIZES.width,
          maxHeight: MAX_ARTICLE_FEATURED_SIZES.height,
        });
        break;
      case 'podcast':
        setCropperImg({
          imgUrl,
          imgName: img.name,
          aspect: ARTICLE_FEATURED_IMAGE_ASPECT,
          callBack: podcastPreviewUpload,
          maxWidth: MAX_ARTICLE_FEATURED_SIZES.width,
          maxHeight: MAX_ARTICLE_FEATURED_SIZES.height,
        });
        break;
      default:
        toast.error(t('Errorr while uploading media'));

        break;
    }
    handleShowCropper();
    e.target.value = '';
  };

  const options = [''];

  const clearPost = () => {
    formikRef.current?.resetForm();
    const newKey = editorKey * 45;
    // setEditorKey(newKey);
    setSelectedCategory([]);
    setPreviewFile(null);
    setImgCaption('');
    setPodcastImgCaption('');
    setArticleContent('');
    setSelectedComany('');
    setTempPodcastPreviewImg('');
    setPodcastVideoLink('');
    setSelectedTags([]);
    setDraftPreviewImg(null);
    setDraftContent({
      title: '',
      seoTitle: '',
      seoDescription: '',
      seoSlug: '',
      seoExcerpt: '',
    });
  };
  // Form

  const uploadEntry = async (values: FormikValues) => {
    let previewArray = null;
    let podcastPreviewArray = null;
    let isDec = isDescription(articleContent);
    if (isDec.length <= 0) {
      return toast.error(t('Article cannot be empty.'));
    }
    // if (articleContent.length <= 0) {
    //   return toast.error(t('Article cannot be empty.'));
    // }
    if (creationType !== 'podcast') {
      if (previewFile !== null) {
        // previewArray = await fileToCanisterBinaryStoreFormat(previewFile);
        previewArray = BASE_IMG_URL + previewImgId;
      } else if (draftPreviewImg !== null) {
        previewArray = draftPreviewImg;
      } else {
        return toast.error(t('Please select feature image'));
      }
    }
    if (creationType == 'podcast') {
      if (podcastPreviewFile !== null) {
        // podcastPreviewArray = await fileToCanisterBinaryStoreFormat(
        //   podcastPreviewFile
        // );
        podcastPreviewArray = BASE_IMG_URL + podcastImgId;
      } else if (draftPodcastPreviewImg !== null) {
        podcastPreviewArray = draftPodcastPreviewImg;
      }
    }
    if (creationType == 'podcast') {
      if (podcastVideoLink == '' && podcastPreviewArray == null) {
        return toast.error(t('Please Enter Iframe or Image.'));
      }
      if (podcastVideoLink != '') {
        const iframeRegex =
          /<iframe\s*width="(\d+)"\s*height="(\d+)"\s*src="(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^"?]+)[^"]*"\s*title="([^"]*)"[^>]*>/i;

        const iframeTag = podcastVideoLink.trim();

        const match = iframeTag.match(iframeRegex);

        if (!match) {
          return toast.error(t('Iframe is Invalid.'));
        }
      }
    }

    if (selectedCategory.length === 0) {
      return toast.error(t('Please select at least one  category'));
    }
    // if (selectedCategory.length === 0 && selectedCompany == '') {
    //   return toast.error('Please select at least one  category or Company');
    // }
    // if (selectedTags.length < 1) {
    //   return toast.error(t('Please select at least one meta Tag.'));
    // }
    if (selectedTags.length > 5) {
      return toast.error(t("Meta Tags can't be more than five."));
    }
    if (creationType !== 'podcast') {
      // if (selectedTagsImg.length < 1) {
      //   return toast.error('Please select at least one Image Tag.');
      // }
      // if (selectedTagsImg.length > 5) {
      //   return toast.error("Image Tags can't be more five.");
      // }
      // if (imgCation.length < 3) {
      //   return toast.error(t("Caption can't be less then 3 characters."));
      // }
      if (imgCation.length >= 200) {
        return toast.error(t("Caption can't be more 200 characters."));
      }
    }
    if (creationType == 'podcast' && podcastPreviewFile !== null) {
      // if (podcastImgCation.length < 3) {
      //   return toast.error(t("Caption can't be less then 3 characters."));
      // }
      if (podcastImgCation.length >= 200) {
        return toast.error(t("Caption can't be more 200 characters."));
      }
    }
    // check iframe

    if (isArticleDraft) {
      setIsDraftSubmitting(true);
    } else {
      setIsArticleSubmitting(true);
    }
    if (auth.state !== 'initialized') {
      await methods.initAuth();
    }

    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    let rewardConfig = await entryActor.get_reward();
    let reward = parseFloat(rewardConfig.master);
    let platform = parseFloat(rewardConfig.platform);
    let admin = parseFloat(rewardConfig.admin);

    let promotionE8S = promotionValues.icp * E8S;
    // TODO ADJUST THIS
    let gasInICP = gasFee * 5;
    let gasInE8S = gasInICP * E8S;
    let promotedICP = promotionE8S + gasInE8S;
    logger({ gasInE8S, promotedICP });
    // let promotedICP = (reward / 100) * (promotionValues.icp * E8S);
    logger({ gasInE8S, promotedICP });
    // let tagslist=selectedTagsImg.map((e:any)=>e.title),

    const article = {
      title: values.title,
      description: articleContent,
      seoTitle: values.seoTitle,
      seoSlug: values.seoSlug,
      seoDescription: values.seoDescription,
      seoExcerpt: values.seoExcerpt,
      isCompanySelected: selectedCompany == '' ? false : true,
      companyId: selectedCompany,
      category: selectedCategory,
      subscription: true,
      image: creationType == 'podcast' ? [] : [previewArray],
      podcastVideoLink: creationType == 'podcast' ? podcastVideoLink : '',
      podcastImg:
        creationType == 'podcast'
          ? podcastPreviewArray != null
            ? [podcastPreviewArray]
            : []
          : [],
      podcastImgCation:
        creationType == 'podcast'
          ? podcastPreviewArray != null
            ? podcastImgCation
            : ''
          : '',
      isPodcast: creationType == 'podcast' ? true : false,
      isDraft: isArticleDraft,
      isPromoted: false,
      userName: user.name[0],
      // promotionLikesTarget: promotionValues.likes,
      promotionICP: 0,
      // type can be article,pressRelease,podcast
      // const [creationType, setCreationType] = useState("article");
      pressRelease:
        creationType == 'podcast'
          ? false
          : creationType == 'pressRelease'
          ? true
          : false,
      // imageTags:
      //   creationType == 'podcast'
      //     ? ['']
      //     : selectedTagsImg.map((item: any) => item.label),
      caption: creationType == 'podcast' ? '' : imgCation,
      tags: selectedTags.map((item: any) => item.label),
    };

    if (isArticleDraft) {
    }
    let reviewMsg = confirmTransaction
      ? 'Your Promoted Article has been sent for review'
      : 'Your Article has been sent for review';
    if (draftId) {
      if (isArticleDraft) {
        article.isPromoted = false;
        article.promotionICP = 0;
      }
      entryActor
        .insertEntry(article, userCanisterId, true, draftId, commentCanisterId)
        .then((res: any) => {
          if (isArticleDraft) {
            article.isPromoted = false;
            article.promotionICP = 0;

            if (!confirmTransaction)
              toast.success(t('Draft Saved successfully'));
          } else {
            logger(res, 'draft Published successfully');
            // toast.success(reviewMsg);
          }
          if (isArticleDraft) {
            setIsDraftSubmitting(false);
            setArticleStatus(false);
          } else {
            setIsArticleSubmitting(false);
            setArticleStatus(true);
            if (creationType == 'podcast') {
              toast.success(
                t(
                  'Your podcast has been published! We will contact you soon after reviewing your article. Thank you for your contribution!'
                )
              );
              router.replace(`${Podcast_DINAMIC_PATH + res.ok[1]}`);
            } else {
              if (creationType == 'pressRelease') {
                toast.success(
                  t(
                    'Your pressRelease has been published! We will contact you soon after reviewing your article. Thank you for your contribution!'
                  )
                );
              } else {
                toast.success(
                  t(
                    'Your article has been published! We will contact you soon after reviewing your article. Thank you for your contribution!'
                  )
                );
              }
              router.replace(`${ARTICLE_DINAMIC_PATH + res.ok[1]}`);
            }
            clearPost();
          }
          // setIsArticleSubmitting(false);

          window.scrollTo(0, 0);
        })
        .catch((err: string) => {
          logger(err);
          // setIsArticleSubmitting(false);
          setArticleStatus(false);

          if (isArticleDraft) {
            setIsDraftSubmitting(false);
          } else {
            setIsArticleSubmitting(false);
          }
        });
    } else {
      if (isArticleDraft) {
        article.isPromoted = false;
        article.promotionICP = 0;
      }
      entryActor
        .insertEntry(article, userCanisterId, false, '', commentCanisterId)
        .then((res: any) => {
          draftId = res.ok[1];
          if (isArticleDraft) {
            if (!confirmTransaction)
              toast.success(t('Draft Saved successfully'));
            setArticleStatus(false);
            router.replace(`/add-article?draftId=${res.ok[1]}`);
          } else {
            // toast.success(reviewMsg);
            setArticleStatus(true);

            clearPost();
            if (creationType == 'podcast') {
              toast.success(t('Your Podcast has been sent for review.'));
              router.replace(`${Podcast_DINAMIC_PATH + res.ok[1]}`);
            } else {
              if (creationType == 'pressRelease') {
                toast.success(t('Your PressRelease has been sent for review.'));
              } else {
                toast.success(t('Your Article has been sent for review.'));
              }
              router.replace(`${ARTICLE_DINAMIC_PATH + res.ok[1]}`);
            }
          }
          // setIsArticleSubmitting(false);
          if (isArticleDraft) {
            setIsDraftSubmitting(false);
          } else {
            setIsArticleSubmitting(false);
          }

          window.scrollTo(0, 0);
        })
        .catch((err: string) => {
          // setIsArticleSubmitting(false);
          if (isArticleDraft) {
            setIsDraftSubmitting(false);
          } else {
            setIsArticleSubmitting(false);
          }
          setArticleStatus(false);
        });
    }

  };
  const saveDraft = async () => {
  
    setIsArticleDraft(true);
    setIsPromoted(false);
    setPromotionValues({
      icp: 0,
    });
    await formikRef.current?.handleSubmit();
    
  };
  const validateAndShowModal = async () => {
    if (articleContent?.length <= 0) {
      return toast.error(t('You can not save an empty article'));
    }

    if (selectedCategory.length === 0) {
      return toast.error(t('Please select at least one  category'));
    }
    let previewArray = null;
    if (previewFile !== null) {
      previewArray = await fileToCanisterBinaryStoreFormat(previewFile);
    } else if (draftPreviewImg !== null) {
      previewArray = draftPreviewImg;
    } else {
      return toast.error('Please', t('select feature image'));
    }
    const errors = await formikRef.current?.validateForm();
    if (errors && Object.keys(errors).length === 0) {
      setShowModal(true);

    } else {
      formikRef.current?.setTouched(
        setNestedObjectValues<FormikTouched<FormikValues>>(errors, true)
      );
    }
  };
  const handleTagChange = (selectedOptions: any) => {
    if (typeof selectedOptions[selectedOptions.length - 1] == 'string') {
      selectedOptions.pop();
      setSelectedTags(selectedOptions);
    } else {
      setSelectedTags(selectedOptions);
    }
  };
 
  const handlePublish = async () => {
    let isDec = isDescription(articleContent);
    if (isDec.length <= 0) {
      setDiscriptionErr(true);
    }
    setIsArticleDraft(false);
    formikRef.current?.handleSubmit();
    // const returniii = await formikRef.current?.validateForm();
  };
  const handleTransaction = async () => {
    try {
      setIsArticleSubmitting(true);
      setIsArticleDraft(true);

      let ledgerActor = await makeLedgerCanister({
        agentOptions: {
          identity,
        },
      });
      let acc: any = AccountIdentifier.fromPrincipal({
        principal: identity.getPrincipal(),
        // subAccount: identity.getPrincipal(),
      });

      let balance = await ledgerActor.account_balance({
        account: acc.bytes,
      });

      let rewardConfig = await defaultEntryActor.get_reward();

      let promotion = parseFloat(rewardConfig.master);
      let platform = parseFloat(rewardConfig.platform);
      let admin = parseFloat(rewardConfig.admin);
      let total = promotion + platform + admin;
      if (total !== 100) {
        setIsArticleSubmitting(false);
        setIsDraftSubmitting(false);
        handleModalClose();
        return toast.error(t('Error During Transaction'));
      }
      // let promotedICP = (reward / 100) * promotionValues.icp;
      let promotionE8S = promotionValues.icp * E8S;
      let promotionICP = (promotion / 100) * promotionE8S;
      let platformICP = (platform / 100) * promotionE8S;
      let adminICP = (admin / 100) * promotionE8S;
      let balanceICP = parseInt(balance.e8s) / E8S;
      let gasInE8s = GAS_FEE;
      // TODO ADJUST THIS
      let gasInICP = gasFee * 5;
      let gasInE8S = gasInICP * E8S;
      let requiredICP = balanceICP + gasInICP;
      let approvingPromotionE8S = promotionE8S + gasInE8S;

      if (balance.e8s < approvingPromotionE8S) {
        setIsArticleDraft(false);
        setConfirmTransaction(false);
        setIsArticleSubmitting(false);
        return toast.error(
          `${t(
            'Insufficient balance to promote. Current Balance'
          )} ${balanceICP}`
        );
      } else {
      }
      let masterPrincipal = Principal.fromText(
        process.env.NEXT_PUBLIC_MASTER_WALLET as string
      );
      let masterAcc: any = AccountIdentifier.fromPrincipal({
        principal: masterPrincipal,
        // subAccount: identity.getPrincipal(),
      });
      let platformPrincipal = Principal.fromText(
        process.env.NEXT_PUBLIC_PLATFORM_WALLET as string
      );
      let platformAcc: any = AccountIdentifier.fromPrincipal({
        principal: platformPrincipal,
        // subAccount: identity.getPrincipal(),
      });
      let adminPrincipal = Principal.fromText(
        process.env.NEXT_PUBLIC_ADMIN_WALLET as string
      );
      let adminAcc: any = AccountIdentifier.fromPrincipal({
        principal: adminPrincipal,
        // subAccount: identity.getPrincipal(),
      });
      if (!entryCanisterId) return toast.error(t('Error in transaction'));
      let entryPrincipal = Principal.fromText(entryCanisterId);
      let approval = await ledgerActor.icrc2_approve({
        amount: approvingPromotionE8S,
        spender: {
          owner: entryPrincipal,
          subaccount: [],
        },
        fee: [GAS_FEE],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        expected_allowance: [],
        expires_at: [],
      });
      if (approval.Ok) {
        setIsArticleDraft(false);
        setTimeout(() => {
          formikRef?.current?.handleSubmit();
        }, 100);
      }

      setIsArticleSubmitting(false);
      setIsArticleDraft(false);
   
    } catch (e) {
      console.error(e);
      setIsArticleSubmitting(false);
      setIsArticleDraft(false);
    }
  };
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      getWeb3List(search);
    }
  };

  const getUser = async (res?: any) => {
    let tempUser = null;
    if (res) {
      tempUser = await res.get_user_details([]);
    } else {
      tempUser = await auth.actor.get_user_details([]);
    }
    if (tempUser.ok) {
      setUser(tempUser.ok[1]);
      updateImg(tempUser.ok[1].profileImg[0], true);
    }
  };
  // editor config
  let uploadEditorImage = (e: any) => {
    const img = e.target.files[0];
    if (!img) return;

    const validType = isValidFileType(img && img.name.toLowerCase(), 'image');
    if (!validType) {
      toast.error(t('Not a valid image type'));
      return;
    }
    setShowEditorImg(img);
    const reader = new FileReader();

    reader.onload = function () {
      setShowEditorPreviewImg(reader.result);
      setShowPreviewImg(true);
    };
    reader.readAsDataURL(img);
    e.target.value = '';
  };
  let handleEditorModelClose = () => {
    setShowEditorPreviewImg(null);
    setShowPreviewImg(false);
    setShowEditorImg(null);
  };
  let copyImgLink = (link: any) => {
    if (link) {
      window.navigator.clipboard.writeText(link).then(() => {
        toast.success(
          t(
            'Copied successfully. Please paste your copied URL in the image section'
          ),
          {
            autoClose: 7000, // Time in milliseconds, 5000ms = 5 seconds
          }
        );
      });
    }
  };
  let handleEditorImageUpload = async () => {
    setEditorImgloading(true);
    if (showEditorImg) {
      const imgId = await uploadImage(showEditorImg);
      if (imgId) {
        setEditorImgloading(false);
        let link = BASE_IMG_URL + imgId;
        setEditorImgLink(link);
        copyImgLink(link);

        handleEditorModelClose();
      }
    }
  };
  const web3ModelShow = () => setShowWeb3Model(true);
  useEffect(() => {
    if (auth.state === 'anonymous') {
      router.push('/');
    }
  }, [auth]);
  useEffect(() => {
    if (principal) getEntry();
  }, [principal, draftId]);
  React.useEffect(() => {
    if (auth.state === 'anonymous') {
      // setIsOwner(false);
      // setIdentity(null);
    } else if (auth.state !== 'initialized') {
    } else {
      getUser();
      // getII();
    }
  }, [auth]);
  useEffect(() => {
    if (auth.state == 'initialized' && identity) {
      getWeb3List();
    }
  }, [auth, identity]);

  return (
    <>
      {cropperImg && (
        <ImageCropper
          show={showCropper}
          handleClose={handleHideCropper}
          cropperProps={cropperImg}
        />
      )}
      <main id='main'>
        <div className='main-inner home'>
          <Head>
            <title>{t('Hi')}</title>
          </Head>
          <div className='section' id='top'>
            <Row>
              <Col xxl='8' xl='8' lg='12' md='12'>
                <div className='pbg-pnl text-left'>
                  <Formik
                    initialValues={initialValues}
                    innerRef={formikRef}
                    enableReinitialize
                    validationSchema={articleSchema}
                    onSubmit={async (values, actions) => {
                      // uploadEntry(values);
                      // hello.greet(values.title).then((res) => {
                      //   logger('GET GREETED KID::::::', res);
                      // });

                      await uploadEntry(values);
                    }}
                  >
                    {({ errors, touched, handleChange, handleBlur }) => (
                      <FormikForm
                        className='flex w-full flex-col items-center justify-center'
                        // onChange={(e) => handleImageChange(e)}
                      >
                        <Field name='title'>
                          {({ field, formProps }: any) => (
                            <Form.Group
                              className='mb-2'
                              controlId='exampleForm.ControlInput1'
                            >
                              <Form.Label>{t('add title')}</Form.Label>
                              <Form.Control
                                type='text'
                                placeholder={t('enter title here')}
                                autoComplete='off'
                                value={field.value}
                                onInput={handleBlur}
                                onChange={(e) => {
                                  formikRef?.current?.setFieldValue(
                                    'seoTitle',
                                    e.target.value
                                  );
                                  formikRef?.current?.setFieldValue(
                                    'seoSlug',
                                    e.target.value
                                  );
                                  handleChange(e);
                                }}
                                name='title'
                              />
                            </Form.Group>
                          )}
                        </Field>
                        <div className='text-danger mb-2'>
                          <ErrorMessage
                            className='Mui-err'
                            name='title'
                            component='div'
                          />
                        </div>
                        <div className='full-div my-3 '>
                          <Form.Label className='d-flex justify-content-between align-items-center'>
                            <p className='mb-0'>{t('Description')}</p>
                            <div>
                              <Button
                                type='button'
                                className='reg-btn blue-btn uploadImg rounded'
                              >
                                <i className='fa fa-upload me-1' />{' '}
                                <label
                                  className='text-white'
                                  htmlFor='uploadimg'
                                >
                                  {t('Upload Image')}
                                </label>
                                <input
                                  type='file'
                                  name=''
                                  className='d-none'
                                  id='uploadimg'
                                  onInput={(e) => uploadEditorImage(e)}
                                />
                              </Button>
                              {showEditorImgLink &&
                                showEditorImgLink.length != 0 && (
                                  <span
                                    className='copybtn'
                                    onClick={() =>
                                      copyImgLink(showEditorImgLink)
                                    }
                                  >
                                    <i className='fa fa-lg fa-copy' />
                                  </span>
                                )}
                            </div>{' '}
                          </Form.Label>
                          <Texteditor
                            initialValue={articleContent}
                            value={articleContent}
                            onChangefn={setArticleContent}
                            errorState={setDiscriptionErr}
                          />
                          {discriptionErr && (
                            <div className='text-danger mb-2'>
                              {t('Description is required')}
                            </div>
                          )}
                        </div>
                        <Field name='seoExcerpt'>
                          {({ field, formProps }: any) => (
                            <Form.Group
                              className='mb-2'
                              controlId='exampleForm.ControlTextarea1'
                            >
                              <Form.Label>
                                {t('Short description')} {field.value.length}/
                                {LANG == 'en' ? 250 : 80}
                              </Form.Label>
                              <Form.Control
                                className='small'
                                as='textarea'
                                rows={3}
                                value={field.value}
                                onChange={handleChange}
                                onInput={handleBlur}
                                name='seoExcerpt'
                              />
                            </Form.Group>
                          )}
                        </Field>
                        <div className='text-danger mb-2'>
                          <ErrorMessage
                            className='Mui-err'
                            name='seoExcerpt'
                            component='div'
                          />
                        </div>
                        <Field name='seoTitle'>
                          {({ field, formProps }: any) => (
                            <Form.Group
                              className='mb-2'
                              controlId='exampleForm.ControlInput1'
                            >
                              <div className='flex-div-xs '>
                                <Form.Label>{t('seo title')}</Form.Label>
                              </div>
                              <Form.Control
                                type='text'
                                placeholder={t('Title')}
                                value={field.value}
                                onChange={handleChange}
                                onInput={handleBlur}
                                name='seoTitle'
                              />
                            </Form.Group>
                          )}
                        </Field>
                        <div className='text-danger mb-2'>
                          <ErrorMessage
                            className='Mui-err'
                            name='seoTitle'
                            component='div'
                          />
                        </div>
                        <Field name='seoSlug'>
                          {({ field, formProps }: any) => (
                            <Form.Group
                              className='mb-2'
                              controlId='exampleForm.ControlInput1'
                            >
                              <div className='flex-div-xs'>
                                <Form.Label>{t('slug')}</Form.Label>
                              </div>
                              <Form.Control
                                type='text'
                                placeholder=''
                                value={field.value}
                                onChange={handleChange}
                                onInput={handleBlur}
                                name='seoSlug'
                              />
                            </Form.Group>
                          )}
                        </Field>
                        <div className='text-danger mb-2'>
                          <ErrorMessage
                            className='Mui-err'
                            name='seoSlug'
                            component='div'
                          />
                        </div>
                        <Field name='seoDescription'>
                          {({ field, formProps }: any) => (
                            <Form.Group className='mb-2'>
                              <Form.Label>{t('meta description')}</Form.Label>
                              <Form.Control
                                className='small'
                                as='textarea'
                                rows={3}
                                value={field.value}
                                onChange={handleChange}
                                onInput={handleBlur}
                                name='seoDescription'
                              />
                            </Form.Group>
                          )}
                        </Field>
                        <div className='text-danger mb-2'>
                          <ErrorMessage
                            className='Mui-err'
                            name='seoDescription'
                            component='div'
                          />
                        </div>
                        <Form.Label>{t('meta tags')}</Form.Label>
                        <Typeahead
                          id='tagInput'
                          className='tagInput'
                          multiple
                          options={options}
                          selected={selectedTags}
                          onChange={handleTagChange}
                          placeholder={t('Enter tags...')}
                          allowNew // Allow users to add new tags
                          newSelectionPrefix={t('Add new tag:')}
                          clearButton // Show a clear button
                        />

                        {/* <Button
                          type='submit'
                          className='flex w-1/6 justify-center'
                        >
                          Submits
                        </Button> */}
                        <ScrollToError />
                      </FormikForm>
                    )}
                  </Formik>
                </div>
              </Col>
              <Col xxl='4' xl='4' className='text-left'>
                <Accordion defaultActiveKey={'0'}>
                  <Accordion.Item eventKey='0'>
                    <Accordion.Header>
                      {t('publish')}
                      <ul className='angle-list'>
                        <li>
                          <i className='fa fa-angle-up' />
                        </li>
                        <li>
                          <i className='fa fa-angle-down' />
                        </li>
                        <li>
                          <i className='fa fa-caret-up' />
                        </li>
                      </ul>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className='flex-div'>
                        <Button
                          className='grey-brdr-btn'
                          disabled={
                            isDraftSubmitting ||
                            isArticleSubmitting ||
                            (!isDraft && draftId ? true : false)
                          }
                          onClick={saveDraft}
                        >
                          {isDraftSubmitting ? (
                            <Spinner size='sm' />
                          ) : (
                            t('save draft')
                          )}
                        </Button>
                        <Button
                          className='grey-brdr-btn'
                          onClick={handleShowPreviewModal}
                        >
                          {t('preview')}
                        </Button>
                      </div>
                      <p>
                        {t('status')}:{' '}
                        <span>{articleStatus ? t('publish') : t('draft')}</span>{' '}
                        {/* <Link >Edit</Link> */}
                        {/* <Button
                          onClick={() => setIsArticleDraft((prev) => !prev)}
                        >
                          Change
                        </Button> */}
                      </p>
                      {/* <p>
                        Visibility: <span>Public </span>{' '}
                        <Link href='#'>Edit</Link>
                      </p>
                      <p>
                        Publish <span>Immediately </span>{' '}
                        <Link href='#'>Edit</Link>
                      </p> */}
                    </Accordion.Body>
                  </Accordion.Item>
                  <div className='linkeee p-0'>
                    <div
                      className='d-flex mb-3'
                      style={{
                        borderBottom: '2px solid #e9e9e9',
                      }}
                    >
                      <p
                        style={{
                          fontSize: 18,
                          fontWeight: 500,
                          marginBottom: 5,
                          paddingInline: 10,
                          paddingTop: 10,
                        }}
                      >
                        {t('creation type')}
                      </p>
                    </div>
                    <div
                      className={`d-flex justify-content-center my-2 gap-3 `}
                    >
                      <Button
                        className={`default-btn  ${
                          creationType == 'article' ? 'active' : ''
                        }`}
                        disabled={
                          isDraftSubmitting ||
                          isArticleSubmitting ||
                          (!isDraft && draftId ? true : false)
                        }
                        onClick={() => setCreationType('article')}
                      >
                        {t('Article')}
                      </Button>
                      <Button
                        className={`default-btn  ${
                          creationType == 'pressRelease' ? 'active' : ''
                        }`}
                        disabled={
                          isDraftSubmitting ||
                          isArticleSubmitting ||
                          (!isDraft && draftId ? true : false)
                        }
                        onClick={() => setCreationType('pressRelease')}
                      >
                        {t('Press Release')}
                      </Button>
                      <Button
                        className={`default-btn  ${
                          creationType == 'podcast' ? 'active' : ''
                        }`}
                        disabled={
                          isDraftSubmitting ||
                          isArticleSubmitting ||
                          (!isDraft && draftId ? true : false)
                        }
                        onClick={() => setCreationType('podcast')}
                      >
                        {t('podcast')}
                      </Button>
                    </div>
                    <div className='flex-div p-2'>
                      <Button
                        className={`red-link  ${
                          isDraftSubmitting || isArticleSubmitting
                            ? 'disabledBtn'
                            : ''
                        }`}
                        disabled={isDraftSubmitting || isArticleSubmitting}
                        onClick={clearPost}
                      >
                        {t('move to trash')}
                      </Button>
                      <Button
                        className='publish-btn'
                        disabled={isArticleSubmitting || isDraftSubmitting}
                        onClick={handlePublish}
                      >
                        {isArticleSubmitting ? (
                          <Spinner size='sm' />
                        ) : (
                          t('publish')
                        )}
                      </Button>
                    </div>
                  </div>
                </Accordion>
                <Accordion defaultActiveKey={'1'}>
                  <Accordion.Item eventKey='1'>
                    <Accordion.Header>
                      {t('categories')}
                      <ul className='angle-list'>
                        <li>
                          <i className='fa fa-angle-up' />
                        </li>
                        <li>
                          <i className='fa fa-angle-down' />
                        </li>
                        <li>
                          <i className='fa fa-caret-up' />
                        </li>
                      </ul>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className='flex-center'>
                        <CategoriesList
                          selectedCategory={selectedCategory}
                          selectedCategoriesNames={selectedCategoriesNames}
                          setSelectedCategory={setSelectedCategory}
                          setSelectedCategoriesNames={
                            setSelectedCategoriesNames
                          }
                        />
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
                <Accordion defaultActiveKey={'1'}>
                  <Accordion.Item eventKey='1'>
                    <Accordion.Header>
                      {t('companies')}
                      <ul className='angle-list'>
                        <li>
                          <i className='fa fa-angle-up' />
                        </li>
                        <li>
                          <i className='fa fa-angle-down' />
                        </li>
                        <li>
                          <i className='fa fa-caret-up' />
                        </li>
                      </ul>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div>
                        <div className='d-flex justify-content-center mb-2'>
                          <div
                            className='search-post-pnl'
                            style={{ maxWidth: '100%' }}
                          >
                            <input
                              type='text'
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              placeholder={t('search companies')}
                              onKeyDown={handleSearch}
                            />
                            {search.length >= 1 && (
                              <button
                                onClick={(e: any) => {
                                  setSearch('');
                                  getWeb3List('');
                                }}
                              >
                                <i className='fa fa-xmark mx-1' />
                              </button>
                            )}
                            <button onClick={() => getWeb3List(search)}>
                              <i className='fa fa-search' />
                            </button>
                          </div>
                        </div>
                        {isGettingweb3 ? (
                          <div className='d-flex justify-content-center w-full'>
                            <Spinner />
                          </div>
                        ) : Companies.length > 0 ? (
                          Companies.map((Company: any, index) => (
                            <p
                              className={`category ps-1 ${
                                selectedCompany.includes(Company[0])
                                  ? 'active selectedBgClr'
                                  : ''
                              }`}
                              key={index}
                              onClick={() => {
                                if (selectedCompany.includes(Company[0])) {
                                  setSelectedComany('');
                                } else {
                                  setSelectedComany(Company[0]);
                                  // setSelectedCategory([]);
                                }
                              }}
                            >
                              {Company[1]?.company ?? ''}
                            </p>
                          ))
                        ) : (
                          <h6 className='mt-3 text-center'>
                            {t('Company not found')}
                          </h6>
                        )}
                      </div>
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
                      <p className='fs-6 mb-0 mt-4 text-black'>
                        {t('cant find your company?')}
                      </p>

                      <Link
                        href='#'
                        className='text-decoration-underline'
                        onClick={(e) => {
                          e.preventDefault();
                          web3ModelShow();
                        }}
                      >
                        {t('register your company')}
                      </Link>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <AddCompanyForm
                  showWeb3Model={showWeb3Model}
                  setShowWeb3Model={setShowWeb3Model}
                  reFetchfn={getWeb3List}
                />

                {creationType == 'podcast' ? (
                  <Accordion defaultActiveKey={'2'}>
                    <Accordion.Item eventKey='2'>
                      <Accordion.Header>
                        {t('Podcast preview')}
                        <ul className='angle-list'>
                          <li>
                            <i className='fa fa-angle-up' />
                          </li>
                          <li>
                            <i className='fa fa-angle-down' />
                          </li>
                          <li>
                            <i className='fa fa-caret-up' />
                          </li>
                        </ul>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Form.Group className='mb-2'>
                          <Form.Label>{t('YouTube Iframe')}</Form.Label>
                          <Form.Control
                            type='text'
                            value={podcastVideoLink}
                            placeholder={t('Enter YouTube iframe here...')}
                            onChange={(e) =>
                              setPodcastVideoLink(e.target.value)
                            }
                            name='podcastVideoLink'
                          />
                        </Form.Group>

                        {(tempPodcastPreviewImg || draftPreviewImg) && (
                          <div
                            style={{
                              // height: '252px',
                              width: '250px',
                              // overflow: 'hidden',
                            }}
                          >
                            <Image
                              // fill={true}
                              // style={{ maxHeight: '200px', maxWidth: '200px' }}
                              width={250}
                              height={250}
                              // fill={true}
                              src={tempPodcastPreviewImg}
                              alt='Banner'
                            />
                          </div>
                        )}
                        <input
                          id='podcastPreviewImg'
                          className='d-none'
                          // onChange={handleImageChange}
                          onChange={(e) => handleImageChageCommon(e, 'podcast')}
                          name='bannerImg'
                          type='file'
                        />
                        <p>
                          <label htmlFor='podcastPreviewImg'>
                            {t('Select Podcast Image')}
                          </label>
                        </p>

                        {(tempPodcastPreviewImg || draftPreviewImg) && (
                          <>
                            <Form.Label>{t('Image caption')}</Form.Label>

                            <Form.Control
                              type='text'
                              placeholder={t('Enter Caption here')}
                              autoComplete='off'
                              value={podcastImgCation}
                              // onInput={handleBlur}
                              onChange={(e) =>
                                setPodcastImgCaption(e.target.value)
                              }
                              name='caption'
                            />
                          </>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                ) : (
                  <Accordion defaultActiveKey={'2'}>
                    <Accordion.Item eventKey='2'>
                      <Accordion.Header>
                        {t('featured image')}
                        <ul className='angle-list'>
                          <li>
                            <i className='fa fa-angle-up' />
                          </li>
                          <li>
                            <i className='fa fa-angle-down' />
                          </li>
                          <li>
                            <i className='fa fa-caret-up' />
                          </li>
                        </ul>
                      </Accordion.Header>
                      <Accordion.Body>
                        {(previewFile || draftPreviewImg) && (
                          <div
                            style={{
                              // height: '252px',
                              width: '250px',
                              // overflow: 'hidden',
                            }}
                          >
                            <Image
                              // fill={true}
                              // style={{ maxHeight: '200px', maxWidth: '200px' }}
                              width={250}
                              height={250}
                              // fill={true}
                              src={tempPreviewImg}
                              alt='Banner'
                            />
                          </div>
                        )}
                        <input
                          id='previewImg'
                          className='d-none'
                          // onChange={handleImageChange}
                          onChange={(e) => handleImageChageCommon(e, 'article')}
                          name='bannerImg'
                          type='file'
                        />
                        <p>
                          <label htmlFor='previewImg'>
                            {t('select feature image')}
                          </label>
                        </p>

                        {(previewFile || draftPreviewImg) && (
                          <>
                            <Form.Label>{t('Image caption')}</Form.Label>

                            <Form.Control
                              type='text'
                              placeholder={t('Enter Caption here')}
                              autoComplete='off'
                              value={imgCation}
                              // onInput={handleBlur}
                              onChange={(e) => setImgCaption(e.target.value)}
                              name='caption'
                            />

                            {/* <Form.Label>Image Tags</Form.Label>
                            <Typeahead
                              id='tagInput'
                              multiple
                              options={options}
                              selected={selectedTagsImg}
                              onChange={handleTagChangeImg}
                              placeholder='Enter tags...'
                              allowNew // Allow users to add new tags
                              newSelectionPrefix='Add new tag: '
                              clearButton
                            /> */}
                          </>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                )}
              </Col>
            </Row>
          </div>
        </div>
      </main>
      <Modal size='lg' show={showPreviewModal} onHide={handlePreviewModalClose}>
        <Modal.Body>
          <div className='article-detail-pnl'>
            <div className='top-img'>
              {/* <Image src={post1} alt='Post' /> */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  margin: '0 auto',
                  aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT,
                }}
              >
                {creationType == 'podcast' ? (
                  podcastVideoLink != '' ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: podcastVideoLink }}
                      style={{ height: '100%', width: '100%' }}
                    />
                  ) : (
                    <Image
                      src={
                        tempPodcastPreviewImg ? tempPodcastPreviewImg : post1
                      }
                      className='backend-img'
                      fill={true}
                      alt='Profileicon'
                    />
                  )
                ) : (
                  <Image
                    src={tempPreviewImg ? tempPreviewImg : post1}
                    className='backend-img'
                    fill={true}
                    alt='Profileicon'
                  />
                )}
              </div>
            </div>
            <div className='post-info-head'>
              <div className='user-inf-cntnr'>
                <Link href={`/`} onClick={(e) => e.preventDefault()}>
                  <div className='img-pnl'>
                    <div
                      style={{
                        position: 'relative',
                        width: '45px',
                        margin: '0 auto',
                        height: '45px',
                      }}
                    >
                      <Image
                        src={profileImg ?? girl}
                        className='backend-img'
                        fill={true}
                        alt='Profileicon'
                      />
                    </div>
                  </div>
                </Link>
                <div className='txt-pnl'>
                  <h6>
                    <Link href={`/`} onClick={(e) => e.preventDefault()}>
                      {t('by')}
                      {user?.name[0] ?? ''}{' '}
                    </Link>
             
                  </h6>
            
                  <span className='small'>
                    {' '}
                    {/* {user
            ?  */}
                    {utcToLocal('', Date_m_d_y_h_m)}
                    {/* : 'Oct 19, 2023, 23:35'} */}
                  </span>
                </div>
              </div>
              <div className='count-description-pnl'>
                <div className='d-flex sm'>
             

                  <Link href='#' className='share-btn'>
                    {t('Share')}
                    <Image src={iconshare} alt={t('Share')} />
                  </Link>
                </div>
              </div>
            </div>

            <div className='text-detail-pnl'>
              <h3>{formikRef?.current?.values?.title ?? ''}</h3>
              {parse(articleContent ?? '')}
              <div className='spacer-20' />
            </div>
            <ul className='hash-list'>
              {selectedCategoriesNames &&
                selectedCategoriesNames.map(
                  (category: string, index: number) => (
                    <li key={index}>
                      <span>#</span> {category}
                    </li>
                  )
                )}
            </ul>
          </div>
        </Modal.Body>
      </Modal>
      <Modal size='lg' show={showPreviewImg} onHide={handleEditorModelClose}>
        <Modal.Body className='d-flex justify-content-center'>
          {showEditorPreviewImg && (
            <div className='editorUploadImgModel'>
              <Image
           

                src={showEditorPreviewImg}
                alt='Banner'
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='blue-btn reg-btn'
            disabled={editorImgloading ? true : false}
            onClick={handleEditorModelClose}
          >
            {t('Close')}
          </Button>
          <Button
            className='blue-btn reg-btn'
            disabled={editorImgloading ? true : false}
            onClick={handleEditorImageUpload}
          >
            {editorImgloading ? <Spinner size='sm' /> : t('Save')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
