using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class Goal
{
    public int GoalId { get; set; }

    public int SpaceId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public DateOnly? TargetDate { get; set; }

    public int? Progress { get; set; }

    public int CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User CreatedByNavigation { get; set; } = null!;

    public virtual ICollection<GoalTask> GoalTasks { get; set; } = new List<GoalTask>();

    public virtual Space Space { get; set; } = null!;
}
