using Coop.Api.Core;
using Coop.Api.Interfaces;
using Coop.Core.Messages;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class CreateBoardMember
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.BoardMember).NotNull();
                RuleFor(request => request.BoardMember).SetValidator(new BoardMemberValidator());
                RuleFor(request => request.User).SetValidator(new UserValidator());
            }
        }

        public class Request : IRequest<Response>
        {
            public UserDto User { get; set; }
            public BoardMemberDto BoardMember { get; set; }
        }

        public class Response : ResponseBase
        {
            public BoardMemberDto BoardMember { get; set; }
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
                var tcs = new TaskCompletionSource<Response>(TaskCreationOptions.RunContinuationsAsynchronously);

                _messageHandlerContext.Subscribe(async notification =>
                {
                    switch (notification)
                    {
                        case CreatedUser createdUser:
                            await _messageHandlerContext.Publish(new Coop.Core.Messages.CreateBoardMember() { 
                                BoardTitle = request.BoardMember.BoardTitle,
                                Firstname = request.BoardMember.Firstname,
                                Lastname = request.BoardMember.Lastname,
                                AvatarDigitalAssetId = request.BoardMember.AvatarDigitalAssetId
                            });
                            break;

                        case CreatedBoardMember createdBoardMember:
                            await _messageHandlerContext.Publish(new Coop.Core.Messages.AddProfile(createdBoardMember.UserId, createdBoardMember.ProfileId));
                            break;

                        case AddedProfile addedProfile:
                            tcs.SetResult(new Response
                            {
                                BoardMember = (await _context.BoardMembers.SingleAsync(x => x.ProfileId == addedProfile.ProfileId)).ToDto()
                            });
                            break;
                    }
                });

                await _messageHandlerContext.Publish(new Coop.Core.Messages.CreateUser(request.User.Username, request.User.Password));

                return await tcs.Task;
            }
        }
    }
}
