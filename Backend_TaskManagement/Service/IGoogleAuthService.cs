using Backend_TaskManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend_TaskManagement.Service
{
    public interface IGoogleAuthService
    {
        Task<User?> LoginByGoogle(string email, string fullName, string? avatarUrl);
        Task<string?> ExchangeCodeForToken(string code);
    }
}
