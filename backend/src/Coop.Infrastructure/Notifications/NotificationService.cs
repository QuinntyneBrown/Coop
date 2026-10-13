using Coop.Application.Common.Interfaces;
using Coop.Domain.Common;
using MediatR;

namespace Coop.Infrastructure.Notifications;

public class NotificationService : INotificationService
{
    private readonly IPublisher _publisher;

    public NotificationService(IPublisher publisher)
    {
        _publisher = publisher;
    }

    public void Publish(IEvent @event)
    {
        _publisher.Publish(@event);
    }
}
