using MediatR;
using System;

namespace Coop.Core
{
    public interface IEvent: INotification
    {
        DateTime Created { get; }
    }
}