using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Model;
using DoAnTotNghiep.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace DoAnTotNghiep.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenServices _tokenServices;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IEmailAuthenticationServices _emailService;

        public AccountController(UserManager<AppUser> userManager, ITokenServices tokenServices, SignInManager<AppUser> signInManager, IEmailAuthenticationServices emailService)
        {
            _userManager = userManager;
            _tokenServices = tokenServices;
            _signInManager = signInManager;
            _emailService = emailService;
            
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == loginDTO.UserName);
                if (user == null) return Unauthorized("UserName or PassWord is incorrect");

                var result = await _signInManager.CheckPasswordSignInAsync(user, loginDTO.Password, false);

                /*if (!result.Succeeded) return Unauthorized(new { message = "UserName or PassWord is incorrect" });
                if(user.OTP == null || user.OTP != loginDTO.OTP )
                {
                    return Unauthorized(new { message = "Sai hoặc không tìm thấy OTP" });
                }
                if (user.OtpCreatedAt.HasValue && user.OtpCreatedAt.Value.AddMinutes(5) < DateTime.UtcNow) return Unauthorized(new {message = "OTP đã hết hạn"});
                user.OTP = null;
                user.OtpCreatedAt = null;
                await _userManager.UpdateAsync(user);*/
                var Role = await _userManager.GetRolesAsync(user);
                var roleString = string.Join(", ", Role);
                var refreshToken = _tokenServices.GenerateRefreshToken();
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7); 
                await _userManager.UpdateAsync(user);
                return Ok(new UserToken
                {
                    UserName = user.UserName,
                    Email = user.Email,
                    Token = _tokenServices.CreateToken(user, Role.ToList()),
                    Roles = roleString,
                    RefreshToken = refreshToken,
                    RefreshTokenExpiryTime = user.RefreshTokenExpiryTime
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AccountLoginDTO accountLoginDTO)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                var appUser = new AppUser
                {
                    UserName = accountLoginDTO.UserName,
                    Email = accountLoginDTO.EmailAddress,
                    Age = accountLoginDTO.Age,
                    PhoneNumber = accountLoginDTO.PhoneNumber,
                };
                var createUser = await _userManager.CreateAsync(appUser, accountLoginDTO.Password!);
                if (createUser.Succeeded)
                {
                    
                    var roleResult = await _userManager.AddToRoleAsync(appUser, "User");
                    if (roleResult.Succeeded)
                    {

                        return Ok(new UserToken
                        {
                            Email = appUser.Email,
                            UserName = appUser.UserName
                        });
                    }
                    else
                    {
                        return StatusCode(500, new { message = "Mật khẩu phải chứa ít nhất 1 kí tự Hoa, 1 kí tự đặc biệt, 1 kí tự số" });
                    }
                }
                else
                {
                    return StatusCode(501, createUser.Errors);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(502, ex.Message);
            }
        }

        [HttpPost("registerAdmin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] AccountLoginDTO accountLoginDTO)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                var appUser = new AppUser
                {
                    UserName = accountLoginDTO.UserName,
                    Email = accountLoginDTO.EmailAddress,
                    Age = accountLoginDTO.Age,
                    PhoneNumber = accountLoginDTO.PhoneNumber,
                };
                var createUser = await _userManager.CreateAsync(appUser, accountLoginDTO.Password!);
                if (createUser.Succeeded)
                {
                    var roleResult = await _userManager.AddToRoleAsync(appUser, "Admin");
                    if (roleResult.Succeeded)
                    {
                        return Ok(new UserToken
                        {
                            Email = appUser.Email,
                            UserName = appUser.UserName,
                        });
                    }
                    else
                    {
                        return StatusCode(500, roleResult.Errors);
                    }
                }
                else
                {
                    return StatusCode(500, createUser.Errors);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("delete/{userName}")]
        public async Task<IActionResult> DeleteUser(string userName)
        {
            try
            {

                var user = await _userManager.FindByNameAsync(userName);


                if (user == null)
                {
                    return NotFound(new { Message = $"User with username '{userName}' not found." });
                }

                var deleteResult = await _userManager.DeleteAsync(user);

                if (deleteResult.Succeeded)
                {
                    return Ok(new { Message = $"User '{userName}' has been successfully deleted." });
                }
                else
                {
                    return StatusCode(500, deleteResult.Errors);
                }
            }
            catch (Exception ex)
            {
                // Trả về lỗi nếu xảy ra ngoại lệ
                return StatusCode(500, ex.Message);
            }

        }

        [HttpGet("check-role/{userName}")]
        public async Task<IActionResult> CheckUserRole(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user == null)
            {
                return NotFound(new { Message = $"User '{userName}' not found." });
            }

            var roles = await _userManager.GetRolesAsync(user);
            if (roles.IsNullOrEmpty()) await _userManager.AddToRoleAsync(user, "Admin");
            return Ok(new { User = user.UserName, Roles = roles });
        }
        [HttpGet("check-role-user/{userName}")]
        public async Task<IActionResult> CheckRoleUser(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user == null)
            {
                return NotFound(new { Message = $"User '{userName}' not found." });
            }

            var roles = await _userManager.GetRolesAsync(user);
            if (roles.IsNullOrEmpty()) await _userManager.AddToRoleAsync(user, "User");
            return Ok(new { User = user.UserName, Roles = roles });
        }
        [HttpPost("userinfor")]
        public async Task<IActionResult> GetUserInfor([FromBody] UserRequestDTOs userRequestDTOs)
        {
            if (string.IsNullOrEmpty(userRequestDTOs.UserName))
            {
                return BadRequest(new { message = "Username is required" });
            }

            var user = await _userManager.FindByNameAsync(userRequestDTOs.UserName);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var roles = await _userManager.GetRolesAsync(user);
            var roleString = string.Join(", ", roles);

            return Ok(new
            {
                user.Id,
                user.UserName,
                user.Email,
                user.PhoneNumber,
                user.Age,
                Roles = roleString
            });
        }
        [HttpPost("SendOTP/{username}")]
        public async Task<IActionResult> SendOtpToEmail(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null || string.IsNullOrEmpty(user.Email)) return NotFound(new {message = "Không tìm thấy email người dùng hoặc trống thông tin"});

            var otp = new Random().Next(100000, 999999).ToString();
            user.OTP = otp;
            user.OtpCreatedAt = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            var subject = "Mã OTP đăng nhập";
            var body = $"Mã OTP của bạn là: <b>{otp}</b> (có hiệu lực trong 5 phút).";

            await _emailService.SendEmailAsync(user.Email, subject, body);
            return Ok(new {message = "Mã OTP của bạn đã được gửi đi"});
        }
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequestDTO request)
        {
            if (request is null || string.IsNullOrEmpty(request.RefreshToken) || string.IsNullOrEmpty(request.UserName))
                return BadRequest("Invalid client request");

            var user = await _userManager.FindByNameAsync(request.UserName);
            if (user == null || user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return Unauthorized("Invalid refresh token");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var newAccessToken = _tokenServices.CreateToken(user, roles.ToList());
            var newRefreshToken = _tokenServices.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);

            return Ok(new UserToken
            {
                UserName = user.UserName,
                Email = user.Email,
                Token = newAccessToken,
                Roles = string.Join(", ", roles),
                RefreshToken = newRefreshToken,
                RefreshTokenExpiryTime = user.RefreshTokenExpiryTime
            });
        }

    }
}