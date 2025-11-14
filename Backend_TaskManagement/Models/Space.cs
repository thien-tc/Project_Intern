using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class Space
{
    public int SpaceId { get; set; }

    public int WorkspaceId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? Color { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<ActivityLog> ActivityLogs { get; set; } = new List<ActivityLog>();

    public virtual ICollection<Chat> Chats { get; set; } = new List<Chat>();

    public virtual ICollection<CustomField> CustomFields { get; set; } = new List<CustomField>();

    public virtual ICollection<Goal> Goals { get; set; } = new List<Goal>();

    public virtual ICollection<List> Lists { get; set; } = new List<List>();

    public virtual ICollection<SpaceMember> SpaceMembers { get; set; } = new List<SpaceMember>();

    public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();

    public virtual ICollection<TaskStatus> TaskStatuses { get; set; } = new List<TaskStatus>();

    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();

    public virtual Workspace Workspace { get; set; } = null!;
}
