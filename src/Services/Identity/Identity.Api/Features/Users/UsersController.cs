// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.SharedKernel.Events.Identity;
using Coop.SharedKernel.Messaging;
using Identity.Domain;
using Identity.Domain.Entities;
using Identity.Domain.Interfaces;
using Identity.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Identity.Api.Features.Users;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IdentityDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IMessageBus _messageBus;

    public UsersController(
        IdentityDbContext context,
        IPasswordHasher passwordHasher,
        IMessageBus messageBus)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _messageBus = messageBus;
    }

    [HttpGet]
    public async Task<ActionResult<List<UserDto>>> GetAll()
    {
        var users = await _context.Users
            .Include(u => u.Roles)
            .Select(u => new UserDto(
                u.UserId,
                u.Username,
                u.Roles.Select(r => r.Name).ToList(),
                u.CurrentProfileId,
                u.DefaultProfileId,
                u.CreatedAt
            ))
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("{userId}")]
    public async Task<ActionResult<UserDto>> GetById(Guid userId)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .SingleOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(new UserDto(
            user.UserId,
            user.Username,
            user.Roles.Select(r => r.Name).ToList(),
            user.CurrentProfileId,
            user.DefaultProfileId,
            user.CreatedAt
        ));
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> Create([FromBody] CreateUserRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
        {
            return BadRequest("Username already exists");
        }

        var user = new User(request.Username, request.Password, _passwordHasher);

        foreach (var roleName in request.Roles)
        {
            var role = await _context.Roles.SingleOrDefaultAsync(r => r.Name == roleName);
            if (role != null)
            {
                user.AddRole(role);
            }
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Publish integration event
        await _messageBus.PublishAsync(new UserCreatedEvent
        {
            UserId = user.UserId,
            Username = user.Username,
            Roles = user.Roles.Select(r => r.Name).ToList()
        });

        return CreatedAtAction(
            nameof(GetById),
            new { userId = user.UserId },
            new UserDto(
                user.UserId,
                user.Username,
                user.Roles.Select(r => r.Name).ToList(),
                user.CurrentProfileId,
                user.DefaultProfileId,
                user.CreatedAt
            ));
    }

    [HttpPut("{userId}")]
    public async Task<IActionResult> Update(Guid userId, [FromBody] UpdateUserRequest request)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .SingleOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrEmpty(request.Username) && request.Username != user.Username)
        {
            if (await _context.Users.AnyAsync(u => u.Username == request.Username && u.UserId != userId))
            {
                return BadRequest("Username already exists");
            }
            user.SetUsername(request.Username);
        }

        if (request.CurrentProfileId.HasValue)
        {
            user.SetCurrentProfileId(request.CurrentProfileId.Value);
        }

        if (request.DefaultProfileId.HasValue)
        {
            user.SetDefaultProfileId(request.DefaultProfileId.Value);
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{userId}")]
    public async Task<IActionResult> Delete(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound();
        }

        user.Delete();
        await _context.SaveChangesAsync();

        // Publish integration event
        await _messageBus.PublishAsync(new UserDeletedEvent { UserId = userId });

        return NoContent();
    }

    [HttpPost("{userId}/roles")]
    public async Task<IActionResult> AddRole(Guid userId, [FromBody] AddRoleRequest request)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .SingleOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
        {
            return NotFound();
        }

        var role = await _context.Roles.SingleOrDefaultAsync(r => r.Name == request.RoleName);
        if (role == null)
        {
            return BadRequest("Role not found");
        }

        user.AddRole(role);
        await _context.SaveChangesAsync();

        // Publish integration event
        await _messageBus.PublishAsync(new UserRoleChangedEvent
        {
            UserId = userId,
            Roles = user.Roles.Select(r => r.Name).ToList()
        });

        return Ok();
    }

    [HttpDelete("{userId}/roles/{roleName}")]
    public async Task<IActionResult> RemoveRole(Guid userId, string roleName)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .SingleOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
        {
            return NotFound();
        }

        var role = user.Roles.SingleOrDefault(r => r.Name == roleName);
        if (role == null)
        {
            return BadRequest("User does not have this role");
        }

        user.RemoveRole(role);
        await _context.SaveChangesAsync();

        // Publish integration event
        await _messageBus.PublishAsync(new UserRoleChangedEvent
        {
            UserId = userId,
            Roles = user.Roles.Select(r => r.Name).ToList()
        });

        return NoContent();
    }
}

public record UserDto(
    Guid UserId,
    string Username,
    List<string> Roles,
    Guid? CurrentProfileId,
    Guid? DefaultProfileId,
    DateTime CreatedAt
);

public record CreateUserRequest(string Username, string Password, List<string> Roles);
public record UpdateUserRequest(string? Username, Guid? CurrentProfileId, Guid? DefaultProfileId);
public record AddRoleRequest(string RoleName);
