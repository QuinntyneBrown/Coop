// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.


namespace Coop.Domain.DomainEvents;

public class BuildToken : BaseDomainEvent
{
    public BuildToken(string username)
    {
        Username = username;
    }
    public string Username { get; private set; }
}

