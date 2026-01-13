// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Maintenance.Domain.Enums;

namespace Maintenance.Domain.Entities;

public class MaintenanceRequest
{
    public Guid MaintenanceRequestId { get; private set; } = Guid.NewGuid();
    public Guid RequestedByProfileId { get; private set; }
    public string Description { get; private set; } = string.Empty;
    public MaintenanceRequestStatus Status { get; private set; } = MaintenanceRequestStatus.New;
    public Address? Address { get; private set; }
    public string? UnitEntered { get; private set; }
    public string? WorkDetails { get; private set; }
    public DateTime? ReceivedDate { get; private set; }
    public Guid? ReceivedByProfileId { get; private set; }
    public DateTime? StartedDate { get; private set; }
    public DateTime? CompletedDate { get; private set; }
    public Guid? CompletedByProfileId { get; private set; }
    public List<MaintenanceRequestComment> Comments { get; private set; } = new();
    public List<MaintenanceRequestDigitalAsset> DigitalAssets { get; private set; } = new();
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; private set; }

    private MaintenanceRequest() { }

    public MaintenanceRequest(Guid requestedByProfileId, string description, Address? address = null)
    {
        RequestedByProfileId = requestedByProfileId;
        Description = description;
        Address = address;
    }

    public void UpdateDescription(string description)
    {
        Description = description;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Receive(Guid receivedByProfileId)
    {
        if (Status != MaintenanceRequestStatus.New)
            throw new InvalidOperationException("Request must be in New status to be received");

        Status = MaintenanceRequestStatus.Received;
        ReceivedByProfileId = receivedByProfileId;
        ReceivedDate = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Start()
    {
        if (Status != MaintenanceRequestStatus.Received)
            throw new InvalidOperationException("Request must be in Received status to be started");

        Status = MaintenanceRequestStatus.Started;
        StartedDate = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Complete(Guid completedByProfileId, string? workDetails = null)
    {
        if (Status != MaintenanceRequestStatus.Started)
            throw new InvalidOperationException("Request must be in Started status to be completed");

        Status = MaintenanceRequestStatus.Completed;
        CompletedByProfileId = completedByProfileId;
        CompletedDate = DateTime.UtcNow;
        WorkDetails = workDetails;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetUnitEntered(string unitEntered)
    {
        UnitEntered = unitEntered;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateWorkDetails(string workDetails)
    {
        WorkDetails = workDetails;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddComment(MaintenanceRequestComment comment)
    {
        Comments.Add(comment);
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddDigitalAsset(MaintenanceRequestDigitalAsset digitalAsset)
    {
        DigitalAssets.Add(digitalAsset);
        UpdatedAt = DateTime.UtcNow;
    }
}

public class Address
{
    public string Street { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
}
