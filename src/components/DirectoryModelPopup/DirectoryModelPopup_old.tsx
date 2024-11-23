import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function DirectoryModelPopup({ show, handleClose }: { show: boolean; handleClose: () => void }) {
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    inquiry: '',
    email: '',
    jobTitle: '',
    linkedIn: '',
    companyWebsite: '',
    companyType: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/contact`, formData);
      if (response.status === 200) {
        toast.success("Your message has been successfully sent. We'll get back to you shortly.");
        setFormData({
          inquiry: '',
          email: '',
          jobTitle: '',
          linkedIn: '',
          companyWebsite: '',
          companyType: '',
        });
        handleClose();
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
        .custom-modal  {
          max-width: 800px!important; /* Adjust width */
        }

        .custom-modal .modal-body {
          max-height: 70vh; /* Adjust height */
          overflow-y: auto; /* Allow scrolling inside the modal */
        }
      `}</style>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Contact Company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please fill out the following information for a direct introduction.</p>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group controlId="formInquiry">
                  <Form.Label>Which team(s) are you requesting to contact?*</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="I’d like to connect with Aconomy!"
                    name="inquiry"
                    value={formData.inquiry}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Work email*</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formJobTitle">
                  <Form.Label>Job title*</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your job title"
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
                  <Form.Label>Your LinkedIn*</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your LinkedIn profile"
                    name="linkedIn"
                    value={formData.linkedIn}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formCompanyWebsite">
                  <Form.Label>Company Website*</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="Enter company website"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <Form.Group controlId="formCompanyType">
                  <Form.Label>Which best describes your company?*</Form.Label>
                  <Form.Control
                    as="select"
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Please Select</option>
                    <option value="startup">Startup</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="other">Other</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <Button type="submit" className="w-100" disabled={isSending}>
                  {isSending ? <Spinner size="sm" animation="border" /> : 'Submit'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
