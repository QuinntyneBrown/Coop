using Coop.Domain.Documents;

namespace Coop.Application.Documents.Dtos;

public class NoticeDto : DocumentDto
{
    public string? Body { get; set; }

    public static NoticeDto FromNotice(Notice notice)
    {
        return new NoticeDto
        {
            DocumentId = notice.DocumentId,
            Name = notice.Name,
            DigitalAssetId = notice.DigitalAssetId,
            CreatedOn = notice.CreatedOn,
            Published = notice.Published,
            Body = notice.Body
        };
    }
}
