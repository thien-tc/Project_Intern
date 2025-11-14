using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class Mention
{
    public int MentionId { get; set; }

    public int? CommentId { get; set; }

    public int? MessageId { get; set; }

    public int MentionedUserId { get; set; }

    public int MentionedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Comment? Comment { get; set; }

    public virtual User MentionedByNavigation { get; set; } = null!;

    public virtual User MentionedUser { get; set; } = null!;

    public virtual Message? Message { get; set; }
}
