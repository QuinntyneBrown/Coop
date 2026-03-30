using System.Security.Cryptography;
using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using Coop.Domain.Identity;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Identity.Commands.CreateUser;

public class CreateUserHandler : IRequestHandler<CreateUserRequest, CreateUserResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public CreateUserHandler(ICoopDbContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<CreateUserResponse> Handle(CreateUserRequest request, CancellationToken cancellationToken)
    {
        var salt = new byte[16];
        RandomNumberGenerator.Fill(salt);

        var user = new User
        {
            Username = request.Username,
            Salt = salt,
            Password = _passwordHasher.HashPassword(salt, request.Password)
        };

        if (request.RoleIds.Any())
        {
            var roles = await _context.Roles
                .Where(r => request.RoleIds.Contains(r.RoleId))
                .ToListAsync(cancellationToken);
            user.Roles = roles;
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateUserResponse
        {
            User = UserDto.FromUser(user)
        };
    }
}
