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
