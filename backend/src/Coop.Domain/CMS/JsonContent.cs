namespace Coop.Domain.CMS;

public class JsonContent
{
    public Guid JsonContentId { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Json { get; set; } = "{}";
    public bool IsDeleted { get; set; }

    public void Delete()
    {
        IsDeleted = true;
    }
}
