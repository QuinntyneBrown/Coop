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
    public class RemoveMaintenanceRequestDigitalAsset
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
                var maintenanceRequestDigitalAsset = await _context.MaintenanceRequestDigitalAssets.SingleAsync(x => x.MaintenanceRequestDigitalAssetId == request.MaintenanceRequestDigitalAssetId);

                _context.MaintenanceRequestDigitalAssets.Remove(maintenanceRequestDigitalAsset);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    MaintenanceRequestDigitalAsset = maintenanceRequestDigitalAsset.ToDto()
                };
            }

        }
    }
}
