using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class TaskCustomFieldValue
{
    public int TaskId { get; set; }

    public int FieldId { get; set; }

    public string? FieldValue { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual CustomField Field { get; set; } = null!;

    public virtual Task Task { get; set; } = null!;
}
