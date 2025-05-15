using DoAnTotNghiep.Helper.RatingResult;
using DoAnTotNghiep.Repository;

namespace DoAnTotNghiep.Services
{
    public class MovieRatingService : IMovieRatingService
    {
        private readonly IMovieRatingRepository _repository;
        public MovieRatingService(IMovieRatingRepository repository)
        {
            _repository = repository;
        }
        public async Task<AddRatingResult> AddRating(string IdMovie, string UserName, int point)
        {
            return await _repository.AddRating(IdMovie, UserName, point);
        }
    }
}
