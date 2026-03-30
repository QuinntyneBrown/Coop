using Coop.Domain.Common;

namespace Coop.Application.Common.Interfaces;

public interface INotificationService
{
    void Publish(IEvent @event);
}
