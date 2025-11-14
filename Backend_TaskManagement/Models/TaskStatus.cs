using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class TaskStatus
{
    public int StatusId { get; set; }

    public int? SpaceId { get; set; }

    public string Name { get; set; } = null!;

    public int OrderIndex { get; set; }

    public bool? IsFinal { get; set; }

    public string? Color { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Space? Space { get; set; }

    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();
}
