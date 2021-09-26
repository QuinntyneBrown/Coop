﻿using System;

namespace Coop.Core.DomainEvents
{
    public class BuiltToken: EventBase
    {
        public BuiltToken(Guid userId, string accessToken)
        {
            UserId = userId;
            AccessToken = accessToken;
        }
        public Guid UserId { get; private set; }
        public string AccessToken { get; private set; }

        public void Deconstruct (out Guid userId, out string accessToken)
        {
            userId = UserId;
            accessToken = AccessToken;
        }
    }
}