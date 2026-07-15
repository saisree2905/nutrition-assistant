import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { userService } from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    age: user?.age || '',
    height: user?.height || '',
    weight: user?.weight || '',
    activityLevel: user?.activityLevel || 'moderate',
    allergies: user?.allergies?.join(', ') || '',
    goals: user?.goals?.join(', ') || '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        height: formData.height ? parseInt(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
        goals: formData.goals ? formData.goals.split(',').map(g => g.trim()) : [],
      };

      const response = await userService.updateProfile(updateData);
      setUser(response.data.data);
      success('Profile updated successfully!');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile';
      setErrorMsg(message);
      error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <LoadingSpinner />;

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h4 className="mb-0 fw-bold">Edit Profile</h4>
            </Card.Header>
            <Card.Body>
              {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="1"
                        max="120"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Height (cm)</Form.Label>
                      <Form.Control
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        min="50"
                        max="300"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Weight (kg)</Form.Label>
                      <Form.Control
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        min="20"
                        max="500"
                        step="0.1"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Activity Level</Form.Label>
                      <Form.Select
                        name="activityLevel"
                        value={formData.activityLevel}
                        onChange={handleChange}
                      >
                        <option value="sedentary">Sedentary (Little to no exercise)</option>
                        <option value="light">Light (1-3 days/week)</option>
                        <option value="moderate">Moderate (3-5 days/week)</option>
                        <option value="active">Active (6-7 days/week)</option>
                        <option value="veryActive">Very Active (Intense training)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Allergies (comma separated)</Form.Label>
                      <Form.Control
                        type="text"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        placeholder="e.g., Peanuts, Milk, Shellfish"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Goals (comma separated)</Form.Label>
                      <Form.Control
                        type="text"
                        name="goals"
                        value={formData.goals}
                        onChange={handleChange}
                        placeholder="e.g., Weight loss, Muscle gain, Better energy"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="secondary"
                    href="/profile"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfile;
