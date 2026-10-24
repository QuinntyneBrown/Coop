using System.Globalization;
using System.Text;

namespace Coop.Domain.CMS;

/// <summary>
/// A website page the office adds to the public site: a title, an optional hero
/// photograph address with its description and a body of blocks held as JSON,
/// reached at /pages/{Slug} once it is published (L2-REQ-123). <see cref="Body"/>
/// is the HTML of a page written before blocks existed, kept only until the
/// startup seed rewrites it into one Existing content block.
/// </summary>
public class Page
{
    public const int SlugMaxLength = 80;

    public Guid PageId { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? HeroImageUrl { get; set; }
    public string? HeroImageAlt { get; set; }
    public string Body { get; set; } = string.Empty;
    /// <summary>The body blocks as JSON (<c>[{ "kind": "heading", "text": "…" }, …]</c>).</summary>
    public string Sections { get; set; } = "[]";
    /// <summary>True when visitors can see the page in the menu and open it.</summary>
    public bool Published { get; set; }
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; }

    public void Update(string title, string? heroImageUrl, string? heroImageAlt, string sections, bool published)
    {
        Title = title.Trim();
        Slug = SlugFrom(title);
        HeroImageUrl = string.IsNullOrWhiteSpace(heroImageUrl) ? null : heroImageUrl.Trim();
        HeroImageAlt = HeroImageUrl is null || string.IsNullOrWhiteSpace(heroImageAlt) ? null : heroImageAlt.Trim();
        Sections = sections;
        Body = string.Empty;
        Published = published;
    }

    public void Delete()
    {
        IsDeleted = true;
    }

    /// <summary>
    /// The URL segment for a title: lower case, letters and digits kept, accents
    /// removed, every other run of characters collapsed to one hyphen, at most
    /// <see cref="SlugMaxLength"/> characters. Empty when the title has no letter or digit.
    /// </summary>
    public static string SlugFrom(string title)
    {
        var slug = new StringBuilder();
        var pendingHyphen = false;

        foreach (var ch in title.Normalize(NormalizationForm.FormD))
        {
            if (CharUnicodeInfo.GetUnicodeCategory(ch) == UnicodeCategory.NonSpacingMark)
                continue;

            if (ch < 128 && char.IsLetterOrDigit(ch))
            {
                if (pendingHyphen && slug.Length > 0)
                    slug.Append('-');
                pendingHyphen = false;
                slug.Append(char.ToLowerInvariant(ch));
            }
            else
            {
                pendingHyphen = true;
            }
        }

        var result = slug.ToString();
        if (result.Length > SlugMaxLength)
            result = result[..SlugMaxLength].TrimEnd('-');
        return result;
    }
}
