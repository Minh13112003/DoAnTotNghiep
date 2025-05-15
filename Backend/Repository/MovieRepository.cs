using DoAnTotNghiep.Data;
using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Helper.SlugifyHelper;
using DoAnTotNghiep.Migrations;
using DoAnTotNghiep.Model;
using Microsoft.EntityFrameworkCore;
using Npgsql;




namespace DoAnTotNghiep.Repository
{
    public class MovieRepository : IMovieRepository
    {
        private readonly DatabaseContext _dbContext;

        public MovieRepository(DatabaseContext dbcontext)
        {
            _dbContext = dbcontext;
        }
        public async Task <bool> AddMovie(MovieDTOs movieDTOs)
        {
            try
            {
                var Movie = new Movie
                {
                    IdMovie = Guid.NewGuid().ToString(),
                    Title = movieDTOs.Title,
                    SlugTitle = movieDTOs.SlugTitle,
                    Description = movieDTOs.Description,
                    Duration = movieDTOs.Duration,
                    Language = movieDTOs.Language,
                    Nation = movieDTOs.Nation,
                    Image = movieDTOs.Image,
                    NumberOfMovie = movieDTOs.NumberOfMovie,
                    Quality = movieDTOs.Quality,
                    Status = movieDTOs.Status,
                    TypeMovie = movieDTOs.TypeMovie,
                    View = movieDTOs.View,
                                   
                };

                await _dbContext.Movies.AddAsync(Movie);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<string> DeleteMovie(string movieId)
        {
            
            var movie = await _dbContext.Movies.FirstOrDefaultAsync(u => u.IdMovie == movieId);

            // Kiểm tra nếu movie tồn tại
            if (movie != null)
            {
                string title = movie.Title;
                _dbContext.Movies.Remove(movie);  
                await _dbContext.SaveChangesAsync(); 

                return title; 
            }

            return null; 
        }

        public async Task<List<Movie>> GetAllMovie()
        {
            return await _dbContext.Movies.ToListAsync();
        }


        public async Task<List<Movie>> GetMovieByName(string movieName)
        {
            

            return await _dbContext.Movies
                .Where(movie => !string.IsNullOrEmpty(movie.Title) &&
                                movie.SlugTitle.ToLower().Contains(movieName.ToLower())) 
                .AsNoTracking()
                .ToListAsync();
        }

        


        public async Task<bool> UpdateMovie(MovieDTOs movieDTOs, string IdMovie)
        {
            // Tìm movie trong cơ sở dữ liệu theo IdMovie
            var movie = await _dbContext.Movies.FirstOrDefaultAsync(u => u.IdMovie == IdMovie);
          
            if (movie == null)
            {
                return false; 
            }

            // Cập nhật các trường trong movie từ MovieDTOs
            movie.Title = movieDTOs.Title;
            movie.SlugTitle = movieDTOs.SlugTitle;
            movie.Description = movieDTOs.Description;
            movie.Nation = movieDTOs.Nation;
            movie.TypeMovie = movieDTOs.TypeMovie;
            movie.Status = movieDTOs.Status;

            movie.NumberOfMovie = movieDTOs.NumberOfMovie;
            movie.Duration = movieDTOs.Duration;
            movie.Quality = movieDTOs.Quality;
            movie.Language = movieDTOs.Language;
            movie.View = movieDTOs.View;
            

            // Lưu thay đổi vào cơ sở dữ liệu
            await _dbContext.SaveChangesAsync();

            return true; // Trả về true nếu cập nhật thành công
        }
        public async Task<List<MovieToShowDTOs>> GetFavoriteMoviesBySlugTitlesAsync(List<string> slugTitles)
        {
            if (slugTitles == null || !slugTitles.Any())
                return new List<MovieToShowDTOs>();

            // Tạo danh sách parameter kiểu: @slug0, @slug1, ...
            var parameters = new List<NpgsqlParameter>();
            var slugConditions = new List<string>();

            for (int i = 0; i < slugTitles.Count; i++)
            {
                var paramName = $"@slug{i}";
                slugConditions.Add($"m.\"SlugTitle\" = {paramName}");
                parameters.Add(new NpgsqlParameter(paramName, slugTitles[i]));
            }

            var whereClause = string.Join(" OR ", slugConditions);

            var sql = $@"
                    SELECT 
                        m.""Id"", 
                        m.""Title"",  
                        m.""Description"", 
                        m.""Nation"", 
                        m.""TypeMovie"", 
                        m.""Status"", 
                        m.""NumberOfMovie"",
                        m.""Duration"", 
                        m.""Quality"", 
                        m.""Language"", 
                        m.""View"", 
                        m.""Image"",
                        m.""IsVip"",
                        m.""Block"",
                        m.""NameDirector"",
                        m.""BackgroundImage"",
                        m.""Point"",
                        lm.""Episode"",
                        lm.""CreatedAt"",               
                        COALESCE(STRING_AGG(DISTINCT c.""NameCategories"", ', '), '') AS ""NameCategories"",
                        COALESCE(STRING_AGG(DISTINCT a.""ActorName"", ', '), '') AS ""NameActors"",
                        lm.""UrlMovie"" AS ""UrlMovie""
                    FROM ""Movie"" m
                    LEFT JOIN ""SubCategories"" sc ON m.""Id"" = sc.""IdMovie""
                    LEFT JOIN ""Category"" c ON sc.""IdCategory"" = c.""IdCategories""
                    LEFT JOIN (
                        SELECT DISTINCT ON (""IdMovie"") ""IdMovie"", ""Episode"", ""CreatedAt"", ""UrlMovie""
                        FROM ""LinkMovie""
                        ORDER BY ""IdMovie"", ""CreatedAt"" DESC
                    ) lm ON m.""Id"" = lm.""IdMovie""
                    LEFT JOIN ""SubActor"" sa ON m.""Id"" = sa.""IdMovie""
                    LEFT JOIN ""Actor"" a ON sa.""IdActor"" = a.""IdActor""
                    WHERE {whereClause}
                    GROUP BY m.""Id"", lm.""UrlMovie"", lm.""Episode"", lm.""CreatedAt"";";

            return await _dbContext.Database
                .SqlQueryRaw<MovieToShowDTOs>(sql, parameters.ToArray())
                .ToListAsync();
        }
        public async Task<bool> IncreaseMovieView(string titleSlug)
        {
            var movie = await _dbContext.Movies
                .FirstOrDefaultAsync(m => m.SlugTitle == titleSlug);

            if (movie == null) return false;

            movie.View += 1;
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<List<MovieToShowDTOs>> GetNewestMovie()
        {
           
            var sql = @"
                    SELECT 
                        m.""Id"", 
                        m.""Title"", 
                        m.""Description"", 
                        m.""Nation"", 
                        m.""TypeMovie"", 
                        m.""Status"", 
                        m.""NumberOfMovie"", 
                        m.""Duration"", 
                        m.""Quality"", 
                        m.""Language"", 
                        m.""View"", 
                        m.""Image"", 
                        m.""BackgroundImage"",
                        m.""IsVip"",
                        m.""Block"",
                        m.""NameDirector"",
                        m.""Point"",
                        COALESCE(STRING_AGG(DISTINCT c.""NameCategories"", ', '), '') AS ""NameCategories"",
                        COALESCE(STRING_AGG(DISTINCT a.""ActorName"", ', '), '') AS ""NameActors"",
                        lm.""Episode"" AS ""Episode"",
                        lm.""CreatedAt"" AS ""CreatedAt"",
                        lm.""UrlMovie"" AS ""UrlMovie""
                    FROM ""Movie"" m
                    LEFT JOIN ""SubCategories"" sc ON m.""Id"" = sc.""IdMovie""
                    LEFT JOIN ""Category"" c ON sc.""IdCategory"" = c.""IdCategories""
                    LEFT JOIN (
                        SELECT DISTINCT ON (""IdMovie"") *
                        FROM ""LinkMovie""
                        ORDER BY ""IdMovie"", ""CreatedAt"" DESC
                    ) lm ON m.""Id"" = lm.""IdMovie""
                    LEFT JOIN ""SubActor"" sa ON m.""Id"" = sa.""IdMovie""
                    LEFT JOIN ""Actor"" a ON sa.""IdActor"" = a.""IdActor""
                    WHERE m.""Block"" = false
                    GROUP BY 
                        m.""Id"", m.""Title"", m.""Description"", m.""Nation"", m.""TypeMovie"", 
                        m.""Status"", m.""NumberOfMovie"", m.""Duration"", m.""Quality"", 
                        m.""Language"", m.""View"", m.""Image"", m.""BackgroundImage"", 
                        m.""IsVip"", m.""Block"", m.""NameDirector"", 
                        lm.""Episode"", lm.""CreatedAt"", lm.""UrlMovie""
                    ORDER BY lm.""CreatedAt"" DESC NULLS LAST
                    ;";


            return await _dbContext.Database.SqlQueryRaw<MovieToShowDTOs>(sql).ToListAsync();
        }


        public async Task<bool> AddHistoryMovie(string IdMovie, string UserName)
        {
            if (IdMovie == null || UserName == null) return false;
            var History = await _dbContext.History.FirstOrDefaultAsync(h => h.IdMovie == IdMovie && h.UserName == UserName);
            if (History != null)
            {
                var movies = await _dbContext.Movies
                    .FirstOrDefaultAsync(m => m.IdMovie == IdMovie);
                if (movies == null) return false;
                movies.View += 1;
                await _dbContext.SaveChangesAsync();
                return true;
            }
            History history = new History
            {
                IdMovie = IdMovie,
                UserName = UserName,
            };
            await _dbContext.History.AddAsync(history);
            var movie = await _dbContext.Movies
                .FirstOrDefaultAsync(m => m.IdMovie == IdMovie);
            if (movie == null) return false;
            movie.View += 1;
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<List<MovieToShowDTOs>> GetHistoryMovie(string UserName)
        {
            if (UserName == null) return new List<MovieToShowDTOs>();
            var sql = $@"
                        SELECT 
                            m.""Id"", 
                            m.""Title"",  
                            m.""Description"", 
                            m.""Nation"", 
                            m.""TypeMovie"", 
                            m.""Status"", 
                            m.""NumberOfMovie"",
                            m.""Duration"", 
                            m.""Quality"", 
                            m.""Language"", 
                            m.""View"", 
                            m.""Image"",
                            m.""IsVip"",
                            m.""Block"",
                            m.""NameDirector"",
                            m.""BackgroundImage"",
                            m.""Point"",
                            lm.""Episode"",
                            lm.""CreatedAt"",               
                            COALESCE(STRING_AGG(DISTINCT c.""NameCategories"", ', '), '') AS ""NameCategories"",
                            COALESCE(STRING_AGG(DISTINCT a.""ActorName"", ', '), '') AS ""NameActors"",
                            lm.""UrlMovie"" AS ""UrlMovie""
                        FROM ""Movie"" m
                        INNER JOIN ""History"" h ON m.""Id"" = h.""IdMovie""
                        LEFT JOIN ""SubCategories"" sc ON m.""Id"" = sc.""IdMovie""
                        LEFT JOIN ""Category"" c ON sc.""IdCategory"" = c.""IdCategories""
                        LEFT JOIN (
                            SELECT DISTINCT ON (""IdMovie"") ""IdMovie"", ""Episode"", ""CreatedAt"", ""UrlMovie""
                            FROM ""LinkMovie""
                            ORDER BY ""IdMovie"", ""CreatedAt"" DESC
                        ) lm ON m.""Id"" = lm.""IdMovie""
                        LEFT JOIN ""SubActor"" sa ON m.""Id"" = sa.""IdMovie""
                        LEFT JOIN ""Actor"" a ON sa.""IdActor"" = a.""IdActor""
                        WHERE h.""UserName"" = @userName
                        AND m.""Block"" = false
                        GROUP BY m.""Id"", lm.""UrlMovie"", lm.""Episode"", lm.""CreatedAt"";";
            return await _dbContext.Database
        .SqlQueryRaw<MovieToShowDTOs>(sql, new[] { new NpgsqlParameter("@userName", UserName) })
            .ToListAsync();
        }
    }
}
