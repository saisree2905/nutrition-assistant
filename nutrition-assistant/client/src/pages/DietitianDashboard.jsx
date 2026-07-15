import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNotification } from '../hooks/useNotification';
import { clientService } from '../services/clientService';
import LoadingSpinner from '../components/LoadingSpinner';

const DietitianDashboard = () => {
  const { error } = useNotification();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await clientService.getAllClients(1, 10);
      setClients(response.data.data);
      setStats({
        totalClients: response.data.pagination.total,
        activeClients: response.data.data.filter(c => c.isActive).length,
      });
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold">Dietitian Dashboard</h2>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <i className="bi bi-people text-primary display-4 mb-2"></i>
              <h6 className="text-muted">Total Clients</h6>
              <p className="display-6 fw-bold">{stats.totalClients}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <i className="bi bi-check-circle text-success display-4 mb-2"></i>
              <h6 className="text-muted">Active Clients</h6>
              <p className="display-6 fw-bold">{stats.activeClients}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Clients */}
      <Row>
        <Col lg={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h6 className="mb-0 fw-bold">My Clients</h6>
            </Card.Header>
            <Card.Body>
              {clients.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Weight</th>
                        <th>BMI</th>
                        <th>Target Calories</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map(client => (
                        <tr key={client._id}>
                          <td>{client.userId?.name}</td>
                          <td>{client.userId?.email}</td>
                          <td>{client.userId?.weight} kg</td>
                          <td>{client.userId?.BMI}</td>
                          <td>{client.targetCalories} kcal</td>
                          <td>
                            <Button
                              variant="sm"
                              size="sm"
                              href={`/clients/${client._id}`}
                              className="me-2"
                            >
                              View
                            </Button>
                            <Button
                              variant="success"
                              size="sm"
                              href={`/meal-plans?clientId=${client._id}`}
                            >
                              Meal Plans
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center py-4">No clients yet</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Row className="mt-4">
        <Col>
          <Button variant="primary" href="/clients" className="me-2">
            <i className="bi bi-plus me-2"></i>Manage Clients
          </Button>
          <Button variant="success" href="/meal-plans">
            <i className="bi bi-egg me-2"></i>View Meal Plans
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default DietitianDashboard;
