using DoAnTotNghiep.Data;
using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Helper.SlugifyHelper;
using DoAnTotNghiep.Model;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;


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

        /*public async Task<List<Movie>> GetMovieByCategory(string categorySlug)
        {
            string normalizedCategorySlug = SlugHelper.Slugify(categorySlug.ToLower().Trim());

            return await _dbContext.Movies
                .Where(movie => !string.IsNullOrEmpty(movie.SlugCatelogies) &&
                                _dbContext.Movies
                                    .Where(m => EF.Functions.Like(movie.SlugCatelogies, $"%{normalizedCategorySlug}%"))
                                    .Any())
                .ToListAsync();
        }*/




        public async Task<List<Movie>> GetMovieByName(string movieName)
        {
            

            return await _dbContext.Movies
                .Where(movie => !string.IsNullOrEmpty(movie.Title) &&
                                movie.SlugTitle.ToLower().Contains(movieName.ToLower())) 
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<List<Movie>> GetMovieByType(string typeName)
        {
            string normalizedTypeSlug = SlugHelper.Slugify(typeName.ToLower().Trim());

            return  _dbContext.Movies
                .AsNoTracking() // Tránh tracking để cải thiện hiệu suất
                .Where(movie => !string.IsNullOrEmpty(movie.TypeMovie))
                .AsEnumerable() // Đưa dữ liệu về client-side
                .Where(movie => SlugHelper.Slugify(movie.TypeMovie.ToLower().Trim()) == normalizedTypeSlug)
                .ToList();
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

    }
}
