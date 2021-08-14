using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class UpdateMaintenanceRequestDigitalAsset
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.MaintenanceRequestDigitalAsset).NotNull();
                RuleFor(request => request.MaintenanceRequestDigitalAsset).SetValidator(new MaintenanceRequestDigitalAssetValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public MaintenanceRequestDigitalAssetDto MaintenanceRequestDigitalAsset { get; set; }
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
                var maintenanceRequestDigitalAsset = await _context.MaintenanceRequestDigitalAssets.SingleAsync(x => x.MaintenanceRequestDigitalAssetId == request.MaintenanceRequestDigitalAsset.MaintenanceRequestDigitalAssetId);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    MaintenanceRequestDigitalAsset = maintenanceRequestDigitalAsset.ToDto()
                };
            }

        }
    }
}
