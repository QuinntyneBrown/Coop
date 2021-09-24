using Coop.Api.Interfaces;
using Coop.Api.Models;
using MediatR;
using System;
using System.Reactive.Subjects;
using System.Threading.Tasks;
using static Newtonsoft.Json.JsonConvert;

namespace Coop.Api.Core
{

    public class OrchestrationHandler : IOrchestrationHandler
    {
        private readonly IMediator _mediator;
        private readonly ICoopDbContext _context;

        public OrchestrationHandler(IMediator mediator, ICoopDbContext context)
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

        public async Task<T> Handle<T>(INotification startWith, Func<TaskCompletionSource<T>, Action<INotification>> onNextFactory)
        {
            var tcs = new TaskCompletionSource<T>(TaskCreationOptions.RunContinuationsAsynchronously);

            _messages.Subscribe(onNextFactory(tcs));

            await Publish(startWith);

            return await tcs.Task;
        }
    }
}
