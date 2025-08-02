import React from 'react'
import '@/styles/LoadingPage.css';

export const LoadingPage = () => (
  <div className='container-loading-page'>
    <div className="loader">
      <span style={{ '--i': 0 }}></span>
      <span style={{ '--i': 1 }}></span>
      <span style={{ '--i': 2 }}></span>
      <span style={{ '--i': 3 }}></span>
      <span style={{ '--i': 4 }}></span>
      <span style={{ '--i': 5 }}></span>
      <span style={{ '--i': 6 }}></span>
    </div>
  </div>
);