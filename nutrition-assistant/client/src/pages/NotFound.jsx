import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="text-muted mb-4">Sorry, the page you're looking for doesn't exist.</p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </div>
    </Container>
  );
};

export default NotFound;
