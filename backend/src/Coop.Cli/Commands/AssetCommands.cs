using System.CommandLine;
using Coop.Application.Assets.Commands.CreateDigitalAsset;
using Coop.Application.Assets.Commands.RemoveDigitalAsset;
using Coop.Application.Assets.Queries.GetDigitalAssets;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;

namespace Coop.Cli.Commands;

/// <summary>The <c>asset</c> group: digital assets (L2-REQ-108 AC5, L2-REQ-040 to L2-REQ-042).</summary>
public static class AssetCommands
{
    public static Command Create(CliRunner cli)
    {
        var group = new Command("asset", "List, upload and remove digital assets");

        var list = new Command("list", "List digital assets");
        cli.SetAction(list, async context =>
        {
            var response = await context.SendAsync(new GetDigitalAssetsRequest());
            Table.Write(context.Output, new[] { "Id", "Name", "Content type", "Size" },
                response.DigitalAssets.OrderBy(a => a.CreatedOn).Select(a => new[] { a.DigitalAssetId.ToString(), a.Name, a.ContentType, Size(a.Size) }));
        });
        group.Subcommands.Add(list);

        var file = new Option<string>("--file") { Description = "The file to upload", Required = true };
        var upload = new Command("upload", "Upload a file as a digital asset") { file };
        cli.SetAction(upload, async context =>
        {
            var path = context.Required(file);
            var bytes = CliFiles.ReadBytes(path);
            var name = Path.GetFileName(path);
            if (!new FileExtensionContentTypeProvider().TryGetContentType(name, out var contentType))
                contentType = "application/octet-stream";
            using var stream = new MemoryStream(bytes);
            var formFile = new FormFile(stream, 0, bytes.Length, "file", name)
            {
                Headers = new HeaderDictionary(),
                ContentType = contentType,
            };
            var response = await context.SendAsync(new CreateDigitalAssetRequest { File = formFile });
            var id = response.DigitalAsset.DigitalAssetId;
            context.Output.WriteLine($"Uploaded \"{name}\" as {id}. It is served at /api/digitalasset/serve/{id}.");
        });
        group.Subcommands.Add(upload);

        var id = new Option<Guid>("--id") { Description = "The asset's id", Required = true };
        var remove = new Command("remove", "Remove a digital asset") { id };
        cli.SetAction(remove, async context =>
        {
            var target = context.Required(id);
            var assets = await context.SendAsync(new GetDigitalAssetsRequest());
            var asset = assets.DigitalAssets.FirstOrDefault(a => a.DigitalAssetId == target)
                ?? throw new CliException($"No asset with the id {target}.");
            await context.SendAsync(new RemoveDigitalAssetRequest { DigitalAssetId = asset.DigitalAssetId });
            context.Output.WriteLine($"Removed \"{asset.Name}\".");
        });
        group.Subcommands.Add(remove);

        return group;
    }

    /// <summary>A size in plain units, for example "11 B" or "2 KB" (L2-REQ-041 AC4).</summary>
    private static string Size(int bytes)
        => bytes < 1024 ? $"{bytes} B" : bytes < 1024 * 1024 ? $"{Math.Round(bytes / 1024d)} KB" : $"{Math.Round(bytes / 1024d / 1024d, 1)} MB";
}
