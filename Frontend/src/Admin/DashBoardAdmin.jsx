import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../ContextAPI/ContextNavbar';
import Navbar from '../Dashboard/Navbar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, Row, Col, Container, Button } from 'react-bootstrap';
import { 
    FaFilm, FaList, FaUsers, FaAngleLeft, 
    FaAngleRight, FaArrowLeft, FaTachometerAlt,
    FaComments, FaEnvelope, FaChartLine, FaChartBar, FaChartPie
} from 'react-icons/fa';
import axios from 'axios';
import Footer from '../Dashboard/Footer';
import './AdminStyles.css';

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashBoardAdmin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { categories, movieTypes, nations, statuses, statusMap } = useContext(DataContext);
    const [stats, setStats] = useState({
        numberOfMovie: 0,
        numberOfCategory: 0,
        numberOfComments: 0,
        numberOfFeedbacks: 0,
        pendingFeedbacks: 0
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    // Dữ liệu cho biểu đồ
    const [viewsData, setViewsData] = useState({
        labels: [],
        datasets: []
    });
    
    const [categoryData, setCategoryData] = useState({
        labels: [],
        datasets: []
    });
    
    const [statusData, setStatusData] = useState({
        labels: [],
        datasets: []
    });

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
                icon: <FaComments />,
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
                icon: <FaEnvelope />,
                items: [
                    {
                        title: 'Danh sách góp ý',
                        link: '/quan-ly/gop-y'
                    }
                ]
            }
        ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:5285/api/movie/getNumberOfMovieAndCategory');
                setStats(response.data);
                
                // Giả lập dữ liệu biểu đồ (thay thế bằng dữ liệu thực từ API)
                fetchChartData();
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);
    
    const fetchChartData = async () => {
        try {
            // Giả lập dữ liệu biểu đồ đường - lượt xem theo thời gian
            const viewsChartData = {
                labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
                datasets: [
                    {
                        label: 'Lượt xem phim',
                        data: [1200, 1900, 3000, 5000, 4000, 3500, 6500, 7800, 8500, 9200, 10000, 12000],
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        tension: 0.3,
                    },
                ],
            };
            setViewsData(viewsChartData);
            
            // Giả lập dữ liệu biểu đồ cột - số lượng phim theo thể loại
            const categoryChartData = {
                labels: ['Hành động', 'Tình cảm', 'Kinh dị', 'Hài hước', 'Khoa học viễn tưởng', 'Hoạt hình'],
                datasets: [
                    {
                        label: 'Số lượng phim',
                        data: [45, 38, 25, 42, 30, 35],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(153, 102, 255, 0.7)',
                            'rgba(255, 159, 64, 0.7)',
                        ],
                    },
                ],
            };
            setCategoryData(categoryChartData);
            
            // Giả lập dữ liệu biểu đồ tròn - tỉ lệ phim theo trạng thái
            const statusChartData = {
                labels: ['Đang chiếu', 'Sắp chiếu', 'Đã hoàn thành'],
                datasets: [
                    {
                        label: 'Số lượng phim',
                        data: [120, 45, 85],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                        ],
                        borderColor: [
                            'rgb(54, 162, 235)',
                            'rgb(255, 206, 86)',
                            'rgb(75, 192, 192)',
                        ],
                        borderWidth: 1,
                    },
                ],
            };
            setStatusData(statusChartData);
            
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    };

    // Cấu hình cho biểu đồ
    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Lượt xem phim theo tháng',
                font: {
                    size: 16
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            }
        }
    };
    
    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Số lượng phim theo thể loại',
                font: {
                    size: 16
                }
            },
        },
    };
    
    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Tỉ lệ phim theo trạng thái',
                font: {
                    size: 16
                }
            },
        },
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
                        <div className="d-flex align-items-center mb-4">
                            <FaTachometerAlt className="me-2" />
                            <span className="fw-bold">Dashboard</span>
                        </div>
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

                {/* Toggle Button */}
                <Button
                    variant="dark"
                    className="sidebar-toggle-fixed"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <FaAngleLeft /> : <FaAngleRight />}
                </Button>

                {/* Main Content */}
                <div className={`admin-content ${isSidebarOpen ? '' : 'expanded'}`}>
                    <Container fluid>
                        <h2 className="text-center mb-5">Tổng quan hệ thống</h2>

                        <Row className="stats-cards g-4 mb-5">
                            <Col md={6} lg={3}>
                                <div className="stats-card">
                                    <div className="stats-icon bg-primary">
                                        <FaFilm />
                                    </div>
                                    <div className="stats-info">
                                        <h3>{stats.numberOfMovie}</h3>
                                        <p>Tổng số phim</p>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6} lg={3}>
                                <div className="stats-card">
                                    <div className="stats-icon bg-success">
                                        <FaList />
                                    </div>
                                    <div className="stats-info">
                                        <h3>{stats.numberOfCategory}</h3>
                                        <p>Tổng số thể loại</p>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6} lg={3}>
                                <div className="stats-card">
                                    <div className="stats-icon bg-warning">
                                        <FaComments />
                                    </div>
                                    <div className="stats-info">
                                        <h3>{stats.numberOfComments || 0}</h3>
                                        <p>Tổng số bình luận</p>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6} lg={3}>
                                <div className="stats-card">
                                    <div className="stats-icon bg-danger">
                                        <FaEnvelope />
                                    </div>
                                    <div className="stats-info">
                                        <h3>{stats.numberOfFeedbacks || 0}</h3>
                                        <p>Góp ý ({stats.pendingFeedbacks || 0} chưa xử lý)</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        
                        {/* Biểu đồ */}
                        <h3 className="text-center mb-4">Thống kê chi tiết</h3>
                        
                        {/* Biểu đồ đường - Lượt xem theo thời gian */}
                        <Card className="mb-5 shadow-sm">
                            <Card.Header className="bg-light">
                                <div className="d-flex align-items-center">
                                    <FaChartLine className="me-2 text-primary" />
                                    <h5 className="mb-0">Thống kê lượt xem</h5>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div style={{ height: '300px' }}>
                                    <Line options={lineOptions} data={viewsData} />
                                </div>
                            </Card.Body>
                        </Card>
                        
                        <Row className="mb-5">
                            {/* Biểu đồ cột - Số lượng phim theo thể loại */}
                            <Col lg={7}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Header className="bg-light">
                                        <div className="d-flex align-items-center">
                                            <FaChartBar className="me-2 text-success" />
                                            <h5 className="mb-0">Phim theo thể loại</h5>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <div style={{ height: '300px' }}>
                                            <Bar options={barOptions} data={categoryData} />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            
                            {/* Biểu đồ tròn - Tỉ lệ phim theo trạng thái */}
                            <Col lg={5}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Header className="bg-light">
                                        <div className="d-flex align-items-center">
                                            <FaChartPie className="me-2 text-danger" />
                                            <h5 className="mb-0">Phim theo trạng thái</h5>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                                            <Pie options={pieOptions} data={statusData} />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default DashBoardAdmin;