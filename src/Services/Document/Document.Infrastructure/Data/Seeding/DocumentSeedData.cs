// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Document.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Document.Infrastructure.Data.Seeding;

public static class DocumentSeedData
{
    public static readonly Guid ByLawDigitalAssetId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    public static readonly Guid NoticeDigitalAssetId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
    public static readonly Guid ReportDigitalAssetId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc");
    public static readonly Guid LogoDigitalAssetId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd");

    public static void Seed(DocumentDbContext context, IConfiguration configuration)
    {
        SeedByLaws(context);
        SeedNotices(context);
        SeedReports(context);
        SeedJsonContent(context, configuration);
    }

    private static void SeedByLaws(DocumentDbContext context)
    {
        if (!context.ByLaws.Any())
        {
            var byLaw = new ByLaw("ByLaw.pdf", ByLawDigitalAssetId);
            context.ByLaws.Add(byLaw);
            context.SaveChanges();
        }
    }

    private static void SeedNotices(DocumentDbContext context)
    {
        if (!context.Notices.Any())
        {
            var notice = new Notice("Notice.pdf", NoticeDigitalAssetId);
            context.Notices.Add(notice);
            context.SaveChanges();
        }
    }

    private static void SeedReports(DocumentDbContext context)
    {
        if (!context.Reports.Any())
        {
            var report = new Report("Report.pdf", ReportDigitalAssetId);
            context.Reports.Add(report);
            context.SaveChanges();
        }
    }

    private static void SeedJsonContent(DocumentDbContext context, IConfiguration configuration)
    {
        var baseUrl = configuration["BaseUrl"] ?? "https://localhost:5001/";

        // Hero content
        if (!context.JsonContents.Any(j => j.Name == JsonContentName.Hero))
        {
            var heroContent = new JsonContent(JsonContentName.Hero, JObject.Parse(JsonConvert.SerializeObject(new
            {
                Heading = "OWN Housing Co-operative",
                SubHeading = "Integrity, Strength, Action",
                LogoUrl = $"{baseUrl}api/digitalasset/serve/{LogoDigitalAssetId}"
            })));
            context.JsonContents.Add(heroContent);
        }

        // Board of Directors content
        if (!context.JsonContents.Any(j => j.Name == JsonContentName.BoardOfDirectors))
        {
            var boardContent = new JsonContent(JsonContentName.BoardOfDirectors, JObject.Parse(JsonConvert.SerializeObject(new
            {
                Heading = "Board of Directors",
                SubHeading = "The Board of Directors is hard working and dedicated to transparency & solid management protocols.",
                LogoUrl = $"{baseUrl}api/digitalasset/serve/{LogoDigitalAssetId}"
            })));
            context.JsonContents.Add(boardContent);
        }

        context.SaveChanges();
    }
}
