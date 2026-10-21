using System.CommandLine;
using Coop.Application.Documents.Commands.CreateByLaw;
using Coop.Application.Documents.Commands.CreateNotice;
using Coop.Application.Documents.Commands.CreateReport;
using Coop.Application.Documents.Commands.PublishDocument;
using Coop.Application.Documents.Commands.RemoveByLaw;
using Coop.Application.Documents.Commands.RemoveNotice;
using Coop.Application.Documents.Commands.RemoveReport;
using Coop.Application.Documents.Commands.SendNotice;
using Coop.Application.Documents.Commands.UpdateByLaw;
using Coop.Application.Documents.Commands.UpdateNotice;
using Coop.Application.Documents.Commands.UpdateReport;
using Coop.Application.Documents.Dtos;
using Coop.Application.Documents.Queries.GetByLaws;
using Coop.Application.Documents.Queries.GetNotices;
using Coop.Application.Documents.Queries.GetReports;

namespace Coop.Cli.Commands;

/// <summary>The <c>notice</c>, <c>bylaw</c> and <c>report</c> groups (L2-REQ-109).</summary>
public static class DocumentCommands
{
    public static Command CreateNotices(CliRunner cli)
    {
        var group = Create(cli, new DocumentKind(
            "notice",
            "List, create, update, publish, remove and send notices",
            HasBody: true,
            async context => (await context.SendAsync(new GetNoticesRequest())).Notices,
            async (context, name, body, asset) => (await context.SendAsync(new CreateNoticeRequest { Name = name, Body = body, DigitalAssetId = asset })).Notice,
            (context, id, name, body, asset) => context.SendAsync(new UpdateNoticeRequest { DocumentId = id, Name = name, Body = body, DigitalAssetId = asset }),
            (context, id) => context.SendAsync(new RemoveNoticeRequest { DocumentId = id })));

        // Sending is the API's own rule: published notices only, and only once (L2-REQ-093, ADR 0007).
        var id = new Option<Guid>("--id") { Description = "The notice's id", Required = true };
        var send = new Command("send", "Send a published notice to the members who asked for notices") { id };
        cli.SetAction(send, async context =>
        {
            var response = await context.SendAsync(new SendNoticeRequest { DocumentId = context.Required(id) });
            context.Output.WriteLine($"\"{response.Notice.Name}\" was sent to members who asked for notices on {response.Notice.SentOn:yyyy-MM-dd HH:mm} UTC.");
        });
        group.Subcommands.Add(send);
        return group;
    }

    public static Command CreateByLaws(CliRunner cli) => Create(cli, new DocumentKind(
        "bylaw",
        "List, create, update, publish and remove bylaws",
        HasBody: false,
        async context => (await context.SendAsync(new GetByLawsRequest())).ByLaws,
        async (context, name, _, asset) => (await context.SendAsync(new CreateByLawRequest { Name = name, DigitalAssetId = asset })).ByLaw,
        (context, id, name, _, asset) => context.SendAsync(new UpdateByLawRequest { DocumentId = id, Name = name, DigitalAssetId = asset }),
        (context, id) => context.SendAsync(new RemoveByLawRequest { DocumentId = id })));

    public static Command CreateReports(CliRunner cli) => Create(cli, new DocumentKind(
        "report",
        "List, create, update, publish and remove reports",
        HasBody: true,
        async context => (await context.SendAsync(new GetReportsRequest())).Reports,
        async (context, name, body, asset) => (await context.SendAsync(new CreateReportRequest { Name = name, Body = body, DigitalAssetId = asset })).Report,
        (context, id, name, body, asset) => context.SendAsync(new UpdateReportRequest { DocumentId = id, Name = name, Body = body, DigitalAssetId = asset }),
        (context, id) => context.SendAsync(new RemoveReportRequest { DocumentId = id })));

    private static Command Create(CliRunner cli, DocumentKind kind)
    {
        var group = new Command(kind.Name, kind.Description);

        var list = new Command("list", $"List {kind.Name}s");
        cli.SetAction(list, async context =>
        {
            var documents = await kind.ListAsync(context);
            Table.Write(context.Output, new[] { "Id", "Name", "Published", "Sent" },
                documents.OrderBy(d => d.CreatedOn).Select(d => new[]
                {
                    d.DocumentId.ToString(),
                    d.Name,
                    d.Published ? "yes" : "no",
                    d is NoticeDto { SentOn: DateTime sentOn } ? sentOn.ToString("yyyy-MM-dd") : "-",
                }));
        });
        group.Subcommands.Add(list);

        var name = new Option<string>("--name") { Description = "The title members see", Required = true };
        var body = new Option<string?>("--body") { Description = "The text members read" };
        var asset = new Option<Guid?>("--asset-id") { Description = "A digital asset to attach, from asset upload" };
        var publish = new Option<bool>("--publish") { Description = "Publish it straight away" };

        var create = new Command("create", $"Create an unpublished {kind.Name}") { name, asset, publish };
        if (kind.HasBody)
            create.Options.Add(body);
        cli.SetAction(create, async context =>
        {
            var document = await kind.CreateAsync(context, context.Required(name), kind.HasBody ? context.Value(body) : null, context.Value(asset));
            if (context.Value(publish))
                document = (await context.SendAsync(new PublishDocumentRequest { DocumentId = document.DocumentId })).Document;
            context.Output.WriteLine($"Created {kind.Name} \"{document.Name}\" ({document.DocumentId}), {(document.Published ? "published" : "not published")}.");
        });
        group.Subcommands.Add(create);

        var id = new Option<Guid>("--id") { Description = $"The {kind.Name}'s id", Required = true };
        var update = new Command("update", $"Change a {kind.Name}; a body or attachment left out is kept") { id, name, asset };
        if (kind.HasBody)
            update.Options.Add(body);
        cli.SetAction(update, async context =>
        {
            var document = await FindAsync(context, kind, context.Required(id));
            var newBody = kind.HasBody && context.ParseResult.GetResult(body) is not null ? context.Value(body) : BodyOf(document);
            var newAsset = context.ParseResult.GetResult(asset) is not null ? context.Value(asset) : document.DigitalAssetId;
            await kind.UpdateAsync(context, document.DocumentId, context.Required(name), newBody, newAsset);
            context.Output.WriteLine($"Updated {kind.Name} {document.DocumentId}.");
        });
        group.Subcommands.Add(update);

        var publishCommand = new Command("publish", $"Publish a {kind.Name}") { id };
        cli.SetAction(publishCommand, async context =>
        {
            var document = await FindAsync(context, kind, context.Required(id));
            await context.SendAsync(new PublishDocumentRequest { DocumentId = document.DocumentId });
            context.Output.WriteLine($"Published {kind.Name} \"{document.Name}\".");
        });
        group.Subcommands.Add(publishCommand);

        var remove = new Command("remove", $"Remove a {kind.Name}") { id };
        cli.SetAction(remove, async context =>
        {
            var document = await FindAsync(context, kind, context.Required(id));
            await kind.RemoveAsync(context, document.DocumentId);
            context.Output.WriteLine($"Removed {kind.Name} \"{document.Name}\".");
        });
        group.Subcommands.Add(remove);

        return group;
    }

    private static async Task<DocumentDto> FindAsync(CommandContext context, DocumentKind kind, Guid id)
        => (await kind.ListAsync(context)).FirstOrDefault(d => d.DocumentId == id)
            ?? throw new CliException($"No {kind.Name} with the id {id}.");

    private static string? BodyOf(DocumentDto document) => document switch
    {
        NoticeDto notice => notice.Body,
        ReportDto report => report.Body,
        _ => null,
    };
}
