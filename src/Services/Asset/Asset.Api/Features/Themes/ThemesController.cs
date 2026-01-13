// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Asset.Domain.Entities;
using Asset.Infrastructure.Data;
using Coop.SharedKernel.Events.Asset;
using Coop.SharedKernel.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace Asset.Api.Features.Themes;

[ApiController]
[Route("api/[controller]")]
public class ThemesController : ControllerBase
{
    private readonly AssetDbContext _context;
    private readonly IMessageBus _messageBus;

    public ThemesController(AssetDbContext context, IMessageBus messageBus)
    {
        _context = context;
        _messageBus = messageBus;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<ThemeDto>>> GetAll()
    {
        var themes = await _context.Themes
            .Select(t => new ThemeDto(t.ThemeId, t.ProfileId, t.CssCustomProperties))
            .ToListAsync();

        return Ok(themes);
    }

    [HttpGet("default")]
    [AllowAnonymous]
    public async Task<ActionResult<ThemeDto>> GetDefault()
    {
        var theme = await _context.Themes.SingleOrDefaultAsync(t => t.ProfileId == null);

        if (theme == null)
            return NotFound();

        return Ok(new ThemeDto(theme.ThemeId, theme.ProfileId, theme.CssCustomProperties));
    }

    [HttpGet("{themeId}")]
    [AllowAnonymous]
    public async Task<ActionResult<ThemeDto>> GetById(Guid themeId)
    {
        var theme = await _context.Themes.FindAsync(themeId);

        if (theme == null)
            return NotFound();

        return Ok(new ThemeDto(theme.ThemeId, theme.ProfileId, theme.CssCustomProperties));
    }

    [HttpGet("by-profile/{profileId}")]
    [AllowAnonymous]
    public async Task<ActionResult<ThemeDto?>> GetByProfile(Guid profileId)
    {
        var theme = await _context.Themes.SingleOrDefaultAsync(t => t.ProfileId == profileId);

        if (theme == null)
            return Ok(null);

        return Ok(new ThemeDto(theme.ThemeId, theme.ProfileId, theme.CssCustomProperties));
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ThemeDto>> Create([FromBody] CreateThemeRequest request)
    {
        if (request.ProfileId.HasValue)
        {
            var existing = await _context.Themes.AnyAsync(t => t.ProfileId == request.ProfileId);
            if (existing)
                return BadRequest("Theme already exists for this profile");
        }

        var theme = new Theme(JObject.Parse(request.CssCustomProperties), request.ProfileId);

        _context.Themes.Add(theme);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { themeId = theme.ThemeId },
            new ThemeDto(theme.ThemeId, theme.ProfileId, theme.CssCustomProperties));
    }

    [HttpPut("{themeId}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid themeId, [FromBody] UpdateThemeRequest request)
    {
        var theme = await _context.Themes.FindAsync(themeId);

        if (theme == null)
            return NotFound();

        theme.UpdateCssCustomProperties(JObject.Parse(request.CssCustomProperties));
        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new ThemeUpdatedEvent
        {
            ThemeId = themeId,
            ProfileId = theme.ProfileId
        });

        return NoContent();
    }

    [HttpDelete("{themeId}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid themeId)
    {
        var theme = await _context.Themes.FindAsync(themeId);

        if (theme == null)
            return NotFound();

        if (theme.ProfileId == null)
            return BadRequest("Cannot delete default theme");

        _context.Themes.Remove(theme);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public record ThemeDto(Guid ThemeId, Guid? ProfileId, JObject CssCustomProperties);
public record CreateThemeRequest(Guid? ProfileId, string CssCustomProperties);
public record UpdateThemeRequest(string CssCustomProperties);
