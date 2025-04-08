using DoAnTotNghiep.Model;

namespace DoAnTotNghiep.Services
{
    public interface IAccountService
    {
        Task<bool> RegisterAccount(Account account);
        Task<Account> Login(string username, string password);
    }
}
