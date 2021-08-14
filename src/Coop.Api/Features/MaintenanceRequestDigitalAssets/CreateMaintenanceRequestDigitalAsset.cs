using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;

namespace Coop.Api.Features
{
    public class CreateMaintenanceRequestDigitalAsset
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
                var maintenanceRequestDigitalAsset = new MaintenanceRequestDigitalAsset(
                    request.MaintenanceRequestDigitalAsset.MaintenanceRequestId,
                    request.MaintenanceRequestDigitalAsset.DigitalAssetId
                    );

                _context.MaintenanceRequestDigitalAssets.Add(maintenanceRequestDigitalAsset);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    MaintenanceRequestDigitalAsset = maintenanceRequestDigitalAsset.ToDto()
                };
            }

        }
    }
}
