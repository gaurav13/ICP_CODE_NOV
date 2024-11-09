'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Container, Navbar, Button } from 'react-bootstrap';
import logo from '@/assets/Img/Logo/Logo.png';
import logo2 from '@/assets/Img/Logo/Logo-2.png';
import Connect from '@/components/Connect/Connect';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
export default function NavBarDash({ handleButtonClick }: any) {
  // Initialize state for the button's class
  const [isThemeActive, setIsThemeActive] = useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { t, changeLocale } = useLocalization(LANG);
  const toggleThemeClass = () => {
    setIsThemeActive(!isThemeActive);
  };
  return (
    <>
      <Navbar expand='lg' className='bg-body-tertiary dashboard-nav'>
        <Container>
          <div className='nav-top'>
            <Navbar.Brand href='/'>
              <Image src={logo} alt='Blockza' />
              <Image src={logo2} alt='Blockza' />
            </Navbar.Brand>
            <div>
              <Button
                className={`themebtn ${isThemeActive ? 'active' : ''}`}
                onClick={() => {
                  toggleThemeClass();
                  handleButtonClick(); // Call your handleButtonClick function here
                }}
              >
                <i className='fa fa-sun-o' />
                <i className='fa fa-moon-o' />
              </Button>

              <Connect />
              <Button className='connect-btn'>{t('Subscribe')}</Button>
            </div>
          </div>
        </Container>
      </Navbar>
    </>
  );
}
