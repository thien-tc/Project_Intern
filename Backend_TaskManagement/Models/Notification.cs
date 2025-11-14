using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class Notification
{
    public int NotificationId { get; set; }

    public int UserId { get; set; }

    public string Title { get; set; } = null!;

    public string? Message { get; set; }

    public string Type { get; set; } = null!;

    public int? RelatedTaskId { get; set; }

    public int? RelatedMessageId { get; set; }

    public int? RelatedCommentId { get; set; }

    public bool? IsRead { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Comment? RelatedComment { get; set; }

    public virtual Message? RelatedMessage { get; set; }

    public virtual Task? RelatedTask { get; set; }

    public virtual User User { get; set; } = null!;
}
