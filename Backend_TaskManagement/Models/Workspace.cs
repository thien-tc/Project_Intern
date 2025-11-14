using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class Workspace
{
    public int WorkspaceId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public int CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User CreatedByNavigation { get; set; } = null!;

    public virtual ICollection<Space> Spaces { get; set; } = new List<Space>();
}
