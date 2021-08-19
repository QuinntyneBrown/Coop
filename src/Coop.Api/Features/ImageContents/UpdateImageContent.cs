using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class UpdateImageContent
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.ImageContent).NotNull();
                RuleFor(request => request.ImageContent).SetValidator(new ImageContentValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public ImageContentDto ImageContent { get; set; }
        }

        public class Response : ResponseBase
        {
            public ImageContentDto ImageContent { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var imageContent = await _context.ImageContents.SingleAsync(x => x.ImageContentId == request.ImageContent.ImageContentId);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    ImageContent = imageContent.ToDto()
                };
            }

        }
    }
}
