import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext } from "react";
import axios from "axios";
import Carousel from './Carosel';
import MoiCapNhat from './Moicapnhat';
import Navbar from './Navbar';
import Footer from './Footer';
import { DataContext, useData } from '../ContextAPI/ContextNavbar';


const Dashboard = () => {
    
    const { categories, movieTypes, nations, statuses, statusMap } = useContext(DataContext);
    const { dashboardMovies, newestMovies,finishedMovies } = useData();
    console.log(newestMovies);
    return (
        
        <div>
            <title>Trang chủ</title>
            <Navbar categories={categories} movieTypes={movieTypes} nations={nations} statuses={statuses} statusMap={statusMap} />
            <div className='container-fluid p-0'>
                <Carousel movie={dashboardMovies}/>
            </div>
            <div className='container mt-4'>
                <MoiCapNhat movies={newestMovies} type="Mới cập nhật"/>
                <MoiCapNhat movies={finishedMovies} type="Đã hoàn thành"/>
                <MoiCapNhat movies={dashboardMovies} type = "Toàn bộ phim"/>
            </div>
            <Footer/>
        </div>
    );
    
};

export default Dashboard;

