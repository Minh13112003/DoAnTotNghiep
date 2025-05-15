using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DoAnTotNghiep.Helper.SlugifyHelper;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using DoAnTotNghiep.Model;

namespace DoAnTotNghiep.Controllers
{
    [Route("api/movie")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly IMovieServices _services;
        private readonly ITokenServices _tokenServices;
        private readonly ISubCategoryServices _subCategoryServices;
        private readonly UserManager<AppUser> _userManager;
       

        public MovieController(IMovieServices services, ITokenServices tokenServices, ISubCategoryServices subCategoryServices,UserManager<AppUser> userManager)
        {
            _services = services;
            _tokenServices = tokenServices;
            _subCategoryServices = subCategoryServices;
            _userManager = userManager;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("addmovie")]
        public async Task<IActionResult> AddMovie([FromBody]MovieToAddDTOs movieDTOs)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                var addMovie = await _subCategoryServices.AddMovie(movieDTOs);

                if (addMovie != null) return Ok(new {message = "Thêm thành công"});               
                else return Unauthorized(new {message = "Thêm thất bại"});
                
            }
            catch (Exception ex)
            {
                return StatusCode(500,ex.Message);
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("delete/{movieid}")]
        public async Task<IActionResult> DeleteMovie(string movieid)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                var DeleteMovie = await _subCategoryServices.DeleteMovie(movieid);              

                if (DeleteMovie != null) return Ok(new { message = "Xóa phim thành công" });
                else return Unauthorized(new { message = "Xóa phim thất bại" });
            }
            catch (Exception ex)
            {
                return StatusCode(500,ex.Message);
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateMovie([FromBody] MovieToUpdateDTOs movieDTOs)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                var Movie = await _subCategoryServices.UpdateMovie(movieDTOs);

                if (Movie != false) return Ok(new { message = "Sửa phim thành công" });
                else return Unauthorized(new { message = "Sửa thất bại" });
            }catch(Exception ex)
            {
                return StatusCode(500,ex.Message);
            }
        }


        
        [HttpGet("getMovieBySlugCategory/{slugCategoryName}")]
        public async Task<IActionResult> GetMovieByCategory([FromRoute]string slugCategoryName)
        {

            try
            {
                if (string.IsNullOrWhiteSpace(slugCategoryName))
                {
                    return BadRequest(new { message = "Category name cannot be empty!" });
                }

               string SlugCategoryName = SlugHelper.Slugify(slugCategoryName);
                var movies = await _subCategoryServices.GetMovieByCategory(SlugCategoryName);

                if (movies == null)
                {
                    return NotFound(new { message = $"No movies found for category: {slugCategoryName}" });
                }

                return Ok(movies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        
        [HttpGet("GetMovieBySlugTitle/{slugtitle}")]
        public async Task<IActionResult> GetMovieByTilte(string slugtitle)
        {
            try
            {
                
                if (!ModelState.IsValid) return BadRequest(ModelState);
                string SlugTitle = SlugHelper.Slugify(slugtitle);
                var movie = await _subCategoryServices.GetMovieByTitleSlug(SlugTitle);
                if (movie == null) return NotFound(new { message = "Không tìm thấy phim hoặc sai định dạng Slug" });

                return Ok(movie);
            }
            catch (Exception ex) 
            { 
                return StatusCode(500, ex.Message);
            }

        }
        [HttpGet("GetMovieById/{id}")]
        public async Task<IActionResult> GetMovieById(string id)
        {
            try
            {
                if (!string.IsNullOrEmpty(id)) 
                {
                    var movie = await _subCategoryServices.GetMovieById(id);
                    if (movie == null) return NotFound(new {message = "Không tìm thấy phim" });
                    return Ok(movie);
                }
                return BadRequest(new { message = "Đã có lỗi xảy ra" });
            }catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpGet("GetMovieBySlugType/{slugtype}")]
        public async Task<IActionResult> GetMovieBySlugType(string slugtype)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(slugtype))
                {
                    return BadRequest(new { message = "Type name cannot be empty!" });
                }
                string SlugType = SlugHelper.Slugify(slugtype);
                var movies = await _subCategoryServices.GetMovieByType(SlugType);
                if (movies == null || !movies.Any()) return NotFound(new { message = "No movies found!" });

                return Ok(movies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
        
        [HttpGet("ShowAllMovieCategory")]
        public async Task<IActionResult> ShowAllMovieIncludeCategory()
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
                var movie = await _subCategoryServices.GetAllMovie(role!);
                if (movie == null) return NotFound(new { message = "Không tìm thấy phim" });
                return Ok(movie);

            }catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpGet("SearchMovie")]
        public async Task<IActionResult> SearchMovie(string? Keyword)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                if (!Keyword.IsNullOrEmpty())
                {
                    var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
                    var MovieToSearch = await _subCategoryServices.SearchMovie(Keyword, role!);
                    if (MovieToSearch != null)
                    {
                        return Ok(MovieToSearch);

                    }
                    else return BadRequest(new { message = "Không tìm được phim" });
                }
                else return BadRequest(new { message = "Keyword không được để trống" });

            }
            catch (Exception ex)
            {

                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("GetMovieBySlugNation/{slugNation}")]
        public async Task<IActionResult> GetMovieByNation(string slugNation)
        {
            try
            {
                if(!ModelState.IsValid) return BadRequest(ModelState);
                if (slugNation.IsNullOrEmpty()) return BadRequest(new { message = "Bị trống thông tin" });
                string SlugNation = SlugHelper.Slugify(slugNation);
                var movies = await _subCategoryServices.GetMovieByNation(SlugNation);
                if (movies != null) return Ok(movies);
                return BadRequest(new { message = "Không tìm thấy phim" });
            }
            catch (Exception ex)
            {
                return StatusCode(500,ex.Message);
            }
        }
        [HttpGet("GetMovieByStatus/{status}")]
        public async Task<IActionResult> GetMovieByStatus(string status)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                if (status.IsNullOrEmpty()) return BadRequest(new { message = "Bị trống thông tin" });
                var movies = await _subCategoryServices.GetMovieByStatus(status);
                if (movies != null) return Ok(movies);
                return BadRequest(new { message = "Không tìm thấy phim" });
            }
            catch(Exception ex)
            {
                return StatusCode(500,ex.Message);
            }
        }
        [HttpGet("GetMovieByActor/{actor}")]
        public async Task<IActionResult> GetMovieByActor(string actor)
        {
            try
            {
                if (!ModelState.IsValid || actor.IsNullOrEmpty()) return BadRequest(new { message = "Đã có lỗi xảy ra" });
                string actorSlug = SlugHelper.Slugify(actor);
                var movie = await _subCategoryServices.GetMovieByActor(actorSlug);
                if (movie != null) return Ok(movie);
                return BadRequest(new { message = "Không tìm thấy phim" });
            }catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [Authorize]
        [HttpPost("ToggleFavoriteMovie/{slugtitle}")]
        public async Task<IActionResult> ToggleFavoriteMovie(string slugtitle)
        {
            try
            {
                var userName = User.Identity?.Name;
                if (string.IsNullOrEmpty(userName)) return Unauthorized(new { message = "Không xác định được người dùng." });

                var user = await _userManager.FindByNameAsync(userName);
                if (user == null) return NotFound(new { message = "Không tìm thấy người dùng." });

                var newSlugTitle = SlugHelper.Slugify(slugtitle);

                var currentFavorite = user.FavoriteSlugTitle ?? string.Empty;
                var list = currentFavorite.Split(",", StringSplitOptions.RemoveEmptyEntries).Select(x => x.Trim()).ToList();

                string message;

                if (list.Contains(newSlugTitle))
                {
                    list.Remove(newSlugTitle);
                    message = "Đã xóa phim khỏi danh sách yêu thích.";
                }
                else
                {
                    list.Add(newSlugTitle);
                    message = "Đã thêm phim vào danh sách yêu thích.";
                }

                user.FavoriteSlugTitle = string.Join(",", list);

                var result = await _userManager.UpdateAsync(user);
                if (result.Succeeded)
                {
                    return Ok(new { message });
                }
                else
                {
                    return StatusCode(500, new { message = "Có lỗi xảy ra khi cập nhật dữ liệu." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("FavoriteMovies")]
        public async Task<IActionResult> GetFavoriteMovies()
        {
            var userName = User.Identity?.Name;
            if (string.IsNullOrEmpty(userName))
                return Unauthorized(new { message = "Không xác định được người dùng." });

            var user = await _userManager.FindByNameAsync(userName);
            if (user == null || string.IsNullOrEmpty(user.FavoriteSlugTitle))
                return NotFound(new { message = "Không tìm thấy hoặc danh sách yêu thích trống." });

            var slugTitles = user.FavoriteSlugTitle
                .Split(",", StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .ToList();

            var movies = await _services.GetFavoriteMoviesBySlugTitlesAsync(slugTitles);

            return Ok(movies);
        }
        [HttpPost("IncreaseView/{titleSlug}")]
        public async Task<IActionResult> IncreaseView(string titleSlug)
        {
            if(titleSlug.IsNullOrEmpty()) return BadRequest(new {messsae = ""});
            var result = await _services.IncreaseMovieView(titleSlug);
            if (!result)
                return NotFound();

            return Ok(new { message = "Tăng View thành công." });
        }
        [HttpGet("GetNewestMovie")]
        public async Task<IActionResult> GetNewestMovie()
        {
            try
            {
                if(!ModelState.IsValid) return BadRequest(ModelState);
                var movie = await _services.GetNewestMovie();
                return Ok(movie);
            }catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [Authorize]
        [HttpPost("AddHistory")]
        public async Task<IActionResult> AddMovieHistory([FromBody] HistoryDTOs historyDTOs)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                var userName = User.Identity?.Name;
                var result = await _services.AddHistoryMovie(historyDTOs.IdMovie, userName!);
                if (result == true) return Ok(new { message = "Đã lưu phim vào lịch sử xem phim hoặc phim đã lưu vào lịch sử xem phim" });
                return Unauthorized(new { message = "Trống thông tin " });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [Authorize]
        [HttpGet("GetHistoryMovie")]
        public async Task<IActionResult> GetHistoryMovie()
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                var UserName = User.Identity?.Name;
                var Movie = await _services.GetHistoryMovie(UserName!);
                return Ok(Movie);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
