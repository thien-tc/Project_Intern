using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class Tag
{
    public int TagId { get; set; }

    public int? SpaceId { get; set; }

    public string Name { get; set; } = null!;

    public string? Color { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Space? Space { get; set; }

    public virtual ICollection<TaskTag> TaskTags { get; set; } = new List<TaskTag>();
}
