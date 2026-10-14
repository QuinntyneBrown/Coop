using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Commands.SendNotice;

public class SendNoticeHandler : IRequestHandler<SendNoticeRequest, SendNoticeResponse>
{
    private readonly ICoopDbContext _context;
    private readonly INoticeSender _sender;

    public SendNoticeHandler(ICoopDbContext context, INoticeSender sender)
    {
        _context = context;
        _sender = sender;
    }

    public async Task<SendNoticeResponse> Handle(SendNoticeRequest request, CancellationToken cancellationToken)
    {
        var notice = await _context.Notices.SingleAsync(n => n.DocumentId == request.DocumentId, cancellationToken);

        // A notice is sent once; sending it again returns it as it is (ADR 0007).
        if (notice.SentOn is null)
        {
            var profiles = await _context.Profiles
                .Where(p => !p.IsDeleted && (p.NoticeByEmail || p.NoticeByText))
                .ToListAsync(cancellationToken);

            var emails = profiles.Where(p => p.NoticeByEmail).Select(p => p.Email?.Trim());
            foreach (var email in emails.Where(e => !string.IsNullOrEmpty(e)).Distinct(StringComparer.OrdinalIgnoreCase))
            {
                await _sender.SendEmailAsync(email!, $"New notice: {notice.Name}", notice.Body ?? string.Empty, cancellationToken);
            }

            var phoneNumbers = profiles.Where(p => p.NoticeByText).Select(p => p.PhoneNumber?.Trim());
            foreach (var phoneNumber in phoneNumbers.Where(n => !string.IsNullOrEmpty(n)).Distinct())
            {
                await _sender.SendTextAsync(phoneNumber!, $"New notice from the co-op: {notice.Name}. {notice.Body}".TrimEnd(), cancellationToken);
            }

            notice.MarkSent(DateTime.UtcNow);
            await _context.SaveChangesAsync(cancellationToken);
        }

        return new SendNoticeResponse { Notice = NoticeDto.FromNotice(notice) };
    }
}
