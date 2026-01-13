// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.SharedKernel.Events;

namespace Coop.SharedKernel.Messaging;

public interface IMessageBus
{
    Task PublishAsync<TEvent>(TEvent @event, CancellationToken cancellationToken = default)
        where TEvent : IntegrationEvent;

    Task PublishAsync<TEvent>(string channel, TEvent @event, CancellationToken cancellationToken = default)
        where TEvent : IntegrationEvent;

    Task SubscribeAsync<TEvent>(string channel, Func<TEvent, Task> handler, CancellationToken cancellationToken = default)
        where TEvent : IntegrationEvent;

    Task SubscribeAsync<TEvent>(Func<TEvent, Task> handler, CancellationToken cancellationToken = default)
        where TEvent : IntegrationEvent;

    Task UnsubscribeAsync(string channel, CancellationToken cancellationToken = default);
}
