import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Spinner, Alert } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaArrowLeft } from 'react-icons/fa';
import { DataContext } from '../ContextAPI/ContextNavbar';
import Navbar from '../Dashboard/Navbar';
import Footer from '../Dashboard/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';
import { ProfileInfor } from '../apis/authAPI';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { categories, movieTypes, nations, statuses, statusMap } = useContext(DataContext);
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        age: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const username = Cookies.get('username');

                // const response = await axios.post(
                //     'http://localhost:5285/api/account/userinfor',
                //     { userName: username },
                //     {
                //         headers: {
                //             'Authorization': `Bearer ${token}`,
                //             'Content-Type': 'application/json'
                //         }
                //     }
                // );
                const payload = {userName: username}
                const response = await ProfileInfor(payload);

                setUserInfo(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user info:', error);
                setError('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Đang tải...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <div>
            <Navbar categories={categories} movieTypes={movieTypes} nations={nations} statuses={statuses} statusMap={statusMap} />
            <Container className="py-5">
                <Row className="justify-content-center mb-3">
                    <Col md={8} lg={6}>
                        <div className="mb-3">
                            <Link to="/" className="btn btn-outline-primary d-flex align-items-center">
                                <FaArrowLeft className="me-2" />
                                Quay lại trang chủ
                            </Link>
                        </div>
                    </Col>
                </Row>            
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                    <Card className="shadow">
                        <Card.Header className="bg-primary text-white text-center py-3">
                            <h3 className="mb-0">Thông tin tài khoản</h3>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Form>
                                <Form.Group className="mb-4">
                                    <Form.Label className="d-flex align-items-center">
                                        <FaUser className="me-2" />
                                        Tên người dùng
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={userInfo.userName || ''}
                                        readOnly
                                        className="bg-light"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="d-flex align-items-center">
                                        <FaEnvelope className="me-2" />
                                        Email
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={userInfo.email || ''}
                                        readOnly
                                        className="bg-light"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="d-flex align-items-center">
                                        <FaPhone className="me-2" />
                                        Số điện thoại
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={userInfo.phoneNumber || ''}
                                        readOnly
                                        className="bg-light"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="d-flex align-items-center">
                                        <FaBirthdayCake className="me-2" />
                                        Tuổi
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={userInfo.age || ''}
                                        readOnly
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Form>
                        </Card.Body>
                        <Card.Footer className="text-center py-3 bg-light">
                            <small className="text-muted">
                                Thông tin được cập nhật lần cuối: {new Date().toLocaleDateString()}
                            </small>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
        <Footer/>
        </div>
    );
};

export default Profile;