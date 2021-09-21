using Coop.Api.Core;
using Coop.Api.Interfaces;
using Coop.Core.Messages;
using Coop.Core.Messages.InvitationToken;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class CreateMember
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Firstname).NotEmpty();
                RuleFor(x => x.Lastname).NotEmpty();
            }
        }

        public class Request : IRequest<Response>
        {
            public string Email { get; set; }
            public string Password { get; set; }
            public string PasswordConfirmation { get; set; }
            public string InvitationToken { get; set; }
            public string Firstname { get; set; }
            public string Lastname { get; set; }
            public Guid? AvatarDigitalAssetId { get; set; }
            public void Deconstruct(out string email, out string password, out string passwordConfirmation, out string invitationToken, out string firstname, out string lastname)
            {
                email = Email;
                password = Password;
                passwordConfirmation = PasswordConfirmation;
                invitationToken = InvitationToken;
                firstname = Firstname;
                lastname = Lastname;
            }
        }

        public class Response : ResponseBase
        {
            public MemberDto Member { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
            private readonly IMessageHandlerContext _messageHandlerContext;
            public Handler(ICoopDbContext context, IMessageHandlerContext messageHandlerContext)
            {
                _context = context;
                _messageHandlerContext = messageHandlerContext;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var (email, password, passwordConfirmation, invitationToken, firstname, lastname) = request;

                var tcs = new TaskCompletionSource<Response>(TaskCreationOptions.RunContinuationsAsynchronously);

                _messageHandlerContext.Subscribe(async message =>
                {
                    switch (message)
                    {
                        case ValidatedInvitationToken validatedToken:
                            if(!validatedToken.IsValid)
                            {
                                throw new System.Exception();
                            }

                            await _messageHandlerContext.Publish(new Coop.Core.Messages.CreateUser(email, password, Constants.Roles.Member));
                            break;

                        case CreatedUser createdUser:
                            await _messageHandlerContext.Publish(new Coop.Core.Messages.CreateProfile(request.Firstname, request.Lastname, request.AvatarDigitalAssetId));
                            break;

                        case CreatedProfile createdProfile:
                            await _messageHandlerContext.Publish(new Coop.Core.Messages.AddProfile(createdProfile.UserId, createdProfile.ProfileId));
                            break;

                        case AddedProfile addedProfile:
                            tcs.SetResult(new Response
                            {
                                Member = (await _context.Members.SingleAsync(x => x.ProfileId == addedProfile.ProfileId)).ToDto()
                            });
                            break;
                    }
                });

                await _messageHandlerContext.Publish(new ValidateInvitationToken(request.InvitationToken));

                return await tcs.Task;
            }

        }
    }
}
