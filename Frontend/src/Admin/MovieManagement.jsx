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

const MovieManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { categories, movieTypes, nations, statuses, statusMap } = useContext(DataContext);
    const [movies, setMovies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [categoryCount, setCategoryCount] = useState(1);
    const [actorCount, setActorCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [showBackgroundModal, setShowBackgroundModal] = useState(false);
    const [selectedBackground, setSelectedBackground] = useState('');

    const statusOptions = [
        { value: "0", label: "Chưa có lịch" },
        { value: "1", label: "Sắp chiếu" },
        { value: "2", label: "Đang cập nhật" },
        { value: "3", label: "Đang chiếu" },
        { value: "4", label: "Đã kết thúc" },
        { value: "5", label: "Đã hoàn thành" }
    ];

    const [formData, setFormData] = useState({
        idMovie: '',
        title: '',
        description: '',
        nation: '',
        typeMovie: '',
        status: '',
        nameCategories: [],
        numberOfMovie: 1,
        duration: 0,
        quality: '',
        language: '',
        view: 0,
        block: false,
        nameDirector: '',
        isVip: false,
        nameActors: [],
        image: '',
        backgroundImage: ''
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
            const token = localStorage.getItem('userToken');
            const response = await axios.get('http://localhost:5285/api/movie/ShowAllMovieCategory', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const getStatusValue = (statusText) => {
        const statusMap = {
            "Chưa có lịch": "0",
            "Sắp chiếu": "1",
            "Đang cập nhật": "2",
            "Đang chiếu": "3",
            "Đã kết thúc": "4",
            "Đã hoàn thành": "5"
        };
        return statusMap[statusText] || '';
    };

    const handleShowModal = async (movie = null) => {
        if (movie) {
            try {
                const token = localStorage.getItem('userToken');
                const response = await axios.get(`http://localhost:5285/api/movie/GetMovieById/${movie.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const movieData = response.data[0];
                
                console.log('Raw API Response:', response);
                console.log('Movie Data Structure:', JSON.stringify(movieData, null, 2));
                console.log('Type Movie:', movieData.typeMovie);

                if (!movieData) {
                    console.error('Movie data is null or undefined');
                    return;
                }

                const newFormData = {
                    idMovie: movieData.id || '',
                    title: movieData.title || '',
                    description: movieData.description || '',
                    nation: movieData.nation || '',
                    typeMovie: movieData.typeMovie || '',
                    status: getStatusValue(movieData.statusText),
                    nameCategories: movieData.nameCategories ? movieData.nameCategories.split(', ') : [],
                    numberOfMovie: movieData.numberOfMovie || 1,
                    duration: movieData.duration || 0,
                    quality: movieData.quality || '',
                    language: movieData.language || '',
                    view: movieData.view || 0,
                    block: movieData.block || false,
                    nameDirector: movieData.nameDirector || '',
                    isVip: movieData.isVip || false,
                    nameActors: movieData.nameActors ? movieData.nameActors.split(', ') : [],
                    image: movieData.image || '',
                    backgroundImage: movieData.backgroundImage || ''
                };

                console.log('New Form Data:', newFormData);
                console.log('Type Movie in Form:', newFormData.typeMovie);

                setSelectedMovie(movieData);
                setFormData(newFormData);
                setCategoryCount(newFormData.nameCategories.length || 1);
                setActorCount(newFormData.nameActors.length || 1);
            } catch (error) {
                console.error('Error fetching movie details:', error);
                console.error('Error response:', error.response);
            }
        } else {
            setSelectedMovie(null);
            setFormData({
                idMovie: '',
                title: '',
                description: '',
                nation: '',
                typeMovie: '',
                status: '',
                nameCategories: [],
                numberOfMovie: 1,
                duration: 0,
                quality: '',
                language: '',
                view: 0,
                block: false,
                nameDirector: '',
                isVip: false,
                nameActors: [],
                image: '',
                backgroundImage: ''
            });
            setCategoryCount(1);
            setActorCount(1);
        }
        setShowModal(true);
    };

    const handleAddMovie = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            const submitData = {
                ...formData,
                nameCategories: formData.nameCategories.join(', '),
                nameActors: formData.nameActors.join(', ')
            };
            
            await axios.post('http://localhost:5285/api/movie/addmovie', submitData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchMovies();
            setShowModal(false);
            toast.success('Thêm phim mới thành công!');
        } catch (error) {
            console.error('Error adding movie:', error);
            toast.error('Thêm phim mới thất bại!');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            const submitData = {
                ...formData,
                nameCategories: formData.nameCategories.join(', '),
                nameActors: formData.nameActors.join(', ')
            };
            
            await axios.put('http://localhost:5285/api/movie/update', submitData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchMovies();
            setShowModal(false);
            toast.success('Cập nhật phim thành công!');
        } catch (error) {
            console.error('Error updating movie:', error);
            toast.error('Cập nhật phim thất bại!');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa phim này?')) {
            try {
                const token = localStorage.getItem('userToken');
                await axios.delete(`http://localhost:5285/api/movie/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                fetchMovies();
            } catch (error) {
                console.error('Error deleting movie:', error);
            }
        }
    };

    const handleCategoryChange = (index, value) => {
        const newCategories = [...formData.nameCategories];
        newCategories[index] = value;
        setFormData({ ...formData, nameCategories: newCategories });
    };

    const handleActorChange = (index, value) => {
        const newActors = [...formData.nameActors];
        newActors[index] = value;
        setFormData({ ...formData, nameActors: newActors });
    };

    const addCategoryField = () => {
        setCategoryCount(prev => prev + 1);
        setFormData({
            ...formData,
            nameCategories: [...formData.nameCategories, '']
        });
    };

    const addActorField = () => {
        setActorCount(prev => prev + 1);
        setFormData({
            ...formData,
            nameActors: [...formData.nameActors, '']
        });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = movies.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(movies.length / itemsPerPage);

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

    const handleShowDescription = (description) => {
        setSelectedDescription(description);
        setShowDescriptionModal(true);
    };

    const truncateDescription = (text, maxLength = 50) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const handleShowImage = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImageModal(true);
    };

    const handleShowBackground = (backgroundUrl) => {
        setSelectedBackground(backgroundUrl);
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

                        <div style={{ 
                            overflowX: 'auto', 
                            width: '100%',
                            minWidth: '1000px'
                        }}>
                            <Table striped bordered hover responsive style={{ 
                                minWidth: '1000px',
                                whiteSpace: 'nowrap'
                            }}>
                                <thead>
                                    <tr>
                                        <th style={{ minWidth: '100px', textAlign: 'center' }}>Hình ảnh</th>
                                        <th style={{ minWidth: '100px', textAlign: 'center' }}>Hình nền</th>
                                        <th style={{ minWidth: '200px', textAlign: 'center' }}>Tên phim</th>
                                        <th style={{ minWidth: '200px', textAlign: 'center' }}>Mô tả</th>
                                        <th style={{ minWidth: '150px', textAlign: 'center' }}>Thể loại</th>
                                        <th style={{ minWidth: '100px', textAlign: 'center' }}>Thời lượng</th>
                                        <th style={{ minWidth: '100px', textAlign: 'center' }}>Số tập</th>
                                        <th style={{ minWidth: '150px', textAlign: 'center' }}>Trạng thái</th>
                                        <th style={{ minWidth: '150px', textAlign: 'center' }}>Loại phim</th>
                                        <th style={{ minWidth: '150px', textAlign: 'center' }}>Chất lượng</th>
                                        <th style={{ minWidth: '150px', textAlign: 'center' }}>Ngôn ngữ</th>
                                        <th style={{ minWidth: '150px', textAlign: 'center' }}>Lượt xem</th>
                                        <th style={{ minWidth: '150px', textAlign: 'center' }}>Tên đạo diễn</th>
                                        <th style={{ minWidth: '150px', textAlign: 'center' }}>Tên diễn viên</th>
                                        <th style={{ minWidth: '150px', textAlign: 'center' }}>VIP</th>
                                        <th style={{ minWidth: '150px', textAlign: 'center' }}>Khóa</th>
                                        <th style={{ minWidth: '150px', textAlign: 'center' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map(movie => (
                                        <tr key={movie.id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img 
                                                        src={movie.image} 
                                                        alt={movie.title} 
                                                        style={{ width: '50px', height: '75px', objectFit: 'cover', cursor: 'pointer' }}
                                                        onClick={() => handleShowImage(movie.image)}
                                                    />
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="p-0 ms-2"
                                                        onClick={() => handleShowBackground(movie.image)}
                                                    >
                                                        <FaBars />
                                                    </Button>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img 
                                                        src={movie.backgroundImage} 
                                                        alt={movie.title} 
                                                        style={{ width: '50px', height: '75px', objectFit: 'cover', cursor: 'pointer' }}
                                                        onClick={() => handleShowImage(movie.backgroundImage)}
                                                    />
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="p-0 ms-2"
                                                        onClick={() => handleShowImage(movie.backgroundImage)}
                                                    >
                                                        <FaBars />
                                                    </Button>
                                                </div>
                                            </td>
                                            <td>{movie.title}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <span className="me-2">{truncateDescription(movie.description)}</span>
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="p-0"
                                                        onClick={() => handleShowDescription(movie.description)}
                                                    >
                                                        <FaBars />
                                                    </Button>
                                                </div>
                                            </td>
                                            <td>{movie.nameCategories}</td>
                                            <td>{movie.duration} phút</td>
                                            <td>{movie.numberOfMovie}</td>
                                            <td>{movie.statusText}</td>
                                            <td>{movie.typeMovie}</td>
                                            <td>{movie.quality}</td>
                                            <td>{movie.language}</td>
                                            <td>{movie.view}</td>
                                            <td>{movie.nameDirector}</td>
                                            <td>{movie.nameActors}</td>
                                            <td>
                                                {movie.isVip ? (
                                                    <FaCheck style={{ color: 'green', fontSize: '20px' }} />
                                                ) : (
                                                    <FaX style={{ color: 'red', fontSize: '20px' }} />
                                                )}
                                            </td>
                                            <td>
                                                {movie.block ? (
                                                    <FaCheck style={{ color: 'green', fontSize: '20px' }} />
                                                ) : (
                                                    <FaX style={{ color: 'red', fontSize: '20px' }} />
                                                )}
                                            </td>
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
                        </div>

                        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {selectedMovie ? 'Chỉnh sửa Phim' : 'Thêm Phim Mới'}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={selectedMovie ? handleSubmit : handleAddMovie}>
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
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Mô tả</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={4}
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                                    placeholder="Nhập mô tả phim..."
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Quốc gia</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={formData.nation}
                                                    onChange={(e) => setFormData({...formData, nation: e.target.value})}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Loại phim</Form.Label>
                                                <Form.Select
                                                    value={formData.typeMovie}
                                                    onChange={(e) => setFormData({...formData, typeMovie: e.target.value})}
                                                    required
                                                >
                                                    <option value="">Chọn loại phim</option>
                                                    <option value="Phim Bộ">Phim Bộ</option>
                                                    <option value="Phim Lẻ">Phim Lẻ</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Trạng thái</Form.Label>
                                                <Form.Select
                                                    value={formData.status}
                                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                                    required
                                                >
                                                    <option value="">Chọn trạng thái</option>
                                                    {statusOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Thể loại</Form.Label>
                                                {[...Array(categoryCount)].map((_, index) => (
                                                    <div key={index} className="mb-2">
                                                        <Form.Select
                                                            value={formData.nameCategories[index] || ''}
                                                            onChange={(e) => handleCategoryChange(index, e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Chọn thể loại</option>
                                                            {categories.map(category => (
                                                                <option key={category.id} value={category.nameCategories}>
                                                                    {category.nameCategories}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </div>
                                                ))}
                                                <Button variant="outline-primary" size="sm" onClick={addCategoryField}>
                                                    Thêm thể loại
                                                </Button>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    
                                    
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Thời lượng</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={formData.duration}
                                                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Tên đạo diễn</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={formData.nameDirector}
                                                    onChange={(e) => setFormData({...formData, nameDirector: e.target.value})}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>                                       
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Tên diễn viên</Form.Label>
                                                {[...Array(actorCount)].map((_, index) => (
                                                    <div key={index} className="mb-2">
                                                        <Form.Control
                                                            type="text"
                                                            value={formData.nameActors[index] || ''}
                                                            onChange={(e) => handleActorChange(index, e.target.value)}
                                                            placeholder="Nhập tên diễn viên"
                                                        />
                                                    </div>
                                                ))}
                                                <Button variant="outline-primary" size="sm" onClick={addActorField}>
                                                    Thêm diễn viên
                                                </Button>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Chất lượng</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={formData.quality}
                                                    onChange={(e) => setFormData({...formData, quality: e.target.value})}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>                              
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Ngôn ngữ</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={formData.language}
                                                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                                                />
                                            </Form.Group>
                                        </Col>
                                        
                                    </Row>
                                    <Row>   
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>VIP</Form.Label>
                                                <Form.Check
                                                    type="switch"
                                                    checked={formData.isVip}
                                                    onChange={(e) => setFormData({...formData, isVip: e.target.checked})}
                                                />
                                            </Form.Group>
                                        </Col>                                    
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Khóa</Form.Label>
                                                <Form.Check
                                                    type="switch"
                                                    checked={formData.block}
                                                    onChange={(e) => setFormData({...formData, block: e.target.checked})}
                                                />
                                            </Form.Group>            
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Hình ảnh</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={formData.image}
                                                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                                                />
                                            </Form.Group>
                                        </Col>
                                        
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Hình nền</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={formData.backgroundImage}
                                                    onChange={(e) => setFormData({...formData, backgroundImage: e.target.value})}
                                                />
                                            </Form.Group>
                                        </Col>
                                        
                                    </Row>

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

            {/* Modal hiển thị mô tả */}
            <Modal show={showDescriptionModal} onHide={() => setShowDescriptionModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Mô tả phim</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ 
                        whiteSpace: 'pre-wrap',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        padding: '10px'
                    }}>
                        {selectedDescription}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDescriptionModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal xem ảnh */}
            <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Hình ảnh phim</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <img 
                        src={selectedImage} 
                        alt="Movie" 
                        style={{ 
                            maxWidth: '100%', 
                            maxHeight: '70vh',
                            objectFit: 'contain'
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowImageModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal xem ảnh nền */}
            <Modal show={showBackgroundModal} onHide={() => setShowBackgroundModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Hình nền phim</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <img 
                        src={selectedBackground} 
                        alt="Background" 
                        style={{ 
                            maxWidth: '100%', 
                            maxHeight: '70vh',
                            objectFit: 'contain'
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowBackgroundModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MovieManagement; 