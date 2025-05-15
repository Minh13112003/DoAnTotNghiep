namespace DoAnTotNghiep.DTOs
{
    public class UserToken
    {
        public string? Email {  get; set; }
        public string? UserName { get; set; }
        public string? Token { get; set; }

        public string? Roles { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }

    }
}
