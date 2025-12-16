using Backend_TaskManagement.Models;
using Microsoft.EntityFrameworkCore;
using BCryptNet = BCrypt.Net.BCrypt;
using System.IO;

namespace Backend_TaskManagement.Service
{
    public class UserService : IUserService
    {
        private readonly ProjectHubContext _context;
        private readonly IWebHostEnvironment _env; //  để lấy đường dẫn gốc (wwwroot)

        public UserService(ProjectHubContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }
        public async Task<User?> GetUserById(int userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        public async Task<User?> UpdateUser(int userId, string fullname, string? avatarUrl)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return null;

            user.FullName = fullname;

            // xử lý file ảnh
           if(!string.IsNullOrEmpty(avatarUrl))
           {
                user.AvatarUrl = avatarUrl;
           }
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> ChangePassword(int userId, string oldPassword, string newPassword)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;
            // Kiểm tra mật khẩu cũ
            if (!BCryptNet.Verify(oldPassword, user.PasswordHash))
            {
                return false; // Mật khẩu cũ không đúng
            }
            // Cập nhật mật khẩu mới
            user.PasswordHash = BCryptNet.HashPassword(newPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
