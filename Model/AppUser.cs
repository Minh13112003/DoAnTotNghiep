using Microsoft.AspNetCore.Identity;
using System.Runtime.CompilerServices;

namespace DoAnTotNghiep.Model
{
    public class AppUser : IdentityUser
    {        
        public int? Age {  get; set; }
    }
}
