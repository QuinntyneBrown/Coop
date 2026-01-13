// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Asset.Domain.Entities;
using Asset.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Asset.Api.Features.OnCall;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OnCallController : ControllerBase
{
    private readonly AssetDbContext _context;

    public OnCallController(AssetDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<OnCallDto>>> GetAll()
    {
        var onCalls = await _context.OnCalls
            .Select(o => new OnCallDto(
                o.OnCallId,
                o.ProfileId,
                o.EffectiveDate,
                o.EndDate,
                o.IsActive,
                o.CreatedAt
            ))
            .ToListAsync();

        return Ok(onCalls);
    }

    [HttpGet("current")]
    [AllowAnonymous]
    public async Task<ActionResult<OnCallDto?>> GetCurrent()
    {
        var now = DateTime.UtcNow;
        var onCall = await _context.OnCalls
            .Where(o => o.EffectiveDate <= now && (!o.EndDate.HasValue || o.EndDate >= now))
            .OrderByDescending(o => o.EffectiveDate)
            .FirstOrDefaultAsync();

        if (onCall == null)
            return Ok(null);

        return Ok(new OnCallDto(
            onCall.OnCallId,
            onCall.ProfileId,
            onCall.EffectiveDate,
            onCall.EndDate,
            onCall.IsActive,
            onCall.CreatedAt
        ));
    }

    [HttpGet("{onCallId}")]
    public async Task<ActionResult<OnCallDto>> GetById(Guid onCallId)
    {
        var onCall = await _context.OnCalls.FindAsync(onCallId);

        if (onCall == null)
            return NotFound();

        return Ok(new OnCallDto(
            onCall.OnCallId,
            onCall.ProfileId,
            onCall.EffectiveDate,
            onCall.EndDate,
            onCall.IsActive,
            onCall.CreatedAt
        ));
    }

    [HttpPost]
    public async Task<ActionResult<OnCallDto>> Create([FromBody] CreateOnCallRequest request)
    {
        var onCall = new Domain.Entities.OnCall(request.ProfileId, request.EffectiveDate, request.EndDate);

        _context.OnCalls.Add(onCall);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { onCallId = onCall.OnCallId },
            new OnCallDto(
                onCall.OnCallId,
                onCall.ProfileId,
                onCall.EffectiveDate,
                onCall.EndDate,
                onCall.IsActive,
                onCall.CreatedAt
            ));
    }

    [HttpPut("{onCallId}/end")]
    public async Task<IActionResult> SetEndDate(Guid onCallId, [FromBody] SetEndDateRequest request)
    {
        var onCall = await _context.OnCalls.FindAsync(onCallId);

        if (onCall == null)
            return NotFound();

        onCall.SetEndDate(request.EndDate);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{onCallId}")]
    public async Task<IActionResult> Delete(Guid onCallId)
    {
        var onCall = await _context.OnCalls.FindAsync(onCallId);

        if (onCall == null)
            return NotFound();

        _context.OnCalls.Remove(onCall);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public record OnCallDto(
    Guid OnCallId,
    Guid ProfileId,
    DateTime EffectiveDate,
    DateTime? EndDate,
    bool IsActive,
    DateTime CreatedAt
);

public record CreateOnCallRequest(Guid ProfileId, DateTime EffectiveDate, DateTime? EndDate);
public record SetEndDateRequest(DateTime EndDate);
