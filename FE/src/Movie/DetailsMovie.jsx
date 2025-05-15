import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { FaStar, FaHeart, FaEye, FaPlay, FaCalendar, FaUser, FaClock, FaLanguage } from 'react-icons/fa';
import { MdHighQuality } from 'react-icons/md';
import { Link, useParams} from 'react-router-dom';
import slugify from '../Helper/Slugify';
import axios from 'axios';
import Navbar from '../Dashboard/Navbar';
import Footer from '../Dashboard/Footer';
import { DataContext } from '../ContextAPI/ContextNavbar';
import CommentSection from './CommentSection'; // Import CommentSection
import './DetailsMovie.css';

const DetailsMovie = () => {
    const { slugmovie } = useParams();
    const { categories, movieTypes, nations, statuses, statusMap } = useContext(DataContext);
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            const response = await axios.get(`http://localhost:5285/api/movie/GetMovieBySlugTitle/${slugmovie}`);
            setMovie(response.data[0]); // Lấy phần tử đầu tiên vì API trả về mảng
        };
        fetchMovie();
    }, [slugmovie]);

    if (!movie) return <div>Loading...</div>;

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
                        {/* Poster Column */}
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
                            </Card>
                        </Col>

                        {/* Details Column */}
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
                                <Link 
                                    to={`/xem-phim/${slugify(movie.title)}`} 
                                    className="btn btn-danger btn-lg d-flex align-items-center"
                                >
                                    <FaPlay className="me-2" />
                                    Xem Phim
                                </Link>
                                    <Button 
                                        variant="outline-light" 
                                        size="lg"
                                        className="d-flex align-items-center"
                                    >
                                        <FaHeart className="me-2" />
                                        Yêu thích
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
