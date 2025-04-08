using DoAnTotNghiep.Model;

namespace DoAnTotNghiep.Repository
{
    public interface IAccountRepository
    {
        Task<Account> CheckExistAccount(string username, string password);
        Task AddAccount(Account account);
    }
}
