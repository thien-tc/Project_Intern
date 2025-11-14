using System;
using System.Collections.Generic;

namespace Backend_TaskManagement.Models;

public partial class CustomField
{
    public int FieldId { get; set; }

    public int SpaceId { get; set; }

    public string FieldName { get; set; } = null!;

    public string? FieldType { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Space Space { get; set; } = null!;

    public virtual ICollection<TaskCustomFieldValue> TaskCustomFieldValues { get; set; } = new List<TaskCustomFieldValue>();
}
