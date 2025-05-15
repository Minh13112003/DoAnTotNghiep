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
          <Route path='/quan-ly/phim/danh-sach' element={<MovieManagement/>}/>
          <Route path="/quan-ly/the-loai/danh-sach" element={<CategoryManagement />} />
          <Route path="/quan-ly/phim/tap-phim" element={<EpisodeManagement />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </DataProvider>
    </>
  )
}

export default App
