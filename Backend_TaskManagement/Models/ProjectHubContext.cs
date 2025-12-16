using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Backend_TaskManagement.Models;

public partial class ProjectHubContext : DbContext
{
    public ProjectHubContext()
    {
    }

    public ProjectHubContext(DbContextOptions<ProjectHubContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ActivityLog> ActivityLogs { get; set; }

    public virtual DbSet<Attachment> Attachments { get; set; }

    public virtual DbSet<Chat> Chats { get; set; }

    public virtual DbSet<ChatMember> ChatMembers { get; set; }

    public virtual DbSet<Comment> Comments { get; set; }

    public virtual DbSet<CustomField> CustomFields { get; set; }

    public virtual DbSet<Goal> Goals { get; set; }

    public virtual DbSet<GoalTask> GoalTasks { get; set; }

    public virtual DbSet<List> Lists { get; set; }

    public virtual DbSet<Mention> Mentions { get; set; }

    public virtual DbSet<Message> Messages { get; set; }

    public virtual DbSet<MessageReaction> MessageReactions { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Space> Spaces { get; set; }

    public virtual DbSet<SpaceMember> SpaceMembers { get; set; }

    public virtual DbSet<Subtask> Subtasks { get; set; }

    public virtual DbSet<Tag> Tags { get; set; }

    public virtual DbSet<Task> Tasks { get; set; }

    public virtual DbSet<TaskCustomFieldValue> TaskCustomFieldValues { get; set; }

    public virtual DbSet<TaskDependency> TaskDependencies { get; set; }

    public virtual DbSet<TaskStatus> TaskStatuses { get; set; }

    public virtual DbSet<TaskTag> TaskTags { get; set; }

    public virtual DbSet<TaskWatcher> TaskWatchers { get; set; }

    public virtual DbSet<TimeEntry> TimeEntries { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Workspace> Workspaces { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            .Build();
        var connectionString = config.GetConnectionString("DBDefault");
        optionsBuilder.UseSqlServer(connectionString);
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ActivityLog>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PK__Activity__5E5499A895FDE477");

            entity.Property(e => e.LogId).HasColumnName("LogID");
            entity.Property(e => e.ActionDescription).HasMaxLength(500);
            entity.Property(e => e.ActionType).HasMaxLength(50);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NewValue).HasMaxLength(500);
            entity.Property(e => e.OldValue).HasMaxLength(500);
            entity.Property(e => e.SpaceId).HasColumnName("SpaceID");
            entity.Property(e => e.TaskId).HasColumnName("TaskID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Space).WithMany(p => p.ActivityLogs)
                .HasForeignKey(d => d.SpaceId)
                .HasConstraintName("FK_Logs_Spaces");

            entity.HasOne(d => d.Task).WithMany(p => p.ActivityLogs)
                .HasForeignKey(d => d.TaskId)
                .HasConstraintName("FK_Logs_Tasks");

            entity.HasOne(d => d.User).WithMany(p => p.ActivityLogs)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_Logs_Users");
        });

        modelBuilder.Entity<Attachment>(entity =>
        {
            entity.HasKey(e => e.AttachmentId).HasName("PK__Attachme__442C64DEC66E7878");

            entity.Property(e => e.AttachmentId).HasColumnName("AttachmentID");
            entity.Property(e => e.FileName).HasMaxLength(255);
            entity.Property(e => e.FileType).HasMaxLength(50);
            entity.Property(e => e.FileUrl).HasMaxLength(500);
            entity.Property(e => e.TaskId).HasColumnName("TaskID");
            entity.Property(e => e.UploadedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Task).WithMany(p => p.Attachments)
                .HasForeignKey(d => d.TaskId)
                .HasConstraintName("FK_Attachments_Tasks");

            entity.HasOne(d => d.UploadedByNavigation).WithMany(p => p.Attachments)
                .HasForeignKey(d => d.UploadedBy)
                .HasConstraintName("FK_Attachments_Users");
        });

        modelBuilder.Entity<Chat>(entity =>
        {
            entity.HasKey(e => e.ChatId).HasName("PK__Chats__A9FBE626EB5F4B60");

            entity.Property(e => e.ChatId).HasColumnName("ChatID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsPrivate).HasDefaultValue(false);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.SpaceId).HasColumnName("SpaceID");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Chats)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Chats_Users");

            entity.HasOne(d => d.Space).WithMany(p => p.Chats)
                .HasForeignKey(d => d.SpaceId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Chats_Spaces");
        });

        modelBuilder.Entity<ChatMember>(entity =>
        {
            entity.HasKey(e => new { e.ChatId, e.UserId }).HasName("PK__ChatMemb__78836AEC1EE87585");

            entity.Property(e => e.ChatId).HasColumnName("ChatID");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.JoinedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Chat).WithMany(p => p.ChatMembers)
                .HasForeignKey(d => d.ChatId)
                .HasConstraintName("FK_ChatMembers_Chats");

            entity.HasOne(d => d.User).WithMany(p => p.ChatMembers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ChatMembers_Users");
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.CommentId).HasName("PK__Comments__C3B4DFAA6F9E40BB");

            entity.HasIndex(e => e.TaskId, "IX_Comments_TaskID");

            entity.Property(e => e.CommentId).HasColumnName("CommentID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsEdited).HasDefaultValue(false);
            entity.Property(e => e.TaskId).HasColumnName("TaskID");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Task).WithMany(p => p.Comments)
                .HasForeignKey(d => d.TaskId)
                .HasConstraintName("FK_Comments_Tasks");

            entity.HasOne(d => d.User).WithMany(p => p.Comments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Comments_Users");
        });

        modelBuilder.Entity<CustomField>(entity =>
        {
            entity.HasKey(e => e.FieldId).HasName("PK__CustomFi__C8B6FF2730435065");

            entity.Property(e => e.FieldId).HasColumnName("FieldID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FieldName).HasMaxLength(100);
            entity.Property(e => e.FieldType)
                .HasMaxLength(50)
                .HasDefaultValue("Text");
            entity.Property(e => e.SpaceId).HasColumnName("SpaceID");

            entity.HasOne(d => d.Space).WithMany(p => p.CustomFields)
                .HasForeignKey(d => d.SpaceId)
                .HasConstraintName("FK_CustomFields_Spaces");
        });

        modelBuilder.Entity<Goal>(entity =>
        {
            entity.HasKey(e => e.GoalId).HasName("PK__Goals__8A4FFF31AAF6E177");

            entity.Property(e => e.GoalId).HasColumnName("GoalID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Progress).HasDefaultValue(0);
            entity.Property(e => e.SpaceId).HasColumnName("SpaceID");
            entity.Property(e => e.Title).HasMaxLength(150);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Goals)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Goals_Users");

            entity.HasOne(d => d.Space).WithMany(p => p.Goals)
                .HasForeignKey(d => d.SpaceId)
                .HasConstraintName("FK_Goals_Spaces");
        });

        modelBuilder.Entity<GoalTask>(entity =>
        {
            entity.HasKey(e => new { e.GoalId, e.TaskId }).HasName("PK__GoalTask__8D896BAC24A47A91");

            entity.Property(e => e.GoalId).HasColumnName("GoalID");
            entity.Property(e => e.TaskId).HasColumnName("TaskID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Goal).WithMany(p => p.GoalTasks)
                .HasForeignKey(d => d.GoalId)
                .HasConstraintName("FK_GoalTasks_Goals");

            entity.HasOne(d => d.Task).WithMany(p => p.GoalTasks)
                .HasForeignKey(d => d.TaskId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_GoalTasks_Tasks");
        });

        modelBuilder.Entity<List>(entity =>
        {
            entity.HasKey(e => e.ListId).HasName("PK__Lists__E383286587D58296");

            entity.Property(e => e.ListId).HasColumnName("ListID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.SpaceId).HasColumnName("SpaceID");

            entity.HasOne(d => d.Space).WithMany(p => p.Lists)
                .HasForeignKey(d => d.SpaceId)
                .HasConstraintName("FK_Lists_Spaces");
        });

        modelBuilder.Entity<Mention>(entity =>
        {
            entity.HasKey(e => e.MentionId).HasName("PK__Mentions__5D91623CFC119380");

            entity.Property(e => e.MentionId).HasColumnName("MentionID");
            entity.Property(e => e.CommentId).HasColumnName("CommentID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.MentionedUserId).HasColumnName("MentionedUserID");
            entity.Property(e => e.MessageId).HasColumnName("MessageID");

            entity.HasOne(d => d.Comment).WithMany(p => p.Mentions)
                .HasForeignKey(d => d.CommentId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Mentions_Comments");

            entity.HasOne(d => d.MentionedByNavigation).WithMany(p => p.MentionMentionedByNavigations)
                .HasForeignKey(d => d.MentionedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Mentions_MentionedBy");

            entity.HasOne(d => d.MentionedUser).WithMany(p => p.MentionMentionedUsers)
                .HasForeignKey(d => d.MentionedUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Mentions_Users");

            entity.HasOne(d => d.Message).WithMany(p => p.Mentions)
                .HasForeignKey(d => d.MessageId)
                .HasConstraintName("FK_Mentions_Messages");
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK__Messages__C87C037C97CA3673");

            entity.HasIndex(e => e.ChatId, "IX_Messages_ChatID");

            entity.Property(e => e.MessageId).HasColumnName("MessageID");
            entity.Property(e => e.AttachmentUrl).HasMaxLength(500);
            entity.Property(e => e.ChatId).HasColumnName("ChatID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.IsEdited).HasDefaultValue(false);
            entity.Property(e => e.SenderId).HasColumnName("SenderID");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Chat).WithMany(p => p.Messages)
                .HasForeignKey(d => d.ChatId)
                .HasConstraintName("FK_Messages_Chats");

            entity.HasOne(d => d.Sender).WithMany(p => p.Messages)
                .HasForeignKey(d => d.SenderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Messages_Users");
        });

        modelBuilder.Entity<MessageReaction>(entity =>
        {
            entity.HasKey(e => e.ReactionId).HasName("PK__MessageR__46DDF9D4002D75B9");

            entity.HasIndex(e => new { e.MessageId, e.UserId, e.Emoji }, "UQ_Reactions_MessageUser").IsUnique();

            entity.Property(e => e.ReactionId).HasColumnName("ReactionID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Emoji).HasMaxLength(20);
            entity.Property(e => e.MessageId).HasColumnName("MessageID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Message).WithMany(p => p.MessageReactions)
                .HasForeignKey(d => d.MessageId)
                .HasConstraintName("FK_Reactions_Messages");

            entity.HasOne(d => d.User).WithMany(p => p.MessageReactions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Reactions_Users");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E329710AF75");

            entity.HasIndex(e => new { e.UserId, e.IsRead }, "IX_Notifications_UserID_IsRead");

            entity.Property(e => e.NotificationId).HasColumnName("NotificationID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsRead).HasDefaultValue(false);
            entity.Property(e => e.Message).HasMaxLength(500);
            entity.Property(e => e.RelatedCommentId).HasColumnName("RelatedCommentID");
            entity.Property(e => e.RelatedMessageId).HasColumnName("RelatedMessageID");
            entity.Property(e => e.RelatedTaskId).HasColumnName("RelatedTaskID");
            entity.Property(e => e.Title).HasMaxLength(150);
            entity.Property(e => e.Type).HasMaxLength(50);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.RelatedComment).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.RelatedCommentId)
                .HasConstraintName("FK_Notifications_Comments");

            entity.HasOne(d => d.RelatedMessage).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.RelatedMessageId)
                .HasConstraintName("FK_Notifications_Messages");

            entity.HasOne(d => d.RelatedTask).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.RelatedTaskId)
                .HasConstraintName("FK_Notifications_Tasks");

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Notifications_Users");
        });

        modelBuilder.Entity<Space>(entity =>
        {
            entity.HasKey(e => e.SpaceId).HasName("PK__Spaces__83E25E0E986B0531");

            entity.Property(e => e.SpaceId).HasColumnName("SpaceID");
            entity.Property(e => e.Color)
                .HasMaxLength(20)
                .HasDefaultValue("#3b82f6");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.WorkspaceId).HasColumnName("WorkspaceID");

            entity.HasOne(d => d.Workspace).WithMany(p => p.Spaces)
                .HasForeignKey(d => d.WorkspaceId)
                .HasConstraintName("FK_Spaces_Workspaces");
        });

        modelBuilder.Entity<SpaceMember>(entity =>
        {
            entity.HasKey(e => new { e.SpaceId, e.UserId }).HasName("PK__SpaceMem__529AD2C473DB4DC6");

            entity.Property(e => e.SpaceId).HasColumnName("SpaceID");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.JoinedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .HasDefaultValue("Member");

            entity.HasOne(d => d.Space).WithMany(p => p.SpaceMembers)
                .HasForeignKey(d => d.SpaceId)
                .HasConstraintName("FK_SpaceMembers_Spaces");

            entity.HasOne(d => d.User).WithMany(p => p.SpaceMembers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SpaceMembers_Users");
        });

        modelBuilder.Entity<Subtask>(entity =>
        {
            entity.HasKey(e => e.SubtaskId).HasName("PK__Subtasks__E08717B66741F149");

            entity.Property(e => e.SubtaskId).HasColumnName("SubtaskID");
            entity.Property(e => e.AssigneeId).HasColumnName("AssigneeID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsCompleted).HasDefaultValue(false);
            entity.Property(e => e.OrderIndex).HasDefaultValue(0);
            entity.Property(e => e.TaskId).HasColumnName("TaskID");
            entity.Property(e => e.Title).HasMaxLength(150);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Assignee).WithMany(p => p.Subtasks)
                .HasForeignKey(d => d.AssigneeId)
                .HasConstraintName("FK_Subtasks_Assignee");

            entity.HasOne(d => d.Task).WithMany(p => p.Subtasks)
                .HasForeignKey(d => d.TaskId)
                .HasConstraintName("FK_Subtasks_Tasks");
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.TagId).HasName("PK__Tags__657CFA4CA7B86F5B");

            entity.HasIndex(e => new { e.SpaceId, e.Name }, "UQ_Tags_SpaceName").IsUnique();

            entity.Property(e => e.TagId).HasColumnName("TagID");
            entity.Property(e => e.Color)
                .HasMaxLength(20)
                .HasDefaultValue("#6b7280");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.SpaceId).HasColumnName("SpaceID");

            entity.HasOne(d => d.Space).WithMany(p => p.Tags)
                .HasForeignKey(d => d.SpaceId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Tags_Spaces");
        });

        modelBuilder.Entity<Task>(entity =>
        {
            entity.HasKey(e => e.TaskId).HasName("PK__Tasks__7C6949D168C753C1");

            entity.HasIndex(e => e.AssigneeId, "IX_Tasks_AssigneeID");

            entity.HasIndex(e => e.DueDate, "IX_Tasks_DueDate");

            entity.HasIndex(e => e.SpaceId, "IX_Tasks_SpaceID");

            entity.HasIndex(e => e.StatusId, "IX_Tasks_StatusID");

            entity.Property(e => e.TaskId).HasColumnName("TaskID");
            entity.Property(e => e.AssigneeId).HasColumnName("AssigneeID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DeletedAt).HasColumnType("datetime");
            entity.Property(e => e.DueDate).HasColumnType("datetime");
            entity.Property(e => e.ListId).HasColumnName("ListID");
            entity.Property(e => e.Priority)
                .HasMaxLength(20)
                .HasDefaultValue("Normal");
            entity.Property(e => e.Progress).HasDefaultValue(0);
            entity.Property(e => e.ReporterId).HasColumnName("ReporterID");
            entity.Property(e => e.SpaceId).HasColumnName("SpaceID");
            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.TimeTracked).HasDefaultValue(0);
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Assignee).WithMany(p => p.TaskAssignees)
                .HasForeignKey(d => d.AssigneeId)
                .HasConstraintName("FK_Tasks_Assignee");

            entity.HasOne(d => d.DeletedByNavigation).WithMany(p => p.TaskDeletedByNavigations)
                .HasForeignKey(d => d.DeletedBy)
                .HasConstraintName("FK_Tasks_DeletedBy");

            entity.HasOne(d => d.List).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.ListId)
                .HasConstraintName("FK_Tasks_Lists");

            entity.HasOne(d => d.Reporter).WithMany(p => p.TaskReporters)
                .HasForeignKey(d => d.ReporterId)
                .HasConstraintName("FK_Tasks_Reporter");

            entity.HasOne(d => d.Space).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.SpaceId)
                .HasConstraintName("FK_Tasks_Spaces");

            entity.HasOne(d => d.Status).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Tasks_Statuses");
        });

        modelBuilder.Entity<TaskCustomFieldValue>(entity =>
        {
            entity.HasKey(e => new { e.TaskId, e.FieldId }).HasName("PK__TaskCust__10E2262345A2F0BF");

            entity.Property(e => e.TaskId).HasColumnName("TaskID");
            entity.Property(e => e.FieldId).HasColumnName("FieldID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FieldValue).HasMaxLength(500);

            entity.HasOne(d => d.Field).WithMany(p => p.TaskCustomFieldValues)
                .HasForeignKey(d => d.FieldId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TaskCustomFields_Fields");

            entity.HasOne(d => d.Task).WithMany(p => p.TaskCustomFieldValues)
                .HasForeignKey(d => d.TaskId)
                .HasConstraintName("FK_TaskCustomFields_Tasks");
        });

        modelBuilder.Entity<TaskDependency>(entity =>
        {
            entity.HasKey(e => new { e.TaskId, e.DependsOnTaskId }).HasName("PK__TaskDepe__EA1CE4C1A0275EEB");

            entity.Property(e => e.TaskId).HasColumnName("TaskID");
            entity.Property(e => e.DependsOnTaskId).HasColumnName("DependsOnTaskID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.DependsOnTask).WithMany(p => p.TaskDependencyDependsOnTasks)
                .HasForeignKey(d => d.DependsOnTaskId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TaskDependencies_DependsOn");

            entity.HasOne(d => d.Task).WithMany(p => p.TaskDependencyTasks)
                .HasForeignKey(d => d.TaskId)
                .HasConstraintName("FK_TaskDependencies_Task");
        });

        modelBuilder.Entity<TaskStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__TaskStat__C8EE20437A4B4784");

            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.Color)
                .HasMaxLength(20)
                .HasDefaultValue("#888888");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsFinal).HasDefaultValue(false);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.SpaceId).HasColumnName("SpaceID");

            entity.HasOne(d => d.Space).WithMany(p => p.TaskStatuses)
                .HasForeignKey(d => d.SpaceId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_TaskStatuses_Spaces");
        });

        modelBuilder.Entity<TaskTag>(entity =>
        {
            entity.HasKey(e => new { e.TaskId, e.TagId }).HasName("PK__TaskTags__AA3E867545C7139D");

            entity.Property(e => e.TaskId).HasColumnName("TaskID");
            entity.Property(e => e.TagId).HasColumnName("TagID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Tag).WithMany(p => p.TaskTags)
                .HasForeignKey(d => d.TagId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TaskTags_Tags");

            entity.HasOne(d => d.Task).WithMany(p => p.TaskTags)
                .HasForeignKey(d => d.TaskId)
                .HasConstraintName("FK_TaskTags_Tasks");
        });

        modelBuilder.Entity<TaskWatcher>(entity =>
        {
            entity.HasKey(e => new { e.TaskId, e.UserId }).HasName("PK__TaskWatc__AD11C51BB2883DDE");

            entity.Property(e => e.TaskId).HasColumnName("TaskID");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Task).WithMany(p => p.TaskWatchers)
                .HasForeignKey(d => d.TaskId)
                .HasConstraintName("FK_TaskWatchers_Tasks");

            entity.HasOne(d => d.User).WithMany(p => p.TaskWatchers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TaskWatchers_Users");
        });

        modelBuilder.Entity<TimeEntry>(entity =>
        {
            entity.HasKey(e => e.EntryId).HasName("PK__TimeEntr__F57BD2D7C927A18A");

            entity.HasIndex(e => e.TaskId, "IX_TimeEntries_TaskID");

            entity.Property(e => e.EntryId).HasColumnName("EntryID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.EndTime).HasColumnType("datetime");
            entity.Property(e => e.IsBillable).HasDefaultValue(false);
            entity.Property(e => e.StartTime).HasColumnType("datetime");
            entity.Property(e => e.TaskId).HasColumnName("TaskID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Task).WithMany(p => p.TimeEntries)
                .HasForeignKey(d => d.TaskId)
                .HasConstraintName("FK_TimeEntries_Tasks");

            entity.HasOne(d => d.User).WithMany(p => p.TimeEntries)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TimeEntries_Users");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCACC0C0DB79");

            entity.HasIndex(e => e.Email, "IX_Users_Email");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D10534017566CC").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.AvatarUrl).IsUnicode(true);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.IsOnline).HasDefaultValue(false);
            entity.Property(e => e.LastSeen)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .HasDefaultValue("Member");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Workspace>(entity =>
        {
            entity.HasKey(e => e.WorkspaceId).HasName("PK__Workspac__C84765B102D74B1B");

            entity.Property(e => e.WorkspaceId).HasColumnName("WorkspaceID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Workspaces)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Workspaces_Users");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
