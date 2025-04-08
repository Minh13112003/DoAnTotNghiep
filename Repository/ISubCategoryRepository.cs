using DoAnTotNghiep.DTOs;

namespace DoAnTotNghiep.Repository
{
    public interface ISubCategoryRepository
    {
        Task<List<MovieToShowDTOs>> GetAllMovie();
        Task<bool> CreateSubCategory(string IdMovie, string IdCategory);
        public Task<List<MovieToShowDTOs>> GetMovieByTitleSlug(string titleSlug);
        public Task<List<MovieToShowDTOs>> GetMovieByType(string type);
        public Task<bool> DeleteMovie(string IdMovie);
        public Task<bool> AddMovie(MovieToAddDTOs movieToAddDTOs);
        public Task<List<MovieToShowDTOs>> GetMovieByCategory(string category);
        public Task<bool> UpdateMovie(MovieToUpdateDTOs movieToAddDTOs);
        public Task<List<MovieToShowDTOs>> SearchMovie (string? Keyword);
        public Task<List<MovieToShowDTOs>> GetMovieByNation(string nation);
        public Task<List<MovieToShowDTOs>> GetMovieByStatus(string status);
        public Task<List<MovieToShowDTOs>> GetMovieByActor(string actor);
    }
}
