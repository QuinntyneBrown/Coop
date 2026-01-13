// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.SharedKernel.Events;
using Microsoft.Extensions.Logging;

namespace Coop.SharedKernel.Messaging;

public class IntegrationEventPublisher
{
    private readonly IMessageBus _messageBus;
    private readonly ILogger<IntegrationEventPublisher> _logger;

    public IntegrationEventPublisher(IMessageBus messageBus, ILogger<IntegrationEventPublisher> logger)
    {
        _messageBus = messageBus;
        _logger = logger;
    }

    public async Task PublishAsync<TEvent>(TEvent @event, CancellationToken cancellationToken = default)
        where TEvent : IntegrationEvent
    {
        try
        {
            await _messageBus.PublishAsync(@event, cancellationToken);
            _logger.LogInformation("Published integration event: {EventType} with Id: {EventId}",
                typeof(TEvent).Name, @event.EventId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing integration event: {EventType}", typeof(TEvent).Name);
            throw;
        }
    }
}
