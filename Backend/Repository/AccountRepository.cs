using DoAnTotNghiep.Data;
using DoAnTotNghiep.Model;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Repository
{
    public class AccountRepository : IAccountRepository
    {
        private readonly DatabaseContext _dbcontext;
        public AccountRepository(DatabaseContext dBContext)
        {
            _dbcontext = dBContext;
        }

        public async Task AddAccount(Account account)
        {
            await _dbcontext.AddAsync(account);
            await _dbcontext.SaveChangesAsync();
        }

        public Task<Account?> CheckExistAccount(string username, string password)
        {
            return _dbcontext.Set<Account>().FirstOrDefaultAsync(i => i.UserName == username && i.Password == password);
        }    

        
    }
}
