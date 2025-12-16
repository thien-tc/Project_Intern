using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Backend_TaskManagement.Models;
using BCryptNet = BCrypt.Net.BCrypt;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;

namespace Backend_TaskManagement.Service
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;
        private readonly ProjectHubContext _context;

        public AuthService(IConfiguration config, ProjectHubContext context)
        {
            _config = config;
            _context = context;
        }


        // Đăng ký người dùng mới
        public async Task<User?> RegisterUser(string fullName, string email, string password)
        {
            // check xem có trùng email không
            if(await _context.Users.AnyAsync(u => u.Email == email))
            {
                return null; // Email đã tồn tại
            }
            var hashed = BCryptNet.HashPassword(password);
            var newUser = new User
            {
                FullName = fullName,
                Email = email,
                PasswordHash = hashed,
                Role = "Member",
                CreatedAt = DateTime.UtcNow,
            };
            _context.Users.Add(newUser); // chỉ là đánh dấy vào RAM 
             await _context.SaveChangesAsync();// đây mới là bước thật sự ghi vào database
            return newUser;
        }



        // gửi email
        public async System.Threading.Tasks.Task SendOtpEmail(string email, string otp)
        {
            var smtp = new System.Net.Mail.SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("thientc108.work@gmail.com", "tmxk srne gzie hmtl"),
                EnableSsl = true,
            };
            var mail = new MailMessage
            {
                From = new MailAddress("thientc108.work@gmail.com", "TaskManagement Support"),
                Subject = "Your OTP Code",
                Body = $"Your OTP code is : {otp}.\nThis code is valid for 2 minutes",
                IsBodyHtml = false,
            };
            mail.To.Add(email);
            await smtp.SendMailAsync(mail);
        }



        // check email có tồn tại hay không
        public async Task<bool> IsEmailExist(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }



        // Đăng nhập
        public async Task<User?> ValidateUser(string email, string password)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
            if (user == null) return null;

            bool isValid = BCryptNet.Verify(password, user.PasswordHash);
            return isValid ? user : null;
        }
        
        public string GenerateToken(User user)
        {
            // Key là khởi tạo key để mã hóa token
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            // creds là chứng thực ký token
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            // claim này thông tin định danh của user           
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim("userId", user.UserId.ToString()),
                new Claim ("fullName", user.FullName),
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
