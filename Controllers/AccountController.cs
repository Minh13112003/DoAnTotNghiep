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
        private readonly IAccountService _accountService;
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenServices _tokenServices;
        private readonly SignInManager<AppUser> _signInManager;

        public AccountController(IAccountService accountService, UserManager<AppUser> userManager, ITokenServices tokenServices, SignInManager<AppUser> signInManager)
        {
            _accountService = accountService;
            _userManager = userManager;
            _tokenServices = tokenServices;
            _signInManager = signInManager;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == loginDTO.UserName);
                if (user == null) return Unauthorized("UserName or PassWord is incorrect");

                var result = await _signInManager.CheckPasswordSignInAsync(user, loginDTO.Password,false);

                if (!result.Succeeded) return Unauthorized(new { message = "UserName or PassWord is incorrect" });
                var Role = await _userManager.GetRolesAsync(user);
                var roleString = string.Join(", ", Role);
                return Ok(new UserToken
                {
                    UserName = user.UserName,
                    Email = user.Email,
                    Token = _tokenServices.CreateToken(user,Role.ToList()),
                    Roles = roleString
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
                        return StatusCode(500, new {message = "Mật khẩu phải chứa ít nhất 1 kí tự Hoa, 1 kí tự đặc biệt, 1 kí tự số"});
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
    }
}
