import React, { useContext, useEffect, useState } from 'react';  
import './ListFilm.css';
import { DataContext } from '../ContextAPI/ContextNavbar';
import Navbar from '../Dashboard/Navbar';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Dashboard/Footer';
import slugify from '../Helper/Slugify';
import { toast } from 'react-toastify';

const ListFavoriteFilm = () => {
    const { categories, movieTypes, nations, statuses, statusMap } = useContext(DataContext);
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();

    const isAuthenticated = () => {
        const token = localStorage.getItem('userToken');
        return !!token;
    };

    useEffect(() => {
        const fetchMovies = async () => {
            // Kiểm tra đăng nhập
            if (!isAuthenticated()) {
                toast.error('Vui lòng đăng nhập để xem danh sách phim yêu thích');
                navigate('/tai-khoan/auth');
                return;
            }

            try {
                // Lấy token từ localStorage
                const token = localStorage.getItem('userToken');
                const response = await axios.get('http://localhost:5285/api/movie/FavoriteMovies', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setMovies(response.data);
            } catch (error) {
                console.error('Error fetching favorite movies:', error);
                if (error.response?.status === 401) {
                    toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('userData');
                    navigate('/tai-khoan/auth');
                } else {
                    toast.error('Không thể tải danh sách phim yêu thích');
                }
            }
        };

        fetchMovies();
    }, [navigate]);

    return (
        <div>
            <Navbar categories={categories} movieTypes={movieTypes} nations={nations} statuses={statuses} statusMap={statusMap} />
            <div className='container'>
                <div className='row'>
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="ms-2 text-white"><b>Danh sách phim yêu thích</b></h4>
                    </div>
                </div>
                <div className='row mt-5'>
                    {movies.length === 0 ? (
                        <div className="text-center text-white py-5">
                            <h4>Bạn chưa có phim yêu thích nào</h4>
                            <Link to="/" className="btn btn-primary mt-3">
                                Khám phá phim ngay
                            </Link>
                        </div>
                    ) : (
                        movies.map((movie, index) => (
                            <div key={index} className='col-lg-2 col-md-4 col-sm-6 mb-4'>
                                <div className="movie-card">
                                    <div className="image-container">
                                        <img src={movie.image} className="card-img-top" alt={movie.title} />
                                        <div className="overlay">
                                            <div className="categories">
                                                {movie.nameCategories.split(', ').map((category, idx) => (
                                                    <span key={idx} className="badge bg-secondary m-1">{category}</span>
                                                ))}
                                            </div>
                                            <Link to={`/chi-tiet-phim/${movie.id}__${slugify(movie.title)}`} className="overlay-button">Xem ngay</Link>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h6 className="card-title text-center">{movie.title}</h6>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default ListFavoriteFilm;