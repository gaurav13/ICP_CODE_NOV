import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LANG } from '@/constant/language';

export default function DirectoryModelPopup({
  show,
  handleClose,
  companyName,
  expertPrice,
  platformPrice,
}: {
  show: boolean;
  handleClose: () => void;
  companyName: string;
  expertPrice?: string | null;
  platformPrice?: string | null;
}) {
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    inquiry: '',
    email: '',
    jobTitle: '',
    linkedIn: '',
    companyWebsite: '',
    companyType: '',
    meetingOption: 'Schedule a meeting to discuss business opportunities.', 
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    const formDataWithFullUrl = {
      formData,
      companyName,
      websiteUrl: window.location.origin,
      submissionUrl: window.location.href, // Full URL of the page
    };
    try {
      const response = await axios.post(
        'https://blockza.io/email/directory.php',
        formDataWithFullUrl,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200) {
        toast.success('Your message has been successfully sent.');
        setFormData({
          inquiry: '',
          email: '',
          jobTitle: '',
          linkedIn: '',
          companyWebsite: '',
          companyType: '',
          meetingOption: '', // Reset meeting option
        });
        handleClose();
      } else {
        throw new Error('Email sending failed');
      }
    } catch (error) {
      toast.error('There was an error sending your message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <style global jsx>{`
        .custom-modal {
          max-width: 800px !important; /* Adjust width */
        }

        .custom-modal .modal-body {
          max-height: 70vh; /* Adjust height */
          overflow-y: auto; /* Allow scrolling inside the modal */
        }
      `}</style>

      <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            {LANG === 'jp' ? `お問い合わせ ${companyName}` : `Contact ${companyName}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Display Expert and Platform Prices */}
         
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group controlId="formInquiry">
                  <Form.Label>
                    {LANG === 'jp'
                      ? 'どのチームに連絡を希望しますか？*'
                      : 'Which team(s) are you requesting to contact?*'}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder={
                      LANG === 'jp'
                        ? `${companyName} に連絡し、Blockza Web3ディレクトリからビジネスパートナーシップとコラボレーションの可能性について話し合いたいです。`
                        : `I would like to connect with ${companyName} from the Blockza Web3 Directory to discuss potential opportunities for a business partnership and collaboration.`
                    }
                    name="inquiry"
                    value={formData.inquiry}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <Form.Group controlId="formMeetingOptions">
                  <Form.Label>
                    {LANG === 'jp'
                      ? 'お問い合わせ内容を選択してください*'
                      : 'Please select your inquiry*'}
                  </Form.Label>
                  <div>
      {/* First Radio Button */}
      <Form.Check
        type="radio"
        id="businessPartnership"
        name="meetingOption"
        value="Schedule a meeting to discuss business opportunities."
        label={
          LANG === 'jp'
            ? 'ビジネスチャンスについて話し合うためのミーティングをスケジュールしてください。'
            : 'Schedule a meeting to discuss business opportunities.'
        }
        onChange={handleChange}
        checked={
          formData.meetingOption ===
          'Schedule a meeting to discuss business opportunities.'
        }
        required
      />
      {formData.meetingOption ===
        'Schedule a meeting to discuss business opportunities.' && (
          <div className='ps-4'><span
          style={{
            borderRadius:'4px',
            backgroundColor: '#1e5fb3',
            fontWeight: 'normal',
            fontSize: '12px',
          }}
          className="badge text-white shadow-sm p-1 ms-auto"
        >
          {LANG === 'jp'
            ? `プラットフォームの料金: ${platformPrice}`
            : `Starting at: ${platformPrice}`}
        </span></div>
      )}

      {/* Second Radio Button */}
      <Form.Check
        type="radio"
        id="expertAdvice"
        name="meetingOption"
        value="Book a meeting for Expert advice."
        label={
          LANG === 'jp'
            ? '専門家のアドバイスを求めてミーティングを予約してください。'
            : 'Book a meeting for Expert advice.'
        }
        onChange={handleChange}
        checked={formData.meetingOption === 'Book a meeting for Expert advice.'}
        required
      />
      {formData.meetingOption === 'Book a meeting for Expert advice.' && (
        <div className='ps-4'><span
          style={{
            borderRadius:'4px',
            backgroundColor: '#1e5fb3',
            fontWeight: 'normal',
            fontSize: '12px',
          }}
          className="badge text-white shadow-sm p-1 ms-auto"
        >
          {LANG === 'jp'
            ? `専門家の料金: ${expertPrice}`
            : `Starting at: ${expertPrice}`}
        </span></div>
      )}
    </div>
                  
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>
                    {LANG === 'jp' ? '勤務先のメールアドレス*' : 'Work email*'}
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder={
                      LANG === 'jp' ? 'メールアドレスを入力してください' : 'Enter your email'
                    }
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formJobTitle">
                  <Form.Label>
                    {LANG === 'jp' ? '役職*' : 'Job title*'}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={
                      LANG === 'jp' ? '役職を入力してください' : 'Enter your job title'
                    }
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={6}>
                <Form.Group controlId="formLinkedIn">
                  <Form.Label>
                    {LANG === 'jp' ? 'あなたのLinkedIn' : 'Your LinkedIn'}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={
                      LANG === 'jp'
                        ? 'LinkedInプロファイルを入力してください'
                        : 'Enter your LinkedIn profile'
                    }
                    name="linkedIn"
                    value={formData.linkedIn}
                    onChange={handleChange}
                    
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formCompanyWebsite">
                  <Form.Label>
                    {LANG === 'jp' ? '会社のウェブサイト' : 'Company Website'}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={
                      LANG === 'jp'
                        ? '会社のウェブサイトを入力してください'
                        : 'Enter company website'
                    }
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <Form.Group controlId="formCompanyType">
                  <Form.Label>
                    {LANG === 'jp'
                      ? 'あなたの会社を最もよく説明するものはどれですか？*'
                      : 'Which best describes your company?*'}
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      {LANG === 'jp' ? '選択してください' : 'Please Select'}
                    </option>
                    <option value="Web3">Web3</option>
                    <option value="Blockchain">Blockchain</option>
                    <option value="Crypto">Crypto</option>
                    <option value="DEFI">DEFI</option>
                    <option value="DAO">DAO</option>
                    <option value="NFT">NFT</option>
                    <option value="Metavers">
                      {LANG === 'jp' ? 'メタバース' : 'Metavers'}
                    </option>
                    <option value="Blockchain Gain">
                      {LANG === 'jp' ? 'ブロックチェーン利得' : 'Blockchain Gain'}
                    </option>
                    <option value="AI">AI</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <Button type="submit" style={{ backgroundColor: '#1e5fb3', }} className="w-100" disabled={isSending}>
                  {isSending ? (
                    <Spinner size="sm" animation="border" />
                  ) : LANG === 'jp' ? (
                    '送信'
                  ) : (
                    'Submit'
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
