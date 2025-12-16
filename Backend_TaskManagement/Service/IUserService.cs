using Backend_TaskManagement.Models;

namespace Backend_TaskManagement.Service
{
    public interface IUserService
    {
        Task<User?> GetUserById(int userId);
        Task<User?> UpdateUser(int userId, string fullname, string? avatarUrl);

        Task<bool> ChangePassword(int userId, string oldPassword, string newPassword);
       
    }
}
