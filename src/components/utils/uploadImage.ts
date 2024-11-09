import instance from '@/components/axios';
import logger from '@/lib/logger';

async function uploadImage(img: File): Promise<string> {
  const formData = new FormData();
  logger(img, 'YEEAAAAA');
  const fullName = img.name;
  const nameParts = fullName.split('.');
  const type = nameParts.pop();
  const name = nameParts.join('.').replace(/\s/g, '-');
  formData.append('file', img);
  try {
    const response = await instance.post('/images/upload', formData);
    return `${name}-${response.data.id}.${type}`;
  } catch (err) {
    return 'error-uploading-23.jpg';
  }
}
export default uploadImage;
