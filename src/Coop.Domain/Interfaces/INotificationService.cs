// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using System.Threading;

namespace Coop.Domain.Interfaces;

public interface INotificationService
{
    void Subscribe(Action<dynamic> onNext, CancellationToken cancellationToken = default);
    void OnNext(dynamic value);
}

