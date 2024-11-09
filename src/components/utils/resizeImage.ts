import { isValidFileType } from '@/constant/image';
import { MAX_RESIZED_IMAGE_SIZE } from '@/constant/validations';
import logger from '@/lib/logger';
import FileResizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';

const resizeImage = async (
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 80
): Promise<File> => {
  // const { t } = useLocalization(LANG)
  return new Promise(async (resolve, reject) => {
  

    if (!file) reject("Image file wasn't provided");
    const validType = isValidFileType(file && file.name.toLowerCase(), 'image');
    if (!validType) {
      toast.error('Not a valid image type');
      reject('Invalid image type');
      return;
    }

    const resize = async (q: number) => {
      return new Promise<void>((res, rej) => {
        FileResizer.imageFileResizer(
          file,
          maxWidth,
          maxHeight,
          'webp',
          q,
          0,
          (uri: any) => {
            if (uri.size > MAX_RESIZED_IMAGE_SIZE && q > 0) {
              logger(uri.size, 'SIZE was larger so we recalled');
              res(resize(q - 10));
            } else {
              logger({ size: uri.size, quality: q }, 'SIZE was ok so we sent');
              resolve(uri as File);
              res();
            }
          },
          'file'
        );
      });
    };

    try {
      await resize(quality);
    } catch (error) {
      reject(error);
    }
  });
};

export default resizeImage;
