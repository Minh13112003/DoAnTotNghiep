import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft, FaFilm, FaList, FaUsers, FaBars, FaTimes, FaAngleLeft, FaAngleRight, FaCheck, FaTimes as FaX } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { DataContext } from '../ContextAPI/ContextNavbar';
import Navbar from '../Dashboard/Navbar';
import Footer from '../Dashboard/Footer';
import './AdminStyles.css';
import { toast } from 'react-toastify';

const EpisodeManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { categories, movieTypes, nations, statuses, statusMap } = useContext(DataContext);
    const [episodeList, setEpisodeList] = useState([]);
    const [movieList, setMovieList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEpisode, setSelectedEpisode] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showBackgroundModal, setShowBackgroundModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedBackground, setSelectedBackground] = useState('');

    const [formData, setFormData] = useState({
        idLinkMovie: '',
        idMovie: '',
        episode: '',
        urlMovie: ''
    });

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
                    title: 'Danh sách tập phim',
                    link: '/quan-ly/phim/tap-phim'
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
            title: 'Quản lý Tập phim',
            icon: <FaFilm />,
            items: [
                {
                    title: 'Danh sách tập phim',
                    link: '/quan-ly/tap-phim/danh-sach'
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
        fetchEpisodes();
        fetchMovies();
    }, []);

    const fetchEpisodes = async () => {
        try {
            const response = await axios.get('http://localhost:5285/api/linkmovie/GetAllLinkMovie');
            // Sắp xếp dữ liệu
            const sortedData = response.data.sort((a, b) => {
                // So sánh tên phim trước
                if (a.title !== b.title) {
                    return a.title.localeCompare(b.title);
                }
                // Nếu cùng phim thì sắp xếp theo số tập
                return a.episode - b.episode;
            });
            setEpisodeList(sortedData);
        } catch (error) {
            console.error('Error fetching episodes:', error);
            toast.error('Không thể tải danh sách tập phim');
        }
    };

    const fetchMovies = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.get('http://localhost:5285/api/movie/ShowAllMovieCategory', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMovieList(response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
            toast.error('Không thể tải danh sách phim');
        }
    };

    const handleShowModal = (episode = null) => {
        if (episode) {
            setSelectedEpisode(episode);
            setFormData({
                idLinkMovie: episode.idLinkMovie,
                idMovie: episode.idMovie,
                episode: episode.episode,
                urlMovie: episode.urlMovie
            });
        } else {
            setSelectedEpisode(null);
            setFormData({
                idLinkMovie: '',
                idMovie: '',
                episode: '',
                urlMovie: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            if (selectedEpisode) {
                // Cập nhật tập phim
                await axios.put('http://localhost:5285/api/linkmovie/AddLinkMovie', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Cập nhật tập phim thành công!');
            } else {
                // Thêm tập phim mới
                await axios.post('http://localhost:5285/api/linkmovie/AddLinkMovie', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Thêm tập phim mới thành công!');
            }
            fetchEpisodes();
            setShowModal(false);
        } catch (error) {
            console.error('Error saving episode:', error);
            toast.error(selectedEpisode ? 'Cập nhật tập phim thất bại!' : 'Thêm tập phim mới thất bại!');
        }
    };

    const handleDelete = async (idLinkMovie) => {
        if (window.confirm('Bạn có chắc muốn xóa tập phim này?')) {
            try {
                const token = localStorage.getItem('userToken');
                await axios.delete(`http://localhost:5285/api/linkmovie/DeleteLinkMovie/${idLinkMovie}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                fetchEpisodes();
                toast.success('Xóa tập phim thành công!');
            } catch (error) {
                console.error('Error deleting episode:', error);
                toast.error('Xóa tập phim thất bại!');
            }
        }
    };

    const getMovieTitle = (idMovie) => {
        const movie = movieList.find(m => m.id === idMovie);
        return movie ? movie.title : 'Không xác định';
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = episodeList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(episodeList.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        let items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item 
                    key={number} 
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }
        return items;
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setShowImageModal(true);
    };

    const handleBackgroundClick = (background) => {
        setSelectedBackground(background);
        setShowBackgroundModal(true);
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
                            <h2>Quản lý Tập phim</h2>
                            <Button variant="primary" onClick={() => handleShowModal()}>
                                <FaPlus className="me-2" />
                                Thêm Tập phim Mới
                            </Button>
                        </div>

                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Ảnh</th>
                                    <th>Ảnh nền</th>
                                    <th>Tên phim</th>
                                    <th>Tập</th>
                                    <th>Link phim</th>
                                    <th>Ngày tạo</th>
                                    
                                    <th style={{ width: '150px' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map(episode => (
                                    <tr key={episode.idLinkMovie}>
                                        <td>
                                            <img 
                                                src={episode.image} 
                                                alt={`${episode.title} - Tập ${episode.episode}`}
                                                style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                                onClick={() => handleImageClick(episode.image)}
                                            />
                                        </td>
                                        <td>
                                            <img 
                                                src={episode.backgroundImage} 
                                                alt={`${episode.title} - Tập ${episode.episode} - Background`}
                                                style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                                onClick={() => handleBackgroundClick(episode.backgroundImage)}
                                            />
                                        </td>
                                        <td>{episode.title}</td>
                                        <td>{episode.episode}</td>
                                        <td>
                                            <a href={episode.urlMovie} target="_blank" rel="noopener noreferrer">
                                                {episode.urlMovie}
                                            </a>
                                        </td>
                                        <td>{episode.createdAtString}</td>
                                        
                                        <td>
                                            <Button 
                                                variant="warning" 
                                                size="sm" 
                                                className="me-2"
                                                onClick={() => handleShowModal(episode)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button 
                                                variant="danger" 
                                                size="sm"
                                                onClick={() => handleDelete(episode.idLinkMovie)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <div className="d-flex justify-content-center mt-4">
                            <Pagination>
                                <Pagination.First 
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                />
                                <Pagination.Prev 
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                />
                                {renderPagination()}
                                <Pagination.Next 
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                />
                                <Pagination.Last 
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                />
                            </Pagination>
                        </div>

                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {selectedEpisode ? 'Chỉnh sửa Tập phim' : 'Thêm Tập phim Mới'}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phim</Form.Label>
                                        <Form.Select
                                            value={formData.idMovie}
                                            onChange={(e) => setFormData({...formData, idMovie: e.target.value})}
                                            required
                                        >
                                            <option value="">Chọn phim</option>
                                            {movieList.map(movie => (
                                                <option key={movie.id} value={movie.id}>
                                                    {movie.title}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tập</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.episode}
                                            onChange={(e) => setFormData({...formData, episode: e.target.value})}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Link phim</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.urlMovie}
                                            onChange={(e) => setFormData({...formData, urlMovie: e.target.value})}
                                            required
                                        />
                                    </Form.Group>
                                    <div className="text-end">
                                        <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                                            Hủy
                                        </Button>
                                        <Button variant="primary" type="submit">
                                            {selectedEpisode ? 'Cập nhật' : 'Thêm mới'}
                                        </Button>
                                    </div>
                                </Form>
                            </Modal.Body>
                        </Modal>

                        {/* Modal xem ảnh */}
                        <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Xem ảnh</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="text-center">
                                <img 
                                    src={selectedImage} 
                                    alt="Ảnh phim" 
                                    style={{ maxWidth: '100%', maxHeight: '80vh' }}
                                />
                            </Modal.Body>
                        </Modal>

                        {/* Modal xem ảnh nền */}
                        <Modal show={showBackgroundModal} onHide={() => setShowBackgroundModal(false)} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Xem ảnh nền</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="text-center">
                                <img 
                                    src={selectedBackground} 
                                    alt="Ảnh nền phim" 
                                    style={{ maxWidth: '100%', maxHeight: '80vh' }}
                                />
                            </Modal.Body>
                        </Modal>
                    </Container>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EpisodeManagement; 