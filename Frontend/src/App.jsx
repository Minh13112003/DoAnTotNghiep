import Dashboard from './Dashboard/Dashboard'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListFilm from './ListMovie/ListFilm';  
import { DataProvider } from './ContextAPI/ContextNavbar';
import ListTypeFilm from './ListMovie/ListTypeFilm';
import ListNationFilm from './ListMovie/ListNationFilm';
import ListStatusFilm from './ListMovie/ListStatusFilm';
import AuthForm from './LoginAndRegis/AuthForm';  
import Profile from './LoginAndRegis/Profile';
import DetailsMovie from './Movie/DetailsMovie';
import SeeMovie from './Movie/SeeMovie';
import DashBoardAdmin from './Admin/DashBoardAdmin';
import MovieManagement from './Admin/MovieManagement';
import CategoryManagement from './Admin/CategoryManagement';
import ListFavoriteFilm from './ListMovie/ListFavouriteFilm';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import EpisodeManagement from './Admin/EpisodeManagement';
import ErrorPage from './ErrorPage';
import ListHistoryFilm from './ListMovie/ListHistoryFilm';
import ListSearchAdvance from './ListMovie/ListSearchAdvance';
import ListNewestFilm from './ListMovie/ListNewestFilm';
import ListAllFilm from './ListMovie/ListAllFilm';
import ForgotPassword from './LoginAndRegis/ForgotPassword';
import ListSearchFilm from './ListMovie/ListSearchFilm';
import Payment from './Payment/Payment';
import PaymentSuccess from './Payment/PaymentSuccess';
import PaymentCancel from './Payment/PaymentCancel';
import PaymentHistory from './Payment/PaymentHistory';
import CommentManagement from './Admin/CommentManagement';
import AccountManagement from './Admin/AccountManagement';
import ReportManagement from './Admin/ReportManagement';
import ReportHistory from './LoginAndRegis/ReportHistory';

function App() {
  return (
    <>
    <ToastContainer />
    <DataProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/tai-khoan/auth' element={<AuthForm/>}/>
          <Route path='/the-loai/:category' element={<ListFilm/>}/>
          <Route path='/loai-phim/:movieTypeSlug' element={<ListTypeFilm/>}/>
          <Route path='/quoc-gia/:nationSlug' element={<ListNationFilm/>}/>
          <Route path='/trang-thai/:movieStatusSlug' element={<ListStatusFilm/>}/>
          <Route path='/tai-khoan/thong-tin-ca-nhan' element={<Profile/>}/>
          <Route path='/chi-tiet-phim/:idAndSlug' element={<DetailsMovie/>}/>
          <Route path='/xem-phim/:idAndSlug' element={<SeeMovie/>}/>
          <Route path='/quan-ly' element={<DashBoardAdmin/>}/>
          <Route path='/yeu-thich' element={<ListFavoriteFilm/>}/>
          <Route path='/lich-su-xem' element={<ListHistoryFilm/>}/>
          <Route path='/quan-ly/phim/danh-sach' element={<MovieManagement/>}/>
          <Route path="/quan-ly/the-loai/danh-sach" element={<CategoryManagement />} />
          <Route path="/quan-ly/phim/tap-phim" element={<EpisodeManagement />} />
          <Route path='/tim-kiem-nang-cao/:param' element={<ListSearchAdvance/>}/>
          <Route path='/moi-cap-nhat' element={<ListNewestFilm/>}/>
          <Route path="*" element={<ErrorPage />} />
          <Route path='/tat-ca-phim' element={<ListAllFilm/>}/>
          <Route path='/quen-mat-khau' element={<ForgotPassword/>}/>
          <Route path='/tim-kiem' element={<ListSearchFilm/>}/>
          <Route path='/thanh-toan' element={<Payment/>}/>
          <Route path="/thanh-toan/thanh-cong" element={<PaymentSuccess />} />
          <Route path="/thanh-toan/huy" element={<PaymentCancel />} />
          <Route path="/danh-sach-thanh-toan" element={<PaymentHistory />} />
          <Route path="/quan-ly/binh-luan" element={<CommentManagement />} />
          <Route path="/quan-ly/tai-khoan/danh-sach" element={<AccountManagement />} />
          <Route path="/quan-ly/bao-cao" element={<ReportManagement />} />
          <Route path="/lich-su-bao-cao" element={<ReportHistory/>} />
        </Routes>
      </Router>
    </DataProvider>
    </>
  )
}

export default App
