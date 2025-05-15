using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Helper.RatingResult;
using DoAnTotNghiep.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoAnTotNghiep.Controllers
{
    [Route("api/movierating")]
    public class MovieRatingController : ControllerBase
    {
        private readonly IMovieRatingService _service;
        public MovieRatingController(IMovieRatingService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpPost("AddRating")]
        public async Task<IActionResult> AddRating([FromBody] MovieRatingDTOs movieRatingDTOs)
        {
            try
            {
                if(!ModelState.IsValid) return BadRequest(ModelState);
                var UserName = User.Identity?.Name;
                var result = await _service.AddRating(movieRatingDTOs.IdMovie, UserName!,movieRatingDTOs.Point);
                switch (result)
                {
                    case AddRatingResult.Success:
                        return Ok("Đánh giá phim thành công");
                    case AddRatingResult.MissingInfo:
                        return BadRequest("Thiếu thông tin");
                    case AddRatingResult.AlreadyRated:
                        return BadRequest("Bạn đã đánh giá phim này");
                    case AddRatingResult.NotWatched:
                        return BadRequest("Bạn chưa xem phim này");
                    default:
                        return StatusCode(500, "Lỗi không xác định");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
