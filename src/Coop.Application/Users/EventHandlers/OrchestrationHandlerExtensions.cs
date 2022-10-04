﻿using Coop.Domain.Interfaces;
using Coop.Domain.DomainEvents;
using System;
using System.Threading.Tasks;

namespace Coop.Application.Features.Users
{
    public static class OrchestrationHandlerExtensions
    {
        public static Task PublishBuildTokenEvent(this IOrchestrationHandler orchestrationHandler, string username)
            => orchestrationHandler.Publish(new BuildToken(username));

        public static Task PublishBuiltTokenEvent(this IOrchestrationHandler orchestrationHandler, Guid userId, string accessToken)
            => orchestrationHandler.Publish(new BuiltToken(userId, accessToken));
    }
}