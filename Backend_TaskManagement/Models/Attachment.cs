using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class Attachment
{
    public int AttachmentId { get; set; }

    public int TaskId { get; set; }

    public string FileName { get; set; } = null!;

    public string FileUrl { get; set; } = null!;

    public string? FileType { get; set; }

    public long? FileSize { get; set; }

    public int? UploadedBy { get; set; }

    public DateTime? UploadedAt { get; set; }

    public virtual Task Task { get; set; } = null!;

    public virtual User? UploadedByNavigation { get; set; }
}
