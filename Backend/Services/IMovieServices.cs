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
        Task<List<Movie>> GetMovieByName(string movieName);

        //Task<List<Movie>> GetMovieByCategory(string categoryName);
        Task<List<Movie>> GetMovieByType(string typeName);
    }
}
