using DoAnTotNghiep.Data;
using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Model;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Repository
{
    public class LinkMovieRepository : ILinkMovieRepository
    {
        private readonly DatabaseContext _databaseContext;
        public LinkMovieRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public async Task<bool> AddLinkMovie(LinkMovieDTOs linkMovieDTOs)
        {
            if (linkMovieDTOs == null) return false;
            var LinkMovie = await _databaseContext.LinkMovies.FirstOrDefaultAsync(i => i.UrlMovie == linkMovieDTOs.UrlMovie || i.IdMovie == linkMovieDTOs.IdMovie && i.Episode == linkMovieDTOs.Episode);
            if(LinkMovie != null) return false;
            LinkMovie linkMovie = new LinkMovie
            {
                IdLinkMovie = Guid.NewGuid().ToString(),
                IdMovie = linkMovieDTOs.IdMovie,
                Episode = linkMovieDTOs.Episode,
                UrlMovie = linkMovieDTOs.UrlMovie
            };
            await _databaseContext.AddAsync(linkMovie);
            await _databaseContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteLinkMovie(string id)
        {
            if (!String.IsNullOrEmpty(id))
            {
                var linkmovie = await _databaseContext.LinkMovies.FirstOrDefaultAsync(i => i.IdLinkMovie == id);
                if (linkmovie != null)
                {
                     _databaseContext.LinkMovies.Remove(linkmovie);
                    await _databaseContext.SaveChangesAsync();
                    return true;
                }
                
            }
            return false;
        }

        public async Task<List<LinkMovie>> ShowAllLinkMovie()
        {
            return await _databaseContext.LinkMovies.AsNoTracking().ToListAsync();
        }

        public async Task<bool> UpdateLinkMovie(LinkMovie linkMovie)
        {
            if(linkMovie.IdLinkMovie != null)
            {
                var movie = await _databaseContext.LinkMovies.FirstOrDefaultAsync(i =>i.IdLinkMovie == linkMovie.IdLinkMovie);
                if (movie != null)
                {
                    movie.UrlMovie = linkMovie.UrlMovie;
                    movie.Episode = linkMovie.Episode;
                    movie.UrlMovie = linkMovie.UrlMovie;
                    await _databaseContext.SaveChangesAsync();
                    return true;
                }
            }
            return false;
        }
    }
}
