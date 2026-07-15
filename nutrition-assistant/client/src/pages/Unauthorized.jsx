import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-danger">403</h1>
        <h2 className="mb-4">Access Denied</h2>
        <p className="text-muted mb-4">You don't have permission to access this page.</p>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    </Container>
  );
};

export default Unauthorized;
