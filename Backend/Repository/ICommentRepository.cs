using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Model;

namespace DoAnTotNghiep.Repository
{
    public interface ICommentRepository
    {
        Task<bool> AddComment(string username,CommentDTOs commentDTOs);
        Task<List<Comment>>GetCommentByMovie(string slugMovie);
        Task<bool> UpdateComment(string username, CommentUpdateDTOs commentDTOs);
        Task<bool> DeleteComment(string role, string username, string Idcomment);
    }
}
