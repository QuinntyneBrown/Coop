// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using Coop.Domain.Enums;

namespace Coop.Domain.Entities;

public class InvitationToken
{
    public Guid InvitationTokenId { get; private set; }
    public string Value { get; private set; }
    public DateTime? Expiry { get; private set; }
    public InvitationTokenType Type { get; private set; } = InvitationTokenType.Member;
    public InvitationToken(string value, DateTime? expiry)
        : this(value)
    {
        Expiry = expiry;
    }
    public InvitationToken(string value, InvitationTokenType type)
        : this(value)
    {
        Type = type;
    }
    public InvitationToken(string value)
    {
        Value = value;
    }
    private InvitationToken()
    {
    }
    public void UpdateExpiry(DateTime? expiry)
    {
        Expiry = expiry;
    }
}

