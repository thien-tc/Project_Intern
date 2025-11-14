using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class TaskTag
{
    public int TaskId { get; set; }

    public int TagId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Tag Tag { get; set; } = null!;

    public virtual Task Task { get; set; } = null!;
}
