// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Asset.Domain.Entities;

public class OnCall
{
    public Guid OnCallId { get; private set; } = Guid.NewGuid();
    public Guid ProfileId { get; private set; }
    public DateTime EffectiveDate { get; private set; }
    public DateTime? EndDate { get; private set; }
    public bool IsActive => DateTime.UtcNow >= EffectiveDate && (!EndDate.HasValue || DateTime.UtcNow <= EndDate);
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    private OnCall() { }

    public OnCall(Guid profileId, DateTime effectiveDate, DateTime? endDate = null)
    {
        ProfileId = profileId;
        EffectiveDate = effectiveDate;
        EndDate = endDate;
    }

    public void SetEndDate(DateTime endDate)
    {
        EndDate = endDate;
    }
}
