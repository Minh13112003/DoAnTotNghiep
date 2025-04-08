using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Model;
using DoAnTotNghiep.Repository;

namespace DoAnTotNghiep.Services
{
    public class LinkMovieServices : ILinkMovieServices
    {
        private readonly ILinkMovieRepository _linkMovieRepository;

        public LinkMovieServices(ILinkMovieRepository linkMovieRepository)
        {
            _linkMovieRepository = linkMovieRepository;
        }

        public async Task<bool> AddLinkMovie(LinkMovieDTOs linkMovieDTOs)
        {
            return await _linkMovieRepository.AddLinkMovie(linkMovieDTOs);
        }

        public async Task<bool> DeleteLinkMovie(string id)
        {
            return await _linkMovieRepository.DeleteLinkMovie(id);
        }

        public async Task<List<LinkMovie>> ShowAllLinkMovie()
        {
            return await _linkMovieRepository.ShowAllLinkMovie();
        }

        public async Task<bool> UpdateLinkMovie(LinkMovie linkMovie)
        {
            return await _linkMovieRepository.UpdateLinkMovie(linkMovie);
        }
    }
}
