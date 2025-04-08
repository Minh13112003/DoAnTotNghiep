using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Model;
using DoAnTotNghiep.Repository;

namespace DoAnTotNghiep.Services
{
    public class CommentServices : ICommentServices
    {
        private readonly ICommentRepository _commentRepository;

        public CommentServices(ICommentRepository commentRepository)
        {
            _commentRepository = commentRepository;
        }


        public async Task<bool> AddComment(string username, CommentDTOs commentDTOs)
        {
            return await _commentRepository.AddComment(username, commentDTOs);
        }

        public Task<bool> DeleteComment(string role, string username, string Idcomment)
        {
            return _commentRepository.DeleteComment(role, username, Idcomment);
        }

        public async Task<List<Comment>> GetCommentByMovie(string slugMovie)
        {
            return await _commentRepository.GetCommentByMovie(slugMovie);
        }

        public async Task<bool> UpdateComment(CommentUpdateDTOs commentDTOs)
        {
            return await _commentRepository.UpdateComment(commentDTOs);
        }
    }
}
