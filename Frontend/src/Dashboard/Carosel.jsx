import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
const Carousel = ({movie}) => {
    return(   
        <div style={{marginTop:'34px'}}>
            <div id="carouselExampleInterval" className="carousel slide w-100" data-bs-ride="carousel">
                <div className="carousel-inner">
                {movie.map((film, index) => (
                    <div
                        key={index}
                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                        data-bs-interval={index === 0 ? 10000 : 2000}
                    >
                        <img
                        src={film.backgroundImage.replace(/"/g, "")}
                        className="img-fluid "
                        style={{height: "100vh", objectFit: "cover", width:"100%"}}
                        alt={film.title}
                        />
                        <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-3 rounded">
                        <h5>{film.title}</h5>
                        <p className='mt-4'><strong>Quốc gia:</strong> {film.nation}</p>
                        <p>{film.description}</p>
                        <p><strong>Thể loại:</strong> {film.nameCategories}</p>
                        <Link to={`/chi-tiet-phim/${film.slugtitle}`} className="btn btn-primary">Xem Ngay</Link>
                        </div>
                    </div>
                    ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
                </div>   
        </div>             
    )
};
export default Carousel