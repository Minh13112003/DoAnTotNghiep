import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft, FaFilm, FaList, FaUsers, FaBars, FaTimes, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { DataContext } from '../ContextAPI/ContextNavbar';
import Navbar from '../Dashboard/Navbar';
import Footer from '../Dashboard/Footer';
import './AdminStyles.css';

const MovieManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { categories, movieTypes, nations, statuses, statusMap } = useContext(DataContext);
    const [movies, setMovies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        nation: '',
        typeMovie: '',
        nameCategories: '',
        numberOfMovie: 1,
        duration: 0,
        quality: '',
        language: '',
        urlMovie: '',
        image: '',
        backgroundImage: '',
        status: ''
    });

    // Thêm định nghĩa sidebarMenus vào đây
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
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await axios.get('http://localhost:5285/api/movie/ShowAllMovieCategory');
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const handleShowModal = (movie = null) => {
        if (movie) {
            setSelectedMovie(movie);
            setFormData(movie);
        } else {
            setSelectedMovie(null);
            setFormData({
                title: '',
                description: '',
                nation: '',
                typeMovie: '',
                nameCategories: '',
                numberOfMovie: 1,
                duration: 0,
                quality: '',
                language: '',
                urlMovie: '',
                image: '',
                backgroundImage: '',
                status: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedMovie) {
                await axios.put(`http://localhost:5285/api/movie/${selectedMovie.id}`, formData);
            } else {
                await axios.post('http://localhost:5285/api/movie', formData);
            }
            fetchMovies();
            setShowModal(false);
        } catch (error) {
            console.error('Error saving movie:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa phim này?')) {
            try {
                await axios.delete(`http://localhost:5285/api/movie/${id}`);
                fetchMovies();
            } catch (error) {
                console.error('Error deleting movie:', error);
            }
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

            <div className="admin-layout">
                {/* Sidebar */}
                <div className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                    {/* Sidebar content */}
                    <div className="sidebar-header">
                        <Button 
                            variant="link" 
                            className="text-white text-decoration-none mb-3"
                            onClick={() => navigate('/quan-ly')}
                        >
                            <FaArrowLeft className="me-2" />
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

                {/* Fixed toggle button */}
                <Button
                    variant="dark"
                    className="sidebar-toggle-fixed"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <FaAngleLeft /> : <FaAngleRight />}
                </Button>

                {/* Content area */}
                <div className={`admin-content ${isSidebarOpen ? '' : 'expanded'}`}>
                    <Container fluid>
                        <div className="content-header d-flex justify-content-between align-items-center mb-4">
                            <h2>Quản lý Phim</h2>
                            <Button variant="primary" onClick={() => handleShowModal()}>
                                <FaPlus className="me-2" />
                                Thêm Phim Mới
                            </Button>
                        </div>

                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Hình ảnh</th>
                                    <th>Tên phim</th>
                                    <th>Thể loại</th>
                                    <th>Thời lượng</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movies.map(movie => (
                                    <tr key={movie.id}>
                                        <td>
                                            <img 
                                                src={movie.image} 
                                                alt={movie.title} 
                                                style={{ width: '50px', height: '75px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td>{movie.title}</td>
                                        <td>{movie.nameCategories}</td>
                                        <td>{movie.duration} phút</td>
                                        <td>{movie.status}</td>
                                        <td>
                                            <Button 
                                                variant="warning" 
                                                size="sm" 
                                                className="me-2"
                                                onClick={() => handleShowModal(movie)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button 
                                                variant="danger" 
                                                size="sm"
                                                onClick={() => handleDelete(movie.id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {selectedMovie ? 'Chỉnh sửa Phim' : 'Thêm Phim Mới'}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Tên phim</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Thể loại</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={formData.nameCategories}
                                                    onChange={(e) => setFormData({...formData, nameCategories: e.target.value})}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    {/* Thêm các trường form khác tương tự */}
                                    <div className="text-end mt-3">
                                        <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                                            Hủy
                                        </Button>
                                        <Button variant="primary" type="submit">
                                            {selectedMovie ? 'Cập nhật' : 'Thêm mới'}
                                        </Button>
                                    </div>
                                </Form>
                            </Modal.Body>
                        </Modal>
                    </Container>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default MovieManagement; 