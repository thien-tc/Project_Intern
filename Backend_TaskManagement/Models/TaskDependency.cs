using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class TaskDependency
{
    public int TaskId { get; set; }

    public int DependsOnTaskId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Task DependsOnTask { get; set; } = null!;

    public virtual Task Task { get; set; } = null!;
}
