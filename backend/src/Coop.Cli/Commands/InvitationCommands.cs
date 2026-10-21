using System.CommandLine;
using Coop.Application.Onboarding.Commands.CreateInvitationToken;
using Coop.Application.Onboarding.Commands.RemoveInvitationToken;
using Coop.Application.Onboarding.Queries.GetInvitationTokens;
using Coop.Domain.Onboarding;

namespace Coop.Cli.Commands;

/// <summary>The <c>invitation</c> group (L2-REQ-107).</summary>
public static class InvitationCommands
{
    public static Command Create(CliRunner cli)
    {
        var group = new Command("invitation", "List, create and remove invitation tokens");

        var list = new Command("list", "List invitation tokens");
        cli.SetAction(list, async context =>
        {
            var response = await context.SendAsync(new GetInvitationTokensRequest());
            Table.Write(context.Output, new[] { "Value", "Type", "Expires", "Redeemed" },
                response.InvitationTokens.OrderBy(t => t.Value).Select(t => new[]
                {
                    t.Value,
                    t.Type.ToString(),
                    t.ExpirationDate?.ToString("yyyy-MM-dd") ?? "never",
                    t.Redeemed ? "yes" : "no",
                }));
        });
        group.Subcommands.Add(list);

        var value = new Option<string>("--value") { Description = "The token value the invitee enters", Required = true };
        var type = new Option<InvitationTokenType>("--type") { Description = "Member, BoardMember or StaffMember", Required = true };
        var expires = new Option<DateOnly?>("--expires") { Description = "The last day the token can be used, as yyyy-mm-dd" };
        var create = new Command("create", "Create a token, or return the one with this value") { value, type, expires };
        cli.SetAction(create, async context =>
        {
            var response = await context.SendAsync(new CreateInvitationTokenRequest
            {
                Value = context.Required(value).Trim(),
                Type = context.Required(type),
                // A token expires at the end of its last day.
                ExpirationDate = context.Value(expires) is DateOnly day ? day.ToDateTime(new TimeOnly(23, 59, 59), DateTimeKind.Utc) : null,
            });
            context.Output.WriteLine($"Invitation \"{response.InvitationToken.Value}\" ({response.InvitationToken.Type}) exists.");
        });
        group.Subcommands.Add(create);

        var remove = new Command("remove", "Remove a token so it can no longer be used") { value };
        cli.SetAction(remove, async context =>
        {
            var target = context.Required(value);
            var tokens = await context.SendAsync(new GetInvitationTokensRequest());
            var token = tokens.InvitationTokens.FirstOrDefault(t => t.Value == target)
                ?? throw new CliException($"No invitation with the value \"{target}\".");
            await context.SendAsync(new RemoveInvitationTokenRequest { InvitationTokenId = token.InvitationTokenId });
            context.Output.WriteLine($"Removed invitation \"{token.Value}\".");
        });
        group.Subcommands.Add(remove);

        return group;
    }
}
