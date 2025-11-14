using Backend_TaskManagement.Models;
using Microsoft.EntityFrameworkCore;


namespace Backend_TaskManagement.Service
{
    public interface IAuthService
    {
        string GenerateToken(User user);
        Task<User?> ValidateUser(string email, string password);
        Task<User?> RegisterUser(string fullName, string email, string password);
        Task<bool> IsEmailExist(string email);
        System.Threading.Tasks.Task SendOtpEmail(string email, string otp);
    }
}
    