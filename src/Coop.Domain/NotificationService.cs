// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.Interfaces;
using System;
using System.Reactive.Subjects;
using System.Threading;

namespace Coop.Domain;

public class NotificationService : INotificationService
{
    private readonly Subject<dynamic> _events = new Subject<dynamic>();
    public void Subscribe(Action<dynamic> onNext, CancellationToken cancellationToken = default)
    {
        _events.Subscribe(onNext, cancellationToken);
    }
    public void OnNext(dynamic value)
    {
        _events.OnNext(value);
    }
}

