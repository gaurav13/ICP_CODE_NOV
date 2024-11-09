'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import home1 from '@/assets/Img/Icons/icon-home-1.png';
import home2 from '@/assets/Img/Icons/icon-home-2.png';
import folder1 from '@/assets/Img/Icons/icon-folder-1.png';
import folder2 from '@/assets/Img/Icons/icon-folder-2.png';
import cup1 from '@/assets/Img/Icons/icon-cup-1.png';
import cup2 from '@/assets/Img/Icons/icon-cup-2.png';
import book from '@/assets/Img/Icons/icon-money.png';
import Bolt from '@/assets/Img/Icons/icon-marketing.png';
import logo from '@/assets/Img/Logo/Logo.png';
import logo2 from '@/assets/Img/Logo/Logo-2.png';
import Connect from '@/components/Connect/Connect';
import { useThemeStore } from '@/store/useStore';
import SocialList from '@/components/SocialList/SocialList';
import { usePathname } from 'next/navigation';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';

export default function NavBar() {
  const { t, changeLocale } = useLocalization(LANG);

  // Dark Theme
  const [isThemeActive, setIsThemeActive] = useState(false);

  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>();
  const [toggle, settoggle] = React.useState(false);

  const navbarRef = useRef<HTMLDivElement | null>(null);
  const { isBlack, setIsBlack, isOpen, setIsOpen } = useThemeStore((state) => ({
    isBlack: state.isBlack,
    isOpen: state.isOpen,
    setIsBlack: state.setIsBlack,
    setIsOpen: state.setIsOpen,
  }));
  const path = usePathname();
  const route = path.split('/')[1];

  // const router = useRouter();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // Function to toggle the class
  const toggleNavbar = () => {
    if (isOpen !== 'Sidebar') {
      settoggle((prev) => {
        if (!prev) {
          setIsOpen('Navbar');
          return true;
        } else {
          setIsOpen('');
          return false;
        }
      });
    } else {
      settoggle((prev) => !prev);
    }
  };
  // Dark Theme
  const handleButtonClick = () => {
    setIsBlack(!isBlack);
  };
  const closeNavbar = (event: any) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      toggleNavbar();
    }
  };
  useEffect(() => {
    if (toggle) {
      document.addEventListener('click', closeNavbar);
    } else {
      document.removeEventListener('click', closeNavbar);
    }

    return () => {
      document.removeEventListener('click', closeNavbar);
    };
  }, [toggle]);
  return (
    <>
      {route !== 'super-admin' && (
        <>
          {/* <p
        style={
          toggle
            ? {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: '0px',
                left: '0px',
                bottom: '0px',
                zIndex: 2,
              }
            : { display: 'none' }
        }
        onClick={() => {
          logger('CLICKed');
          if (toggle) {
            toggleThemeClass();
          }
        }}
      /> */}
          <Navbar
            expand='lg'
            expanded={toggle}
            id='him'
            className='bg-body-tertiary my-nav'
            ref={navbarRef}
            // style={{ zIndex: 1 }}
          >
            <Container fluid>
              <Navbar.Brand>
                <Link href='/'>
                  <Image src={logo} alt='Blockza' />
                  <Image src={logo2} alt='Blockza' />
                </Link>
              </Navbar.Brand>
              <div className='d-flex-mobee'>
                <Connect hideRewards />
                <Navbar.Toggle
                  aria-controls='navbarScroll'
                  onClick={toggleNavbar}
                />
              </div>
              <Navbar.Collapse id='navbarScroll'>
                <Nav className='me-auto my-lg-0 my-2' navbarScroll>
                  <Link href='/' className='nav-link' onClick={toggleNavbar}>
                    <div className='img'>
                      <Image src={home1} alt='Home' />
                      <Image src={home2} alt='Home' />
                    </div>
                    {t('Home')}
                  </Link>
                  <Nav.Link href='#;' onClick={toggleNavbar}>
                    <div className='img'>
                      <Image src={folder1} alt='Directory' />
                      <Image src={folder2} alt='Directory' />
                    </div>
                    Web3 {t('Directory')}
                  </Nav.Link>
                  <Nav.Link href='#;' onClick={toggleNavbar}>
                    <div className='img'>
                      <Image src={cup1} alt='Diamond' />
                      <Image src={cup2} alt='Diamond' />
                    </div>
                    Grants <span>hot</span>
                  </Nav.Link>
                  <Nav.Link
                    onClick={toggleNavbar}
                    href='#;'
                    className='disablled'
                  >
                    <div className='img'>
                      <Image src={book} alt='book' />
                    </div>
                    {t('Investors')} <sup>{t('coming soon')}</sup>
                  </Nav.Link>
                  <Nav.Link
                    onClick={toggleNavbar}
                    href='#;'
                    className='disablled'
                  >
                    <div className='img'>
                      <Image src={Bolt} alt='Bolt' />
                    </div>{' '}
                    {t('Campaigns')} <sup>{t('coming soon')}</sup>
                  </Nav.Link>
                  <SocialList />
                </Nav>

                <div id='google_translate_element' className='width-80' />

                <div className='d-flex'>
                  <Button
                    className={`themebtn ${isThemeActive ? 'active' : ''}`}
                    onClick={() => {
                      // toggleThemeClass();
                      handleButtonClick(); // Call your handleButtonClick function here
                    }}
                  >
                    <i className='fa fa-sun-o' />
                    <i className='fa fa-moon-o' />
                  </Button>
                  {/* <Nav.Link href='#;' className='link-btn empty'>
                My Reward
              </Nav.Link>
              <Nav.Link href='#;' className='link-btn empty'>
                <Image src={iconbook} alt='iconbook' />{t('guide book')}
              </Nav.Link> */}
                  {/* <Nav.Link href="#;" className='link-btn logedin'>
                <div className='img-pnl'>
                  <Image src={icongirl} alt='icongirl' />
                </div>
                <div className='txt-pnl'>
                  <h6>Neha Ali</h6>
                  <span><Image src={Infinity} alt='Infinity' /> 500</span>
                </div>
              </Nav.Link> */}
                  {/* <div className='profile-btn'>
                <NavDropdown
                  title={
                    <>
                      <div className='link-btn logedin'>
                        <div className='img-pnl'>
                          <Image src={icongirl} alt='icongirl' />
                        </div>
                        <div className='txt-pnl'>
                          <h6>Neha Ali</h6>
                          <span>
                            <Image src={Infinity} alt='Infinity' /> 500
                          </span>
                        </div>
                      </div>
                    </>
                  }
                  id='basic-nav-dropdown'
                >
                  <NavDropdown.Item>
                    <Link href={'/profilen'}>
                      <div className='d-flex'>
                        <div>
                          <Image src={Profileicon} alt='Profileicon' />
                        </div>
                        <div>
                          <h6>Username</h6>
                          <p>0x717d...74a</p>
                        </div>
                      </div>
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href='#;'>
                    <Image src={User} alt="user" /> My Profile
                  </NavDropdown.Item>
                  <Link href='/dashboardn' className='dropdown-item'>
                    <Image src={cup1} alt="user" />{t('my rewards')}
                  </Link>
                  <Link href='/settingsn' className='dropdown-item'>
                    <Image src={setting} alt="user" /> Settings
                  </Link>
                  <Link href='/settingsn' className='dropdown-item'>
                    <Image src={feedback} alt="user" /> Feedback
                  </Link>
                  <NavDropdown.Divider />
                  <NavDropdown.Item className='disconnect-btn'>
                    <i className='fa fa-sign-out'/> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
              <Nav.Link
                style={{ display: 'none' }}
                href='#;'
                className='link-btn'
              >
                Sign In
              </Nav.Link> */}
                  <Connect hideUser />
                </div>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </>
      )}
    </>
  );
}
