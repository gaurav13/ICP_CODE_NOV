'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Breadcrumb, Dropdown, Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Link from 'next/link';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { usePathname, useRouter } from 'next/navigation';

export default function TermsofUse() {
  const { t, changeLocale } = useLocalization(LANG);
  const [hideMyContent, setHideMyContent] = useState(true);
  const [activeSection, setActiveSection] = useState('top'); // Default to the first section
  const location = usePathname(); 
   const router = useRouter();
  useEffect(() => {
    if (location.startsWith("/terms-of-use") && !location.endsWith('/')) {
     router.push("/terms-of-use/");
   }
     }, [])
  useEffect(() => {
    let currentSection = 'top'; // Default to the first section

    const handleScroll = () => {
      const sections = [
        'top',
        'top1',
        'top2',
        'top3',
        'top4',
        'top5',
        'top6',
        'top7',
        'top8',
        'top9',
        'top10',
        'top11',
        'top12',
      ]; // Update with your section IDs

      // Determine the currently active section based on scroll position
      sections.forEach((section) => {
        const sectionElement = document.getElementById(section);
        if (sectionElement) {
          const sectionTop = sectionElement.getBoundingClientRect().top;
          if (sectionTop <= 10 && sectionTop >= -5) {
            currentSection = section;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <main id='main'>
        <div className='main-inner detail-inner-Pages pri-term-pnl'>
          <div className='inner-content'>
            <div className='pri-term-inner'>
              <Row>
                <Col xl='12' lg='12'>
                  <div className='event-innr'>
                    <div className='flex-details-pnl'>
                      <div className='left-side-pnl'>
                        <Dropdown
                          onClick={() => setHideMyContent((pre: any) => !pre)}
                        >
                          <Dropdown.Toggle
                            variant='success'
                            className='fill'
                            id='dropdown-basic'
                          >
                            {t('All Content')}{' '}
                            {hideMyContent ? (
                              <i className='fa fa-angle-down' />
                            ) : (
                              <i className='fa fa-angle-right' />
                            )}
                          </Dropdown.Toggle>
                          {/* 
                      <Dropdown.Menu>
                        <Dropdown.Item href='#/action-1'>
                          Trending
                        </Dropdown.Item>
                        <Dropdown.Item href='#/action-2'>
                          Trending
                        </Dropdown.Item>
                      </Dropdown.Menu> */}
                        </Dropdown>
                        <div className='spacer-20' />
                        <ul
                          className='tab-blue-list'
                          style={{
                            height: '535px',
                            position: 'sticky',
                            top: '0',
                            display: hideMyContent ? 'block' : 'none',
                          }}
                        >
                          <li>
                            <Link
                              href='#top'
                              className={
                                activeSection === 'top' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' />{' '}
                              {t('Terms of Use')}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#top1'
                              className={
                                activeSection === 'top1' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' /> Acceptance of
                              Terms
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#top2'
                              className={
                                activeSection === 'top2' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' /> Changes to
                              Terms
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#top3'
                              className={
                                activeSection === 'top3' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' /> Use of the
                              {t('website')}
                            </Link>
                            <ul>
                              <li>
                                <Link
                                  href='#top4'
                                  className={
                                    activeSection === 'top4' ? 'active' : ''
                                  }
                                >
                                  <i className='fa fa-angle-right' />{' '}
                                  Eligibility
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href='#top5'
                                  className={
                                    activeSection === 'top5' ? 'active' : ''
                                  }
                                >
                                  <i className='fa fa-angle-right' /> Account
                                  Registration
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href='#top6'
                                  className={
                                    activeSection === 'top6' ? 'active' : ''
                                  }
                                >
                                  <i className='fa fa-angle-right' /> User
                                  Content
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href='#top7'
                                  className={
                                    activeSection === 'top7' ? 'active' : ''
                                  }
                                >
                                  <i className='fa fa-angle-right' /> Prohibited
                                  Activities
                                </Link>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <Link
                              href='#top8'
                              className={
                                activeSection === 'top8' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' /> Intellectual
                              Property
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#top9'
                              className={
                                activeSection === 'top9' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' />
                              {t('Disclaimer')}
                              of Warranties
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#top10'
                              className={
                                activeSection === 'top10' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' /> Limitation of
                              Liability
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#top11'
                              className={
                                activeSection === 'top11' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' /> Governing Law
                              and Jurisdiction
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='#top12'
                              className={
                                activeSection === 'top12' ? 'active' : ''
                              }
                            >
                              <i className='fa fa-angle-right' />{' '}
                              {t('Contact Us')}
                            </Link>
                          </li>
                        </ul>
                      </div>

                      <div className='right-detail-pnl'>
                        <div id='top' />
                        <div className='spacer-50 desktop-view-display' />
                        <h1>{t('Terms of Use')}</h1>
                        <div className='spacer-30' />
                        <div id='top1' />
                        <h2>1. Acceptance of Terms</h2>
                        <p>
                          Welcome to BlockZa.io (“we,” “us,” “our,” or the
                          “Company”). By accessing or using the website with the
                          address Kasukabe, Saitama 344-0063 (the “Website”),
                          you agree to comply with and be bound by these Terms
                          of Use (“Terms”). If you do not agree to these Terms,
                          please do not use this Website.
                        </p>
                        <div id='top2' />
                        <h2>2. Changes to Terms</h2>
                        <p>
                          We reserve the right to modify or revise these Terms
                          at any time. The date of the last update will be noted
                          at the beginning of this document. Your continued use
                          of the Website after any changes signifies your
                          acceptance of those changes.
                        </p>
                        <div id='top3' />
                        <h2>3. Use of the Website</h2>
                        <p>
                          If you upload images to the website, you should avoid
                          uploading images with embedded location data (EXIF
                          GPS) included. Visitors to the website can download
                          and extract any location data from images on the
                          website.
                        </p>
                        <div className='padd-left'>
                          <div id='top4' />
                          <h2>Eligibility</h2>
                          <p>
                            You must be at least 18 years old to use this
                            Website. By using this Website, you confirm that you
                            meet this age requirement.
                          </p>
                          <div id='top5' />
                          <h2>Account Registration</h2>
                          <p>
                            {' '}
                            Some features of the Website may require you to
                            create an account. You are responsible for
                            maintaining the confidentiality of your account
                            information and for all activities that occur under
                            your account.
                          </p>
                          <div id='top6' />
                          <h2>User Content</h2>
                          <p>
                            You may have the opportunity to submit or post
                            content on the Website. By doing so, you grant us a
                            non-exclusive,worldwide, royalty-free, irrevocable,
                            sub-licensable, and transferable right to use,
                            reproduce, modify, adapt, publish,translate, create
                            derivative works from, distribute, and display such
                            content.
                          </p>
                          <div id='top7' />
                          <h2>Prohibited Activities</h2>
                          <p>
                            You agree not to engage in any of the following
                            activities on the Website:
                          </p>
                          <p>
                            Violating any applicable laws or regulations.
                            <br />
                            Using the Website for any unlawful or fraudulent
                            purpose.
                            <br />
                            Impersonating any person or entity.
                            <br />
                            Attempting to interfere with the proper functioning
                            of the Website.
                            <br />
                          </p>
                        </div>
                        <div id='top8' />
                        <h2>4. Intellectual Property</h2>
                        <p>
                          All content, trademarks, logos, and intellectual
                          property on the Website are owned or licensed by the
                          Company. You may not use, reproduce, or distribute any
                          content from the Website without our prior written
                          consent.
                        </p>
                        <div id='top9' />
                        <h2>5. Disclaimer of Warranties</h2>
                        <p>
                          The Website and its content are provided “as is” and
                          “as available.” We make no warranties, express or
                          implied, regarding the accuracy, reliability, or
                          availability of the Website.
                        </p>
                        <div id='top10' />
                        <h2>6. Limitation of Liability</h2>
                        <p>
                          To the fullest extent permitted by law, we shall not
                          be liable for any indirect, incidental, special,
                          consequential, or punitive damages arising out of or
                          in connection with your use of the Website.
                        </p>
                        <p>
                          {t('Terms of Use')} and {t('Privacy Policy')}{' '}
                          Jurisdiction:
                        </p>
                        <div id='top11' />
                        <h2>7. Governing Law and Jurisdiction</h2>
                        <p>
                          These Terms shall be governed by and construed in
                          accordance with the laws of Japan, and any disputes
                          arising from these Terms or your use of the Website
                          shall be subject to the exclusive jurisdiction of the
                          courts of Saitama , Japan.
                        </p>
                        <div id='top12' />
                        <h2>8. {t('Contact Us')}</h2>
                        <p>
                          If you have any questions or concerns about these
                          Terms of Use, please contact us at{' '}
                          <b>
                            <Link
                              href='mailto:support@blockza.io'
                              target='_blank'
                            >
                             support@blockza.io
                            </Link>
                          </b>{' '}
                          or by <br />
                          phone at{' '}
                          <Link href='callto:+8148-708-8997'>
                            +8148-708-8997
                          </Link>
                        </p>
                        <hr />
                        <p>
                          <b>Effective Date: September 27, 2023.</b>
                        </p>
                        <p>
                          Welcome to the BlockZa website and related
                          interactive features, products, services,
                          applications, or downloads (collectively, the
                          “Websites”) that are owned by BlockZa., including
                          our affiliates and subsidiaries (“Company,” “we” and
                          “us).
                          <br />
                          <b>
                            BY USING OUR WEBSITES, YOU ARE ACCEPTING THE
                            PRACTICES DESCRIBED IN THESE TERMS OF USE (“TERMS”)
                            AND OUR PRIVACY POLICY. IF YOU DO NOT AGREE TO THESE
                            TERMS, YOU MAY NOT USE THESE WEBSITES. WE RESERVE
                            THE RIGHT TO MODIFY OR AMEND THESE TERMS FROM TIME
                            TO TIME WITHOUT NOTICE. YOUR CONTINUED USE OF OUR
                            WEBSITES OR ANY AFFILIATED WEBSITES FOLLOWING THE
                            POSTING OF CHANGES TO THESE TERMS WILL MEAN YOU
                            ACCEPT THOSE CHANGES.
                          </b>
                        </p>
                        <p>
                          <b>
                            EXCEPT FOR CERTAIN TYPES OF DISPUTES DESCRIBED IN
                            THE AGREEMENT TO ARBITRATE SECTION BELOW, YOU AGREE
                            THAT ALL DISPUTES BETWEEN YOU AND USE WILL BE
                            RESOLVED BY BINDING, INDIVIDUAL ARBITRATION, AND YOU
                            WAIVE YOUR RIGHT TO PARTICIPATE IN A CLASS ACTION
                            LAWSUIT OR CLASS-WIDE ARBITRATION.
                          </b>
                        </p>
                        <p>
                          <b>Agreement to Arbitrate</b>. The parties acknowledge
                          that any statutory or common law claims related to
                          intellectual property may require forms of equitable
                          relief that are best administered by courts;
                          accordingly, the parties agree that except for
                          statutory or common law claims related to intellectual
                          property and disputes that qualify for small claims
                          court, any controversy or claim arising out of or
                          relating to these Terms or any aspect of the
                          relationship between us, whether based in contract,
                          tort, statute, fraud, misrepresentation or any other
                          legal theory, will be resolved by arbitration
                          administered by the American Arbitration Association
                          (AAA) in accordance with its “Commercial Arbitration
                          Rules and the Supplementary Procedures for Consumer
                          Related Disputes.” Judgment on the award rendered by
                          the arbitrator may be entered in any federal or state
                          court of competent jurisdiction located in the County
                          of New York in the State of New York. For more
                          information about arbitration, the AAA, and the
                          arbitration process, please consult the American
                          Arbitration Association web site at www.adr.org. You
                          agree that by agreeing to these Terms, you and we are
                          each waiving the right to trial by jury, except as
                          otherwise stated above. All issues are for the
                          arbitrator to decide, except those issues relating to
                          the interpretation of the scope, application, and
                          enforceability of this arbitration provision are for a
                          court to decide. As stated in General section below,
                          New York law applies to any arbitration under these
                          Terms, but the parties acknowledge that the Federal
                          Arbitration Act governs the interpretation and
                          enforcement of this provision. This agreement to
                          arbitrate shall survive termination of these Terms.
                          This arbitration agreement does not preclude you from
                          bringing issues to the attention of federal, state, or
                          local agencies, and, if the law allows, they can seek
                          relief against us for you.
                        </p>
                        <p>
                          Unless you and we agree otherwise, the arbitration
                          will take place in the County of Japan in the State of
                          Japan. For claims of $14,000 or less, you can choose
                          whether you would like arbitration carried out based
                          only on documents submitted to the arbitrator, or by a
                          hearing in person, by phone, or via online video
                          conference.
                        </p>
                        <p>
                          The arbitrator may award money or equitable relief in
                          favor of only the individual party seeking relief and
                          only to the extent necessary to provide relief
                          warranted by that party’s individual claim. To reduce
                          the time and expense of the arbitration, the
                          arbitrator will not provide a statement of reasons for
                          their award unless requested to do so by both parties.
                          Unless both you and we agree otherwise, the arbitrator
                          may not consolidate more than one person’s claims and
                          may not otherwise preside over any form of a
                          representative or class proceeding.
                        </p>
                        <p>
                          <b>Waiver of Class Actions</b>. You and the company
                          agree that each party may bring disputes against the
                          other party only in an individual capacity, and not as
                          a plaintiff or class member in any purported class or
                          representative proceeding, including, without
                          limitation, a federal or state class action lawsuit.
                        </p>
                        <p>
                          <b>Order Eligibility</b>. Unless otherwise stated at
                          the time of purpose, you may only purchase products
                          and services for personal, non-commercial use. We may
                          refuse any order that we have reason to believe is for
                          onward sale other than through distribution channels
                          approved by Company. We make no representation or
                          guarantees that products or services available on the
                          Websites are appropriate or available for use in
                          locations outside the United States. Accessing the
                          Websites from territories where its contents are
                          illegal or unlawful is prohibited. It is your
                          responsibility to ascertain and obey all applicable
                          local, state, federal and international laws
                          (including minimum age requirements) regarding the
                          possession, use and sale of any product or service
                          purchased from these Websites. Nothing on the Websites
                          constitutes a binding offer to sell, distribute, or
                          give away any products or services. In the event the
                          products and services are listed at an incorrect
                          price, we have the right to refuse or cancel orders
                          placed at the incorrect price, regardless of whether
                          the order has been confirmed or you have been charged.
                          We reserve the right at any time after receipt of your
                          order to accept or decline such order, or any portion
                          thereof, or to not ship to particular addresses, even
                          after your receipt of an order confirmation or after
                          you have been charged.
                        </p>
                        <p>
                          <b>Products and Services</b>. Details of the products
                          and services available for purchase are set out on the
                          Websites. All prices are displayed and charged in US
                          dollars. Applicable sales and other taxes may not be
                          included and are in addition to the sale price. All
                          online transaction totals reflect the estimated tax
                          amount; the actual tax amount will be calculated based
                          on your shipping location and many vary from the
                          estimated tax. Discounts and sales prices may not be
                          applied to previous orders. We reserve the right to
                          shorten the duration of any special order or sales
                          promotion. All features, content, specifications,
                          products and prices of products and services described
                          or depicted on these Websites are subject to change at
                          any time without notice. The inclusion of any products
                          or services on these Websites at a particular time
                          does not imply or warrant that these products or
                          services will be available at any time. Occasionally,
                          the availability of a certain product or service may
                          be delayed. Any terms and conditions of any offer
                          disclosed to you when ordering is deemed part of these
                          Terms.
                        </p>
                        <p>
                          <b>NFTs; NFT Ticket</b>: Any NFTs purchased or
                          received from us or one of our approved marketplaces
                          are subject to the following terms. You agree that we,
                          or our licensee (including the original artist), own
                          all legal rights, titles, and interests in and to the
                          artwork and any other intellectual property rights
                          contained within the NFT. Except for the limited
                          license granted to you in the next sentence, we and
                          our licensees reserve all rights, titles, and
                          interests in the artwork and any other intellectual
                          property rights contained therein. Subject to your
                          continued compliance with these Terms and any other
                          applicable terms and conditions, we hereby grant you a
                          worldwide, revocable, non-exclusive, personal and
                          non-commercial license to (a) display the artwork
                          associated with the NFT in its original form, (b)
                          display the NFT on a third-party site for
                          non-commercial purposes, so long as the site
                          cryptographically verifies each NFT owner’s right to
                          display the artwork to ensure that only the actual
                          owner can display the artwork and that the artwork is
                          no longer visible once the NFT owner leaves the site,
                          and (c) to transfer said NFT, provided that said
                          transfer and any future transfers remain subject to
                          these Terms, and if transferred via a marketplace, so
                          long as that marketplace cryptographically verifies
                          each NFT owner’s right to display the artwork to
                          ensure that only the actual owners can display the
                          artwork.
                        </p>
                        <p>
                          In relation to our NFT Ticket program, each purchase
                          is also subject to the terms and conditions associated
                          with each applicable event and award. Not all
                          available rewards are assigned to each token, the
                          rewards are subject to change, and additional
                          requirements may apply in order to redeem a reward. To
                          receive the full value of this program you must also
                          enroll with our verification provider, currently
                          Tokenproof. Failure to maintain a current email
                          address in our records or to respond within the
                          proscribed time periods may result in the lapse of the
                          ticket and/or award, no credit or refund will be
                          provided. Quantities are limited and awards are
                          subject to expiration.
                        </p>
                        <p>
                          Any additional licenses or other terms and conditions
                          provided by us at the time of your acquisition of a
                          NFT from us will supplement and will become a part of
                          this section. In the event of a conflict between this
                          section and the supplemental terms, these terms will
                          continue to govern unless the supplemental terms
                          specifically reference this section in the Terms and
                          expressly indicate that they override part or all of
                          this Section.
                        </p>
                        <p>
                          <b>Conferences and Events</b>: Additional terms and
                          conditions apply to attendance of conferences and
                          events. Those additional terms will be available at
                          the time of registration or in the event forum.
                        </p>
                        <p>
                          <b>Electronic Receipts and Notices</b>. By using our
                          Websites or making a purchase you consent to receive
                          notices, disclosures, agreements, policies, receipts,
                          confirmations, transaction information, account
                          information, other communications, and changes or
                          updates to any such documents electronically. We will
                          provide these by posting them on your account page or
                          emailing them to the email address associated with
                          your account or order. You agree that these electronic
                          documents satisfy legal communication requirements,
                          including but not limited to requirements that any
                          such communications be in writing.
                        </p>
                        <p>
                          <b>Returns and Refunds</b>. Unless otherwise stated by
                          us at the time of purchase, all sales are final and no
                          refunds or credit will be issued. If we do allow a
                          return or issue a refund or credit, we are under no
                          obligation to issue the same or similar in the future.
                          Certain jurisdictions may provide additional statutory
                          rights. Nothing herein is meant to limit your return
                          or cancellation rights under applicable local law.
                        </p>
                        <p>
                          <b>Charges</b>. For all charges for any products or
                          services sold on the Websites, Company will bill your
                          credit card or alternative payment method offered by
                          Company. You agree to provide valid and updated
                          payment information. In the event legal action is
                          necessary to collect on balances due, you agree to
                          reimburse Company for all expenses incurred to recover
                          sums due, including attorneys’ fees and other legal
                          expenses. You are responsible for purchase of, and
                          payment of charges for, all Internet access services
                          needed for use of these Websites and all fees charged
                          to you by your financial institution related to the
                          charges. Payment obligations are non-cancelable, and
                          fees paid are non-refundable. Company may suspend or
                          terminate your account, in addition to other rights
                          and remedies, if any amount is past due. You shall
                          provide Company with written notice of any disputed
                          charges within ten (10) business days of the date of
                          the charge. Notice of the dispute must provide in
                          reasonable detail a statement of the basis for
                          disputing the charge.
                        </p>
                        <p>
                          <b>Promotional Codes</b>. On occasion Company may
                          issue promotion codes that may be redeemed at the time
                          of check out. These codes are non-transferable and may
                          only be used by the intended recipient; these codes
                          have no cash value and are not redeemable for cash. We
                          reserve the right to cancel any promotion code and
                          limit redemption when the total value of the
                          promotional code exceeds the price of the item.
                          Multiple promotional codes may not be combined. When a
                          promotion or promotional code has been communicated to
                          a particular individual, the promotional code is
                          non-transferable, and the name and email address
                          provided during the checkout must be the same. We are
                          not responsible for any financial loss arising out of
                          our refusal, cancelation or withdrawal of a promotion
                          or any failure or inability of a customer to use a
                          promotional code for any reason.
                        </p>
                        <p>
                          <b>Contest and Promotions</b>. From time to time, we,
                          our advertisers, or other parties may conduct
                          promotions and other activities on, through or in
                          connection with the Websites, including, without
                          limitation, contests, and sweepstakes. In some case,
                          you may be able to win a prize. Each promotion may
                          have additional terms, rules, or eligibility
                          requirements which will be posted or otherwise made
                          available to you in connection therewith in accordance
                          with applicable law.
                        </p>
                        <p>
                          <b>Copyright, Trademark and Ownership</b>. All the
                          content displayed on the Websites, including without
                          limitation text, graphics, photographs, images, moving
                          images, sound, and illustrations (“Content”), is owned
                          by Company, its licensors, agents, or the party
                          credited as the provided of the Content. All elements
                          of the Websites, including, without limitation, the
                          Websites’ general design, Company’s trademarks,
                          service marks, trade names (including the Company’s
                          name, logos, the Websites’ names, and the Websites’
                          design), and other Content, are protected by trade
                          dress, copyright, moral rights, trademark, and other
                          laws relating to intellectual property rights. The
                          Websites may only be used for the intended purpose for
                          which it is being made available. Except as may be
                          otherwise indicated on the Websites, you are
                          authorized to view, play, print and download
                          documents, audio and video found on our Websites for
                          personal, informational, and non-commercial purposes
                          only. You may not use, copy, reproduce, republish,
                          upload, post, transmit, distribute, or modify the
                          Content or the Company’s trademarks in any way,
                          including in advertising or publicity pertaining to
                          distribution of materials on the Websites, without
                          Company’s prior written consent. The use of Company
                          trademarks on any other websites is not allowed.
                          Company prohibits the use of our trademarks as a “hot”
                          link on or to any other websites unless establishment
                          of such a link is approved in advance. The Websites,
                          its Content and all related rights shall remain the
                          exclusive property of Company or its licensors unless
                          otherwise expressly agreed. You will not remove any
                          copyright, trademark or other proprietary notices from
                          material found on the Websites.
                        </p>
                        <p>
                          <b>User Content</b>. In designated areas, Company may
                          allow users or members of the public to submit user
                          published content or user content (e.g., comments to
                          articles, participation in communities, etc) to
                          Company for consideration in connection with the
                          Websites (“User Content”). User Content remains the
                          intellectual property of the individual user. By
                          posting content on our Websites, you expressly grant
                          Company a non-exclusive, perpetual, irrevocable,
                          royalty-free, fully paid-up worldwide, fully
                          sub-licensable right to use, reproduce, modify, adapt,
                          publish, translate, create derivative works from,
                          distribute, transmit, perform and display such content
                          and your name, voice, and likeness as contained in
                          your User Content, in whole or in part, and in any
                          form throughout the world in any media or technology,
                          whether now known or hereafter discovered, including
                          all promotion, advertising, marketing, online and
                          offline use, merchandising, publicity and any other
                          ancillary uses thereof, and including the unfettered
                          right to sublicense such rights, in perpetuity
                          throughout the universe. All User Content is deemed
                          non-confidential, and Company shall be under no
                          obligation to maintain the confidentiality of any
                          information, in whatever form, contained in any User
                          Content. You agree that we may modify or alter your
                          User Content without seeking further permission from
                          you. To submit a request to have content that you have
                          posted removed, please contact the designated
                          community manager.
                        </p>
                        <p>
                          User Content does not represent the views of Company,
                          or any individual associated with Company, and we do
                          not control the User Content. In no event shall you
                          represent or suggest, directly or indirectly,
                          Company’s endorsement of User Content. Company does
                          not vouch for the accuracy or credibility of any User
                          Content on our Websites and does not take any
                          responsibility or assume any liability for any actions
                          you may take because of reading User Content on our
                          Websites. Through your use of the Websites, you may be
                          exposed to content that you may find offensive,
                          objectionable, harmful, inaccurate, or deceptive.
                          There may also be risks of dealing with underage
                          persons or people acting under false pretense. By
                          using our Websites, you assume all associated risks.
                        </p>
                        <p>
                          Company does not encourage and strongly discourages
                          any User Content that results from any activity that:
                          (a) may create a risk of harm, loss, injury, emotional
                          distress, death, disability, disfigurement, or illness
                          to you, to any other person, or to any animal; (b) may
                          create a risk of any loss or damage to any person or
                          property; or (c) may constitute a crime or create
                          civil liability. You agree that you have not and will
                          not engage in any of the foregoing activities in
                          connection with producing your submission. Without
                          limiting the foregoing, you agree that in conjunction
                          with your submission, you will not inflict emotional
                          distress on other people, will not humiliate other
                          people (publicly or otherwise), will not assault or
                          threaten other people, will not enter onto private
                          property without permission, and will not otherwise
                          engage in any activity that may result in injury,
                          death, property damage, or liability of any kind.
                          Company may reject or remove any submissions that
                          Company believes, in its sole discretion, include any
                          inappropriate or prohibited material.
                        </p>
                        <p>
                          <b>Copyright Act Notice</b>. Third party materials
                          that we do not own or control may be transmitted,
                          stored, accessed, or otherwise made available using
                          the Websites. Company has adopted a policy that
                          provides for the removal of any content or the
                          suspension of any user that is found to have
                          repeatedly infringed on the copyright of a third
                          party. If you believe any material available via the
                          Websites infringes a copyright, you should notify us
                          using the notice procedure for claimed infringement
                          under the DMCA (17 USC Section 512). Your infringement
                          notice should be sent to support@blockza.io.
                          Please make you sure that you specifically identify
                          the copyrighted work that you claim has been infringed
                          by providing specific URL(s) and a precise description
                          of where the copyrighted material is located on the
                          page(s).
                        </p>
                        <p>
                          We may give notice to our users of any infringement
                          notice by means of a general notice on any of our
                          websites, electronic mail to a user’s e-mail address
                          in our records, or by written communication sent to a
                          user’s last known physical address in our records. If
                          you receive such an infringement notice, you may
                          provide counter-notification in writing. Please be
                          advised that if you submit a counter-notification,
                          that notice along with your identifying information
                          included in the notice will be provided to the party
                          that submitted the original claim of infringement.
                        </p>
                        <p>
                          <b>Advertising Rights</b>. Company reserves the right
                          to sell and display any advertising, attribution,
                          links, promotional and distribution rights, and
                          Company and its licensors or affiliates will be
                          entitled to retain all revenue generated from any
                          sales of such advertising, attribution, links, or
                          promotional or distribution rights. Nothing in these
                          additional terms obligates or may be deemed to
                          obligate Company to sell or offer to sell any
                          advertising, promotion, or distribution rights.
                        </p>
                        <p>
                          <b>Accuracy of Information</b>. We attempt to ensure
                          that information on these Websites is complete,
                          accurate and current. Despite our efforts, the
                          information on these Websites may occasionally be
                          inaccurate, incomplete, or out of date. We make no
                          representation as to the completeness, accuracy, or
                          currency of any information on these Websites. For
                          example, products included on these Websites may be
                          unavailable, may have different attributes than those
                          listed, or may carry a different price than that
                          stated on these Websites. In addition, we may make
                          changes in information about price and availability
                          without notice. We reserve the right, without prior
                          notice, to limit the order quantity on any product or
                          service or to refuse service to any customer. We also
                          may require verification of information prior to the
                          acceptance or shipment of any order.
                        </p>
                        <p>
                          <b>Links</b>. Running or displaying these Websites or
                          any information or material displayed on these
                          Websites in frames or through similar means on another
                          website without our prior written permission is
                          prohibited. From time to time, these Websites may
                          contain links to third-party websites that are not
                          owned, operated, or controlled by Company or its
                          affiliates. All such links are provided solely as a
                          convenience to you. If you use these links, you will
                          leave our Websites. We are responsible for any
                          content, materials or other information located on or
                          accessible from any third-party websites. We do not
                          endorse, guarantee, or make any representations or
                          warranties regarding any other websites, or any
                          content, materials or other information located or
                          accessible from any other websites, or the results
                          that you may obtain from using any other websites. If
                          you decide to access any other websites linked to or
                          from these Websites, you do so entirely at your own
                          risk.
                        </p>
                        <p>
                          <b>Inappropriate Use of the Websites</b>. You are
                          prohibited from sending or posting any unlawful,
                          threatening, defamatory, libelous, obscene,
                          pornographic, or profane messages or materials on the
                          Websites. You may not post any material on the
                          Websites, or otherwise use the Websites in any manner,
                          that could: (a) humiliate, threaten, or injure other
                          people or their property rights, including, but not
                          limited to, intellectual property rights; (b) violate
                          the privacy or publicity rights of other individuals
                          or entities; (c) be considered criminal conduct or
                          give rise to civil liability; or (d) otherwise violate
                          any law or these Terms. You further understand and
                          agree that posting unsolicited advertisements on these
                          Websites is expressly prohibited by these Terms. Any
                          unauthorized use of our computer systems is a
                          violation of these Terms. In addition to any remedies
                          that we may have at law or in equity, if we determine,
                          in our sole discretion, that you have violated or are
                          likely to violate the foregoing prohibitions, we may
                          take any action we deem necessary to prevent or cure
                          the violation, including without limitation, the
                          immediate removal of your content from these Websites,
                          termination of your account, and termination of your
                          access to the Websites. As set forth in our{' '}
                          <Link href='/privacy-policy'>
                            <b>{t('Privacy Policy')}</b>
                          </Link>
                          , we may fully cooperate with any law enforcement
                          authorities or court order or subpoena requesting or
                          directing us to disclose the identity of anyone
                          posting such materials.
                        </p>
                        <p>
                          <b>Account Registration and Security.</b> You
                          understand that you may need to create an account to
                          have access to parts of the Websites. Accounts are
                          limited to one per individual and multiple accounts
                          may not share the same wallet. In consideration of
                          your use of the Websites, you will: (a) provide true,
                          accurate, current, and complete information about
                          yourself as prompted by the Websites’ registration
                          process and (b) maintain and promptly update your
                          information to keep it true, accurate, current, and
                          complete. If Company suspects that such information is
                          untrue, inaccurate, not current, incomplete, or that
                          you maintain multiple accounts, Company has the right
                          to suspend or terminate your account and refuse all
                          use of the Websites. You are entirely responsible for
                          the security and confidentiality of your password and
                          account. Furthermore, you are entirely responsible for
                          all activities that occur under your account. You
                          agree to immediately notify us of any unauthorized use
                          of your account or any other breach of security of
                          which you become aware. You are responsible for taking
                          precautions and providing security measures best
                          suited for your situation and intended use of the
                          Websites. Please note that anyone able to provide your
                          username and password will be able to access your
                          account so you should take reasonable steps to protect
                          this information.
                        </p>
                        <p>
                          <b>Access and Interference</b>. You agree that you
                          will not use any robot, spider, scraper, or other
                          automated means to access the Websites for any purpose
                          without our express written permission. Additionally,
                          you agree that you will not: (a) take any action that
                          imposes or may impose in our sole discretion an
                          unreasonable or disproportionately large load on our
                          or our vendors systems; (b) interfere or attempt to
                          interfere with the proper working of the site or any
                          activities conducted on the Websites; or (c) bypass
                          any measures we may use to prevent or restrict access
                          to the Websites.
                        </p>
                        <p>
                          {' '}
                          <b>Privacy.</b> Information collection and use,
                          including the collection and use of personal
                          information, is governed by our Privacy Policy which
                          is incorporated into and is a part of these Terms.
                        </p>
                        <p>
                          <b>Force Majeure</b>. Company is not responsible for
                          damages, delays, or failures in performance resulting
                          from acts or occurrences beyond its reasonable
                          control, including, without limitation: fire,
                          lightning, explosion, power surge or failure, water,
                          acts of God, public health emergency, war, revolution,
                          civil commotion or acts of civil or military
                          authorities or public enemies: any law, order,
                          regulation, ordinance, or requirement of any
                          government or legal body or any representative of any
                          such government or legal body; or labor unrest,
                          including without limitation, strikes, slowdowns,
                          picketing, or boycotts; inability to secure raw
                          materials, transportation facilities, fuel or energy
                          shortages, or acts or omissions of other common
                          carriers.
                        </p>
                        <p>
                          <b>Representations and Warranties</b>. You affirm,
                          represent and warrant the following: (a) you are old
                          enough in your location to enter into a binding
                          contract with Company and have the right and authority
                          to enter into this agreement, and are fully able and
                          competent to satisfy the terms, conditions and
                          obligations herein; (b) you have obtained all
                          consents, and possess all copyright, patent,
                          trademark, trade secret and any other proprietary
                          rights, or the necessary licenses thereto, for any
                          content you have provided to us; (c) if applicable,
                          you have the written consent of each and every
                          identifiable natural person to use such persons name
                          or likeness in the manner contemplated by the Websites
                          and these Terms, and each such person has released you
                          from any liability that may arise in relation to such
                          use; (d) you have read, understood, agree with, and
                          will abide by the terms and conditions of this
                          agreement; (e) you are not, and have not been an agent
                          of Company and were not and are not acting on behalf
                          of, or as a representative of, Company or any other
                          party; (f) Company use of any information you have
                          submitted as contemplated by the Terms and the
                          Websites will not infringe any rights of any third
                          party, including but not limited to any intellectual
                          property rights, privacy rights and rights of
                          publicity; (g) you are not located in a country that
                          is subject to a government embargo or that has been
                          designated as a “terrorist supporting” country; and
                          (h) your User Content does not contain: (1) material
                          falsehoods or misrepresentations that could harm
                          Company or any third party; (2) content that is
                          unlawful, obscene, defamatory, libelous, threatening,
                          pornographic, harassing or encourages conduct that
                          would be considered a criminal offense, give rise to
                          civil liability or violate any law; (3) advertisements
                          or solicitations of business; or (4) impersonations of
                          third parties
                        </p>
                        <p>
                          <b>Disclaimers</b>. Your use of these websites is at
                          your own risk. the information, materials, products
                          and services provided on, through, or in connection
                          with the websites or otherwise provided by us are
                          provided “as is” without any warranties of any kind
                          including, but not limited to, warranties of
                          merchantability, fitness for a particular purpose,
                          security, non-infringement of intellectual property,
                          freedom from computer virus, or warranties arising
                          from course of dealing or course of performance. to
                          the fullest extent permitted by applicable law, we
                          hereby disclaim all warranties of any kind, either
                          express or implied, with respect to the websites and
                          our products and services. we do not represent or
                          warrant that the websites or any information or
                          products or services we provide will be uninterrupted
                          or error-free, that defects will be corrected, or that
                          the websites is free of viruses or other harmful
                          components. we do not make any warranties or
                          representations regarding the completeness,
                          correctness, accuracy, adequacy, usefulness,
                          timeliness or reliability of the websites or any
                          information or products or services we provide, or any
                          other warranty, the information, materials, products
                          and services provided on or through the websites may
                          be out of date, and neither company nor any of its
                          affiliates makes any commitment or assumes any duty to
                          update such information, materials, products or
                          services. the foregoing exclusions of implied
                          warranties do not apply to the extent prohibited by
                          applicable law.
                        </p>
                        <p>
                          To the fullest extent permissible by applicable law,
                          we hereby disclaim all warranties of any kind, either
                          express or implied, including, any implied warranties
                          with respect to the products or services listed on or
                          purchased on or through these websites. without
                          limiting the generality of the foregoing, we hereby
                          expressly disclaim all liability for product defect or
                          failure, claims that are due to normal wear, product
                          misuse, abuse, product modification, improper product
                          selection, non-compliance with any codes, or
                          misappropriation. we make no warranties to those
                          defined as “consumers” in the magnuson-moss
                          warranty-federal trade commission improvements act.
                          the foregoing exclusions of implied warranties do not
                          apply to the extent prohibited by applicable law.
                        </p>
                        <p>
                          No advice or information, whether oral or written,
                          obtained from company or through company’s websites,
                          products and services will create any warranty not
                          expressly made herein.
                        </p>

                        <p>
                          <b>Limitations of liability</b>. in no event will
                          company, or any of its officers, directors, employees,
                          shareholders, affiliates, agents, successors or
                          assigns, nor any party involved in the creation,
                          production or transmission of these websites, be
                          liable to you or anyone else for any indirect,
                          special, punitive, incidental or consequential damages
                          (including, without limitation, those resulting from
                          lost profits, lost data or business interruption)
                          arising out of the use, inability to use, or the
                          results of use of these websites, any websites linked
                          to these websites, or the materials, information,
                          products or services contained on or provided in
                          connection with the websites, whether based on
                          warranty, contract, tort or any other legal theory and
                          whether or not advised of the possibility of such
                          damages. you specifically acknowledge that company
                          shall not be liable for user content or the
                          defamatory, offensive, or illegal conduct of any third
                          party, and that the risk of harm or damage from the
                          foregoing rests entirely with you. the foregoing
                          limitations of liability do not apply to the extent
                          prohibited by applicable law.
                        </p>
                        <p>
                          In the event of any problem with the websites or any
                          content or products or services, you agree that your
                          sole remedy is to cease using the websites or the
                          content or products or services. in no event shall
                          company’s total liability to you for all damages,
                          losses, and causes of action whether in contract, tort
                          (including, but not limited to, negligence), or
                          otherwise exceed the greater of (a) twenty-five
                          dollars (us $25.00) or (b) the value of your purchases
                          on the websites for the six (6) months prior to you
                          making a claim.
                        </p>
                        <p>
                          If you are a california resident and in connection
                          with the foregoing releases, you hereby waive japan
                          civil code section 1542 (and any similar provision in
                          any other jurisdiction) which states: “a general
                          release does not extend to claims which the creditor
                          does not know or suspect to exist in his favor at the
                          time of executing the release, which, if known by him
                          must have materially affected his settlement with the
                          debtor.”
                        </p>
                        <p>
                          <b>Indemnity</b>. You agree to defend, indemnify and
                          hold Company, each of our parent companies,
                          subsidiaries and affiliates and the successors of each
                          of the foregoing, and the officers, directors, agents,
                          and employees of each of the foregoing, harmless from
                          any and all liabilities, costs, and expenses,
                          including reasonable attorneys’ fees, related to or in
                          connection with (a) your use of the Websites or your
                          placement or transmission of any message or
                          information on these Websites by you or your
                          authorized users; (b) your violation of any term or
                          condition of these Terms, including without
                          limitation, your breach of any of the representations
                          and warranties; (c) your violation of any third-party
                          rights, including without limitation any right of
                          privacy, publicity rights or intellectual property
                          rights; (d) your violation of any law, rule or
                          regulation of the United States or any other country;
                          (e) any claim or damages that arise as a result of any
                          information or material that you provide to Company;
                          or (f) any other party’s access and use of the
                          Websites with your unique username, password or other
                          appropriate security code.
                        </p>
                        <p>
                          <b>Release</b>. If you have a dispute with another
                          user or other party related to the Websites, you
                          release Company (and our officers, directors, agents,
                          subsidiaries, joint ventures, and employees) from all
                          claims, demands and damages (actual and consequential)
                          of every kind and nature, known and unknown, suspected
                          and unsuspected, disclosed and undisclosed, arising
                          out of or in any way connected with such disputes.
                        </p>
                        <p>
                          Termination. You or we may suspend or terminate your
                          account or your use of these Websites at any time, for
                          any reason or for no reason. You are personally liable
                          for any orders placed or charges incurred prior to
                          termination. We may also block your access to our
                          Websites if (a) you breach these Terms; (b) we are
                          unable to verify or authenticate any information you
                          provide to us; (c) we believe that your actions may
                          cause financial loss or legal liability for our users
                          or us; or (d) or as otherwise provided herein or in
                          another incorporated policy. You understand that any
                          termination of your account, by you or Company, may
                          involve the permanent deletion of your data. Company
                          will not have any liability whatsoever to you for any
                          suspension or termination, including for deletion of
                          your data.
                        </p>

                        <p>
                          General. Any claim arising out of or relating to the
                          use of, these Websites and the materials contained
                          herein is governed by the laws of the State of New
                          York as an agreement wholly performed therein without
                          regard to its choice of law provisions and the United
                          Nations Conventions on Contracts (if applicable). You
                          consent to the exclusive jurisdiction of the state and
                          federal courts located in New York, New York. You
                          hereby irrevocably consent to such venue and to the
                          exclusive jurisdiction of any such court over any such
                          dispute. A printed version of these Terms will be
                          admissible in judicial and administrative proceedings
                          based upon or relating to these Terms to the same
                          extent as other business documents originally
                          generated and maintained in printed form. You shall
                          comply with all applicable domestic and international
                          laws, statutes, ordinances, and regulations regarding
                          your use of the Websites.
                        </p>
                        <p>
                          If any provision of these Terms is held to be invalid
                          or unenforceable, such provision shall be struck and
                          the remaining provisions shall be enforced. You agree
                          that these Terms and all incorporated agreements may
                          be assigned by Company in our sole discretion.
                          Headings are for reference purposes only and in no way
                          define, limit, construe or describe the scope or
                          extent of such section. Our failure to act with
                          respect to a breach by you or others does not waive
                          our right to act with respect to subsequent or similar
                          breaches. Except for additional terms and conditions
                          that are provided at the time of purchase, including
                          but not limited to additional terms associated with
                          our events, these Terms are the entire agreement
                          between you and Company with respects to the subject
                          matter hereof and supersede any prior understandings
                          or agreements (written or oral). Any provision that
                          must survive to give proper effect to its intent
                          (e.g., indemnity, general, any perpetual license,
                          limitations on liability, disclaimers,
                          representations, and warranties, etc) shall survive
                          the expiration or termination of these Terms.
                        </p>
                        <p>
                          All rights not granted herein are expressly reserved
                          to BlockZa .
                        </p>
                        <div className='spacer-50' />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
