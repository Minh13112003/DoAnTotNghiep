using DoAnTotNghiep.DTOs;

namespace DoAnTotNghiep.Repository
{
    public interface IReportRepository
    {
        Task<bool> UpReport(string UserNameReporter,UpReportDTOs upReportDTOs);
        Task<List<ReportToShowDTOs>> GetSelfReport(string UserNameReporter);
        Task<List<ReportToShowDTOs>> GetReportAdmin(string UserNameAdminFix);
        Task<bool> ReceiveReport(string IdReport, string UserNameAdminFix);
        Task<bool> ResponseReport(string UserNameAdminFix, ResponseReport responseReport);
        Task<bool> DeleteReport(string IdReport);

    }
}
