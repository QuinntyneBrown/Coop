// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.Entities;

namespace Coop.Testing.Builders.Models;

public class OnCallBuilder
{
    private OnCall _onCall;
    public static OnCall WithDefaults()
    {
        return new OnCall(default, default, default);
    }
    public OnCallBuilder()
    {
        _onCall = WithDefaults();
    }
    public OnCall Build()
    {
        return _onCall;
    }
}

