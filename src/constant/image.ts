export const validFileExtensions: any = {
  image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'],
};

export function isValidFileType(fileName: string, fileType: any) {
  return (
    fileName &&
    validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1
  );
}
export const BASE_IMG_URL = `${process.env.BASE_URL}images/image/`;
export const DEFUALT_IMG = 'https://7uioq-vyaaa-aaaal-ac6ea-cai.icp0.io/images/placeholder-img.jpg';

export function isDescription(articleContent: any) {
  if (document) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = articleContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return textContent;

  } else {
    return articleContent;
  }

};
export function characterCount(data: any) {
  let count = isDescription(data).trim().length;
  return count;
}
export function getCount(data: any) {
  let count = data.length;
  return count;
}