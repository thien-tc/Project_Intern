using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class User
{
    public int UserId { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string? AvatarUrl { get; set; }

    public string? Role { get; set; }

    public bool? IsOnline { get; set; }

    public DateTime? LastSeen { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<ActivityLog> ActivityLogs { get; set; } = new List<ActivityLog>();

    public virtual ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();

    public virtual ICollection<ChatMember> ChatMembers { get; set; } = new List<ChatMember>();

    public virtual ICollection<Chat> Chats { get; set; } = new List<Chat>();

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<Goal> Goals { get; set; } = new List<Goal>();

    public virtual ICollection<Mention> MentionMentionedByNavigations { get; set; } = new List<Mention>();

    public virtual ICollection<Mention> MentionMentionedUsers { get; set; } = new List<Mention>();

    public virtual ICollection<MessageReaction> MessageReactions { get; set; } = new List<MessageReaction>();

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<SpaceMember> SpaceMembers { get; set; } = new List<SpaceMember>();

    public virtual ICollection<Subtask> Subtasks { get; set; } = new List<Subtask>();

    public virtual ICollection<Task> TaskAssignees { get; set; } = new List<Task>();

    public virtual ICollection<Task> TaskDeletedByNavigations { get; set; } = new List<Task>();

    public virtual ICollection<Task> TaskReporters { get; set; } = new List<Task>();

    public virtual ICollection<TaskWatcher> TaskWatchers { get; set; } = new List<TaskWatcher>();

    public virtual ICollection<TimeEntry> TimeEntries { get; set; } = new List<TimeEntry>();

    public virtual ICollection<Workspace> Workspaces { get; set; } = new List<Workspace>();
}
