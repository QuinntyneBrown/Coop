using Coop.Application.Documents.Dtos;

namespace Coop.Cli.Commands;

/// <summary>
/// How the document commands reach one type of document (notice, bylaw or
/// report): its list query and its create, update and remove requests.
/// </summary>
public record DocumentKind(
    string Name,
    string Description,
    bool HasBody,
    Func<CommandContext, Task<IReadOnlyList<DocumentDto>>> ListAsync,
    Func<CommandContext, string, string?, Guid?, Task<DocumentDto>> CreateAsync,
    Func<CommandContext, Guid, string, string?, Guid?, Task> UpdateAsync,
    Func<CommandContext, Guid, Task> RemoveAsync);
