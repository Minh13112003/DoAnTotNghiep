using DoAnTotNghiep.Data;
using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace DoAnTotNghiep.Controllers
{
    [Route("api/profile")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly UserManager<AppUser> _userManager;
        private readonly DatabaseContext _database;
        private readonly ILogger<ProfileController> _logger;

        public ProfileController(IWebHostEnvironment env, UserManager<AppUser> userManager, DatabaseContext database, ILogger<ProfileController> logger)
        {
            _env = env;
            _userManager = userManager;
            _database = database;
            _logger = logger;
        }
        [Authorize]
        [HttpPost("upload-avatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] FormFileDTO formFileDTO)
        {
            var file = formFileDTO.File;
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");
            
            // Kiểm tra loại file ảnh
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif" };
            if (!allowedTypes.Contains(file.ContentType))
                return BadRequest("Only image files (jpg, png, gif) are allowed.");

            // Tạo tên file duy nhất
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            // Tạo thư mục lưu file nếu chưa tồn tại
            var uploadPath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "Images", "Avatars");
            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            var filePath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Trả về URL file hoặc tên file
            var fileUrl = $"{Request.Scheme}://{Request.Host}/Images/Avatars/{fileName}";
            var username = User.Identity?.Name;
            var user = await _userManager.FindByNameAsync(username!);
            if (!string.IsNullOrEmpty(user?.Image))
            {
                var oldFileName = Path.GetFileName(new Uri(user.Image).LocalPath);
                var oldFilePath = Path.Combine(uploadPath, oldFileName);

                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }
            }
            user!.Image = fileUrl;
            await _userManager.UpdateAsync(user);
            return Ok(new { fileName, fileUrl });
        }
        [Authorize]
        [HttpPost("upload-Image")]
        public async Task<IActionResult> UploadImage([FromForm] UploadImageOrBackgroundDTO UploadImage)
        {
            var file = UploadImage.File;
            var NameMovie = UploadImage.NameMovie;
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // Kiểm tra loại file ảnh
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif" };
            if (!allowedTypes.Contains(file.ContentType))
                return BadRequest("Only image files (jpg, png, gif) are allowed.");

            // Tạo tên file duy nhất
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            // Tạo thư mục lưu file nếu chưa tồn tại
            var uploadPath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "Images", "ImageMovie");
            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            var filePath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Trả về URL file hoặc tên file
            var fileUrl = $"{Request.Scheme}://{Request.Host}/Images/ImageMovie/{fileName}";
            var movie = await _database.Movies.FirstOrDefaultAsync(i => i.Title == NameMovie);
            if (!string.IsNullOrEmpty(movie?.Image))
            {
                var oldFileName = Path.GetFileName(new Uri(movie.Image).LocalPath);
                var oldFilePath = Path.Combine(uploadPath, oldFileName);     
                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }
            }
            movie!.Image = fileUrl;
            await _database.SaveChangesAsync();
            return Ok(new { fileName, fileUrl});
        }
        [Authorize]
        [HttpPost("upload-Background")]
        public async Task<IActionResult> UploadBackgroundImage([FromForm] UploadImageOrBackgroundDTO UploadImage)
        {
            var file = UploadImage.File;
            var NameMovie = UploadImage.NameMovie;
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // Kiểm tra loại file ảnh
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif" };
            if (!allowedTypes.Contains(file.ContentType))
                return BadRequest("Only image files (jpg, png, gif) are allowed.");

            // Tạo tên file duy nhất
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            // Tạo thư mục lưu file nếu chưa tồn tại
            var uploadPath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "Images", "BackgroundImageMovie");
            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            var filePath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Trả về URL file hoặc tên file
            var fileUrl = $"{Request.Scheme}://{Request.Host}/Images/BackgroundImageMovie/{fileName}";
            var movie = await _database.Movies.FirstOrDefaultAsync(i => i.Title == NameMovie);
            if (!string.IsNullOrEmpty(movie?.BackgroundImage))
            {
                var oldFileName = Path.GetFileName(new Uri(movie.Image).LocalPath);
                var oldFilePath = Path.Combine(uploadPath, oldFileName);

                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }
            }
            movie!.BackgroundImage = fileUrl;
            await _database.SaveChangesAsync();
            return Ok(new { fileName, fileUrl });
        }
    }
}
