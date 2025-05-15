﻿using DoAnTotNghiep.Helper.RatingResult;

namespace DoAnTotNghiep.Repository
{
    public interface IMovieRatingRepository
    {
        Task<AddRatingResult> AddRating(string IdMovie, string UserName, int point);
    }
}
