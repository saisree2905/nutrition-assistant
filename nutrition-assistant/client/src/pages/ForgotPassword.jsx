import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await forgotPassword(email);
      setSubmitted(true);
      success('Password reset email sent!');
    } catch (err) {
      const message = err.message || 'Failed to send reset email';
      setErrorMsg(message);
      error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body className="p-5">
          <h2 className="text-center mb-4 fw-bold">Reset Password</h2>

          {submitted ? (
            <Alert variant="success">
              Check your email for password reset instructions
            </Alert>
          ) : (
            <>
              {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

              <p className="text-muted mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </Form>
            </>
          )}

          <div className="text-center">
            <Link to="/login" className="text-decoration-none">
              Back to Login
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
