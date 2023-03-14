// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class CreateReportValidator : AbstractValidator<CreateReportRequest>
{
    public CreateReportValidator()
    {
    }
}
public class CreateReportRequest : IRequest<CreateReportResponse>
{
    public string Name { get; set; }
    public Guid DigitalAssetId { get; set; }
}
public class CreateReportResponse : ResponseBase
{
    public ReportDto Report { get; set; }
}
public class CreateReportHandler : IRequestHandler<CreateReportRequest, CreateReportResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public CreateReportHandler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }
    public async Task<CreateReportResponse> Handle(CreateReportRequest request, CancellationToken cancellationToken)
    {
        var userId = new Guid(_httpContextAccessor.HttpContext.User.FindFirst(Constants.ClaimTypes.UserId).Value);
        var user = await _context.Users.FindAsync(userId);
        var @event = new Domain.DomainEvents.CreateDocument(Guid.NewGuid(), request.Name, request.DigitalAssetId, user.CurrentProfileId);
        var report = new Report(@event);
        _context.Reports.Add(report);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            Report = report.ToDto()
        };
    }
}

