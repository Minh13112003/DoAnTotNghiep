using DoAnTotNghiep.Model;

namespace DoAnTotNghiep.Services
{
    public interface ITokenServices
    {
        public string CreateToken(AppUser appUser, List<string> roles);
    }
}
