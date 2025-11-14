using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class Chat
{
    public int ChatId { get; set; }

    public int? SpaceId { get; set; }

    public string? Name { get; set; }

    public bool? IsPrivate { get; set; }

    public int CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<ChatMember> ChatMembers { get; set; } = new List<ChatMember>();

    public virtual User CreatedByNavigation { get; set; } = null!;

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

    public virtual Space? Space { get; set; }
}
