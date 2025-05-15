using DoAnTotNghiep.DTOs;

namespace DoAnTotNghiep.Services
{
    public interface ISubCategoryServices
    {
        Task<List<MovieToShowDTOs>> GetAllMovie(string role);
        Task<bool> CreateSubCategory(string IdMovie, string IdCategory);
        Task<List<MovieToShowDTOs>> GetMovieByTitleSlug(string titleSlug);
        Task<List<MovieToShowDTOs>> GetMovieByType(string type);
        public Task<bool> AddMovie(MovieToAddDTOs movieToAddDTOs);
        public Task<List<MovieToShowDTOs>> GetMovieByCategory(string category);
        public Task<bool> UpdateMovie(MovieToUpdateDTOs movieToAddDTOs);
        public Task<bool> DeleteMovie(string IdMovie);
        public Task<List<MovieToShowDTOs>> SearchMovie(string? Keyword, string role);
        public Task<List<MovieToShowDTOs>> GetMovieByNation(string nation);
        public Task<List<MovieToShowDTOs>> GetMovieByStatus(string status);
        public Task<List<MovieToShowDTOs>> GetMovieByActor(string actor);
        Task<List<MovieToShowDTOs>> GetMovieById(string id);
    }
}
