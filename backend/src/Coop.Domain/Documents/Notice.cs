namespace Coop.Domain.Documents;

public class Notice : Document
{
    public string? Body { get; set; }
    public DateTime? SentOn { get; set; }

    public void MarkSent(DateTime sentOn)
    {
        SentOn = sentOn;
    }
}
