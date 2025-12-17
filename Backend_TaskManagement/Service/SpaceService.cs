using Backend_TaskManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend_TaskManagement.Service
{
    public class SpaceService : ISpaceService
    {
        private readonly ProjectHubContext _context;

        public SpaceService(ProjectHubContext context)
        {
            _context = context;
        }

        public async Task<bool> AddMemberToSpace(int spaceId, string email)
        {
            // 1. Find user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return false; // User not found

            // 2. Check if already member
            var exists = await _context.SpaceMembers
                .AnyAsync(sm => sm.SpaceId == spaceId && sm.UserId == user.UserId);
            
            if (exists) return true; // Already member

            // 3. Add to SpaceMembers
            var member = new SpaceMember
            {
                SpaceId = spaceId,
                UserId = user.UserId,
                Role = "Member",
                JoinedAt = DateTime.Now
            };

            _context.SpaceMembers.Add(member);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
