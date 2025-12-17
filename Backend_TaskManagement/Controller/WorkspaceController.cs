using Backend_TaskManagement.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend_TaskManagement.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WorkspaceController : ControllerBase
    {
        private readonly IWorkspaceService _workspaceService;

        public WorkspaceController(IWorkspaceService workspaceService)
        {
            _workspaceService = workspaceService;
        }

        [HttpGet]
        public async Task<ActionResult<List<WorkspaceDTO>>> GetWorkspaces()
        {
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim == null) return Unauthorized();

            var userId = int.Parse(userIdClaim.Value);
            var workspaces = await _workspaceService.GetWorkspacesByUserId(userId);

            return Ok(workspaces);
        }
    }
}
