namespace DoAnTotNghiep.Repository
{
    public interface IMixAPIRepository
    {
        Task<dynamic> GetMovieTypeAndCategory();
        Task<dynamic> GetcountMovieAndCategory();
    }
}
