import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const LoadingSpinner = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="text-center">
        <Spinner animation="border" role="status" variant="primary" className="mb-3">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading...</p>
      </div>
    </Container>
  );
};

export default LoadingSpinner;
