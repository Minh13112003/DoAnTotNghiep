
using DoAnTotNghiep.Data;
using DoAnTotNghiep.Migrations;
using Microsoft.EntityFrameworkCore;


namespace DoAnTotNghiep.Repository
{
    public class MixAPIRepository : IMixAPIRepository
    {
        private readonly DatabaseContext _databaseContext;
        public MixAPIRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public async Task<dynamic> GetcountMovieAndCategory()
        {
            var NumberOfMovie = await _databaseContext.Movies.CountAsync();
            var NumberOfCategory = await _databaseContext.Categories.CountAsync();
            return new { NumberOfMovie, NumberOfCategory };
        }

        public async Task<dynamic> GetMovieTypeAndCategory()
        {
            var Category = await _databaseContext.Categories.ToListAsync();
            var movies = await _databaseContext.Movies
            .Select(m => new
            {
                title = m.Title,
                slugtitle = m.SlugTitle,
                description = m.Description,
                nameMovieType = m.TypeMovie,
                slugNameMovieType = m.SlugTypeMovie,
                nation = m.Nation,
                slugNation = m.SlugNation,
                status = m.Status,
                image = m.Image,
                nameCategories = string.Join(", ",
                m.SubCategories.Select(sc => sc.Category.NameCategories)), // Lấy danh sách thể loại của phim
                slugnameCategories = string.Join(", ",
                m.SubCategories.Select(sc => sc.Category.SlugNameCategories)),
                backgroundImage = m.BackgroundImage
            })
            .ToListAsync();
            var movieTypes = movies
            .Select(m => new { m.nameMovieType, m.slugNameMovieType })
            .Distinct()
            .ToList();

            var Nations = movies.Select(m => new { m.nation , m.slugNation }).Distinct().ToList();
            var Statuses = movies.Select(m => m.status).Distinct().ToList();
            var Movie = movies.Select(m=> new {m.title, m.slugtitle,m.nation,m.nameCategories,m.slugnameCategories,m.backgroundImage,m.description, m.image}).ToList();
            return new { Category, movieTypes, Nations, Statuses, Movie };
        }
    }
}
