// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.


namespace Coop.Domain.DomainEvents;

public class ValidateInvitationToken : BaseDomainEvent
{
    public ValidateInvitationToken(string invitationToken)
    {
        InvitationToken = invitationToken;
    }
    public string InvitationToken { get; private set; }
}

