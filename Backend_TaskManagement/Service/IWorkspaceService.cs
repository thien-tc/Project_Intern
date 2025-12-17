using Backend_TaskManagement.Models;

namespace Backend_TaskManagement.Service
{
    public interface IWorkspaceService
    {
        Task<List<WorkspaceDTO>> GetWorkspacesByUserId(int userId);
    }

    public class WorkspaceDTO
    {
        public int WorkspaceId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public List<SpaceDTO> Spaces { get; set; } = new List<SpaceDTO>();
    }

    public class SpaceDTO
    {
        public int SpaceId { get; set; }
        public string Name { get; set; } = null!;
        public string? Color { get; set; }
    }
}
