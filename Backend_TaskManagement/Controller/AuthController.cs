using Microsoft.AspNetCore.Mvc;
using Backend_TaskManagement.Service;
using Microsoft.EntityFrameworkCore;
using Google.Apis.Auth;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Caching.Memory;

namespace Backend_TaskManagement.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController: ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IGoogleAuthService _google;
        private readonly IConfiguration _config;
        private readonly ILogger<AuthController> _logger;
        private readonly IMemoryCache _cache;
        public AuthController(IAuthService authService, IGoogleAuthService google, IConfiguration config, ILogger<AuthController> logger, IMemoryCache cache )
        {
            _authService = authService;
            _google = google;
            _config = config;
            _logger = logger;
            _cache = cache;
        }
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _authService.ValidateUser(request.Email, request.Password);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }
            //check xem là có phải đăng nhập bằng google hay không
            
            var token = _authService.GenerateToken(user);
            return Ok(new { 
                token,
                user = new {user.UserId, user.FullName, user.Email, user.AvatarUrl, user.Role, user.IsOnline, user.LastSeen}
            });
        }
        [HttpPost("register/SendOtp")]
        public async Task<ActionResult> Register([FromBody] SendOtpRequest request)
        {
           var isExist = await _authService.IsEmailExist(request.Email);
            if (isExist)
            {
                return BadRequest(new { message = "Email already exists" });
            }
            // tạo mã otp
            var otp = new Random().Next(100000, 999999).ToString();
            // lưu vào cache 2 phut
            _cache.Set(request.Email, otp, TimeSpan.FromMinutes(2));
            // gửi email
            await _authService.SendOtpEmail(request.Email, otp);

            return Ok(new { message = "OTP sent to your email. OTP is valid for 2 minutes" });
        }
        [HttpPost("register/VerifyOtp")]
        public async Task<ActionResult> VerifyOtp([FromBody] RegisterRequest request)
        {
          if(!_cache.TryGetValue(request.Email, out string? cachedOtp) || cachedOtp != request.Otp)
            {
                return BadRequest(new { message = "Invalid or expired OTP" });
            }
            // Xóa OTP khỏi cache sau khi xác thực thành công
            _cache.Remove(request.Email);
            // Đăng ký tài khoản
            var user = await _authService.RegisterUser(request.FullName, request.Email, request.Password);
            if(user == null)
            {
                return BadRequest(new { message = "Email already exists" });
            }
            var token = _authService.GenerateToken(user);
            return Ok(new
            {
                token,
                user = new { user.UserId, user.FullName, user.Email, user.AvatarUrl, user.Role, user.IsOnline, user.LastSeen }
            });
        }

        [HttpGet("google")]
        public IActionResult GoogleLogin()
        {
            _logger.LogInformation("Initiating Google OAuth2 login");
            _logger.LogInformation("Client ID: {ClientId}", _config["Google:ClientId"]);
            _logger.LogInformation("Redirect URI: {RedirectUri}", _config["Google:RedirectUri"]);

            var url = $"https://accounts.google.com/o/oauth2/v2/auth" +
                $"?client_id={_config["Google:ClientId"]}" +
                $"&redirect_uri=https://localhost:7129/api/auth/google/callback" +
                $"&response_type=code&scope=openid%20email%20profile";
            return Redirect(url);
        }
        [HttpGet("google/callback")]
        public async Task<IActionResult> GoogleCallback(string code)
        {
            var idToken = await _google.ExchangeCodeForToken(code);
            if(idToken == null)
            {
                return BadRequest(new { message = "Google authentication failed" });
            }

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken);
            var user = await _google.LoginByGoogle(payload.Email, payload.Name, payload.Picture);
            if(user == null)
            {
                return BadRequest(new { message = "Google login failed" });
            }
            var jwt = _authService.GenerateToken(user!);
            var nameEncoded = WebUtility.UrlEncode(payload.Name);

            var front = $"http://localhost:5173/login?token={jwt}&email={payload.Email}&name={nameEncoded}&picture=" +
                $"{payload.Picture}";
            return Redirect(front);
        }
    }
    // DTOs
    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
    public class RegisterRequest
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Otp { get; set; } = null!;
    }
    public class SendOtpRequest
    {
       
        public string Email { get; set; } = null!;
        
    }
}
