using Microsoft.AspNetCore.Mvc;
using Backend_TaskManagement.Service;
using Microsoft.AspNetCore.Authorization;
using Backend_TaskManagement.Models;


namespace Backend_TaskManagement.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController:ControllerBase
    {

        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("profile")]
        public async Task<ActionResult> GetProfile()
        {
            // Lấy userId từ claims khi đăng nhập 

            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim == null)
            {
                return Unauthorized();

            }

            var userId = int.Parse(userIdClaim.Value);
            var user = await _userService.GetUserById(userId);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                user.UserId,
                user.FullName,
                user.Email,
                user.AvatarUrl,
                user.Role,
                user.IsOnline,
                user.LastSeen
            });
        }
        [HttpPut("profile")]
        public async Task<ActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userIdClaim = User.FindFirst("userId");
            if(userIdClaim == null)
            {
                return Unauthorized();
            }
            var userId = int.Parse(userIdClaim.Value);
            var user = await _userService.UpdateUser(userId, request.FullName, request.AvatarUrl);
            if(user == null) return NotFound();

            return Ok(new
            {
                user.UserId,
                user.FullName,
                user.Email,
                user.AvatarUrl,
                user.Role,
                user.IsOnline,
                user.LastSeen
            });
        }
        [HttpPut("change-password")]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim == null)
            {
                return Unauthorized();
            }
            var userId = int.Parse(userIdClaim.Value);
            var result = await _userService.ChangePassword(userId, request.OldPassword, request.NewPassword);
            if (!result)
            {
                return BadRequest(new { message = "Old password is incorrect" });
            }
            return Ok(new { message = "Password changed successfully" });
        }
    }

    // DTOs Lớp Ui request
    public class UpdateProfileRequest
    {
        public string FullName { get; set; } = null!;
        public string? AvatarUrl { get; set; }

    }

    public class ChangePasswordRequest
    {
        public string OldPassword { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }
}
