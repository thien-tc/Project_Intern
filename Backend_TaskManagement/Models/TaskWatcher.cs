using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class TaskWatcher
{
    public int TaskId { get; set; }

    public int UserId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Task Task { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
