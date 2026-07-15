import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNotification } from '../hooks/useNotification';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const { error } = useNotification();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      setStats(response.data.data);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold">Admin Dashboard</h2>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <i className="bi bi-people text-primary display-4 mb-2"></i>
              <h6 className="text-muted">Total Users</h6>
              <p className="display-6 fw-bold">{stats?.totalUsers || 0}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <i className="bi bi-person-check text-success display-4 mb-2"></i>
              <h6 className="text-muted">Approved Dietitians</h6>
              <p className="display-6 fw-bold">{stats?.approvedDietitians || 0}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <i className="bi bi-person-x text-warning display-4 mb-2"></i>
              <h6 className="text-muted">Pending Approvals</h6>
              <p className="display-6 fw-bold">{stats?.pendingDietitians || 0}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <i className="bi bi-egg text-info display-4 mb-2"></i>
              <h6 className="text-muted">Meal Plans</h6>
              <p className="display-6 fw-bold">{stats?.totalMealPlans || 0}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Users */}
      <Row>
        <Col lg={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h6 className="mb-0 fw-bold">Recent Users</h6>
            </Card.Header>
            <Card.Body>
              {stats?.recentUsers?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentUsers.map(user => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge bg-${
                              user.role === 'admin' ? 'danger' :
                              user.role === 'dietitian' ? 'info' : 'success'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center py-4">No users yet</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Row className="mt-4">
        <Col>
          <Button variant="primary" href="/admin/users" className="me-2">
            <i className="bi bi-people me-2"></i>Manage Users
          </Button>
          <Button variant="info" href="/admin/dietitians">
            <i className="bi bi-person-check me-2"></i>Approve Dietitians
          </Button>
          <Button variant="success" href="/analytics">
            <i className="bi bi-bar-chart me-2"></i>View Analytics
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
