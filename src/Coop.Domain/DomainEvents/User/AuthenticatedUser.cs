// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.


namespace Coop.Domain.DomainEvents;

public class AuthenticatedUser : BaseDomainEvent
{
    public AuthenticatedUser(string username)
    {
        Username = username;
    }
    public string Username { get; private set; }
}

