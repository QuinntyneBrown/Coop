using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features
{
    public class GetMaintenanceRequestComments
    {
        public class Request : IRequest<Response> { }

        public class Response : ResponseBase
        {
            public List<MaintenanceRequestCommentDto> MaintenanceRequestComments { get; set; }
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
                    MaintenanceRequestComments = await _context.MaintenanceRequestComments.Select(x => x.ToDto()).ToListAsync()
                };
            }

        }
    }
}
