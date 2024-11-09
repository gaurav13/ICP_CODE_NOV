// InstagramShareButton.js
import React from 'react';

const InstagramShareButton = ({ url }: { url: any }) => {
  const shareOnInstagram = () => {
    const instagramUrl = 'instagram://app';
    const fallbackUrl = 'https://www.instagram.com/';

    // Try to open the Instagram app
    const link = `${instagramUrl}create/?url=${encodeURIComponent(
      url
    )}&caption=${encodeURIComponent('caption')}`;
    window.open(link);

    // If the Instagram app is not available, fallback to the website
    setTimeout(() => {
      window.open(link);
    }, 500);
  };

  return (
    <button className='border-0' onClick={shareOnInstagram}>
      <i className='fa fa-instagram' />
    </button>
  );
};

export default InstagramShareButton;
