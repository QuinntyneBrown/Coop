using MediatR;
using System;
using System.Threading.Tasks;

namespace Coop.Core.Interfaces
{
    public interface IOrchestrationHandler
    {
        public Task Publish(INotification message);
        public Task<T> Handle<T>(INotification startWith, Func<TaskCompletionSource<T>, Action<INotification>> onNextFactory);
    }
}
