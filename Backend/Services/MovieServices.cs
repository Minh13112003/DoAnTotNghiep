using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Model;
using DoAnTotNghiep.Repository;

namespace DoAnTotNghiep.Services
{
    public class MovieServices : IMovieServices
    {
        private readonly IMovieRepository _movieRepository;

        public MovieServices(IMovieRepository movieRepository)
        {
           _movieRepository = movieRepository;
        }
        public async Task<bool> AddMovie(MovieDTOs movieDTOs)
        {
            return await _movieRepository.AddMovie(movieDTOs);
        }

        public async Task<string> DeleteMovie(string movieId)
        {
            return await _movieRepository.DeleteMovie(movieId);
        }

        public async Task<List<Movie>> GetAllMovie()
        {
            return await _movieRepository.GetAllMovie();
        }

        /*public async Task<List<Movie>> GetMovieByCategory(string categoryName)
        {
            return await _movieRepository.GetMovieByCategory(categoryName);
        }*/

        public async Task<List<Movie>> GetMovieByName(string movieName)
        {
            return await _movieRepository.GetMovieByName(movieName);
        }

        public async Task<List<Movie>> GetMovieByType(string typeName)
        {
            return await _movieRepository.GetMovieByType(typeName);
        }

        public async Task<bool> UpdateMovie(MovieDTOs movieDTOs, string Idmovie)
        {
            return await _movieRepository.UpdateMovie(movieDTOs, Idmovie);
        }
    }
}
