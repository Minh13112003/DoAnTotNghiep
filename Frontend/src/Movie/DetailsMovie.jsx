import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { FaStar, FaHeart, FaEye, FaPlay, FaCalendar, FaUser, FaClock, FaLanguage, FaRocket } from 'react-icons/fa';
import { MdHighQuality } from 'react-icons/md';
import { Link, useParams, useNavigate } from 'react-router-dom';
import slugify from '../Helper/Slugify';
import axios from 'axios';
import Navbar from '../Dashboard/Navbar';
import Footer from '../Dashboard/Footer';
import { DataContext } from '../ContextAPI/ContextNavbar';
import './DetailsMovie.css';
import { toast } from 'react-toastify';
import CommentSection from './CommentSection'

const DetailsMovie = () => {
    const { idAndSlug  } = useParams();
    const [id, slugTitle] = idAndSlug.split('__');
    const navigate = useNavigate();
    const { categories, movieTypes, nations, statuses, statusMap } = useContext(DataContext);
    const [movie, setMovie] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loadingFavorite, setLoadingFavorite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isAuthenticated = () => {
        const token = localStorage.getItem('userToken');
        return !!token;
    };
    

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await axios.get(`http://localhost:5285/api/movie/GetMovieBySlugTitle/${slugTitle}`);
                setMovie(response.data[0]);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching movie:', error);
                toast.error('Không thể tải thông tin phim');
            }
        };
        fetchMovie();
    }, [id, slugTitle]);

    useEffect(() => {
        const checkFavorite = async () => {
            if (!isAuthenticated() || !movie) return;
        
            try {
                const token = localStorage.getItem('userToken');
                const response = await axios.get('http://localhost:5285/api/movie/FavoriteMovies', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
        
                const favorites = response.data || [];   
                const favoriteSlugs = favorites.map(fav => slugify(fav.title) || ''); // map ra list slug
                setIsFavorite(favoriteSlugs.includes((slugify(movie.title)))); // kiểm tra bằng slugTitle
            } catch (error) {
                console.error('Error checking favorite:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('userData');
                }
            }
        };

        checkFavorite();
    }, [movie, id]);

    const handleFavoriteClick = async () => {
        if (!isAuthenticated()) {
            toast.info('Vui lòng đăng nhập để yêu thích phim');
            navigate('/tai-khoan/auth');
            return;
        }
    
        try {
            setLoadingFavorite(true);
            const token = localStorage.getItem('userToken');
            await axios.post(
                `http://localhost:5285/api/movie/ToggleFavoriteMovie/${slugmovie}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            setIsFavorite(prev => {
                const newFavorite = !prev;
                toast.success(newFavorite ? 'Đã thêm vào danh sách yêu thích' : 'Đã bỏ yêu thích phim');
                return newFavorite;
            });
    
        } catch (error) {
            console.error('Error toggling favorite:', error);
            if (error.response?.status === 401) {
                toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                localStorage.removeItem('userToken');
                localStorage.removeItem('userData');
                navigate('/tai-khoan/auth');
            } else {
                toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
            }
        } finally {
            setLoadingFavorite(false);
        }
    };
    const HandleSeeMovieButton = async () => {
        const url = movie.numberOfMovie > 1 
            ? `/xem-phim/${movie.id}__${slugify(movie.title)}__Tap_1`
            : `/xem-phim/${movie.id}__${slugify(movie.title)}`;
        if (!isAuthenticated()) {           
            navigate(url);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch('http://localhost:5285/api/movie/AddHistory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    idMovie: movie.id
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add history');
            }

            const data = await response.json();
            console.log('API response:', data);

            // Sau khi thành công, điều hướng tới trang xem phim
            navigate(url);
        } catch (err) {
            setError(err.message);
            console.error('Error:', err);
            toast.error('Có lỗi xảy ra khi thêm lịch sử xem phim');
        } finally {
            setLoading(false);
        }
    };

    if (!movie) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );

    return (
        <div>
            <Navbar categories={categories} movieTypes={movieTypes} nations={nations} statuses={statuses} statusMap={statusMap} />

            <div className="movie-details py-5" style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${movie.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '50vh'
            }}>
                <Container>
                    <Row className="g-4">
                        <Col md={4}>
                            <Card className="border-0 h-100">
                                <Card.Img
                                    variant="top"
                                    src={movie.image}
                                    alt={movie.title}
                                    className="rounded-3 shadow"
                                    style={{
                                        width: '100%',
                                        height: '600px',
                                        objectFit: 'contain',
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                                    }}
                                    
                                />
                                {movie.isVip === true || movie.isVip === 'true' ? (
                                    <div className="vip-label">VIP</div>
                                ) : null}
                            </Card>
                        </Col>

                        <Col md={8}>
                            <div className="text-white">
                                <h1 className="mb-3">{movie.title}</h1>

                                <div className="mb-4">
                                    <Badge bg="danger" className="me-2">{movie.statusText}</Badge>
                                    <Badge bg="primary" className="me-2">{movie.typeMovie}</Badge>
                                    <Badge bg="success">{movie.nation}</Badge>
                                </div>

                                <Row className="mb-4 g-3">
                                    <Col sm={6} md={4}>
                                        <div className="d-flex align-items-center">
                                            <FaEye className="text-warning me-2" />
                                            <span>{movie.view} lượt xem</span>
                                        </div>
                                    </Col>
                                    <Col sm={6} md={4}>
                                        <div className="d-flex align-items-center">
                                            <FaClock className="text-warning me-2" />
                                            <span>{movie.duration} phút</span>
                                        </div>
                                    </Col>
                                    <Col sm={6} md={4}>
                                        <div className="d-flex align-items-center">
                                            <MdHighQuality className="text-warning me-2" />
                                            <span>{movie.quality}</span>
                                        </div>
                                    </Col>
                                    <Col sm={6} md={4}>
                                        <div className="d-flex align-items-center">
                                            <FaLanguage className="text-warning me-2" />
                                            <span>{movie.language}</span>
                                        </div>
                                    </Col>
                                    <Col sm={6} md={4}>
                                        <div className="d-flex align-items-center">
                                            <FaRocket className="text-warning me-2" />
                                            <span>
                                                {movie.createdAtString} - Tập {movie.episode}
                                            </span>
                                        </div>
                                    </Col>

                                </Row>

                                <div className="mb-4">
                                    <h5 className="text-warning mb-3">Thể loại:</h5>
                                    <div>
                                        {movie.nameCategories.split(', ').map((category, index) => (
                                            <Badge
                                                bg="secondary"
                                                className="me-2 mb-2"
                                                key={index}
                                            >
                                                {category}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h5 className="text-warning mb-3">Mô tả:</h5>
                                    <p>{movie.description}</p>
                                </div>

                                <div className="d-flex gap-3">
                                    <Button
                                        variant="danger"
                                        size="lg"
                                        className="d-flex align-items-center"
                                        onClick={HandleSeeMovieButton}
                                    >
                                        <FaPlay className="me-2" />
                                        Xem Phim
                                    </Button>

                                    <Button
                                        variant={isFavorite ? "danger" : "outline-light"}
                                        size="lg"
                                        className="d-flex align-items-center"
                                        onClick={handleFavoriteClick}
                                        disabled={loadingFavorite}
                                        title={!isAuthenticated() ? "Vui lòng đăng nhập để yêu thích phim" : ""}
                                    >
                                        {loadingFavorite ? (
                                            <Spinner animation="border" size="sm" className="me-2" />
                                        ) : (
                                            <FaHeart className="me-2" />
                                        )}
                                        {isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                                    </Button>
                                </div>

                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
             {/* Thêm phần bình luận */}
             <Container className="py-5 bg-white">
                <CommentSection movieId={movie.id} movieTitle={movie.title} />
            </Container>

            <Footer />
        </div>
    );
};

export default DetailsMovie;
