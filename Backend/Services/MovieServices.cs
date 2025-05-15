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

        public async Task<bool> AddHistoryMovie(string IdMovie, string UserName)
        {
           return await _movieRepository.AddHistoryMovie(IdMovie, UserName);
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

        public async Task<List<MovieToShowDTOs>> GetFavoriteMoviesBySlugTitlesAsync(List<string> slugTitles)
        {
            return await _movieRepository.GetFavoriteMoviesBySlugTitlesAsync(slugTitles);
        }

        public async Task<List<MovieToShowDTOs>> GetHistoryMovie(string UserName)
        {
            return await _movieRepository.GetHistoryMovie(UserName);
        }

        public async Task<List<MovieToShowDTOs>> GetNewestMovie()
        {
            return await _movieRepository.GetNewestMovie();
        }

        public async Task<bool> IncreaseMovieView(string titleSlug)
        {
            return await _movieRepository.IncreaseMovieView(titleSlug);
        }


        public async Task<bool> UpdateMovie(MovieDTOs movieDTOs, string Idmovie)
        {
            return await _movieRepository.UpdateMovie(movieDTOs, Idmovie);
        }

    }
}
