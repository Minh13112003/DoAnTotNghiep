import React, { useContext, useEffect, useState } from 'react';  
import './ListFilm.css';
import { DataContext } from '../ContextAPI/ContextNavbar';
import Navbar from '../Dashboard/Navbar';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Dashboard/Footer';
import slugify from '../Helper/Slugify';
const ListNationFilm = () => {
    const { categories, movieTypes, nations, statuses, statusMap } = useContext(DataContext);
    const [movies, setMovies] = useState([]);
    const {nationSlug } = useParams();
    useEffect(() => {
        const fetchMovies = async () => {
            const response = await axios.get(`http://localhost:5285/api/movie/GetMovieBySlugNation/${nationSlug}`);
            setMovies(response.data);
        };
        fetchMovies();
    }, [nationSlug]);

    
    return (
        <div>
            <Navbar categories={categories} movieTypes={movieTypes} nations={nations} statuses={statuses} statusMap={statusMap} />
            <div className='container'>
                <div className='row'>
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="ms-2"><b>Danh sách phim có quốc gia {movies.length > 0 ? movies[0].nation : ''}</b></h4>
                    </div>
                </div>
                <div className='row mt-5'>
                    {movies.map((movie, index) => (
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
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default ListNationFilm;
