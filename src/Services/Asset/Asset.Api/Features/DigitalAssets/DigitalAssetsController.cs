// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Asset.Domain.Entities;
using Asset.Infrastructure.Data;
using Coop.SharedKernel.Events.Asset;
using Coop.SharedKernel.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Asset.Api.Features.DigitalAssets;

[ApiController]
[Route("api/[controller]")]
public class DigitalAssetsController : ControllerBase
{
    private readonly AssetDbContext _context;
    private readonly IMessageBus _messageBus;

    public DigitalAssetsController(AssetDbContext context, IMessageBus messageBus)
    {
        _context = context;
        _messageBus = messageBus;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<DigitalAssetDto>>> GetAll()
    {
        var assets = await _context.DigitalAssets
            .Select(a => new DigitalAssetDto(
                a.DigitalAssetId,
                a.Name,
                a.ContentType,
                a.Size,
                a.CreatedAt
            ))
            .ToListAsync();

        return Ok(assets);
    }

    [HttpGet("{assetId}")]
    [Authorize]
    public async Task<ActionResult<DigitalAssetDto>> GetById(Guid assetId)
    {
        var asset = await _context.DigitalAssets.FindAsync(assetId);

        if (asset == null)
            return NotFound();

        return Ok(new DigitalAssetDto(
            asset.DigitalAssetId,
            asset.Name,
            asset.ContentType,
            asset.Size,
            asset.CreatedAt
        ));
    }

    [HttpGet("serve/{assetId}")]
    [AllowAnonymous]
    public async Task<IActionResult> Serve(Guid assetId)
    {
        var asset = await _context.DigitalAssets.FindAsync(assetId);

        if (asset == null)
            return NotFound();

        return File(asset.Bytes, asset.ContentType, asset.Name);
    }

    [HttpGet("by-name/{name}")]
    [AllowAnonymous]
    public async Task<IActionResult> ServeByName(string name)
    {
        var asset = await _context.DigitalAssets.SingleOrDefaultAsync(a => a.Name == name);

        if (asset == null)
            return NotFound();

        return File(asset.Bytes, asset.ContentType, asset.Name);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<DigitalAssetDto>> Upload([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);

        var asset = new DigitalAsset
        {
            Name = file.FileName,
            Bytes = memoryStream.ToArray(),
            ContentType = file.ContentType
        };

        _context.DigitalAssets.Add(asset);
        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new DigitalAssetCreatedEvent
        {
            DigitalAssetId = asset.DigitalAssetId,
            Name = asset.Name,
            ContentType = asset.ContentType
        });

        return CreatedAtAction(nameof(GetById), new { assetId = asset.DigitalAssetId },
            new DigitalAssetDto(
                asset.DigitalAssetId,
                asset.Name,
                asset.ContentType,
                asset.Size,
                asset.CreatedAt
            ));
    }

    [HttpPost("avatar")]
    [Authorize]
    public async Task<ActionResult<DigitalAssetDto>> UploadAvatar([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
        if (!allowedTypes.Contains(file.ContentType.ToLower()))
            return BadRequest("Invalid image type. Allowed types: jpeg, png, gif, webp");

        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);

        var asset = new DigitalAsset
        {
            Name = file.FileName,
            Bytes = memoryStream.ToArray(),
            ContentType = file.ContentType
        };

        _context.DigitalAssets.Add(asset);
        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new DigitalAssetCreatedEvent
        {
            DigitalAssetId = asset.DigitalAssetId,
            Name = asset.Name,
            ContentType = asset.ContentType
        });

        return CreatedAtAction(nameof(GetById), new { assetId = asset.DigitalAssetId },
            new DigitalAssetDto(
                asset.DigitalAssetId,
                asset.Name,
                asset.ContentType,
                asset.Size,
                asset.CreatedAt
            ));
    }

    [HttpDelete("{assetId}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid assetId)
    {
        var asset = await _context.DigitalAssets.FindAsync(assetId);

        if (asset == null)
            return NotFound();

        _context.DigitalAssets.Remove(asset);
        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new DigitalAssetDeletedEvent
        {
            DigitalAssetId = assetId
        });

        return NoContent();
    }
}

public record DigitalAssetDto(
    Guid DigitalAssetId,
    string Name,
    string ContentType,
    long Size,
    DateTime CreatedAt
);
