using DoAnTotNghiep.Model;
using DoAnTotNghiep.Repository;

namespace DoAnTotNghiep.Services
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _accountRepository;

        public AccountService(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }
        public Task<Account> Login(string username, string password)
        {
            var account = _accountRepository.CheckExistAccount(username, password);
            if (account != null) 
            {
                return account;
            }
            return null;
        }

        public async Task<bool> RegisterAccount(Account account)
        {
            var accounts = await _accountRepository.CheckExistAccount(account.UserName, account.Password);
            if (accounts != null) return false;
            else
            {
                await _accountRepository.AddAccount(account);
                return true;
            }
        }
    }
}
