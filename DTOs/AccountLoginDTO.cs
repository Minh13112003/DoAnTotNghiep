using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;


namespace DoAnTotNghiep.DTOs
{
    public class AccountLoginDTO
    {
        [Required]
        public string? UserName { get; set; }
        [Required]
        public string? Password { get; set; }
        [Required]
        [EmailAddress]
        public string? EmailAddress { get; set; }
        [Required]
        [Range(1, 130, ErrorMessage = "Age must be between 1 and 130.")]
        public int? Age { get; set; }
        public string? PhoneNumber { get; set; }

    }
}
