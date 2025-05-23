﻿using DoAnTotNghiep.Data;
using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Helper.DateTimeVietNam;
using DoAnTotNghiep.Model;
using Microsoft.EntityFrameworkCore;
using Npgsql;


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

            var sql = @"
                SELECT 
                    r.""IdReport"",
                    r.""IdMovie"",
                    r.""IdComment"",
                    r.""UserNameReporter"",
                    r.""Content"",
                    r.""UserNameAdminFix"",
                    r.""Response"",
                    r.""TimeReport"",
                    r.""TimeResponse"",
                    r.""Status"",
                    c.""IdUserName"" AS ""NameOfUserReported"",
                    c.""Content"" AS ""ContentCommentReported""
                FROM ""Report"" r
                LEFT JOIN ""Comment"" c ON r.""IdComment"" = c.""IdComment""
                WHERE r.""Status"" = 0 OR (r.""Status"" = 1 AND r.""UserNameAdminFix"" = @usernameadminfix);
            ";
            return await _databaseContext.Database
        .SqlQueryRaw<ReportToShowDTOs>(sql, new[] { new NpgsqlParameter("@usernameadminfix", UserNameAdminFix) })
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
            if (!string.IsNullOrEmpty(upReportDTOs.Content) && !string.Equals(upReportDTOs.Content, "string", StringComparison.OrdinalIgnoreCase))
            {
                if (!string.IsNullOrWhiteSpace(upReportDTOs.SlugMovie) && !string.Equals(upReportDTOs.SlugMovie, "string", StringComparison.OrdinalIgnoreCase))
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
                else if (!string.IsNullOrWhiteSpace(upReportDTOs.IdComment) && !string.Equals(upReportDTOs.IdComment, "string", StringComparison.OrdinalIgnoreCase))
                {
                    var UserNameReported = await _databaseContext.Comments.FirstOrDefaultAsync(i => i.IdComment == upReportDTOs.IdComment);
                    if(UserNameReporter == UserNameReported.IdUserName) throw new InvalidOperationException("Bạn không thể tự báo cáo chính mình.");
                    var report = new Report
                    {
                        IdReport = Guid.NewGuid().ToString(),
                        IdComment = upReportDTOs.IdComment,
                        UserNameReporter = UserNameReporter,
                        Content = upReportDTOs.Content,
                        Status = 0,
                        TimeReport= DateTimeHelper.GetdateTimeVNNow()
                    };
                    await _databaseContext.Reports.AddAsync(report);
                    await _databaseContext.SaveChangesAsync();
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
