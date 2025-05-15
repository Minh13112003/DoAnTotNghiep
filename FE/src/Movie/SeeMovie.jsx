import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Navbar from '../Dashboard/Navbar';
import Footer from '../Dashboard/Footer';
import { DataContext } from "../ContextAPI/ContextNavbar";

const SeeMovie = () => {
    const { slugmovie } = useParams();
    const { categories, movieTypes, nations, statuses, statusMap } = useContext(DataContext);
    const [videoUrls, setVideoUrls] = useState([]);
    const [selectedEpisode, setSelectedEpisode] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            const response = await fetch(`http://localhost:5285/api/movie/GetMovieBySlugTitle/${slugmovie}`);
            const data = await response.json();
            if (data.length > 0) {
                const urls = data[0].urlMovie.split(', ');

                const sortedUrls = urls
                    .map(url => {
                        const match = url.match(/-Tap-(\d+)/);
                        return {
                            url,
                            episode: match ? parseInt(match[1]) : 9999 // Nếu không có tập, đẩy xuống cuối
                        };
                    })
                    .sort((a, b) => a.episode - b.episode) // Sắp xếp tăng dần theo số tập
                    .map(item => item.url); // Chỉ lấy lại URL

                setVideoUrls(sortedUrls);
                setSelectedEpisode(sortedUrls[0]); // Chọn tập đầu tiên
            }
        };
        fetchMovie();
    }, [slugmovie]);

    // Hàm lấy link nhúng YouTube
    const getEmbedUrl = (url) => {
        const videoId = url.split('watch?v=')[1]?.split('-Tap-')[0]; // Lấy ID video trước -Tap-
        return `https://www.youtube.com/embed/${videoId}`;
    };

    // Hàm lấy số tập từ URL
    const getEpisodeName = (url, index) => {
        const match = url.match(/-Tap-(\d+)/);
        return match ? `Tập ${match[1]}` : `Tập ${index + 1}`;
    };

    return (
        <div>
            <Navbar categories={categories} movieTypes={movieTypes} nations={nations} statuses={statuses} statusMap={statusMap} />
            <Container className="mt-4 text-center">
                <h2 className="mb-4">Xem Phim</h2>
                <Row className="justify-content-center">
                    <Col md={8}>
                        {selectedEpisode && (
                            <div className="ratio ratio-16x9">
                                <iframe
                                    src={getEmbedUrl(selectedEpisode)}
                                    title="Movie Player"
                                    allowFullScreen
                                    className="w-100 border rounded shadow"
                                ></iframe>
                            </div>
                        )}
                    </Col>
                </Row>
                {videoUrls.length > 1 && (
                    <Row className="mt-4 justify-content-center">
                        <Col md={8}>
                            <h5>Chọn tập:</h5>
                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                                {videoUrls.map((url, index) => (
                                    <Button 
                                        key={index} 
                                        variant={url === selectedEpisode ? 'danger' : 'outline-secondary'}
                                        onClick={() => setSelectedEpisode(url)}
                                    >
                                        {getEpisodeName(url, index)}
                                    </Button>
                                ))}
                            </div>
                        </Col>
                    </Row>
                )}
            </Container>
            <Footer />
        </div>
    );
};

export default SeeMovie;
