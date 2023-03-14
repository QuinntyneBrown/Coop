// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.Notice).NotNull();
        RuleFor(request => request.Notice).SetValidator(new NoticeValidator());
    }
}
public class UpdateNoticeRequest : IRequest<UpdateNoticeResponse>
{
    public NoticeDto Notice { get; set; }
}
public class UpdateNoticeResponse : ResponseBase
{
    public NoticeDto Notice { get; set; }
}
public class UpdateNoticeHandler : IRequestHandler<UpdateNoticeRequest, UpdateNoticeResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateNoticeHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateNoticeResponse> Handle(UpdateNoticeRequest request, CancellationToken cancellationToken)
    {
        var notice = await _context.Notices.SingleAsync(x => x.NoticeId == request.Notice.NoticeId);
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateNoticeResponse()
        {
            Notice = notice.ToDto()
        };
    }
}

