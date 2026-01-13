// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Identity.Domain.Entities;
using Identity.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Identity.Api.Features.Roles;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RolesController : ControllerBase
{
    private readonly IdentityDbContext _context;

    public RolesController(IdentityDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<RoleDto>>> GetAll()
    {
        var roles = await _context.Roles
            .Include(r => r.Privileges)
            .Select(r => new RoleDto(
                r.RoleId,
                r.Name,
                r.Privileges.Select(p => new PrivilegeDto(
                    p.PrivilegeId,
                    p.AccessRight.ToString(),
                    p.Aggregate
                )).ToList()
            ))
            .ToListAsync();

        return Ok(roles);
    }

    [HttpGet("{roleId}")]
    public async Task<ActionResult<RoleDto>> GetById(Guid roleId)
    {
        var role = await _context.Roles
            .Include(r => r.Privileges)
            .SingleOrDefaultAsync(r => r.RoleId == roleId);

        if (role == null)
        {
            return NotFound();
        }

        return Ok(new RoleDto(
            role.RoleId,
            role.Name,
            role.Privileges.Select(p => new PrivilegeDto(
                p.PrivilegeId,
                p.AccessRight.ToString(),
                p.Aggregate
            )).ToList()
        ));
    }

    [HttpPost]
    public async Task<ActionResult<RoleDto>> Create([FromBody] CreateRoleRequest request)
    {
        if (await _context.Roles.AnyAsync(r => r.Name == request.Name))
        {
            return BadRequest("Role already exists");
        }

        var role = new Role(request.Name);

        foreach (var privilegeRequest in request.Privileges)
        {
            if (Enum.TryParse<AccessRight>(privilegeRequest.AccessRight, out var accessRight))
            {
                role.AddPrivilege(new Privilege(accessRight, privilegeRequest.Aggregate));
            }
        }

        _context.Roles.Add(role);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { roleId = role.RoleId },
            new RoleDto(
                role.RoleId,
                role.Name,
                role.Privileges.Select(p => new PrivilegeDto(
                    p.PrivilegeId,
                    p.AccessRight.ToString(),
                    p.Aggregate
                )).ToList()
            ));
    }

    [HttpPost("{roleId}/privileges")]
    public async Task<IActionResult> AddPrivilege(Guid roleId, [FromBody] AddPrivilegeRequest request)
    {
        var role = await _context.Roles
            .Include(r => r.Privileges)
            .SingleOrDefaultAsync(r => r.RoleId == roleId);

        if (role == null)
        {
            return NotFound();
        }

        if (!Enum.TryParse<AccessRight>(request.AccessRight, out var accessRight))
        {
            return BadRequest("Invalid access right");
        }

        role.AddPrivilege(new Privilege(accessRight, request.Aggregate));
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{roleId}/privileges/{privilegeId}")]
    public async Task<IActionResult> RemovePrivilege(Guid roleId, Guid privilegeId)
    {
        var role = await _context.Roles
            .Include(r => r.Privileges)
            .SingleOrDefaultAsync(r => r.RoleId == roleId);

        if (role == null)
        {
            return NotFound();
        }

        var privilege = role.Privileges.SingleOrDefault(p => p.PrivilegeId == privilegeId);
        if (privilege == null)
        {
            return NotFound();
        }

        role.RemovePrivilege(privilege);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public record RoleDto(Guid RoleId, string Name, List<PrivilegeDto> Privileges);
public record PrivilegeDto(Guid PrivilegeId, string AccessRight, string Aggregate);
public record CreateRoleRequest(string Name, List<CreatePrivilegeRequest> Privileges);
public record CreatePrivilegeRequest(string AccessRight, string Aggregate);
public record AddPrivilegeRequest(string AccessRight, string Aggregate);
