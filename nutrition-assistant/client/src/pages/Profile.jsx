import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user } = useAuth();
  const { success } = useNotification();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold">My Profile</h2>

      <Row>
        <Col lg={4} className="mb-3">
          <Card className="shadow-sm text-center">
            <Card.Body>
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="rounded-circle mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="rounded-circle mb-3 d-inline-block bg-light"
                  style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <i className="bi bi-person" style={{ fontSize: '60px', color: '#999' }}></i>
                </div>
              )}
              <h4>{user?.name}</h4>
              <p className="text-muted">{user?.email}</p>
              <Badge bg={user?.role === 'admin' ? 'danger' : user?.role === 'dietitian' ? 'info' : 'success'}>
                {user?.role}
              </Badge>
            </Card.Body>
          </Card>

          <Button variant="primary" href="/edit-profile" className="w-100 mt-3">
            <i className="bi bi-pencil me-2"></i>Edit Profile
          </Button>
        </Col>

        <Col lg={8}>
          <Card className="shadow-sm mb-3">
            <Card.Header className="bg-light">
              <h6 className="mb-0 fw-bold">Personal Information</h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <strong>Name</strong>
                  <p className="text-muted">{user?.name}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Email</strong>
                  <p className="text-muted">{user?.email}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Phone</strong>
                  <p className="text-muted">{user?.phone || 'Not provided'}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Gender</strong>
                  <p className="text-muted capitalize">{user?.gender || 'Not provided'}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Age</strong>
                  <p className="text-muted">{user?.age || 'Not provided'} years</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Activity Level</strong>
                  <p className="text-muted capitalize">{user?.activityLevel || 'Not provided'}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-3">
            <Card.Header className="bg-light">
              <h6 className="mb-0 fw-bold">Physical Metrics</h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <strong>Height</strong>
                  <p className="text-muted">{user?.height ? `${user.height} cm` : 'Not provided'}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Weight</strong>
                  <p className="text-muted">{user?.weight ? `${user.weight} kg` : 'Not provided'}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>BMI</strong>
                  <p className="text-muted">{user?.BMI || 'Not calculated'}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {user?.allergies?.length > 0 && (
            <Card className="shadow-sm mb-3">
              <Card.Header className="bg-light">
                <h6 className="mb-0 fw-bold">Allergies</h6>
              </Card.Header>
              <Card.Body>
                <div>
                  {user.allergies.map((allergy, idx) => (
                    <Badge key={idx} bg="warning" className="me-2 mb-2">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {user?.goals?.length > 0 && (
            <Card className="shadow-sm">
              <Card.Header className="bg-light">
                <h6 className="mb-0 fw-bold">Goals</h6>
              </Card.Header>
              <Card.Body>
                <div>
                  {user.goals.map((goal, idx) => (
                    <Badge key={idx} bg="info" className="me-2 mb-2">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
