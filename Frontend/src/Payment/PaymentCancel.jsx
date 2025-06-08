import React, { useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Payment.css';

const PaymentCancel = () => {
    const navigate = useNavigate();

    useEffect(() => {
        toast.error('Thanh toán đã bị hủy.');
    }, []);

    return (
        <Container className="py-5">
            <Card className="text-center p-5">
                <FaTimesCircle className="text-danger mb-4" style={{ fontSize: '5rem' }} />
                <h2 className="mb-4">Thanh toán đã bị hủy</h2>
                <p className="lead mb-4">
                    Bạn đã hủy quá trình thanh toán. Nếu bạn gặp vấn đề trong quá trình thanh toán, vui lòng liên hệ với chúng tôi để được hỗ trợ.
                </p>
                <div className="d-flex justify-content-center gap-3">
                    <Button 
                        variant="primary" 
                        size="lg"
                        onClick={() => navigate('/thanh-toan')}
                    >
                        Thử lại
                    </Button>
                    <Button 
                        variant="outline-secondary" 
                        size="lg"
                        onClick={() => navigate('/')}
                    >
                        Về trang chủ
                    </Button>
                </div>
            </Card>
        </Container>
    );
};

export default PaymentCancel; 