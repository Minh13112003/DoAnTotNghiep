using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Model;

namespace DoAnTotNghiep.Services
{
    public interface IMovieServices
    {
        Task<bool> AddMovie(MovieDTOs movieDTOs);
        Task<bool> UpdateMovie(MovieDTOs movieDTOs, string Idmovie);
        Task<string> DeleteMovie(string movieId);
        Task<List<Movie>> GetAllMovie();
        
        Task<List<MovieToShowDTOs>> GetFavoriteMoviesBySlugTitlesAsync(List<string> slugTitles);
        Task<bool> IncreaseMovieView(string titleSlug);
        Task<List<MovieToShowDTOs>> GetNewestMovie();
        Task<bool> AddHistoryMovie(string IdMovie, string UserName);
        Task<List<MovieToShowDTOs>> GetHistoryMovie(string UserName);
    }
}
