using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Core;
using Coop.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class GetMaintenanceRequestDigitalAssetById
    {
        public class Request : IRequest<Response>
        {
            public Guid MaintenanceRequestDigitalAssetId { get; set; }
        }

        public class Response : ResponseBase
        {
            public MaintenanceRequestDigitalAssetDto MaintenanceRequestDigitalAsset { get; set; }
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
                    MaintenanceRequestDigitalAsset = (await _context.MaintenanceRequestDigitalAssets.SingleOrDefaultAsync(x => x.MaintenanceRequestDigitalAssetId == request.MaintenanceRequestDigitalAssetId)).ToDto()
                };
            }

        }
    }
}
