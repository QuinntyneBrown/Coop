// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;

namespace Coop.Domain.DomainEvents;

public class BuiltToken : BaseDomainEvent
{
    public BuiltToken(Guid userId, string accessToken)
    {
        UserId = userId;
        AccessToken = accessToken;
    }
    public Guid UserId { get; private set; }
    public string AccessToken { get; private set; }
    public void Deconstruct(out Guid userId, out string accessToken)
    {
        userId = UserId;
        accessToken = AccessToken;
    }
}

