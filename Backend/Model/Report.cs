namespace DoAnTotNghiep.Model
{
    public class Report
    {
        public string IdReport {  get; set; } = string.Empty;
        public string? IdMovie {  get; set; } = string.Empty;
        public string? IdComment {  get; set; } = string.Empty;
        public string UserNameReporter {  get; set; } = string.Empty;
        public string Content {  get; set; } = string.Empty;
        public string? UserNameAdminFix {  get; set; } = string.Empty;
        public string? Response {  get; set; } = string.Empty;
        public string TimeReport {  get; set; } = string.Empty;
        public string TimeResponse {  get; set; } = string.Empty;
        public int Status { get; set; }

        public virtual Movie? Movie { get; set; }
        public virtual AppUser? User { get; set; }
    }
}
