namespace DoAnTotNghiep.Services
{
    public interface IMixAPIService
    {
        Task<dynamic> GetMovieTypeAndCategory();
        Task<dynamic> GetcountMovieAndCategory();
    }
}
