﻿using DoAnTotNghiep.Data;
using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Helper.DateTimeVietNam;
using DoAnTotNghiep.Model;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace DoAnTotNghiep.Repository
{
    public class CommentRepository : ICommentRepository
    {
        private readonly DatabaseContext _dbContext;
        public CommentRepository(DatabaseContext dbContext) {
            _dbContext = dbContext;
        }
        public async Task<bool> AddComment(string username, CommentDTOs commentDTOs)
        {
            if (commentDTOs.Content == null || commentDTOs.SlugTitle == null) return false;
            var Movie = await _dbContext.Movies.FirstOrDefaultAsync(i => i.SlugTitle == commentDTOs.SlugTitle);
            if (Movie == null) return false; 
            var comment = new Comment
            {
                IdComment = Guid.NewGuid().ToString(),
                IdUserName = username,
                IdMovie = Movie.IdMovie,
                Content = commentDTOs.Content,
                TimeComment = DateTimeHelper.GetdateTimeVNNow()
            };
            await _dbContext.Comments.AddAsync(comment);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteComment(string role,string username, string Idcomment)
        {
            if (username == null || Idcomment == null) return false;
            var comment = await _dbContext.Comments.FirstOrDefaultAsync(i => (i.IdUserName == username || role == "Admin") && i.IdComment == Idcomment);
            if (comment == null) return false;
            _dbContext.Comments.Remove(comment);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<List<Comment>> GetCommentByMovie(string slugMovie)
        {
            var sql = @"
                    SELECT 
                        cm.""IdComment"",
                        cm.""IdMovie"", 
                        cm.""IdUserName"", 
                        cm.""Content"",
                        cm.""TimeComment""
                    FROM ""Comment"" cm
                    JOIN ""Movie"" m ON cm.""IdMovie"" = m.""Id""
                    WHERE m.""SlugTitle"" = @slugMovie;";

            return await _dbContext.Comments
                .FromSqlRaw(sql, new NpgsqlParameter("@slugMovie", slugMovie))
                .ToListAsync();
        }

        public async Task<bool> UpdateComment(CommentUpdateDTOs commentDTOs)
        {
            if (!String.IsNullOrEmpty(commentDTOs.IdUserName))
            {
                var comment = await _dbContext.Comments.FirstOrDefaultAsync(i => i.IdUserName ==  commentDTOs.IdUserName && i.IdComment == commentDTOs.IdComment);
                if (comment == null) return false;
                comment.Content = commentDTOs.Content;
                comment.TimeComment = DateTimeHelper.GetdateTimeVNNow();
                return true;
            }
            return false;
        }
    }   
}
