using Coop.Domain.Documents;

namespace Coop.Application.Documents.Dtos;

public class DocumentDto
{
    public Guid DocumentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid? DigitalAssetId { get; set; }
    public DateTime CreatedOn { get; set; }
    public bool Published { get; set; }

    public static DocumentDto FromDocument(Document doc)
    {
        return new DocumentDto
        {
            DocumentId = doc.DocumentId,
            Name = doc.Name,
            DigitalAssetId = doc.DigitalAssetId,
            CreatedOn = doc.CreatedOn,
            Published = doc.Published
        };
    }
}
