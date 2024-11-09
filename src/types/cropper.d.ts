export interface CropperProps {
  imgUrl: string;
  aspect: number;
  imgName: string;
  callBack: (
    imgUrl: string,
    imgUrl: string,
    pixels: any,
    rotation: number
  ) => unknown;
  maxWidth: number,
  maxHeight: number,
}
