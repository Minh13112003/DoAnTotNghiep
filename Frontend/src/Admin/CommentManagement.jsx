import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaTrash, FaEdit, FaEye, FaAngleLeft, FaAngleRight, FaFilm, FaList, FaUsers, FaFlag } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { DataContext } from '../ContextAPI/ContextNavbar';
import Navbar from '../Dashboard/Navbar';
import Footer from '../Dashboard/Footer';
import './AdminStyles.css';

const CommentManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { categories, movieTypes, nations, statuses, statusMap } = React.useContext(DataContext);
    const [comments, setComments] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [filter, setFilter] = useState('all'); // all, reported, deleted

    // Thêm định nghĩa sidebarMenus
    const sidebarMenus = [
        {
            title: 'Quản lý Phim',
            icon: <FaFilm />,
            items: [
                {
                    title: 'Danh sách phim',
                    link: '/quan-ly/phim/danh-sach'
                },
                {
                    title: 'Thêm phim mới',
                    link: '/quan-ly/phim/them-moi'
                }
            ]
        },
        {
            title: 'Quản lý Thể loại',
            icon: <FaList />,
            items: [
                {
                    title: 'Danh sách thể loại',
                    link: '/quan-ly/the-loai/danh-sach'
                },
                {
                    title: 'Thêm thể loại',
                    link: '/quan-ly/the-loai/them-moi'
                }
            ]
        },
        {
            title: 'Quản lý Tài khoản',
            icon: <FaUsers />,
            items: [
                {
                    title: 'Danh sách người dùng',
                    link: '/quan-ly/tai-khoan/danh-sach'
                },
                {
                    title: 'Thêm người dùng',
                    link: '/quan-ly/tai-khoan/them-moi'
                }
            ]
        },
        {
            title: 'Quản lý Bình luận',
            icon: <FaList />,
            items: [
                {
                    title: 'Danh sách bình luận',
                    link: '/quan-ly/binh-luan'
                },
                {
                    title: 'Bình luận bị báo cáo',
                    link: '/quan-ly/binh-luan/bao-cao'
                }
            ]
        },
        {
            title: 'Quản lý Góp ý',
            icon: <FaList />,
            items: [
                {
                    title: 'Danh sách góp ý',
                    link: '/quan-ly/gop-y'
                }
            ]
        }
    ];

    useEffect(() => {
        fetchComments();
    }, [filter]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            let url = 'http://localhost:5285/api/comments/admin';
            if (filter === 'reported') {
                url = 'http://localhost:5285/api/comments/admin/reported';
            } else if (filter === 'deleted') {
                url = 'http://localhost:5285/api/comments/admin/deleted';
            }
            
            const token = localStorage.getItem('userToken');
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setComments(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setLoading(false);
        }
    };

    const handleViewComment = (comment) => {
        setSelectedComment(comment);
        setShowModal(true);
    };

    const handleDeleteComment = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa bình luận này?')) {
            try {
                const token = localStorage.getItem('userToken');
                await axios.delete(`http://localhost:5285/api/comments/admin/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchComments();
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    const handleRestoreComment = async (id) => {
        try {
            const token = localStorage.getItem('userToken');
            await axios.post(`http://localhost:5285/api/comments/admin/${id}/restore`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchComments();
        } catch (error) {
            console.error('Error restoring comment:', error);
        }
    };

    const handleReply = async () => {
        if (!replyText.trim() || !selectedComment) return;

        try {
            const token = localStorage.getItem('userToken');
            await axios.post(`http://localhost:5285/api/comments/admin/${selectedComment.id}/reply`, {
                content: replyText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setReplyText('');
            setShowModal(false);
            fetchComments();
        } catch (error) {
            console.error('Error replying to comment:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
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

            <div className="admin-layout">
                {/* Sidebar */}
                <div className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                    <div className="sidebar-header">
                        <Button 
                            variant="link" 
                            className="text-white text-decoration-none mb-3"
                            onClick={() => navigate('/quan-ly')}
                        >
                            <FaAngleLeft className="me-2" />
                            Quay lại Dashboard
                        </Button>
                    </div>
                    {sidebarMenus.map((menu, index) => (
                        <div key={index} className="sidebar-menu-item">
                            <div className="sidebar-menu-header">
                                {menu.icon}
                                <span>{menu.title}</span>
                            </div>
                            <div className="sidebar-submenu">
                                {menu.items.map((item, idx) => (
                                    <Link 
                                        key={idx}
                                        to={item.link}
                                        className={`sidebar-submenu-item ${location.pathname === item.link ? 'active' : ''}`}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Toggle Button */}
                <Button
                    variant="dark"
                    className="sidebar-toggle-fixed"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <FaAngleLeft /> : <FaAngleRight />}
                </Button>

                {/* Main Content */}
                <div className={`admin-content ${isSidebarOpen ? '' : 'expanded'}`}>
                    <Container fluid>
                        <h2 className="mb-4">Quản lý Bình luận</h2>
                        
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="btn-group">
                                <Button 
                                    variant={filter === 'all' ? 'primary' : 'outline-primary'}
                                    onClick={() => setFilter('all')}
                                >
                                    Tất cả
                                </Button>
                                <Button 
                                    variant={filter === 'reported' ? 'primary' : 'outline-primary'}
                                    onClick={() => setFilter('reported')}
                                >
                                    <FaFlag className="me-1" /> Bị báo cáo
                                </Button>
                                <Button 
                                    variant={filter === 'deleted' ? 'primary' : 'outline-primary'}
                                    onClick={() => setFilter('deleted')}
                                >
                                    Đã xóa
                                </Button>
                            </div>
                            
                            <Button 
                                variant="success" 
                                onClick={() => fetchComments()}
                            >
                                Làm mới
                            </Button>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Đang tải...</span>
                                </div>
                            </div>
                        ) : (
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Người dùng</th>
                                        <th>Nội dung</th>
                                        <th>Phim</th>
                                        <th>Thời gian</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comments.length > 0 ? (
                                        comments.map(comment => (
                                            <tr key={comment.id}>
                                                <td>{comment.id}</td>
                                                <td>{comment.userName}</td>
                                                <td>
                                                    {comment.content.length > 50 
                                                        ? `${comment.content.substring(0, 50)}...` 
                                                        : comment.content}
                                                </td>
                                                <td>{comment.movieTitle}</td>
                                                <td>{formatDate(comment.createdAt)}</td>
                                                <td>
                                                    {comment.isDeleted && (
                                                        <Badge bg="danger">Đã xóa</Badge>
                                                    )}
                                                    {comment.reportCount > 0 && (
                                                        <Badge bg="warning" className="ms-1">
                                                            <FaFlag className="me-1" /> {comment.reportCount}
                                                        </Badge>
                                                    )}
                                                    {!comment.isDeleted && comment.reportCount === 0 && (
                                                        <Badge bg="success">Bình thường</Badge>
                                                    )}
                                                </td>
                                                <td>
                                                    <Button 
                                                        variant="info" 
                                                        size="sm" 
                                                        className="me-2"
                                                        onClick={() => handleViewComment(comment)}
                                                    >
                                                        <FaEye />
                                                    </Button>
                                                    
                                                    {comment.isDeleted ? (
                                                        <Button 
                                                            variant="success" 
                                                            size="sm"
                                                            onClick={() => handleRestoreComment(comment.id)}
                                                        >
                                                            Khôi phục
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm"
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">Không có bình luận nào</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        )}
                    </Container>
                </div>
            </div>

            {/* Modal Chi tiết bình luận */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết bình luận</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedComment && (
                        <>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <p><strong>Người dùng:</strong> {selectedComment.userName}</p>
                                    <p><strong>Thời gian:</strong> {formatDate(selectedComment.createdAt)}</p>
                                </Col>
                                <Col md={6}>
                                    <p><strong>Phim:</strong> {selectedComment.movieTitle}</p>
                                    <p>
                                        <strong>Trạng thái:</strong>{' '}
                                        {selectedComment.isDeleted ? (
                                            <Badge bg="danger">Đã xóa</Badge>
                                        ) : (
                                            <Badge bg="success">Bình thường</Badge>
                                        )}
                                        {selectedComment.reportCount > 0 && (
                                            <Badge bg="warning" className="ms-2">
                                                <FaFlag className="me-1" /> {selectedComment.reportCount} báo cáo
                                            </Badge>
                                        )}
                                    </p>
                                </Col>
                            </Row>

                            <div className="p-3 bg-light rounded mb-4">
                                <h6>Nội dung bình luận:</h6>
                                <p className="mb-0">{selectedComment.content}</p>
                            </div>

                            {selectedComment.replies && selectedComment.replies.length > 0 && (
                                <div className="mb-4">
                                    <h6>Các phản hồi:</h6>
                                    {selectedComment.replies.map((reply, index) => (
                                        <div key={index} className="p-2 border-start border-3 ps-3 mb-2">
                                            <div className="d-flex justify-content-between">
                                                <strong>{reply.userName}</strong>
                                                <small>{formatDate(reply.createdAt)}</small>
                                            </div>
                                            <p className="mb-0">{reply.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phản hồi bình luận này:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Nhập nội dung phản hồi..."
                                    />
                                </Form.Group>
                            </Form>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleReply} disabled={!replyText.trim()}>
                        Gửi phản hồi
                    </Button>
                    {selectedComment && !selectedComment.isDeleted && (
                        <Button 
                            variant="danger" 
                            onClick={() => {
                                handleDeleteComment(selectedComment.id);
                                setShowModal(false);
                            }}
                        >
                            Xóa bình luận
                        </Button>
                    )}
                    {selectedComment && selectedComment.isDeleted && (
                        <Button 
                            variant="success" 
                            onClick={() => {
                                handleRestoreComment(selectedComment.id);
                                setShowModal(false);
                            }}
                        >
                            Khôi phục bình luận
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            <Footer />
        </div>
    );
};

export default CommentManagement;