import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNotification } from '../hooks/useNotification';

const Contact = () => {
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      success('Message sent successfully! We will contact you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <h1 className="fw-bold mb-4 text-center">Contact Us</h1>
          <p className="text-center text-muted mb-5">
            Have questions or feedback? We'd love to hear from you. Get in touch with our team.
          </p>

          <Card className="shadow-lg">
            <Card.Body className="p-5">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message"
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={4} className="mb-4 text-center">
          <i className="bi bi-envelope text-primary display-4 mb-3"></i>
          <h5>Email</h5>
          <p className="text-muted">support@nutrition-assistant.com</p>
        </Col>
        <Col md={4} className="mb-4 text-center">
          <i className="bi bi-telephone text-primary display-4 mb-3"></i>
          <h5>Phone</h5>
          <p className="text-muted">+1 (555) 123-4567</p>
        </Col>
        <Col md={4} className="mb-4 text-center">
          <i className="bi bi-geo-alt text-primary display-4 mb-3"></i>
          <h5>Address</h5>
          <p className="text-muted">123 Health St, Wellness City, HC 12345</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
