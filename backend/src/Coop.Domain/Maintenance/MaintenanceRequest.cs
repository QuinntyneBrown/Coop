using Coop.Domain.EventSourcing;
using Newtonsoft.Json;
using Coop.Domain.Tenancy;

namespace Coop.Domain.Maintenance;

public class MaintenanceRequest : ITenantOwned
{
    public Guid MaintenanceRequestId { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
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

    public bool IsStarted => Status is MaintenanceRequestStatus.InProgress or MaintenanceRequestStatus.Complete;

    public bool IsCompleted => Status is MaintenanceRequestStatus.Complete;

    public StoredEvent Start(Guid startedByProfileId)
    {
        if (Status != MaintenanceRequestStatus.Received)
            throw new InvalidOperationException("Only a received request can be started.");

        StartDate = DateTime.UtcNow;
        Status = MaintenanceRequestStatus.InProgress;
        return ToStoredEvent(new Start { MaintenanceRequestId = MaintenanceRequestId, StartedByProfileId = startedByProfileId });
    }

    public StoredEvent Complete(Guid completedByProfileId)
    {
        if (Status != MaintenanceRequestStatus.InProgress)
            throw new InvalidOperationException("Only a started request can be finished.");

        CompleteDate = DateTime.UtcNow;
        Status = MaintenanceRequestStatus.Complete;
        return ToStoredEvent(new Complete
        {
            MaintenanceRequestId = MaintenanceRequestId,
            CompletedByProfileId = completedByProfileId,
            WorkDetails = WorkDetails ?? string.Empty
        });
    }

    private StoredEvent ToStoredEvent(Common.BaseDomainEvent @event) => new()
    {
        StreamId = MaintenanceRequestId.ToString(),
        Aggregate = nameof(MaintenanceRequest),
        Data = JsonConvert.SerializeObject(@event),
        CreatedOn = @event.Created,
        CorrelationId = @event.CorrelationId
    };

    public void Delete()
    {
        IsDeleted = true;
    }
}
