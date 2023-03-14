// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;
using System.Threading.Tasks;

namespace Coop.Domain.Interfaces;

public interface IOrchestrationHandler
{
    public Task Publish(IEvent message);
    public Task<T> Handle<T>(IEvent startWith, Func<TaskCompletionSource<T>, Action<INotification>> onNextFactory);
}

