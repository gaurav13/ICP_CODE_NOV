"use client";

import { useState } from "react";
import axios from "axios";
import "../../styles/expert-directory.css";
import { Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { LANG } from '@/constant/language';
export default function ExpertForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    twitterLinks:"",
    likendinLinks:"",
    expertise: "",
    companyName: "",
    designation: "",
    availabilityPricing: "",
    consent: false,
  });

  const [photo, setPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Only JPG and PNG are allowed.");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB. Please upload a smaller file.");
      return;
    }

    setPhoto(file);
    setPreviewPhoto(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.consent) {
      alert("You must agree to the terms and conditions.");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    if (photo) formDataToSend.append("photo", photo);

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://blockza.io/chart/expert-registration/expertregistraion.php",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Form submitted successfully!");
      console.log("Response:", response.data);
      setIsSubmitting(false);
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        twitterLinks:"",
        likendinLinks:"",
        expertise: "",
        companyName: "",
        designation: "",
        availabilityPricing: "",
        consent: false,
      });
      setPhoto(null);
      setPreviewPhoto(null);
    } catch (error) {
      alert("Error submitting the form. Please try again.");
      console.error("Error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid">
      <Row>
  <Col md={8} className="text-start form-container shadow-sm rounded">
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2 className="blue-text-color text-center">
        {LANG === 'jp' ? '専門家登録' : 'Expert Registration'}
      </h2>

      {/* Full Name */}
      <div className="form-group">
        <label className="form-label">
          {LANG === 'jp' ? '氏名' : 'Full Name'} <span className="required_icon">*</span>
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="form-control"
          placeholder={LANG === 'jp' ? '氏名を入力してください' : 'Enter your full name'}
          required
        />
      </div>

      {/* Email */}
      <div className="form-group">
        <label className="form-label">
          {LANG === 'jp' ? 'メールアドレス' : 'Email Address'} <span className="required_icon">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
          placeholder={LANG === 'jp' ? 'メールアドレスを入力してください' : 'Enter your email'}
          required
        />
      </div>

      {/* Twitter Links */}
      <div className="form-group">
        <label className="form-label">
          {LANG === 'jp' ? 'Twitter リンク' : 'Twitter Link'}
        </label>
        <input
          type="text"
          name="twitterLinks"
          value={formData.twitterLinks}
          onChange={handleChange}
          className="form-control"
          placeholder={LANG === 'jp' ? 'Twitter リンクを入力してください' : 'Enter Twitter link'}
        />
      </div>

      {/* LinkedIn Links */}
      <div className="form-group">
        <label className="form-label">
          {LANG === 'jp' ? 'LinkedIn リンク' : 'LinkedIn Link'}
        </label>
        <input
          type="text"
          name="likendinLinks"
          value={formData.likendinLinks}
          onChange={handleChange}
          className="form-control"
          placeholder={LANG === 'jp' ? 'LinkedIn リンクを入力してください' : 'Enter LinkedIn link'}
        />
      </div>

      {/* Expertise */}
      <div className="form-group">
        <label className="form-label">
          {LANG === 'jp' ? '専門知識について説明する' : 'Describe Your Expertise'}
        </label>
        <textarea
          name="expertise"
          value={formData.expertise}
          onChange={handleChange}
          className="form-control"
          maxLength={300}
          placeholder={
            LANG === 'jp'
              ? '専門知識について簡単に説明してください (最大 300 文字)'
              : 'Briefly explain your expertise (max 300 words)'
          }
        />
      </div>

      {/* Company Name */}
      <div className="form-group">
        <label className="form-label">
          {LANG === 'jp' ? '会社名' : 'Company Name'} <span className="required_icon">*</span>
        </label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className="form-control"
          placeholder={LANG === 'jp' ? '会社名を入力してください' : 'Enter company name'}
          required
        />
      </div>

      {/* Designation */}
      <div className="form-group">
        <label className="form-label">
          {LANG === 'jp' ? '役職' : 'Designation'} <span className="required_icon">*</span>
        </label>
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          className="form-control"
          placeholder={LANG === 'jp' ? '役職を入力してください' : 'Enter your designation'}
          required
        />
      </div>

      {/* Photo Upload */}
      <div className="form-group media-upload-container">
        <label className="form-label">
          {LANG === 'jp' ? '写真をアップロードしてください' : 'Upload Your Photo'}{' '}
          <span className="required_icon">*</span>
        </label>
        <Form.Group controlId="formFile1">
          <Form.Control
            id="previewweb3photo"
            className="d-none"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handlePhotoChange}
          />
          <label
            htmlFor="previewweb3photo"
            className="btn button-color btn-primary btn-sm upload-button"
          >
            {LANG === 'jp' ? 'ファイルを選択' : 'Browse files'}
          </label>
        </Form.Group>
        <small>
          {LANG === 'jp'
            ? '許容形式: JPG, PNG | 最大サイズ: 5 MB'
            : 'Acceptable formats: JPG, PNG | Max size: 5 MB'}
        </small>
        {previewPhoto && (
          <div className="preview-image mt-2">
            <img
              src={previewPhoto}
              alt={LANG === 'jp' ? 'プレビュー' : 'Preview'}
              className="img-fluid rounded"
            />
          </div>
        )}
      </div>

      {/* Availability and Pricing */}
      <div className="form-group">
        <label className="form-label">
          {LANG === 'jp' ? '利用可能時間（任意）' : 'Availability (Optional)'}
        </label>
        <input
          type="text"
          name="availabilityPricing"
          value={formData.availabilityPricing}
          onChange={handleChange}
          className="form-control"
          placeholder={
            LANG === 'jp'
              ? '毎週の利用可能時間を入力してください（例: 週10時間）'
              : 'Enter hourly availability. (10 Hours a Week)'
          }
        />
      </div>

      {/* Consent */}
      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input
            className="checkboxtext"
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            required
          />
          <span className="ps-2">
            {LANG === 'jp'
              ? '規約に同意し、提供した情報が正確であることを確認します。'
              : 'I agree to the terms and conditions and confirm that the information provided is accurate.'}
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn submit-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Spinner animation="border" size="sm" />
        ) : LANG === 'jp' ? '送信' : 'Submit'}
      </button>
    </form>
  </Col>
  <Col md={4}>
    <div className="contact-card p-3 shadow-sm rounded">
      <h6 className="fw-bold mb-2">
        {LANG === 'jp'
          ? '📧 営業チームに連絡してください'
          : '📧 Contact the sales team'}
      </h6>
      <a
        href="mailto:support@blockza.io"
        className="blue-text-color fw-bold"
      >
        support@blockza.io
      </a>
    </div>
  </Col>
</Row>

    </div>
  );
}
