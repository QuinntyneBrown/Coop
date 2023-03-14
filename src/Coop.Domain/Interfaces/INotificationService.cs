using System;
using System.Threading;

namespace Coop.Domain.Interfaces;

public interface INotificationService
{
    void Subscribe(Action<dynamic> onNext, CancellationToken cancellationToken = default);
    void OnNext(dynamic value);
}
