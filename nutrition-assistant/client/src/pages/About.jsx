import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const About = () => {
  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col lg={10} className="mx-auto">
          <h1 className="fw-bold mb-4">About Nutrition Assistant</h1>
          <p className="lead">
            Nutrition Assistant is a comprehensive platform designed to help individuals manage their nutrition and achieve their health goals with the support of certified dietitians.
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col lg={10} className="mx-auto">
          <h3 className="fw-bold mb-3">Our Mission</h3>
          <p>
            We believe that proper nutrition is the foundation of good health. Our mission is to make nutrition management accessible, personalized, and effective for everyone by combining modern technology with professional expertise.
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col lg={10} className="mx-auto">
          <h3 className="fw-bold mb-3">What We Offer</h3>
          <ul className="fs-5">
            <li className="mb-3">Personalized meal plans created by certified dietitians</li>
            <li className="mb-3">Real-time progress tracking with detailed analytics</li>
            <li className="mb-3">Comprehensive nutritional guidance</li>
            <li className="mb-3">Support from experienced nutrition professionals</li>
            <li className="mb-3">Community and motivation</li>
          </ul>
        </Col>
      </Row>

      <Row>
        <Col lg={10} className="mx-auto">
          <h3 className="fw-bold mb-3">Get Started Today</h3>
          <p>
            Join thousands of users who have transformed their nutrition and health. Start your journey with Nutrition Assistant today.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
