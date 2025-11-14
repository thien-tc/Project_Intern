using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class Comment
{
    public int CommentId { get; set; }

    public int TaskId { get; set; }

    public int UserId { get; set; }

    public string Content { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool? IsEdited { get; set; }

    public virtual ICollection<Mention> Mentions { get; set; } = new List<Mention>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual Task Task { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
