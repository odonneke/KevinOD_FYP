import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
//import SignaturePad from 'react-signature-canvas';
//import emailjs from 'emailjs-com';
import './LP.css';
import researcherSignature from './assets/signature.jpg';

const LandingPage = () => {
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);
//  const [signature, setSignature] = useState(null);
 // const [showSignaturePad, setShowSignaturePad] = useState(false);
 // const sigPad = useRef({});
  const isFormValid = agree

  

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isFormValid) {
        navigate('/form');
  }else{
    alert("Please make sure all fields are filled and you have agreed to the terms.");
  }
}

  return (
    <div className="consent-form-container">
      <form onSubmit={handleSubmit}>
      <section className="consent-form-title">
        <h2><strong>Consent Form</strong></h2>
        </section>
        <section>
          <h2><strong>1. LEAD RESEARCHERS:</strong></h2>
          <p>Kevin O'Donnell</p>
        </section>

        <section>
          <h2><strong>2. BACKGROUND OF RESEARCH:</strong></h2>
          <p>You are invited to participate in this study on solutions to the obesity crisis which aims to
evaluate the plausibility of an App/Tool to aid in solutions to the obesity crisis. Proposed is a
web application that will provide affordable meal options to research the potential benefits
of utilising technology in obesity policy and action planning.</p>
        </section>

        <section>
          <h2><strong>3. PROCEDURES OF THIS STUDY:</strong></h2>
          <p>You will first use the application. You will input your weight, sex, budget and age. You will
then receive recipes tailored to you. You are asked to explore these fully. None of the user’s
inputted data will be saved. Personal information provided is only used to generate the
suggested recipes and none of the information is stored or associated with the user.</p>
          <p>After use of the application you will be asked to answer a set of questions.</p>
          <p>The set is part of IBMS PSSUQ system evaluation where you will rank the application
usability under certain headings from 1 (strongly agree) to 7 (strongly disagree). There is
also one open question on application purpose. The participants data will be stored securely
on a password protected google sheet.</p>
          <p>No linkage will be kept between an individual&#39;s consent form and an individual&#39;s survey
result.</p>
          <p>After agreeing to the consent form a copy will be recorded, emailed to the researcher and
stored in a Microsoft Office/OneDrive password-protect folder.</p>
        </section>

        <section>
          <h2><strong>4. PUBLICATION:</strong></h2>
          <p>This is intended to be part of the CSU44099 final year project requirement.</p>
        </section>

        <section>
          <h2><strong>5. CONFLICTS OF INTEREST:</strong></h2>
          <p>There are conflicts of interest present in this project. The researcher has utilised personal
relationships in order to recruit participants. The researcher asks all participants to act
completely unbiasedly when completing the survey.</p>
           <p>Individual results may be aggregated anonymously and research reported on aggregate
results.</p>
        </section>

        <section>
          <h2><strong>6. DECLARATION (By continuing you agree to the decleraion):</strong></h2>
          <p>• I am 18 years or older and am competent to provide consent.</p>
          <p>• I have read, or had read to me, a document providing information about this research and
this consent form. I have had the opportunity to ask questions and all my questions have
been answered to my satisfaction and understand the description of the research that is
being provided to me.</p>
          <p>• I agree that my data is used for scientific purposes and I have no objection that my data is
published in scientific publications in a way that does not reveal my identity.</p>
          <p>• I understand that if I make illicit activities known, these will be reported to appropriate
authorities.</p>
          <p>• I understand that I may refuse to answer any question and that I may withdraw at any time
without penalty.</p>
          <p>• I understand that my data has been fully anonymised so that it can no longer be attributed
to me, then it will no longer be possible to withdraw</p>
          <p>• I freely and voluntarily agree to be part of this research study, though without prejudice to
my legal and ethical rights.</p>
          <p>• I understand that my participation is fully anonymous and that no personal details about me
will be recorded.</p>
          <p>• I understand that if I or anyone in my family has a history of epilepsy then I am proceeding
at my own risk.</p>
          <p>• I have received a copy of this agreement.</p>
          <p>By signing this document I consent to participate in this study, and consent to the data
processing necessary to enable my participation and to achieve the research goals of this
study.</p>

           
        </section>
       {/*jdi*/}
        <section>
          <h2><strong>7. Statement of investigator’s responsibility:</strong></h2>
          <p>Statement of investigator’s responsibility: I have explained the nature and purpose of this
research study, the procedures to be undertaken and any risks that may be involved. I have
offered to answer any questions and fully answered such questions. I believe that the
participant understands my explanation and has freely given informed consent.</p>
<h2><strong>RESEARCHERS CONTACT DETAILS:</strong></h2>
          <p>odonneke@tcd.ie</p>
          <h2><strong>RESEARCHER’S SIGNATURE:</strong></h2>
          <img src={researcherSignature} alt="Researcher's Signature" style={{ width: '80px', height: 'auto' }} />
          <h2><strong>Date: </strong></h2>
          <p>16/01/2024</p>
        </section>

        <div className="consent-check">
          <input
            type="checkbox"
            id="agree"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <label htmlFor="agree">I have read and agree to the informed consent form.</label>
        </div>
        
        <button type="submit" disabled={!isFormValid}>Proceed to the Application</button>

      </form>
    </div>
  );
};

export default LandingPage;
