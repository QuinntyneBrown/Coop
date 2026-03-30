namespace Coop.Domain.Maintenance;

public class MaintenanceRequest
{
    public Guid MaintenanceRequestId { get; set; } = Guid.NewGuid();
    public Guid RequestedByProfileId { get; set; }
    public Guid? ReceivedByProfileId { get; set; }
    public string RequestedByName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? UnitNumber { get; set; }
    public string? WorkDetails { get; set; }
    public MaintenanceRequestStatus Status { get; set; } = MaintenanceRequestStatus.New;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public DateTime? ReceivedDate { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? CompleteDate { get; set; }
    public List<MaintenanceRequestComment> Comments { get; set; } = new();
    public List<MaintenanceRequestDigitalAsset> DigitalAssets { get; set; } = new();
    public bool IsDeleted { get; set; }

    public void Receive(Guid receivedByProfileId)
    {
        ReceivedByProfileId = receivedByProfileId;
        ReceivedDate = DateTime.UtcNow;
        Status = MaintenanceRequestStatus.Received;
    }

    public void Start()
    {
        StartDate = DateTime.UtcNow;
        Status = MaintenanceRequestStatus.InProgress;
    }

    public void Complete()
    {
        CompleteDate = DateTime.UtcNow;
        Status = MaintenanceRequestStatus.Complete;
    }

    public void Delete()
    {
        IsDeleted = true;
    }
}
