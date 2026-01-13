// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Document.Domain.Entities;
using Document.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace Document.Api.Features.JsonContents;

[ApiController]
[Route("api/[controller]")]
public class JsonContentsController : ControllerBase
{
    private readonly DocumentDbContext _context;

    public JsonContentsController(DocumentDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<JsonContentDto>>> GetAll()
    {
        var contents = await _context.JsonContents
            .Select(j => new JsonContentDto(j.JsonContentId, j.Name, j.Json))
            .ToListAsync();

        return Ok(contents);
    }

    [HttpGet("{contentId}")]
    [AllowAnonymous]
    public async Task<ActionResult<JsonContentDto>> GetById(Guid contentId)
    {
        var content = await _context.JsonContents.FindAsync(contentId);

        if (content == null)
            return NotFound();

        return Ok(new JsonContentDto(content.JsonContentId, content.Name, content.Json));
    }

    [HttpGet("by-name/{name}")]
    [AllowAnonymous]
    public async Task<ActionResult<JsonContentDto>> GetByName(string name)
    {
        var content = await _context.JsonContents.SingleOrDefaultAsync(j => j.Name == name);

        if (content == null)
            return NotFound();

        return Ok(new JsonContentDto(content.JsonContentId, content.Name, content.Json));
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<JsonContentDto>> Create([FromBody] CreateJsonContentRequest request)
    {
        if (await _context.JsonContents.AnyAsync(j => j.Name == request.Name))
            return BadRequest("Content with this name already exists");

        var content = new JsonContent(request.Name, JObject.Parse(request.Json));

        _context.JsonContents.Add(content);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { contentId = content.JsonContentId },
            new JsonContentDto(content.JsonContentId, content.Name, content.Json));
    }

    [HttpPut("{contentId}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid contentId, [FromBody] UpdateJsonContentRequest request)
    {
        var content = await _context.JsonContents.FindAsync(contentId);

        if (content == null)
            return NotFound();

        content.UpdateJson(JObject.Parse(request.Json));
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{contentId}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid contentId)
    {
        var content = await _context.JsonContents.FindAsync(contentId);

        if (content == null)
            return NotFound();

        _context.JsonContents.Remove(content);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public record JsonContentDto(Guid JsonContentId, string Name, JObject Json);
public record CreateJsonContentRequest(string Name, string Json);
public record UpdateJsonContentRequest(string Json);
