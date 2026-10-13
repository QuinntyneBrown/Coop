namespace Coop.Domain.Documents;

public class Document
{
    public Guid DocumentId { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public Guid? DigitalAssetId { get; set; }
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public bool Published { get; set; }
    public bool IsDeleted { get; set; }

    public void Publish()
    {
        Published = true;
    }

    public void Delete()
    {
        IsDeleted = true;
    }
}
