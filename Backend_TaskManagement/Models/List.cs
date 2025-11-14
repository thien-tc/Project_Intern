using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class List
{
    public int ListId { get; set; }

    public int SpaceId { get; set; }

    public string Name { get; set; } = null!;

    public int OrderIndex { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Space Space { get; set; } = null!;

    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();
}
