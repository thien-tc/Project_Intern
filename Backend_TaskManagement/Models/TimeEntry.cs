using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class TimeEntry
{
    public int EntryId { get; set; }

    public int TaskId { get; set; }

    public int UserId { get; set; }

    public string? Description { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public int? Duration { get; set; }

    public bool? IsBillable { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Task Task { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
