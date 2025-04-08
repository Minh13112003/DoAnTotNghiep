
using DoAnTotNghiep.Repository;

namespace DoAnTotNghiep.Services
{
    public class MixAPIServices : IMixAPIService
    { 
        private readonly IMixAPIRepository _mixAPIRepository;
        public MixAPIServices(IMixAPIRepository mixAPIRepository)
        {
            _mixAPIRepository = mixAPIRepository;
        }

        public async Task<dynamic> GetcountMovieAndCategory()
        {
            return await _mixAPIRepository.GetcountMovieAndCategory();
        }

        public async Task<dynamic> GetMovieTypeAndCategory()
        {
            return await _mixAPIRepository.GetMovieTypeAndCategory();
        }
    }
}
