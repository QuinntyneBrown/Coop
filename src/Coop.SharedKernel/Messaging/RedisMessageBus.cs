// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.SharedKernel.Events;
using Coop.SharedKernel.Serialization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StackExchange.Redis;

namespace Coop.SharedKernel.Messaging;

public class RedisMessageBus : IMessageBus, IDisposable
{
    private readonly IConnectionMultiplexer _connection;
    private readonly ISubscriber _subscriber;
    private readonly IMessageSerializer _serializer;
    private readonly ILogger<RedisMessageBus> _logger;
    private readonly RedisOptions _options;
    private readonly Dictionary<string, ChannelMessageQueue> _subscriptions = new();
    private bool _disposed;

    public RedisMessageBus(
        IConnectionMultiplexer connection,
        IMessageSerializer serializer,
        IOptions<RedisOptions> options,
        ILogger<RedisMessageBus> logger)
    {
        _connection = connection;
        _subscriber = connection.GetSubscriber();
        _serializer = serializer;
        _options = options.Value;
        _logger = logger;
    }

    public async Task PublishAsync<TEvent>(TEvent @event, CancellationToken cancellationToken = default)
        where TEvent : IntegrationEvent
    {
        var channel = GetChannelName<TEvent>();
        await PublishAsync(channel, @event, cancellationToken);
    }

    public async Task PublishAsync<TEvent>(string channel, TEvent @event, CancellationToken cancellationToken = default)
        where TEvent : IntegrationEvent
    {
        try
        {
            var envelope = new MessageEnvelope
            {
                EventType = typeof(TEvent).AssemblyQualifiedName!,
                Payload = _serializer.Serialize(@event),
                Timestamp = DateTime.UtcNow,
                CorrelationId = @event.CorrelationId
            };

            var data = _serializer.Serialize(envelope);
            var fullChannel = $"{_options.ChannelPrefix}:{channel}";

            await _subscriber.PublishAsync(RedisChannel.Literal(fullChannel), data);

            _logger.LogDebug("Published event {EventType} to channel {Channel}",
                typeof(TEvent).Name, fullChannel);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to publish event {EventType} to channel {Channel}",
                typeof(TEvent).Name, channel);
            throw;
        }
    }

    public async Task SubscribeAsync<TEvent>(Func<TEvent, Task> handler, CancellationToken cancellationToken = default)
        where TEvent : IntegrationEvent
    {
        var channel = GetChannelName<TEvent>();
        await SubscribeAsync(channel, handler, cancellationToken);
    }

    public async Task SubscribeAsync<TEvent>(string channel, Func<TEvent, Task> handler, CancellationToken cancellationToken = default)
        where TEvent : IntegrationEvent
    {
        var fullChannel = $"{_options.ChannelPrefix}:{channel}";

        await _subscriber.SubscribeAsync(RedisChannel.Literal(fullChannel), async (_, message) =>
        {
            try
            {
                var envelope = _serializer.Deserialize<MessageEnvelope>((byte[])message!);
                var @event = _serializer.Deserialize<TEvent>(envelope.Payload);

                await handler(@event);

                _logger.LogDebug("Handled event {EventType} from channel {Channel}",
                    typeof(TEvent).Name, fullChannel);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error handling event from channel {Channel}", fullChannel);
            }
        });

        _logger.LogInformation("Subscribed to channel {Channel} for event type {EventType}",
            fullChannel, typeof(TEvent).Name);
    }

    public async Task UnsubscribeAsync(string channel, CancellationToken cancellationToken = default)
    {
        var fullChannel = $"{_options.ChannelPrefix}:{channel}";
        await _subscriber.UnsubscribeAsync(RedisChannel.Literal(fullChannel));

        _logger.LogInformation("Unsubscribed from channel {Channel}", fullChannel);
    }

    private static string GetChannelName<TEvent>() where TEvent : IntegrationEvent
    {
        return typeof(TEvent).Name.ToLowerInvariant();
    }

    public void Dispose()
    {
        if (_disposed) return;

        foreach (var subscription in _subscriptions.Values)
        {
            subscription.Unsubscribe();
        }
        _subscriptions.Clear();

        _disposed = true;
    }
}
