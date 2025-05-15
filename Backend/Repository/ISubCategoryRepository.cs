using DoAnTotNghiep.DTOs;

namespace DoAnTotNghiep.Repository
{
    public interface ISubCategoryRepository
    {
        Task<List<MovieToShowDTOs>> GetAllMovie(string role);
        Task<bool> CreateSubCategory(string IdMovie, string IdCategory);
        Task<List<MovieToShowDTOs>> GetMovieByTitleSlug(string titleSlug);
        Task<List<MovieToShowDTOs>> GetMovieByType(string type);
        Task<bool> DeleteMovie(string IdMovie);
        Task<bool> AddMovie(MovieToAddDTOs movieToAddDTOs);
        Task<List<MovieToShowDTOs>> GetMovieByCategory(string category);
        Task<bool> UpdateMovie(MovieToUpdateDTOs movieToAddDTOs);
        Task<List<MovieToShowDTOs>> SearchMovie (string? Keyword, string role);
        Task<List<MovieToShowDTOs>> GetMovieByNation(string nation);
        Task<List<MovieToShowDTOs>> GetMovieByStatus(string status);
        Task<List<MovieToShowDTOs>> GetMovieByActor(string actor);
        Task<List<MovieToShowDTOs>> GetMovieById(string id);
    }
}
