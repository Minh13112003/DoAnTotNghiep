using DoAnTotNghiep.Data;
using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Helper.DateTimeVietNam;
using DoAnTotNghiep.Model;
using Microsoft.EntityFrameworkCore;


namespace DoAnTotNghiep.Repository
{
    public class ReportRepository : IReportRepository
    {
        private readonly DatabaseContext _databaseContext;

        public ReportRepository(DatabaseContext databaseContext) {
            _databaseContext = databaseContext;
        }

        public async Task<bool> DeleteReport(string IdReport)
        {
            if(!string.IsNullOrEmpty(IdReport)){
                var report = await _databaseContext.Reports.FirstOrDefaultAsync(i => i.IdReport == IdReport && (i.Status == 0 || i.Status == 2));
                if (report != null) 
                {
                    _databaseContext.Reports.Remove(report);
                    await _databaseContext.SaveChangesAsync();
                    return true;
                }
            }
            return false;
        }

        public async Task<List<ReportToShowDTOs>> GetReportAdmin(string UserNameAdminFix)
        {
            return await _databaseContext.Reports
                .Where(r => r.Status == 0 || (r.Status == 1 && r.UserNameAdminFix == UserNameAdminFix))
                .Select(r => new ReportToShowDTOs
                {
                    IdReport = r.IdReport,
                    IdMovie = r.IdMovie,
                    UserNameReporter = r.UserNameReporter,
                    Content = r.Content,
                    UserNameAdminFix = r.UserNameAdminFix,
                    Response = r.Response,
                    TimeReport = r.TimeReport,
                    TimeResponse = r.TimeResponse,
                    Status = r.Status
                })
                .ToListAsync();
        }

        public async Task<List<ReportToShowDTOs>> GetSelfReport(string UserNameReporter)
        {
            return await _databaseContext.Reports
                .Where(r => r.UserNameReporter == UserNameReporter) 
                .Select(r => new ReportToShowDTOs
                {
                    IdReport = r.IdReport,
                    IdMovie = r.IdMovie,
                    UserNameReporter = r.UserNameReporter,
                    Content = r.Content,
                    UserNameAdminFix = r.UserNameAdminFix,
                    Response = r.Response,
                    TimeReport = r.TimeReport,
                    TimeResponse = r.TimeResponse,
                    Status = r.Status
                })
                .ToListAsync();
        }



        public async Task<bool> ReceiveReport(string IdReport, string UserNameAdminFix)
        {
            if (IdReport != null || UserNameAdminFix != null)
            {
                var report = await _databaseContext.Reports.FirstOrDefaultAsync(r => r.IdReport == IdReport);
                if (report != null)
                {
                    report.UserNameAdminFix = UserNameAdminFix;
                    report.Status = 1;
                }
                await _databaseContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> ResponseReport(string UserNameAdminFix, ResponseReport responseReport)
        {
            if(responseReport.IdReport != null && UserNameAdminFix != null)
            {
                var report = await _databaseContext.Reports.FirstOrDefaultAsync(r => r.IdReport == responseReport.IdReport && r.UserNameAdminFix == UserNameAdminFix && r.Status == 1);
                if (report != null)
                {
                    report.Response = responseReport.Response;
                    report.TimeResponse = DateTimeHelper.GetdateTimeVNNow();  
                    report.Status = 2;
                    await _databaseContext.SaveChangesAsync();
                    return true;
                }

            }
            return false;
        }

        public async Task<bool> UpReport(string UserNameReporter, UpReportDTOs upReportDTOs)
        {
            if (!string.IsNullOrEmpty(upReportDTOs.Content))
            {
                if (!string.IsNullOrEmpty(upReportDTOs.SlugMovie))
                {

                    var movie = await _databaseContext.Movies.FirstOrDefaultAsync(i => i.SlugTitle == upReportDTOs.SlugMovie);   
                    var report = new Report
                    {
                        IdReport = Guid.NewGuid().ToString(),
                        UserNameReporter = UserNameReporter,
                        IdMovie = movie?.IdMovie,
                        Content = upReportDTOs.Content,
                        Status = 0,
                        TimeReport = DateTimeHelper.GetdateTimeVNNow()
                    };

                    await _databaseContext.Reports.AddAsync(report);
                    await _databaseContext.SaveChangesAsync();
                    return true;
                }
                else
                {
                    var report = new Report
                    {
                        IdReport = Guid.NewGuid().ToString(),
                        UserNameReporter = UserNameReporter,
                        Content = upReportDTOs.Content,
                        Status = 0,
                        TimeReport = DateTimeHelper.GetdateTimeVNNow()
                    };

                    await _databaseContext.Reports.AddAsync(report);
                    await _databaseContext.SaveChangesAsync();
                    return true;
                }
            }
            return false;
        }
    }
}
