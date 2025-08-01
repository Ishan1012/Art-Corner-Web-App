import React from 'react'

export const LoadingPage = () => (
  <div style={styles.wrapper}>
    <div className="spinner-border text-warning" role="status" style={styles.spinner}>
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const styles = {
  wrapper: {
    height: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: '4rem',
    height: '4rem',
  },
};
