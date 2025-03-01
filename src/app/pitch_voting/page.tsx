"use client";
import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import ConnectModal from '@/components/Modal';
import ConfirmationModel from '@/components/Modal/ConfirmationModel';
const SurveyForm = () => {
  const { auth, identity } = useConnectPlugWalletStore((state: any) => ({
    auth: state.auth,
    identity: state.identity,
  }));

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: 'Participant', // Default selection
    rankings: { 'JPYC Inc.': 1, 'SONEX': 1, 'Slash Fintech': 1, 'Bandruption': 1, '株式会社HEALTHREE': 1 },
    submitted: false,
  });

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectLink, setConnectLink] = useState('/');
  const router = useRouter();
const [loginModalShow, setLoginModalShow] = React.useState(false);
  const companies = ['JPYC Inc.', 'SONEX', 'Slash Fintech', 'Bandruption', '株式会社HEALTHREE'];

  useEffect(() => {
    if (auth.state === 'initialized' && identity) {
      setShowConnectModal(false);
    }
  
    // Remove automatic modal opening, allow it to be triggered manually
    // Else if (auth.state === 'anonymous') { setShowConnectModal(true); }  <-- REMOVE THIS
  
    const storedEmail = localStorage.getItem("submittedEmail");
    if (storedEmail) {
      setFormData((prev) => ({ ...prev, submitted: true }));
    }
  }, [auth, identity]);
  

  const handleConnectModalClose = () => {
    setShowConnectModal(false);
  };

  const handleConnectModalOpen = (e: string) => {
    setShowConnectModal(true);
    setConnectLink(e);
  };
  const connect = async () => {
  //  setIsConnectLoading(true);
    // Add logic for connecting Internet Identity here
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStarClick = (company: string, rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rankings: { ...prev.rankings, [company]: rating },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!identity) {
      toast.error('Please log in using Internet Identity.');
      setLoginModalShow(true); // Directly trigger the modal
      return;
    }
  
    const walletAddress = identity.getPrincipal().toText();
  
    const formDataWithFullUrl = {
      name: formData.name,
      email: formData.email,
      userType: formData.userType,
      wallet: walletAddress,
      rankings: formData.rankings,
    };
  
    console.log('form data', formDataWithFullUrl);
  
    try {
      const response = await axios.post(
        'https://blockza.io/survey.php/',
        formDataWithFullUrl,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('Survey submitted:', response.data);
      localStorage.setItem("submittedEmail", formData.email);
      setFormData((prev) => ({ ...prev, submitted: true }));
    } catch (error) {
      console.error('Error submitting survey:', error);
      toast.error('Failed to submit survey.');
    }
  };
  
  let confirmationModelOpen = () => {
    setLoginModalShow(true);
  };
  return (
   <>
    <main id="main">
      <div className="main-inner detail-inner-Pages pri-term-pnl">
        <div className="">
       
       
          <div className="container">
            <div className="row"><div style={{
      backgroundColor: "#ffffff",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
      padding: "4px 0px",
      marginLeft: "0"
    }} className="col-md-8 mt-4 mb-4 p-4 border rounded shadow bg-white">
            <img 
        src="https://blockza.io/category_banner/pitch.png"  
        width="800"/> <h1 className='blue-title'>Vote for the Best Web3 Pitch-Web3 Salon Event (Feb 27)</h1>
        <p>Support the most innovative Web3 startup by casting your vote for the best pitch at the Web3 Salon Pitch Event on February 27. Your vote will help recognize and empower groundbreaking projects shaping the future of Web3!
        </p>
        <p>Stay engaged and be part of the decision—vote now! 🚀</p>
            {!formData.submitted ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label style={{ fontSize: '14px', color: '#333' }} className="form-label fw-bold">Name*:</label>
                  <input style={{fontSize: '14px',borderColor: '#858585',boxShadow: 'none',backgroundColor: '#f6f7f9',borderRadius: '10px'}}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label style={{ fontSize: '14px', color: '#333' }} className="form-label fw-bold">Email*:</label>
                  <input style={{fontSize: '14px',borderColor: '#858585',boxShadow: 'none',backgroundColor: '#f6f7f9',borderRadius: '10px'}}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label style={{ fontSize: '14px', color: '#333' }} className="form-label fw-bold">User Type*:</label>
                  <select style={{fontSize: '14px',borderColor: '#858585',boxShadow: 'none',backgroundColor: '#f6f7f9',borderRadius: '10px'}}
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="Participant">Participant</option>
                    <option value="VC">VC-Investors</option>  
                  </select>
                </div>
                {companies.map((company) => (
                  <div key={company} className="mb-3">
                    <label style={{ fontSize: '14px', color: '#333' }} className="form-label fw-bold">
                      {company.toUpperCase()} Ranking:
                    </label>
                    <div>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <FaStar
                          key={rating}
                          size={24}
                          color={
                            formData.rankings[
                              company as keyof typeof formData.rankings
                            ] >= rating
                              ? '#ffc107'
                              : '#e4e5e9'
                          }
                          onClick={() => handleStarClick(company, rating)}
                          style={{ cursor: 'pointer' }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <div
                  onClick={() => {
                    if (!identity) {
                      handleConnectModalOpen('/pitch_voting/');
                    }
                  }}
                  style={{ cursor: !identity ? 'pointer' : 'default' }}
                >
              <button
  type="submit"
  style={{ background: '#1e5fb3' }}
  className="btn w-50 text-white"
  onClick={(e) => {
    if (!identity) {
      e.preventDefault(); // Prevent the form from submitting
      setLoginModalShow(true); // Show the login modal instead
      return;
    }
  }}
>
  Submit Your Vote
</button>


                </div>
              </form>
            ) : (
              <p className="text-success text-center">Thank you for your voting!</p>
            )}
          </div>
          <div className='col-md-4'><div style={{
      background: "#f8f9fa",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      textAlign: "center",
      padding: "20px"
    }} className="contact-card mt-4 p-3 shadow-sm rounded">
                    <h6 className="fw-bold mb-2">📧 Contact the support team</h6>
                    <a
                      href="mailto:support@blockza.io"
                      className="blue-text-color fw-bold"
                    >
                      support@blockza.io
                    </a>
                  </div></div>
        </div>
        </div></div>
      
      </div>
      <ConfirmationModel
          show={loginModalShow}
          handleClose={() => setLoginModalShow(false)}
          handleConfirm={connect}
        />
      {/*<ConnectModal
        handleClose={handleConnectModalClose}
        showModal={showConnectModal}
        link={connectLink}
      />*/}
    </main>
    </>
  );
};

export default SurveyForm;
