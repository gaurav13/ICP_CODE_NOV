import instance from '@/components/axios';
import logger from '@/lib/logger';

const base64ToImageUrl = (base64: string, imgType = 'jpeg') => {
  return `data:image/${imgType};base64,${base64}`;
};
const getImage = (buffer: any, imgType = 'jpeg') => {
  // if (typeof buffer === 'bigint') return '';
  // const byteArray = new Uint8Array(buffer);
  // const picBlob = new Blob([byteArray], { type: `image/${imgType}` });
  // const picSrc = URL.createObjectURL(picBlob);
  return buffer;
};
const getImageById = async (id: string) => {
  // const response = await instance.get(`/images/image/` + parseInt(id));

  // const string = response.data.data;
  // return base64ToImageUrl(string);
  return id;
};
let iframeimgThumbnail = (iframe: string): string | undefined => {
  if (iframe) {
    var youtubeVideoId = iframe
      .match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/)
      ?.pop();

    if (youtubeVideoId && youtubeVideoId.length === 11) {
      return `https://img.youtube.com/vi/${youtubeVideoId}/0.jpg`;
    }
  }

  // Return undefined if the conditions are not met
  return undefined;
};
export { getImage, iframeimgThumbnail, getImageById };
