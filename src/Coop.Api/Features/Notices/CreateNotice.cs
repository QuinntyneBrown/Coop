using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Core.Models;
using Coop.Core;
using Coop.Core.Interfaces;

namespace Coop.Api.Features
{
    public class CreateNotice
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.Notice).NotNull();
                RuleFor(request => request.Notice).SetValidator(new NoticeValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public NoticeDto Notice { get; set; }
        }

        public class Response : ResponseBase
        {
            public NoticeDto Notice { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var notice = new Notice(default);

                _context.Notices.Add(notice);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    Notice = notice.ToDto()
                };
            }

        }
    }
}
