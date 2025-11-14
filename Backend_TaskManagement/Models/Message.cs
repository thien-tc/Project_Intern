using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class Message
{
    public int MessageId { get; set; }

    public int ChatId { get; set; }

    public int SenderId { get; set; }

    public string? Content { get; set; }

    public string? AttachmentUrl { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool? IsEdited { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual Chat Chat { get; set; } = null!;

    public virtual ICollection<Mention> Mentions { get; set; } = new List<Mention>();

    public virtual ICollection<MessageReaction> MessageReactions { get; set; } = new List<MessageReaction>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual User Sender { get; set; } = null!;
}
