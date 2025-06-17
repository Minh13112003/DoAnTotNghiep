import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Dashboard/Navbar';
import Footer from '../Dashboard/Footer';
import { DataContext } from "../ContextAPI/ContextNavbar";
import CommentSection from './CommentSection'
import { GetLinkMovieByIdMovie } from '../apis/linkmovieAPI';
import { FaUserTie, FaHeart, FaEye, FaPlay, FaCalendar, FaTheaterMasks, FaClock, FaLanguage, FaRocket, FaComment, FaStar, FaArrowLeft } from 'react-icons/fa';
const SeeMovie = () => {
    const { idAndSlug } = useParams();
    const navigate = useNavigate();
    const parts = idAndSlug.split('__');
    const id = parts[0];
    const slugTitle = parts[1];
    const episode = parts.length === 3 && parts[2].startsWith('Tap_')
        ? parseInt(parts[2].split('Tap_')[1])
        : null;
    const { categories, movieTypes, nations, statuses, statusMap } = useContext(DataContext);
    const [videoData, setVideoData] = useState([]);
    const [selectedEpisode, setSelectedEpisode] = useState(null);
    const [movie, setMovie] = useState([]);
    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                // Lấy danh sách link phim
                // const response = await fetch(`http://localhost:5285/api/linkmovie/GetLinkMovieByIdMovie/${id}`);
                const response = await GetLinkMovieByIdMovie(id);
                setMovie(response.data);
                console.log("HIHI"); 
                console.log(response.data);     
                // Sắp xếp theo episode từ nhỏ đến lớn
                const sortedData = response.data.sort((a, b) => a.episode - b.episode);
                setVideoData(sortedData);
                // Kiểm tra nếu có episode trong URL
                if (episode && sortedData.length > 0) {
                    // Tìm tập phim tương ứng với episode trong URL
                    const selectedEp = sortedData.find(ep => ep.episode === episode);
                    if (selectedEp) {
                        setSelectedEpisode(selectedEp);
                    } else {
                        // Nếu không tìm thấy tập phim, set tập đầu tiên
                        navigate(`/*`);
                    }
                } else if (sortedData.length > 0) {
                    // Nếu không có episode trong URL, set tập đầu tiên
                    setSelectedEpisode(sortedData[0]);
                }
                
            } catch (error) {
                console.error('Error fetching movie data:', error);
            }
        };
        fetchMovie();
    }, [id, episode]);

    // Hàm lấy link nhúng YouTube
    const getEmbedUrl = (url) => {
        if (!url || typeof url !== 'string') return "";
    
        if (url.includes('watch?v=')) {
            const videoId = url.split('watch?v=')[1];
            return `https://www.youtube.com/embed/${videoId}`;
        }
    
        // Nếu là link m3u8 hoặc mp4, giữ nguyên
        return url;
    };

    const handleEpisodeChange = (selectedEp) => {
        setSelectedEpisode(selectedEp);
        const newUrl = `/xem-phim/${id}__${slugTitle}__Tap_${selectedEp.episode}`;
        navigate(newUrl, { replace: true });
    };

    return (
        <div>
            <Navbar categories={categories} movieTypes={movieTypes} nations={nations} statuses={statuses} statusMap={statusMap} />
            <Container className="mt-4 text-center">
                {/* <h2 className="mb-4" style={{color : 'white'}}>Xem Phim</h2> */}
                <h2 className="mb-4" style={{color : 'White', margin : '70px'}}>Xem Phim {movie[0]?.title}</h2>
                <Row className="justify-content-center">
                    <Col md={8}>
                        {selectedEpisode && (
                            <div className="ratio ratio-16x9">
                                <iframe                                   
                                    src={getEmbedUrl(selectedEpisode.urlMovie)}
                                    title="Movie Player"
                                    allowFullScreen
                                    className="w-100 border rounded shadow"
                                    style={{
                                        colorScheme: 'normal',
                                        accentColor: '#007bff'
                                    }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    webkitallowfullscreen="true"
                                    mozallowfullscreen="true"
                                ></iframe>
                            </div>
                        )}
                    </Col>
                </Row>
                {videoData.length > 1 && (
                    <Row className="mt-4 justify-content-center">
                        <Col md={8}>
                            <h5>Chọn tập:</h5>
                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                                {videoData.map((episode) => (
                                    <Button 
                                        key={episode.idLinkMovie} 
                                        variant={selectedEpisode?.episode === episode.episode ? 'danger' : 'outline-secondary'}
                                        onClick={() => handleEpisodeChange(episode)}
                                    >
                                        Tập {episode.episode}
                                    </Button>
                                ))}
                            </div>
                        </Col>
                        
                    </Row>
                )}
            </Container>
            {videoData && videoData.length > 0 && (
                <Container className="py-5 bg-white">
                    <CommentSection 
                        movieId={videoData[0].idMovie} 
                        movieTitle={videoData[0].title} 
                    />
                </Container>
            )}
            <Footer />
        </div>
    );
};

export default SeeMovie;
