﻿using MediatR;
using System;
using System.Threading.Tasks;

namespace Coop.Domain.Interfaces
{
    public interface IOrchestrationHandler
    {
        public Task Publish(IEvent message);
        public Task<T> Handle<T>(IEvent startWith, Func<TaskCompletionSource<T>, Action<INotification>> onNextFactory);
    }
}