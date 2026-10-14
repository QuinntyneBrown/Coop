using Coop.Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Commands.SendNotice;

public class SendNoticeValidator : AbstractValidator<SendNoticeRequest>
{
    public SendNoticeValidator(ICoopDbContext context)
    {
        RuleFor(x => x.DocumentId)
            .MustAsync((id, cancellationToken) => context.Notices
                .AnyAsync(n => n.DocumentId == id && n.Published && !n.IsDeleted, cancellationToken))
            .WithMessage("Only a published notice can be sent.");
    }
}
