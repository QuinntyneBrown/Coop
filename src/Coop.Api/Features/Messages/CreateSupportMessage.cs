using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Core.Models;
using Coop.Core;
using Coop.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using Microsoft.EntityFrameworkCore;
using Coop.Core;

namespace Coop.Api.Features
{
    public class CreateSupportMessage
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.Message).NotNull();
                RuleFor(request => request.Message).SetValidator(new MessageValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public MessageDto Message { get; set; }
        }

        public class Response : ResponseBase
        {
            public MessageDto Message { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var userId = new Guid(_httpContextAccessor.HttpContext.User.FindFirst(Constants.ClaimTypes.UserId).Value);
                var user = await _context.Users.FindAsync(userId);
                var profile = await _context.Profiles.FindAsync(user.CurrentProfileId);
                var support = await _context.Profiles.SingleAsync(x => x.Type == ProfileType.Support);

                var message = new Message(
                    request.Message.ConversationId,
                    support.ProfileId,
                    profile.ProfileId,
                    request.Message.Body);

                _context.Messages.Add(message);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    Message = message.ToDto()
                };
            }

        }
    }
}
