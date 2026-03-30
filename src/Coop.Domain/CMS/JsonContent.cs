using Newtonsoft.Json.Linq;

namespace Coop.Domain.CMS;

public class JsonContent
{
    public static class WellKnownNames
    {
        public const string Hero = "Hero";
        public const string BoardOfDirectors = "BoardOfDirectors";
        public const string Landing = "Landing";
    }

    public Guid JsonContentId { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public JObject Json { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public void SetJson(JObject json)
    {
        Json = json;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateJson(JObject json)
    {
        foreach (var property in json.Properties())
        {
            Json[property.Name] = property.Value;
        }

        UpdatedAt = DateTime.UtcNow;
    }

    public void SetName(string name)
    {
        Name = name;
        UpdatedAt = DateTime.UtcNow;
    }
}
