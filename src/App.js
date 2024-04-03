
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage'; 
import FormComponent from './FormComponent';
import DisplayComponent from './DisplayComponent';

function App() {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<LandingPage />} />  
        <Route path="/form" element={<FormComponent />} /> 
        <Route path="/display" element={<DisplayComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
