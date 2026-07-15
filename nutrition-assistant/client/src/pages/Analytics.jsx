import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNotification } from '../hooks/useNotification';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressChart from '../components/ProgressChart';

const Analytics = () => {
  const { error } = useNotification();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics/platform');
      setAnalytics(response.data.data);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const userStats = analytics?.userStats || [];
  const mealPlanStats = analytics?.mealPlanStats || {};
  const progressStats = analytics?.progressStats || {};

  const userChartData = {
    labels: userStats.map(u => u._id) || [],
    datasets: [{
      label: 'User Count',
      data: userStats.map(u => u.count) || [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    }],
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold">Platform Analytics</h2>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h6 className="text-muted">Total Meal Plans</h6>
              <p className="display-6 fw-bold">{mealPlanStats.total || 0}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h6 className="text-muted">Avg Calories/Plan</h6>
              <p className="display-6 fw-bold">{Math.round(mealPlanStats.avgCalories) || 0}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h6 className="text-muted">Total Progress Records</h6>
              <p className="display-6 fw-bold">{progressStats.total || 0}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h6 className="text-muted">Avg Adherence</h6>
              <p className="display-6 fw-bold">{Math.round(progressStats.avgAdherence) || 0}%</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row>
        <Col lg={12}>
          <ProgressChart
            data={userChartData}
            type="pie"
            title="User Distribution"
            height={300}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;
