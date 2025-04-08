using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Repository;

namespace DoAnTotNghiep.Services
{
    public class SubCategoryServices : ISubCategoryServices
    {
        private readonly ISubCategoryRepository _repository;
        public SubCategoryServices(ISubCategoryRepository repository) {
            _repository = repository;
        }

        public async Task<bool> AddMovie(MovieToAddDTOs movieToAddDTOs)
        { 
            return await _repository.AddMovie(movieToAddDTOs);
        }

        public async Task<bool> CreateSubCategory(string IdMovie, string IdCategory)
        {
            return await _repository.CreateSubCategory(IdMovie, IdCategory);
        }

        public async Task<List<MovieToShowDTOs>> GetAllMovie()
        {
            return await _repository.GetAllMovie();
        }

        public async Task<List<MovieToShowDTOs>> GetMovieByCategory(string category)
        {
            return await _repository.GetMovieByCategory(category);
        }

        public async Task<List<MovieToShowDTOs>> GetMovieByTitleSlug(string titleSlug)
        {
            return await _repository.GetMovieByTitleSlug(titleSlug);
        }

        public async Task<List<MovieToShowDTOs>> GetMovieByType(string type)
        {
            return await _repository.GetMovieByType(type);
        }

        public async Task<bool> UpdateMovie(MovieToUpdateDTOs movieToAddDTOs)
        {
            return await _repository.UpdateMovie (movieToAddDTOs);
        }
        public async Task<bool> DeleteMovie(string IdMovie)
        {
            return await _repository.DeleteMovie(IdMovie);
        }

        public async Task<List<MovieToShowDTOs>> SearchMovie(string? Keyword)
        {
            return await _repository.SearchMovie(Keyword);
        }

        public async Task<List<MovieToShowDTOs>> GetMovieByNation(string nation)
        {
            return await _repository.GetMovieByNation(nation);
        }

        public async Task<List<MovieToShowDTOs>> GetMovieByStatus(string status)
        {
            return await _repository.GetMovieByStatus(status);
        }

        public async Task<List<MovieToShowDTOs>> GetMovieByActor(string actor)
        {
            return await _repository.GetMovieByActor(actor);
        }
    }
}
