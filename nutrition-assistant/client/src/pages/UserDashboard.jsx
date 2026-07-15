import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { userService } from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressChart from '../components/ProgressChart';

const UserDashboard = () => {
  const { user } = useAuth();
  const { error } = useNotification();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await userService.getUserStats();
      setStats(response.data.data);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const targets = stats?.targets || {};
  const todayProgress = stats?.todayProgress;
  const recommendations = stats?.recommendations || {};

  const chartData = {
    labels: stats?.recentProgress?.map(p => new Date(p.date).toLocaleDateString())?.reverse() || [],
    datasets: [
      {
        label: 'Calories Consumed',
        data: stats?.recentProgress?.map(p => p.caloriesConsumed)?.reverse() || [],
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
      },
      {
        label: 'Target Calories',
        data: Array(stats?.recentProgress?.length || 0).fill(targets.calories),
        borderColor: '#4CAF50',
        borderDash: [5, 5],
      },
    ],
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold">Welcome, {user?.name}!</h2>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <i className="bi bi-droplet text-primary display-4 mb-2"></i>
              <h6 className="text-muted">BMI</h6>
              <p className="display-6 fw-bold">{user?.BMI || 'N/A'}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <i className="bi bi-calendar-event text-success display-4 mb-2"></i>
              <h6 className="text-muted">Today's Calories</h6>
              <p className="display-6 fw-bold">{todayProgress?.caloriesConsumed || 0}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <i className="bi bi-trophy text-warning display-4 mb-2"></i>
              <h6 className="text-muted">Target</h6>
              <p className="display-6 fw-bold">{targets.calories || 'N/A'}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <i className="bi bi-percent text-info display-4 mb-2"></i>
              <h6 className="text-muted">Adherence</h6>
              <p className="display-6 fw-bold">{todayProgress?.adherencePercentage || 0}%</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Nutrition Details */}
      <Row className="mb-4">
        <Col lg={6} className="mb-3">
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h6 className="mb-0 fw-bold">Nutrition Targets</h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Protein</span>
                  <Badge bg="success">{targets.protein}g</Badge>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Carbs</span>
                  <Badge bg="info">{targets.carbs}g</Badge>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Fat</span>
                  <Badge bg="danger">{targets.fat}g</Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-3">
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h6 className="mb-0 fw-bold">Recommendations</h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <span className="text-muted">Daily Calorie Needs (TDEE):</span>
                <p className="fs-5 fw-bold">{recommendations.tdee || 'N/A'} kcal</p>
              </div>
              <div className="mb-3">
                <span className="text-muted">Basal Metabolic Rate (BMR):</span>
                <p className="fs-5 fw-bold">{recommendations.bmr || 'N/A'} kcal</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col lg={12} className="mb-3">
          <ProgressChart
            data={chartData}
            type="line"
            title="Weekly Calorie Intake"
            height={300}
          />
        </Col>
      </Row>

      {/* Action Buttons */}
      <Row>
        <Col className="mb-3">
          <Button variant="primary" href="/meal-plans" className="me-2">
            <i className="bi bi-egg me-2"></i>View Meal Plans
          </Button>
          <Button variant="success" href="/progress" className="me-2">
            <i className="bi bi-graph-up me-2"></i>Track Progress
          </Button>
          <Button variant="info" href="/profile">
            <i className="bi bi-person me-2"></i>Edit Profile
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;
