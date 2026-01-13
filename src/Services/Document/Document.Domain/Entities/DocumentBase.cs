// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Document.Domain.Entities;

public abstract class DocumentBase
{
    public Guid DocumentId { get; protected set; } = Guid.NewGuid();
    public string Name { get; protected set; } = string.Empty;
    public Guid DigitalAssetId { get; protected set; }
    public Guid? CreatedById { get; protected set; }
    public DateTime PublishedDate { get; protected set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; protected set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; protected set; }

    protected DocumentBase() { }

    protected DocumentBase(string name, Guid digitalAssetId, Guid? createdById = null)
    {
        Name = name;
        DigitalAssetId = digitalAssetId;
        CreatedById = createdById;
    }

    public void UpdateName(string name)
    {
        Name = name;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetPublishedDate(DateTime publishedDate)
    {
        PublishedDate = publishedDate;
        UpdatedAt = DateTime.UtcNow;
    }
}
