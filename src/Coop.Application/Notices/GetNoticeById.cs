using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features
{
    public class GetNoticeById
    {
        public class Request : IRequest<Response>
        {
            public Guid NoticeId { get; set; }
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
                return new()
                {
                    Notice = (await _context.Notices.SingleOrDefaultAsync(x => x.NoticeId == request.NoticeId)).ToDto()
                };
            }

        }
    }
}
