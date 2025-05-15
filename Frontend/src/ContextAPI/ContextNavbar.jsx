import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";

const DataContext = createContext();

const DataProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [movieTypes, setMovieTypes] = useState([]);
    const [nations, setNations] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [dashboardMovies, setDashboardMovies] = useState([]); // Movie cho Dashboard
    const [searchMovies, setSearchMovies] = useState([]); // Movie cho Search
    const [newestMovies, setNewestMovies] = useState([]);
    const [finishedMovies, setFinishedMovies] = useState([]);
    const [keyword, setKeyword] = useState("");

    const statusMap = {
        "0": "Chưa có lịch",
        "1": "Sắp chiếu",
        "2": "Đang cập nhật",
        "3": "Đang chiếu",
        "4": "Đã kết thúc",
        "5": "Đã hoàn thành"
    };

    const processMovieData = (movies) => {
        return movies.map(movie => ({
            ...movie,
            image: (movie.image && 
                   typeof movie.image === 'string' && 
                   movie.image.trim() !== "" && 
                   movie.image !== "null") ? movie.image.trim() : null,
            title: movie.title || "Không có tiêu đề",
            nameCategories: movie.nameCategories || "Chưa phân loại",
            slugmovie: movie.slugmovie || "Không có slug"
        }));
    };

    // Fetch dữ liệu cho Dashboard
    useEffect(() => {
        axios.get("http://localhost:5285/api/mixapi/getCategoryAndMovieType")
            .then(response => {
                const data = response.data;
                setCategories(data.category || []);
                setMovieTypes(data.movieTypes || []);
                setNations(data.nations || []);
                setStatuses(data.statuses || []);
                
                const processedMovies = processMovieData(data.movie || []);
                const processedNewestMovie = processMovieData(data.updateNewestMovie || []);
                const processedFinishedMovie = processMovieData(data.finishedMovie || []);
                setDashboardMovies(processedMovies);
                setNewestMovies(processedNewestMovie);
                setFinishedMovies(processedFinishedMovie);

            })
            .catch(error => console.error("Lỗi khi lấy dữ liệu dashboard:", error));
    }, []);

    // Fetch dữ liệu cho Search
    const fetchSearchMovies = async (searchKeyword) => {
        if (!searchKeyword) {
            setSearchMovies([]); // Clear kết quả tìm kiếm khi không có keyword
            return;
        }
        try {
            const response = await axios.get(
                `http://localhost:5285/api/movie/SearchMovie?Keyword=${searchKeyword}`
            );
            const processedMovies = processMovieData(response.data);
            setSearchMovies(processedMovies);
        } catch (error) {
            console.error("Lỗi khi tìm kiếm phim:", error);
            setSearchMovies([]);
        }
    };

    const debouncedSearch = _.debounce(fetchSearchMovies, 2000);

    useEffect(() => {
        debouncedSearch(keyword);
        return () => debouncedSearch.cancel();
    }, [keyword]);

    return (
        <DataContext.Provider 
            value={{ 
                categories, 
                movieTypes, 
                nations, 
                statuses,
                newestMovies,
                finishedMovies, 
                dashboardMovies, // Movie cho Dashboard
                searchMovies,    // Movie cho Search
                statusMap, 
                keyword, 
                setKeyword 
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    return useContext(DataContext);
}
export { DataContext, DataProvider };

