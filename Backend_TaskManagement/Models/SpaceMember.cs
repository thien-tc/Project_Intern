using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class SpaceMember
{
    public int SpaceId { get; set; }

    public int UserId { get; set; }

    public string? Role { get; set; }

    public DateTime? JoinedAt { get; set; }

    public virtual Space Space { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
