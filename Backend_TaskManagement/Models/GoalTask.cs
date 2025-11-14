using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class GoalTask
{
    public int GoalId { get; set; }

    public int TaskId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Goal Goal { get; set; } = null!;

    public virtual Task Task { get; set; } = null!;
}
