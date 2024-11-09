// components/TwitterShareButton.js
import React from 'react';

const TwitterShareButton2 = ({ text, url }:{ text:any, url:any }) => {
    const shareOnTwitter = () => {
        const twitterUrl = 'https://twitter.com/intent/tweet';
        const encodedText = encodeURIComponent(text);
        const encodedUrl = encodeURIComponent(url);
        const shareUrl = `${twitterUrl}?text=${encodedText}&url=${encodedUrl}`;
        window.open(shareUrl, '_blank');
    };

    return (
        <button onClick={shareOnTwitter}>
            Share on Twitter
        </button>
    );
};

export default TwitterShareButton2;
