﻿using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Model;

namespace DoAnTotNghiep.Services
{
    public interface ICommentServices
    {
        Task<bool> AddComment(string username, CommentDTOs commentDTOs);
        Task<List<Comment>> GetCommentByMovie(string slugMovie);
        Task<bool> UpdateComment(CommentUpdateDTOs commentDTOs);
        Task<bool> DeleteComment(string role, string username, string Idcomment);
    }
}
