// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.


namespace Coop.Domain.DomainEvents.InvitationToken;

public class ValidatedInvitationToken : BaseDomainEvent
{
    public bool IsValid { get; set; }
    public string InvitationTokenType { get; set; }
}

