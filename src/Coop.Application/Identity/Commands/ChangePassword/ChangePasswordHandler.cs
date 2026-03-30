using Coop.Application.Common.Interfaces;
using Coop.Domain.Identity;
using Coop.SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Identity.Commands.ChangePassword;

public class ChangePasswordHandler : IRequestHandler<ChangePasswordRequest, ChangePasswordResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ChangePasswordHandler(ICoopDbContext context, IPasswordHasher passwordHasher, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ChangePasswordResponse> Handle(ChangePasswordRequest request, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_httpContextAccessor.HttpContext!.User.FindFirst(Constants.ClaimTypes.UserId)!.Value);

        var user = await _context.Users
            .SingleAsync(u => u.UserId == userId, cancellationToken);

        var success = user.ChangePassword(_passwordHasher, request.OldPassword, request.NewPassword);

        if (success)
            await _context.SaveChangesAsync(cancellationToken);

        return new ChangePasswordResponse { Success = success };
    }
}
