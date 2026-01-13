// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.SharedKernel.Events.Document;
using Coop.SharedKernel.Messaging;
using Document.Domain.Entities;
using Document.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Document.Api.Features.Notices;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NoticesController : ControllerBase
{
    private readonly DocumentDbContext _context;
    private readonly IMessageBus _messageBus;

    public NoticesController(DocumentDbContext context, IMessageBus messageBus)
    {
        _context = context;
        _messageBus = messageBus;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<NoticeDto>>> GetAll()
    {
        var notices = await _context.Notices
            .Select(n => new NoticeDto(n.DocumentId, n.Name, n.DigitalAssetId, n.PublishedDate))
            .ToListAsync();

        return Ok(notices);
    }

    [HttpGet("{noticeId}")]
    [AllowAnonymous]
    public async Task<ActionResult<NoticeDto>> GetById(Guid noticeId)
    {
        var notice = await _context.Notices.FindAsync(noticeId);

        if (notice == null)
            return NotFound();

        return Ok(new NoticeDto(notice.DocumentId, notice.Name, notice.DigitalAssetId, notice.PublishedDate));
    }

    [HttpPost]
    public async Task<ActionResult<NoticeDto>> Create([FromBody] CreateNoticeRequest request)
    {
        var notice = new Notice(request.Name, request.DigitalAssetId, request.CreatedById);

        _context.Notices.Add(notice);
        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new DocumentCreatedEvent
        {
            DocumentId = notice.DocumentId,
            Name = notice.Name,
            DocumentType = "Notice",
            DigitalAssetId = notice.DigitalAssetId,
            CreatedById = request.CreatedById ?? Guid.Empty
        });

        return CreatedAtAction(nameof(GetById), new { noticeId = notice.DocumentId },
            new NoticeDto(notice.DocumentId, notice.Name, notice.DigitalAssetId, notice.PublishedDate));
    }

    [HttpDelete("{noticeId}")]
    public async Task<IActionResult> Delete(Guid noticeId)
    {
        var notice = await _context.Notices.FindAsync(noticeId);

        if (notice == null)
            return NotFound();

        _context.Notices.Remove(notice);
        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new DocumentDeletedEvent
        {
            DocumentId = noticeId,
            DocumentType = "Notice"
        });

        return NoContent();
    }
}

public record NoticeDto(Guid DocumentId, string Name, Guid DigitalAssetId, DateTime PublishedDate);
public record CreateNoticeRequest(string Name, Guid DigitalAssetId, Guid? CreatedById);
