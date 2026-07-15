import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Row, Col, Modal, Table } from 'react-bootstrap';
import { useNotification } from '../hooks/useNotification';
import { progressService } from '../services/progressService';
import { clientService } from '../services/clientService';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressChart from '../components/ProgressChart';

const Progress = () => {
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    weight: '',
    caloriesConsumed: '',
    waterIntake: '',
    exerciseMinutes: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchProgress();
      fetchStats();
    }
  }, [selectedClient, page]);

  const fetchClients = async () => {
    try {
      const response = await clientService.getAllClients(1, 100);
      setClients(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedClient(response.data.data[0]._id);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await progressService.getProgress({
        clientId: selectedClient,
        page,
        limit: 10,
      });
      setProgress(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load progress');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await progressService.getProgressStats(selectedClient, 30);
      setStats(response.data.data);
    } catch (err) {
      console.error('Failed to load stats');
    }
  };

  const handleCreate = () => {
    setFormData({
      weight: '',
      caloriesConsumed: '',
      waterIntake: '',
      exerciseMinutes: '',
      notes: '',
      date: new Date().toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.weight || !formData.caloriesConsumed) {
      error('Please fill required fields');
      return;
    }

    try {
      await progressService.createProgress({
        clientId: selectedClient,
        weight: parseFloat(formData.weight),
        caloriesConsumed: parseInt(formData.caloriesConsumed),
        waterIntake: parseFloat(formData.waterIntake) || 0,
        exerciseMinutes: parseInt(formData.exerciseMinutes) || 0,
        notes: formData.notes,
        date: formData.date,
      });
      success('Progress logged successfully');
      setShowModal(false);
      fetchProgress();
      fetchStats();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to log progress');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this progress record?')) {
      try {
        await progressService.deleteProgress(id);
        success('Progress deleted');
        fetchProgress();
        fetchStats();
      } catch (err) {
        error(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  const chartData = stats && {
    labels: stats.records?.map(r => new Date(r.date).toLocaleDateString())?.reverse() || [],
    datasets: [
      {
        label: 'Weight (kg)',
        data: stats.records?.map(r => r.weight)?.reverse() || [],
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        yAxisID: 'y',
      },
    ],
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Progress Tracking</h2>
        <Button variant="primary" onClick={handleCreate}>
          <i className="bi bi-plus me-2"></i>Log Progress
        </Button>
      </div>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Label>Select Client</Form.Label>
            <Form.Select
              value={selectedClient}
              onChange={(e) => {
                setSelectedClient(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Select a client</option>
              {clients.map(client => (
                <option key={client._id} value={client._id}>
                  {client.userId?.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      {selectedClient && stats && (
        <>
          {/* Stats Summary */}
          <Row className="mb-4">
            <Col md={6} lg={3} className="mb-3">
              <Card className="shadow-sm text-center">
                <Card.Body>
                  <h6 className="text-muted">Avg Calories</h6>
                  <p className="display-6 fw-bold">{stats.stats?.averageCalories || 0}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-3">
              <Card className="shadow-sm text-center">
                <Card.Body>
                  <h6 className="text-muted">Avg Adherence</h6>
                  <p className="display-6 fw-bold">{stats.stats?.averageAdherence || 0}%</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-3">
              <Card className="shadow-sm text-center">
                <Card.Body>
                  <h6 className="text-muted">Avg Water Intake</h6>
                  <p className="display-6 fw-bold">{stats.stats?.averageWaterIntake || 0}L</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-3">
              <Card className="shadow-sm text-center">
                <Card.Body>
                  <h6 className="text-muted">Weight Change</h6>
                  <p className="display-6 fw-bold">{stats.stats?.weightChange || 0} kg</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Chart */}
          {chartData && (
            <Row className="mb-4">
              <Col lg={12}>
                <ProgressChart
                  data={chartData}
                  type="line"
                  title="Weight Progress (30 days)"
                  height={300}
                />
              </Col>
            </Row>
          )}

          {/* Progress Records */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h6 className="mb-0 fw-bold">Progress Records</h6>
            </Card.Header>
            {progress.length > 0 ? (
              <>
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Weight</th>
                        <th>Calories</th>
                        <th>Water</th>
                        <th>Exercise</th>
                        <th>Adherence</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {progress.map(record => (
                        <tr key={record._id}>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>{record.weight} kg</td>
                          <td>{record.caloriesConsumed}</td>
                          <td>{record.waterIntake} L</td>
                          <td>{record.exerciseMinutes} min</td>
                          <td>
                            <span className={`badge bg-${record.adherencePercentage >= 90 ? 'success' : record.adherencePercentage >= 70 ? 'warning' : 'danger'}`}>
                              {record.adherencePercentage}%
                            </span>
                          </td>
                          <td>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(record._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <Card.Footer>
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="outline-secondary"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                      >
                        Previous
                      </Button>
                      <span className="align-self-center">
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        variant="outline-secondary"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </Card.Footer>
                )}
              </>
            ) : (
              <Card.Body className="text-center py-5">
                <p className="text-muted">No progress records found</p>
              </Card.Body>
            )}
          </Card>
        </>
      )}

      {/* Log Progress Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Log Progress</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Weight (kg) *</Form.Label>
              <Form.Control
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                step="0.1"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Calories Consumed *</Form.Label>
              <Form.Control
                type="number"
                value={formData.caloriesConsumed}
                onChange={(e) => setFormData({...formData, caloriesConsumed: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Water Intake (liters)</Form.Label>
              <Form.Control
                type="number"
                value={formData.waterIntake}
                onChange={(e) => setFormData({...formData, waterIntake: e.target.value})}
                step="0.5"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Exercise (minutes)</Form.Label>
              <Form.Control
                type="number"
                value={formData.exerciseMinutes}
                onChange={(e) => setFormData({...formData, exerciseMinutes: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Log Progress
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Progress;
