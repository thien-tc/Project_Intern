using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class ActivityLog
{
    public int LogId { get; set; }

    public int? TaskId { get; set; }

    public int? SpaceId { get; set; }

    public int? UserId { get; set; }

    public string ActionType { get; set; } = null!;

    public string ActionDescription { get; set; } = null!;

    public string? OldValue { get; set; }

    public string? NewValue { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Space? Space { get; set; }

    public virtual Task? Task { get; set; }

    public virtual User? User { get; set; }
}
