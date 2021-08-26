using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;

namespace Coop.Api.Features
{
    public class RemoveJsonContentType
    {
        public class Request : IRequest<Response>
        {
            public Guid JsonContentTypeId { get; set; }
        }

        public class Response : ResponseBase
        {
            public JsonContentTypeDto JsonContentType { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var jsonContentType = await _context.JsonContentTypes.SingleAsync(x => x.JsonContentTypeId == request.JsonContentTypeId);

                _context.JsonContentTypes.Remove(jsonContentType);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    JsonContentType = jsonContentType.ToDto()
                };
            }

        }
    }
}
