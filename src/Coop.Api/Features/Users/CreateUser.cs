using Coop.Api.Core;
using Coop.Api.Interfaces;
using Coop.Api.Models;
using FluentValidation;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static Coop.Api.Core.Constants;

namespace Coop.Api.Features
{
    public class CreateUser
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.User).NotNull();
                RuleFor(request => request.User).SetValidator(new UserValidator());
            }
        }

        [AuthorizeResourceOperation(nameof(Operations.Create), nameof(Aggregates.User))]
        public class Request : IRequest<Response>
        {
            public UserDto User { get; set; }
        }

        public class Response : ResponseBase
        {
            public UserDto User { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
            private readonly IPasswordHasher _passwordHasher;

            public Handler(ICoopDbContext context, IPasswordHasher passwordHasher)
            {

                _context = context;
                _passwordHasher = passwordHasher;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var user = new User(request.User.Username, request.User.Password, _passwordHasher);

                switch (request.User.DefaultProfile.ProfileType)
                {
                    case ProfileType.BoardMember:
                        var boardMember = new BoardMember(default, default, request.User.DefaultProfile.Firstname, request.User.DefaultProfile.Lastname);
                        boardMember.SetAvatar(request.User.DefaultProfile.AvatarDigitalAssetId);
                        user.Profiles.Add(boardMember);
                        break;

                    case ProfileType.Member:
                        var member = new Member(default, request.User.DefaultProfile.Firstname, request.User.DefaultProfile.Lastname);
                        member.SetAvatar(request.User.DefaultProfile.AvatarDigitalAssetId);
                        user.Profiles.Add(member);
                        break;

                    case ProfileType.StaffMember:
                        var staffMember = new StaffMember(default, default, request.User.DefaultProfile.Firstname, request.User.DefaultProfile.Lastname);
                        staffMember.SetAvatar(request.User.DefaultProfile.AvatarDigitalAssetId);
                        user.Profiles.Add(staffMember);
                        break;
                }

                foreach (var role in request.User.Roles)
                {
                    user.Roles.Add(_context.Roles.Find(role.RoleId));
                }

                _context.Users.Add(user);

                user.SetDefaultProfileId(user.Profiles.First().ProfileId);

                user.SetCurrentProfileId(user.Profiles.First().ProfileId);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    User = user.ToDto()
                };
            }

        }
    }
}
