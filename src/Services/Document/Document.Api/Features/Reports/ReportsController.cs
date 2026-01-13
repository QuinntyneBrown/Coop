// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.SharedKernel.Events.Document;
using Coop.SharedKernel.Messaging;
using Document.Domain.Entities;
using Document.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Document.Api.Features.Reports;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly DocumentDbContext _context;
    private readonly IMessageBus _messageBus;

    public ReportsController(DocumentDbContext context, IMessageBus messageBus)
    {
        _context = context;
        _messageBus = messageBus;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<ReportDto>>> GetAll()
    {
        var reports = await _context.Reports
            .Select(r => new ReportDto(r.DocumentId, r.Name, r.DigitalAssetId, r.PublishedDate))
            .ToListAsync();

        return Ok(reports);
    }

    [HttpGet("{reportId}")]
    [AllowAnonymous]
    public async Task<ActionResult<ReportDto>> GetById(Guid reportId)
    {
        var report = await _context.Reports.FindAsync(reportId);

        if (report == null)
            return NotFound();

        return Ok(new ReportDto(report.DocumentId, report.Name, report.DigitalAssetId, report.PublishedDate));
    }

    [HttpPost]
    public async Task<ActionResult<ReportDto>> Create([FromBody] CreateReportRequest request)
    {
        var report = new Report(request.Name, request.DigitalAssetId, request.CreatedById);

        _context.Reports.Add(report);
        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new DocumentCreatedEvent
        {
            DocumentId = report.DocumentId,
            Name = report.Name,
            DocumentType = "Report",
            DigitalAssetId = report.DigitalAssetId,
            CreatedById = request.CreatedById ?? Guid.Empty
        });

        return CreatedAtAction(nameof(GetById), new { reportId = report.DocumentId },
            new ReportDto(report.DocumentId, report.Name, report.DigitalAssetId, report.PublishedDate));
    }

    [HttpDelete("{reportId}")]
    public async Task<IActionResult> Delete(Guid reportId)
    {
        var report = await _context.Reports.FindAsync(reportId);

        if (report == null)
            return NotFound();

        _context.Reports.Remove(report);
        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new DocumentDeletedEvent
        {
            DocumentId = reportId,
            DocumentType = "Report"
        });

        return NoContent();
    }
}

public record ReportDto(Guid DocumentId, string Name, Guid DigitalAssetId, DateTime PublishedDate);
public record CreateReportRequest(string Name, Guid DigitalAssetId, Guid? CreatedById);
