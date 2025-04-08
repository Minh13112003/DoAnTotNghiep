using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Model;

namespace DoAnTotNghiep.Services
{
    public interface ILinkMovieServices
    {
        public Task<bool> AddLinkMovie(LinkMovieDTOs linkMovieDTOs);
        public Task<bool> UpdateLinkMovie(LinkMovie linkMovie);
        public Task<bool> DeleteLinkMovie(string id);
        public Task<List<LinkMovie>> ShowAllLinkMovie();
    }
}
