using Backend_TaskManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend_TaskManagement.Service
{
    public class WorkspaceService : IWorkspaceService
    {
        private readonly ProjectHubContext _context;

        public WorkspaceService(ProjectHubContext context)
        {
            _context = context;
        }

        public async Task<List<WorkspaceDTO>> GetWorkspacesByUserId(int userId)
        {
            var workspaces = await _context.Workspaces
                .Include(w => w.Spaces)
                .Where(w => w.CreatedBy == userId || w.Spaces.Any(s => s.SpaceMembers.Any(sm => sm.UserId == userId)))
                .Select(w => new WorkspaceDTO
                {
                    WorkspaceId = w.WorkspaceId,
                    Name = w.Name,
                    Description = w.Description,
                    Spaces = w.Spaces
                        .Where(s => w.CreatedBy == userId || s.SpaceMembers.Any(sm => sm.UserId == userId))
                        .Select(s => new SpaceDTO
                    {
                        SpaceId = s.SpaceId,
                        Name = s.Name,
                        Color = s.Color
                    }).ToList()
                })
                .ToListAsync();

            return workspaces;
        }
    }
}
