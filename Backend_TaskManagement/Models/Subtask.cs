using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class Subtask
{
    public int SubtaskId { get; set; }

    public int TaskId { get; set; }

    public string Title { get; set; } = null!;

    public bool? IsCompleted { get; set; }

    public int? AssigneeId { get; set; }

    public int? OrderIndex { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User? Assignee { get; set; }

    public virtual Task Task { get; set; } = null!;
}
