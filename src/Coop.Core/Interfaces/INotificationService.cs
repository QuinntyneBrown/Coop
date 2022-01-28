using System;

namespace Coop.Core.Interfaces
{
    public interface INotificationService
    {
        void Subscribe(Action<dynamic> onNext);

        void OnNext(dynamic value);
    }
}
