using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Repository;

namespace DoAnTotNghiep.Services
{
    public class ReportServices : IReportServices
    {
        private readonly IReportRepository _repository;
        public ReportServices(IReportRepository repository) {
            _repository = repository;
        }

        public async Task<bool> DeleteReport(string IdReport)
        {
            return await _repository.DeleteReport(IdReport);
        }

        public async Task<List<ReportToShowDTOs>> GetReportAdmin(string UserNameAdminFix)
        {
            return await _repository.GetReportAdmin(UserNameAdminFix);
        }

        public async Task<List<ReportToShowDTOs>> GetSelfReport(string UserNameReporter)
        {
            return await _repository.GetSelfReport(UserNameReporter);
        }

        public Task<bool> ReceiveReport(string IdReport, string UserNameAdminFix)
        {
            return _repository.ReceiveReport(IdReport, UserNameAdminFix);
        }

        public async Task<bool> ResponseReport(string UserNameAdminFix, ResponseReport responseReport)
        {
            return await _repository.ResponseReport(UserNameAdminFix, responseReport);
        }

        public async Task<bool> UpReport(string UserNameReporter, UpReportDTOs upReportDTOs)
        {
            return await _repository.UpReport(UserNameReporter, upReportDTOs);
        }
        
    }
}
