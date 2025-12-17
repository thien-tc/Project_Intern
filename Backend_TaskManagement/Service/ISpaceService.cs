using Backend_TaskManagement.Models;

namespace Backend_TaskManagement.Service
{
    public interface ISpaceService
    {
        Task<bool> AddMemberToSpace(int spaceId, string email);
    }
}
