using Backend_TaskManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Http;
using Microsoft.Identity.Client;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;
namespace Backend_TaskManagement.Service
{
    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly ProjectHubContext _context;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public GoogleAuthService(ProjectHubContext context, IConfiguration config, IHttpClientFactory factory)
        {
            _context = context;
            _config = config;
            _httpClient = factory.CreateClient();
        }

        public async Task<User?> LoginByGoogle(string email, string fullname, string? avatarUrl)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return null;
            // Check là tài khoản email hoặc tài khoản tại đây
            return user;

        }

        public async Task<string?> ExchangeCodeForToken(string code)
        {
            var res = await _httpClient.PostAsync("https://oauth2.googleapis.com/token", new FormUrlEncodedContent(new Dictionary<string, string>
            {
                {"code", code },
                {"client_id", _config["Google:ClientId"]! },
                {"client_secret", _config["Google:ClientSecret"]! },
                {"redirect_uri","https://localhost:7129/api/auth/google/callback" },
                {"grant_type", "authorization_code" }
            }));

            if(!res.IsSuccessStatusCode)
            {
                return null;
            }
            var json = await res.Content.ReadFromJsonAsync<JsonElement>();
            return json.GetProperty("id_token").GetString();
        }
    }
}
