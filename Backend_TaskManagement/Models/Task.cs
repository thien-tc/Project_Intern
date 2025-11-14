using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class Task
{
    public int TaskId { get; set; }

    public int SpaceId { get; set; }

    public int? ListId { get; set; }

    public int StatusId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public int? AssigneeId { get; set; }

    public int? ReporterId { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? DueDate { get; set; }

    public string? Priority { get; set; }

    public int? Progress { get; set; }

    public int? EstimatedTime { get; set; }

    public int? TimeTracked { get; set; }

    public int? SprintPoints { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public int? DeletedBy { get; set; }

    public virtual ICollection<ActivityLog> ActivityLogs { get; set; } = new List<ActivityLog>();

    public virtual User? Assignee { get; set; }

    public virtual ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual User? DeletedByNavigation { get; set; }

    public virtual ICollection<GoalTask> GoalTasks { get; set; } = new List<GoalTask>();

    public virtual List? List { get; set; }

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual User? Reporter { get; set; }

    public virtual Space Space { get; set; } = null!;

    public virtual TaskStatus Status { get; set; } = null!;

    public virtual ICollection<Subtask> Subtasks { get; set; } = new List<Subtask>();

    public virtual ICollection<TaskCustomFieldValue> TaskCustomFieldValues { get; set; } = new List<TaskCustomFieldValue>();

    public virtual ICollection<TaskDependency> TaskDependencyDependsOnTasks { get; set; } = new List<TaskDependency>();

    public virtual ICollection<TaskDependency> TaskDependencyTasks { get; set; } = new List<TaskDependency>();

    public virtual ICollection<TaskTag> TaskTags { get; set; } = new List<TaskTag>();

    public virtual ICollection<TaskWatcher> TaskWatchers { get; set; } = new List<TaskWatcher>();

    public virtual ICollection<TimeEntry> TimeEntries { get; set; } = new List<TimeEntry>();
}
