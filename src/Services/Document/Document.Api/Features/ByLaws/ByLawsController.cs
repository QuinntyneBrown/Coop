// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.SharedKernel.Events.Document;
using Coop.SharedKernel.Messaging;
using Document.Domain.Entities;
using Document.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Document.Api.Features.ByLaws;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ByLawsController : ControllerBase
{
    private readonly DocumentDbContext _context;
    private readonly IMessageBus _messageBus;

    public ByLawsController(DocumentDbContext context, IMessageBus messageBus)
    {
        _context = context;
        _messageBus = messageBus;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<ByLawDto>>> GetAll()
    {
        var bylaws = await _context.ByLaws
            .Select(b => new ByLawDto(b.DocumentId, b.Name, b.DigitalAssetId, b.PublishedDate))
            .ToListAsync();

        return Ok(bylaws);
    }

    [HttpGet("{bylawId}")]
    [AllowAnonymous]
    public async Task<ActionResult<ByLawDto>> GetById(Guid bylawId)
    {
        var bylaw = await _context.ByLaws.FindAsync(bylawId);

        if (bylaw == null)
            return NotFound();

        return Ok(new ByLawDto(bylaw.DocumentId, bylaw.Name, bylaw.DigitalAssetId, bylaw.PublishedDate));
    }

    [HttpPost]
    public async Task<ActionResult<ByLawDto>> Create([FromBody] CreateByLawRequest request)
    {
        var bylaw = new ByLaw(request.Name, request.DigitalAssetId, request.CreatedById);

        _context.ByLaws.Add(bylaw);
        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new DocumentCreatedEvent
        {
            DocumentId = bylaw.DocumentId,
            Name = bylaw.Name,
            DocumentType = "ByLaw",
            DigitalAssetId = bylaw.DigitalAssetId,
            CreatedById = request.CreatedById ?? Guid.Empty
        });

        return CreatedAtAction(nameof(GetById), new { bylawId = bylaw.DocumentId },
            new ByLawDto(bylaw.DocumentId, bylaw.Name, bylaw.DigitalAssetId, bylaw.PublishedDate));
    }

    [HttpDelete("{bylawId}")]
    public async Task<IActionResult> Delete(Guid bylawId)
    {
        var bylaw = await _context.ByLaws.FindAsync(bylawId);

        if (bylaw == null)
            return NotFound();

        _context.ByLaws.Remove(bylaw);
        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new DocumentDeletedEvent
        {
            DocumentId = bylawId,
            DocumentType = "ByLaw"
        });

        return NoContent();
    }
}

public record ByLawDto(Guid DocumentId, string Name, Guid DigitalAssetId, DateTime PublishedDate);
public record CreateByLawRequest(string Name, Guid DigitalAssetId, Guid? CreatedById);
