using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.JsonContents
{
    public class RemoveJsonContent
    {
        public class Request : IRequest<Response>
        {
            public Guid JsonContentId { get; set; }
        }

        public class Response : ResponseBase
        {
            public JsonContentDto JsonContent { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var jsonContent = await _context.JsonContents.SingleAsync(x => x.JsonContentId == request.JsonContentId);

                _context.JsonContents.Remove(jsonContent);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    JsonContent = jsonContent.ToDto()
                };
            }

        }
    }
}
