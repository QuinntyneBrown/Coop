using Coop.Domain.Maintenance;

namespace Coop.Application.Maintenance.Dtos;

public class MaintenanceRequestDto
{
    public Guid MaintenanceRequestId { get; set; }
    public Guid RequestedByProfileId { get; set; }
    public Guid? ReceivedByProfileId { get; set; }
    public string RequestedByName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? UnitNumber { get; set; }
    public string? WorkDetails { get; set; }
    public MaintenanceRequestStatus Status { get; set; }
    public DateTime Date { get; set; }
    public DateTime? ReceivedDate { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? CompleteDate { get; set; }
    public List<MaintenanceRequestCommentDto> Comments { get; set; } = new();
    public List<MaintenanceRequestDigitalAssetDto> DigitalAssets { get; set; } = new();

    public static MaintenanceRequestDto FromMaintenanceRequest(MaintenanceRequest mr)
    {
        return new MaintenanceRequestDto
        {
            MaintenanceRequestId = mr.MaintenanceRequestId,
            RequestedByProfileId = mr.RequestedByProfileId,
            ReceivedByProfileId = mr.ReceivedByProfileId,
            RequestedByName = mr.RequestedByName,
            Title = mr.Title,
            Description = mr.Description,
            Phone = mr.Phone,
            UnitNumber = mr.UnitNumber,
            WorkDetails = mr.WorkDetails,
            Status = mr.Status,
            Date = mr.Date,
            ReceivedDate = mr.ReceivedDate,
            StartDate = mr.StartDate,
            CompleteDate = mr.CompleteDate,
            Comments = mr.Comments?.Select(MaintenanceRequestCommentDto.FromComment).ToList() ?? new(),
            DigitalAssets = mr.DigitalAssets?.Select(MaintenanceRequestDigitalAssetDto.FromDigitalAsset).ToList() ?? new()
        };
    }
}
