using Coop.Api.Interfaces;
using Coop.Api.Models;
using MediatR;
using System;
using System.Reactive.Subjects;
using System.Threading.Tasks;
using static Newtonsoft.Json.JsonConvert;

namespace Coop.Api.Core
{
    public interface IMessageHandlerContext
    {
        public void Subscribe(Action<INotification> onNext);
        public Task Publish(INotification message);
    }

    public class MessageHandlerContext : IMessageHandlerContext
    {
        private readonly IMediator _mediator;
        private readonly ICoopDbContext _context;

        public MessageHandlerContext(IMediator mediator, ICoopDbContext context)
        {
            _mediator = mediator;
            _context = context;
        }

        private Subject<INotification> _messages = new Subject<INotification>();

        public async Task Publish(INotification @event)
        {
            _context.StoredEvents.Add(new StoredEvent
            {
                Data = SerializeObject(@event),
                DotNetType = @event.GetType().AssemblyQualifiedName,
                Type = @event.GetType().Name,
                CreatedOn = DateTime.UtcNow
            });

            await _context.SaveChangesAsync(default);

            _messages.OnNext(@event);

            await _mediator.Publish(@event);
        }

        public void Subscribe(Action<INotification> onNext)
        {
            _messages.Subscribe(onNext);
        }
    }
}
