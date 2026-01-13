// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Asset.Domain.Entities;
using Microsoft.AspNetCore.StaticFiles;
using Newtonsoft.Json.Linq;

namespace Asset.Infrastructure.Data.Seeding;

public static class AssetSeedData
{
    public const string MemberAvatar = "earl.webp";
    public const string BoardMemberAvatar = "natasha.webp";
    public const string StaffMemberAvatar = "marie.PNG";
    public const string Logo = "Logo.jpg";
    public const string Building = "Building.jpg";
    public const string Doors = "Doors.jpg";
    public const string ByLawPdf = "ByLaw.pdf";
    public const string NoticePdf = "Notice.pdf";
    public const string ReportPdf = "Report.pdf";

    public static void Seed(AssetDbContext context)
    {
        SeedDigitalAssets(context);
        SeedThemes(context);
    }

    private static void SeedDigitalAssets(AssetDbContext context)
    {
        var provider = new FileExtensionContentTypeProvider();

        var assets = new[]
        {
            MemberAvatar,
            BoardMemberAvatar,
            StaffMemberAvatar,
            Logo,
            Building,
            Doors,
            ByLawPdf,
            NoticePdf,
            ReportPdf
        };

        foreach (var assetName in assets)
        {
            if (context.DigitalAssets.SingleOrDefault(x => x.Name == assetName) == null)
            {
                provider.TryGetContentType(assetName, out string? contentType);

                try
                {
                    var digitalAsset = new DigitalAsset
                    {
                        Name = assetName,
                        Bytes = StaticFileLocator.Get(assetName),
                        ContentType = contentType ?? "application/octet-stream"
                    };
                    context.DigitalAssets.Add(digitalAsset);
                }
                catch (FileNotFoundException)
                {
                    // Skip if file not found in embedded resources
                    Console.WriteLine($"Warning: Embedded resource '{assetName}' not found, skipping.");
                }
            }
        }

        context.SaveChanges();
    }

    private static void SeedThemes(AssetDbContext context)
    {
        // Default theme (no profile)
        if (context.Themes.SingleOrDefault(x => x.ProfileId == null) == null)
        {
            var theme = new Theme(JObject.Parse("{ \"--font-size\":\"16px\"}"));
            context.Themes.Add(theme);
            context.SaveChanges();
        }
    }
}
