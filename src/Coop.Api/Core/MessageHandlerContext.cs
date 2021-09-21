using MediatR;
using System;
using System.Reactive.Subjects;
using System.Threading.Tasks;

namespace Coop.Api.Core
{
    public interface IMessageHandlerContext
    {
        public void Subscribe(Action<INotification> onNext);
        public Task Publish(INotification message);
    }

    public class MessageHandlerContext: IMessageHandlerContext
    {
        private IMediator _mediator;

        public MessageHandlerContext(IMediator mediator)
        {
            _mediator = mediator;
        }

        private Subject<INotification> _messages = new Subject<INotification>();

        public async Task Publish(INotification message)
        {
            _messages.OnNext(message);

            await _mediator.Publish(message);
        }

        public void Subscribe(Action<INotification> onNext)
        {
            _messages.Subscribe(onNext);
        }
    }
}
