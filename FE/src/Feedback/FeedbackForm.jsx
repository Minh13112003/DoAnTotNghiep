import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { FaPaperPlane, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import Navbar from '../Dashboard/Navbar';
import Footer from '../Dashboard/Footer';
import { DataContext } from '../ContextAPI/ContextNavbar';
import axios from 'axios';
import './FeedbackForm.css';

const FeedbackForm = () => {
    const { categories, movieTypes, nations, statuses, statusMap } = React.useContext(DataContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'suggestion' // mặc định là góp ý
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState({ status: '', message: '' });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        const user = JSON.parse(localStorage.getItem('userData'));
        
        if (token && user) {
            setIsLoggedIn(true);
            setUserData(user);
            setFormData(prev => ({
                ...prev,
                name: user.userName || '',
                email: user.email || ''
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitResult({ status: '', message: '' });

        try {
            const token = localStorage.getItem('userToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            await axios.post('http://localhost:5285/api/feedback', formData, { headers });
            
            setSubmitResult({
                status: 'success',
                message: 'Cảm ơn bạn đã gửi góp ý! Chúng tôi sẽ xem xét và phản hồi sớm nhất có thể.'
            });
            
            // Reset form sau khi gửi thành công
            setFormData({
                name: isLoggedIn ? userData.userName : '',
                email: isLoggedIn ? userData.email : '',
                subject: '',
                message: '',
                type: 'suggestion'
            });
        } catch (error) {
            console.error('Lỗi khi gửi góp ý:', error);
            setSubmitResult({
                status: 'error',
                message: 'Có lỗi xảy ra khi gửi góp ý. Vui lòng thử lại sau.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Navbar 
                categories={categories} 
                movieTypes={movieTypes} 
                nations={nations} 
                statuses={statuses} 
                statusMap={statusMap} 
            />
            
            <Container className="py-5">
                <h1 className="text-center mb-5">Góp ý và Phản hồi</h1>
                
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <Card className="shadow-sm">
                            <Card.Body className="p-4">
                                {submitResult.status && (
                                    <Alert 
                                        variant={submitResult.status === 'success' ? 'success' : 'danger'}
                                        className="d-flex align-items-center"
                                    >
                                        {submitResult.status === 'success' ? 
                                            <FaCheckCircle className="me-2" /> : 
                                            <FaExclamationTriangle className="me-2" />
                                        }
                                        {submitResult.message}
                                    </Alert>
                                )}
                                
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Loại phản hồi</Form.Label>
                                        <Form.Select 
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="suggestion">Góp ý cải thiện</option>
                                            <option value="bug">Báo cáo lỗi</option>
                                            <option value="content">Yêu cầu nội dung</option>
                                            <option value="other">Khác</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label>Họ tên</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={isLoggedIn}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={isLoggedIn}
                                                />
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Tiêu đề</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Nội dung</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={5}
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            placeholder="Vui lòng mô tả chi tiết góp ý của bạn..."
                                        />
                                    </Form.Group>

                                    <div className="d-grid">
                                        <Button 
                                            type="submit" 
                                            variant="primary" 
                                            size="lg"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Đang gửi...
                                                </>
                                            ) : (
                                                <>
                                                    <FaPaperPlane className="me-2" />
                                                    Gửi góp ý
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                        
                        <div className="text-center mt-4">
                            <p className="text-muted">
                                Mọi góp ý của bạn đều được chúng tôi trân trọng và xem xét cẩn thận.
                                <br />
                                Chúng tôi sẽ phản hồi qua email trong thời gian sớm nhất.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
            
            <Footer />
        </div>
    );
};

export default FeedbackForm;
