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
import CommentManagement from './Admin/CommentManagement';
import FeedbackManagement from './Admin/FeedbackManagement';
import FeedbackForm from './Feedback/FeedbackForm';

function App() {
  return (
    <>
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
          <Route path='/chi-tiet-phim/:slugmovie' element={<DetailsMovie/>}/>
          <Route path='/xem-phim/:slugmovie' element={<SeeMovie/>}/>
          <Route path='/gop-y' element={<FeedbackForm/>}/>
          
          {/* Routes cho Admin */}
          <Route path='/quan-ly' element={<DashBoardAdmin/>}/>
          <Route path='/quan-ly/phim/danh-sach' element={<MovieManagement/>}/>
          <Route path='/quan-ly/binh-luan' element={<CommentManagement/>}/>
          <Route path='/quan-ly/binh-luan/bao-cao' element={<CommentManagement/>}/>
          <Route path='/quan-ly/gop-y' element={<FeedbackManagement/>}/>
        </Routes>
      </Router>
    </DataProvider>
    </>
  )
}

export default App

