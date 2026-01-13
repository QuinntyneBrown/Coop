// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Profile.Domain.Enums;

namespace Profile.Domain.Entities;

public class InvitationToken
{
    public Guid InvitationTokenId { get; private set; } = Guid.NewGuid();
    public string Value { get; private set; } = string.Empty;
    public InvitationTokenType Type { get; private set; }
    public DateTime? ExpiryDate { get; private set; }
    public bool IsUsed { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    private InvitationToken() { }

    public InvitationToken(string value, InvitationTokenType type, DateTime? expiryDate = null)
    {
        Value = value;
        Type = type;
        ExpiryDate = expiryDate;
    }

    public void MarkAsUsed()
    {
        IsUsed = true;
    }

    public bool IsValid()
    {
        if (IsUsed) return false;
        if (ExpiryDate.HasValue && ExpiryDate.Value < DateTime.UtcNow) return false;
        return true;
    }
}
