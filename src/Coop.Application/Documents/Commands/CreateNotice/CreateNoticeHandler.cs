using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using Coop.Domain.Documents;
using MediatR;

namespace Coop.Application.Documents.Commands.CreateNotice;

public class CreateNoticeHandler : IRequestHandler<CreateNoticeRequest, CreateNoticeResponse>
{
    private readonly ICoopDbContext _context;
    public CreateNoticeHandler(ICoopDbContext context) { _context = context; }

    public async Task<CreateNoticeResponse> Handle(CreateNoticeRequest request, CancellationToken cancellationToken)
    {
        var notice = new Notice { Name = request.Name, Body = request.Body, DigitalAssetId = request.DigitalAssetId };
        _context.Notices.Add(notice);
        await _context.SaveChangesAsync(cancellationToken);
        return new CreateNoticeResponse { Notice = NoticeDto.FromNotice(notice) };
    }
}
