using Backend_TaskManagement.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend_TaskManagement.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SpaceController : ControllerBase
    {
        private readonly ISpaceService _spaceService;

        public SpaceController(ISpaceService spaceService)
        {
            _spaceService = spaceService;
        }

        [HttpPost("{spaceId}/invite")]
        public async Task<IActionResult> InviteMember(int spaceId, [FromBody] InviteRequest request)
        {
            // Validations
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest("Email is required");

            // Assuming user has permission (can add check here later)
            
            var result = await _spaceService.AddMemberToSpace(spaceId, request.Email);
            
            if (!result)
                return NotFound("User email not found or system error.");

            return Ok(new { message = "Member added successfully" });
        }
    }

    public class InviteRequest
    {
        public string Email { get; set; } = string.Empty;
    }
}
