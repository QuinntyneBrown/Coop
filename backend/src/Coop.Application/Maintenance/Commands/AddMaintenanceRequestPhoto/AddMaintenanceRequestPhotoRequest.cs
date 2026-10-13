using MediatR;
using Microsoft.AspNetCore.Http;

namespace Coop.Application.Maintenance.Commands.AddMaintenanceRequestPhoto;

public class AddMaintenanceRequestPhotoRequest : IRequest<AddMaintenanceRequestPhotoResponse>
{
    public Guid MaintenanceRequestId { get; set; }
    public IFormFile File { get; set; } = default!;
}
