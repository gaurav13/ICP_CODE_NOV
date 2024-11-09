import logger from '@/lib/logger';
import React, { useEffect, useRef, useState } from 'react'

function ScrollToTopbtn() {

  let scrollTOTopBtn = useRef(null)
  const [show, setShow] = useState<boolean>(false)
/**
 * backToTop use to scroll user to top
 */
  function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  useEffect(() => {
    const handleScroll = () => {
      logger(window.scrollY,"asfsadfsadfwindow.scrollY")
      if (!show && window.scrollY > 100) {
        setShow(true);
      }else{
        setShow(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <button
          onClick={backToTop}
        type="button"
        className={`btn btn-floating btn-lg ${show?"d-block":"d-none"}`}
        id="btn-back-to-top"
        ref={scrollTOTopBtn}
        >
  <i className="fa fa-angle-double-up"></i>
</button>
  )
}

export default ScrollToTopbtn