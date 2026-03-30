using Coop.Domain.Common;

namespace Coop.Domain.Maintenance;

public class MaintenanceRequest : AggregateRoot
{
    public Guid MaintenanceRequestId { get; private set; }
    public Guid RequestedByProfileId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public MaintenanceRequestStatus Status { get; private set; }
    public UnitEntered UnitEntered { get; private set; }
    public string? WorkDetails { get; private set; }
    public Guid? ReceivedByProfileId { get; private set; }
    public Guid? StartedByProfileId { get; private set; }
    public Guid? CompletedByProfileId { get; private set; }
    public DateTime? ReceivedDate { get; private set; }
    public DateTime? StartDate { get; private set; }
    public DateTime? CompletedDate { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    public List<MaintenanceRequestComment> Comments { get; private set; } = new();
    public List<MaintenanceRequestDigitalAsset> DigitalAssets { get; private set; } = new();

    protected override void When(dynamic @event)
    {
        Handle(@event);
    }

    private void Handle(CreateMaintenanceRequest @event)
    {
        MaintenanceRequestId = @event.MaintenanceRequestId;
        RequestedByProfileId = @event.RequestedByProfileId;
        Title = @event.Title;
        Description = @event.Description;
        UnitEntered = @event.UnitEntered;
        Status = MaintenanceRequestStatus.New;
        CreatedAt = @event.Created;
        UpdatedAt = @event.Created;
    }

    private void Handle(Receive @event)
    {
        ReceivedByProfileId = @event.ReceivedByProfileId;
        Status = MaintenanceRequestStatus.Received;
        ReceivedDate = @event.Created;
        UpdatedAt = @event.Created;
    }

    private void Handle(Start @event)
    {
        StartedByProfileId = @event.StartedByProfileId;
        Status = MaintenanceRequestStatus.Started;
        StartDate = @event.Created;
        UpdatedAt = @event.Created;
    }

    private void Handle(Complete @event)
    {
        CompletedByProfileId = @event.CompletedByProfileId;
        WorkDetails = @event.WorkDetails;
        Status = MaintenanceRequestStatus.Completed;
        CompletedDate = @event.Created;
        UpdatedAt = @event.Created;
    }

    private void Handle(UpdateDescription @event)
    {
        Description = @event.Description;
        UpdatedAt = @event.Created;
    }

    private void Handle(UpdateWorkDetails @event)
    {
        WorkDetails = @event.WorkDetails;
        UpdatedAt = @event.Created;
    }

    public override void EnsureValidState()
    {
        if (MaintenanceRequestId == Guid.Empty)
            throw new InvalidOperationException("MaintenanceRequestId is required.");

        if (RequestedByProfileId == Guid.Empty)
            throw new InvalidOperationException("RequestedByProfileId is required.");

        if (string.IsNullOrWhiteSpace(Title))
            throw new InvalidOperationException("Title is required.");

        if (string.IsNullOrWhiteSpace(Description))
            throw new InvalidOperationException("Description is required.");
    }
}
