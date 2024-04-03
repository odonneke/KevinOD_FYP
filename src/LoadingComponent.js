import React from 'react';
import './LC.css'; 

const LoadingComponent = () => (
  <div className="loader-container">
    <div className="loader"></div>
    <p>Loading recipes... This may take afew moments</p>
  </div>
);

export default LoadingComponent;
