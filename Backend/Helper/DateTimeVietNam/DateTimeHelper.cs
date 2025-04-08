namespace DoAnTotNghiep.Helper.DateTimeVietNam
{
    public class DateTimeHelper
    {
        public static string GetdateTimeVNNow()
        {
            TimeZoneInfo vietnamZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

            DateTime vietnamTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vietnamZone);

            string formattedTime = vietnamTime.ToString("dd/MM/yyyy HH:mm:ss");

            return formattedTime;
        }
    }
}
