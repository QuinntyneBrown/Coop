// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.SharedKernel.Events.Maintenance;
using Coop.SharedKernel.Messaging;
using Maintenance.Domain.Entities;
using Maintenance.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Maintenance.Api.Features.MaintenanceRequests;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MaintenanceRequestsController : ControllerBase
{
    private readonly MaintenanceDbContext _context;
    private readonly IMessageBus _messageBus;

    public MaintenanceRequestsController(MaintenanceDbContext context, IMessageBus messageBus)
    {
        _context = context;
        _messageBus = messageBus;
    }

    [HttpGet]
    public async Task<ActionResult<List<MaintenanceRequestDto>>> GetAll()
    {
        var requests = await _context.MaintenanceRequests
            .Include(r => r.Comments)
            .Select(r => MapToDto(r))
            .ToListAsync();

        return Ok(requests);
    }

    [HttpGet("{requestId}")]
    public async Task<ActionResult<MaintenanceRequestDto>> GetById(Guid requestId)
    {
        var request = await _context.MaintenanceRequests
            .Include(r => r.Comments)
            .Include(r => r.DigitalAssets)
            .SingleOrDefaultAsync(r => r.MaintenanceRequestId == requestId);

        if (request == null)
            return NotFound();

        return Ok(MapToDto(request));
    }

    [HttpGet("by-profile/{profileId}")]
    public async Task<ActionResult<List<MaintenanceRequestDto>>> GetByProfile(Guid profileId)
    {
        var requests = await _context.MaintenanceRequests
            .Where(r => r.RequestedByProfileId == profileId)
            .Select(r => MapToDto(r))
            .ToListAsync();

        return Ok(requests);
    }

    [HttpPost]
    public async Task<ActionResult<MaintenanceRequestDto>> Create([FromBody] CreateMaintenanceRequestRequest request)
    {
        var maintenanceRequest = new MaintenanceRequest(
            request.RequestedByProfileId,
            request.Description,
            request.Address != null ? new Address
            {
                Street = request.Address.Street,
                Unit = request.Address.Unit,
                City = request.Address.City,
                Province = request.Address.Province,
                PostalCode = request.Address.PostalCode
            } : null
        );

        _context.MaintenanceRequests.Add(maintenanceRequest);
        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new MaintenanceRequestCreatedEvent
        {
            MaintenanceRequestId = maintenanceRequest.MaintenanceRequestId,
            RequestedByProfileId = maintenanceRequest.RequestedByProfileId,
            Description = maintenanceRequest.Description,
            Status = maintenanceRequest.Status.ToString()
        });

        return CreatedAtAction(nameof(GetById), new { requestId = maintenanceRequest.MaintenanceRequestId },
            MapToDto(maintenanceRequest));
    }

    [HttpPut("{requestId}/description")]
    public async Task<IActionResult> UpdateDescription(Guid requestId, [FromBody] UpdateDescriptionRequest request)
    {
        var maintenanceRequest = await _context.MaintenanceRequests.FindAsync(requestId);

        if (maintenanceRequest == null)
            return NotFound();

        maintenanceRequest.UpdateDescription(request.Description);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("{requestId}/receive")]
    public async Task<IActionResult> Receive(Guid requestId, [FromBody] ReceiveRequest request)
    {
        var maintenanceRequest = await _context.MaintenanceRequests.FindAsync(requestId);

        if (maintenanceRequest == null)
            return NotFound();

        try
        {
            var oldStatus = maintenanceRequest.Status.ToString();
            maintenanceRequest.Receive(request.ReceivedByProfileId);
            await _context.SaveChangesAsync();

            await _messageBus.PublishAsync(new MaintenanceRequestStatusChangedEvent
            {
                MaintenanceRequestId = requestId,
                OldStatus = oldStatus,
                NewStatus = maintenanceRequest.Status.ToString()
            });

            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{requestId}/start")]
    public async Task<IActionResult> Start(Guid requestId)
    {
        var maintenanceRequest = await _context.MaintenanceRequests.FindAsync(requestId);

        if (maintenanceRequest == null)
            return NotFound();

        try
        {
            var oldStatus = maintenanceRequest.Status.ToString();
            maintenanceRequest.Start();
            await _context.SaveChangesAsync();

            await _messageBus.PublishAsync(new MaintenanceRequestStatusChangedEvent
            {
                MaintenanceRequestId = requestId,
                OldStatus = oldStatus,
                NewStatus = maintenanceRequest.Status.ToString()
            });

            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{requestId}/complete")]
    public async Task<IActionResult> Complete(Guid requestId, [FromBody] CompleteRequest request)
    {
        var maintenanceRequest = await _context.MaintenanceRequests.FindAsync(requestId);

        if (maintenanceRequest == null)
            return NotFound();

        try
        {
            var oldStatus = maintenanceRequest.Status.ToString();
            maintenanceRequest.Complete(request.CompletedByProfileId, request.WorkDetails);
            await _context.SaveChangesAsync();

            await _messageBus.PublishAsync(new MaintenanceRequestStatusChangedEvent
            {
                MaintenanceRequestId = requestId,
                OldStatus = oldStatus,
                NewStatus = maintenanceRequest.Status.ToString()
            });

            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{requestId}/comments")]
    public async Task<ActionResult<CommentDto>> AddComment(Guid requestId, [FromBody] AddCommentRequest request)
    {
        var maintenanceRequest = await _context.MaintenanceRequests.FindAsync(requestId);

        if (maintenanceRequest == null)
            return NotFound();

        var comment = new MaintenanceRequestComment(requestId, request.CreatedByProfileId, request.Body);
        maintenanceRequest.AddComment(comment);
        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new MaintenanceRequestCommentAddedEvent
        {
            MaintenanceRequestId = requestId,
            CommentId = comment.MaintenanceRequestCommentId,
            CreatedByProfileId = comment.CreatedByProfileId,
            Body = comment.Body
        });

        return Ok(new CommentDto(comment.MaintenanceRequestCommentId, comment.CreatedByProfileId, comment.Body, comment.CreatedAt));
    }

    [HttpPost("{requestId}/attachments")]
    public async Task<IActionResult> AddAttachment(Guid requestId, [FromBody] AddAttachmentRequest request)
    {
        var maintenanceRequest = await _context.MaintenanceRequests.FindAsync(requestId);

        if (maintenanceRequest == null)
            return NotFound();

        var attachment = new MaintenanceRequestDigitalAsset(requestId, request.DigitalAssetId);
        maintenanceRequest.AddDigitalAsset(attachment);
        await _context.SaveChangesAsync();

        return Ok();
    }

    private static MaintenanceRequestDto MapToDto(MaintenanceRequest r)
    {
        return new MaintenanceRequestDto(
            r.MaintenanceRequestId,
            r.RequestedByProfileId,
            r.Description,
            r.Status.ToString(),
            r.Address != null ? new AddressDto(r.Address.Street, r.Address.Unit, r.Address.City, r.Address.Province, r.Address.PostalCode) : null,
            r.UnitEntered,
            r.WorkDetails,
            r.ReceivedDate,
            r.ReceivedByProfileId,
            r.StartedDate,
            r.CompletedDate,
            r.CompletedByProfileId,
            r.Comments.Select(c => new CommentDto(c.MaintenanceRequestCommentId, c.CreatedByProfileId, c.Body, c.CreatedAt)).ToList(),
            r.DigitalAssets.Select(d => d.DigitalAssetId).ToList(),
            r.CreatedAt
        );
    }
}

public record MaintenanceRequestDto(
    Guid MaintenanceRequestId,
    Guid RequestedByProfileId,
    string Description,
    string Status,
    AddressDto? Address,
    string? UnitEntered,
    string? WorkDetails,
    DateTime? ReceivedDate,
    Guid? ReceivedByProfileId,
    DateTime? StartedDate,
    DateTime? CompletedDate,
    Guid? CompletedByProfileId,
    List<CommentDto> Comments,
    List<Guid> DigitalAssetIds,
    DateTime CreatedAt
);

public record AddressDto(string Street, string Unit, string City, string Province, string PostalCode);
public record CommentDto(Guid CommentId, Guid CreatedByProfileId, string Body, DateTime CreatedAt);
public record CreateMaintenanceRequestRequest(Guid RequestedByProfileId, string Description, AddressDto? Address);
public record UpdateDescriptionRequest(string Description);
public record ReceiveRequest(Guid ReceivedByProfileId);
public record CompleteRequest(Guid CompletedByProfileId, string? WorkDetails);
public record AddCommentRequest(Guid CreatedByProfileId, string Body);
public record AddAttachmentRequest(Guid DigitalAssetId);
