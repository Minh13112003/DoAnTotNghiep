
using DoAnTotNghiep.Data;
using DoAnTotNghiep.DTOs;
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
        /*public async Task<dynamic> GetMovieTypeAndCategory()
        {
            var Category = await _databaseContext.Categories.ToListAsync();
            var movies = await _databaseContext.Movies
            .Where(m => m.Block == false)
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

            var Nations = movies.Select(m => new { m.nation, m.slugNation }).Distinct().ToList();
            var Statuses = movies.Select(m => m.status).Distinct().ToList();
            var Movie = movies.Select(m => new { m.title, m.slugtitle, m.nation, m.nameCategories, m.slugnameCategories, m.backgroundImage, m.description, m.image }).ToList();
            return new { Category, movieTypes, Nations, Statuses, Movie };
        }*/

        public async Task<dynamic> GetMovieTypeAndCategory()
{
            var Category = await _databaseContext.Categories.ToListAsync();

            var movies = await _databaseContext.Movies
                .Where(m => m.Block == false)
                .Select(m => new
                {
                    idmovie = m.IdMovie,
                    title = m.Title,
                    slugTitle = m.SlugTitle,
                    description = m.Description,
                    nameMovieType = m.TypeMovie,
                    slugNameMovieType = m.SlugTypeMovie,
                    nation = m.Nation,
                    slugNation = m.SlugNation,
                    status = m.Status,
                    image = m.Image,
                    nameCategories = string.Join(", ", m.SubCategories.Select(sc => sc.Category.NameCategories)),
                    slugnameCategories = string.Join(", ", m.SubCategories.Select(sc => sc.Category.SlugNameCategories)),
                    backgroundImage = m.BackgroundImage
                })
                .ToListAsync();

            var movieTypes = movies
                .Select(m => new { m.nameMovieType, m.slugNameMovieType })
                .Distinct()
                .ToList();

            var Nations = movies
                .Select(m => new { m.nation, m.slugNation })
                .Distinct()
                .ToList();

            var Statuses = movies
                .Select(m => m.status)
                .Distinct()
                .ToList();

            var Movie = movies
                .Select(m => new {
                    m.idmovie,
                    m.title,
                    m.slugTitle,
                    m.nation,
                    m.nameCategories,
                    m.slugnameCategories,
                    m.backgroundImage,
                    m.description,
                    m.image

                })
                .ToList();

            // ✅ Lấy danh sách phim mới nhất
            var sqlNewestMovies = @"
                    SELECT 
                        m.""Id"",
                        m.""Title"", 
                        m.""SlugTitle"",
                        m.""Nation"",
                        COALESCE(STRING_AGG(DISTINCT c.""NameCategories"", ', '), '') AS ""NameCategories"",
                        COALESCE(STRING_AGG(DISTINCT c.""SlugNameCategories"", ', '), '') AS ""SlugNameCategories"",
                        m.""BackgroundImage"",
                        m.""Description"",
                        m.""Image"",
                        lm.""CreatedAt"",
                        lm.""Episode""
                    FROM ""Movie"" m
                    LEFT JOIN ""SubCategories"" sc ON m.""Id"" = sc.""IdMovie""
                    LEFT JOIN ""Category"" c ON sc.""IdCategory"" = c.""IdCategories""
                    LEFT JOIN (
                        SELECT DISTINCT ON (""IdMovie"") ""IdMovie"", ""CreatedAt"", ""Episode"", ""UrlMovie""
                        FROM ""LinkMovie""
                        ORDER BY ""IdMovie"", ""CreatedAt"" DESC
                    ) lm ON m.""Id"" = lm.""IdMovie""
                    WHERE m.""Block"" = false
                    GROUP BY 
                        m.""Title"", m.""SlugTitle"", m.""Nation"", m.""BackgroundImage"", 
                        m.""Description"", m.""Image"", m.""Id"",
                        lm.""CreatedAt"", lm.""Episode"", lm.""UrlMovie""
                    ORDER BY lm.""CreatedAt"" DESC NULLS LAST
                    LIMIT 12;
                ";

            var UpdateNewestMovie = await _databaseContext.Database.SqlQueryRaw<MovieSimpleDTOs>(sqlNewestMovies).ToListAsync();

            // ✅ Lấy danh sách phim đã hoàn thành (Status = 5)
            var FinishedMovie = await _databaseContext.Movies
            .Where(m => m.Block == false && m.Status == "5")
            .Select(m => new {
                m.IdMovie,
                m.Title,
                m.Description,
                m.Image,
                m.BackgroundImage,
                m.TypeMovie,
                m.SlugTitle,
                m.SlugNation,
                m.Nation,
                nameCategories = string.Join(", ", m.SubCategories.Select(sc => sc.Category.NameCategories)),
                slugNameCategories = string.Join(", ", m.SubCategories.Select(sc => sc.Category.SlugNameCategories))
            })
            .ToListAsync();


            return new
            {
                Category,
                movieTypes,
                Nations,
                Statuses,
                Movie,
                UpdateNewestMovie,
                FinishedMovie
            };
        }

    }
}
