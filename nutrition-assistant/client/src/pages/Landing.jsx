import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-light py-5">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">
                Transform Your Nutrition Journey
              </h1>
              <p className="lead mb-4 text-muted">
                Track your meals, monitor your progress, and achieve your health goals with personalized guidance from nutrition experts.
              </p>
              <div className="d-flex gap-3">
                {!isAuthenticated ? (
                  <>
                    <Button variant="primary" size="lg" onClick={() => navigate('/register')}>
                      Get Started
                    </Button>
                    <Button variant="outline-primary" size="lg" onClick={() => navigate('/login')}>
                      Sign In
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" size="lg" onClick={() => navigate('/dashboard')}>
                    Go to Dashboard
                  </Button>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23e9ecef'/%3E%3Ccircle cx='200' cy='200' r='100' fill='%234CAF50'/%3E%3Ctext x='200' y='210' font-size='40' font-weight='bold' text-anchor='middle' fill='white'%3E🥗%3C/text%3E%3C/svg%3E"
                alt="Nutrition"
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Why Choose Nutrition Assistant?</h2>
          <Row>
            <Col md={4} className="mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body text-center">
                  <i className="bi bi-egg text-success display-4 mb-3"></i>
                  <h5 className="card-title">Meal Planning</h5>
                  <p className="card-text">Get personalized meal plans tailored to your dietary needs and preferences.</p>
                </div>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body text-center">
                  <i className="bi bi-graph-up text-primary display-4 mb-3"></i>
                  <h5 className="card-title">Progress Tracking</h5>
                  <p className="card-text">Monitor your progress with detailed analytics and visual reports.</p>
                </div>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body text-center">
                  <i className="bi bi-people text-warning display-4 mb-3"></i>
                  <h5 className="card-title">Expert Guidance</h5>
                  <p className="card-text">Work with certified dietitians who create customized nutrition plans.</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-5">
        <Container className="text-center">
          <h2 className="mb-4">Ready to Start Your Journey?</h2>
          {!isAuthenticated && (
            <Button variant="light" size="lg" onClick={() => navigate('/register')}>
              Sign Up Today
            </Button>
          )}
        </Container>
      </section>
    </div>
  );
};

export default Landing;
