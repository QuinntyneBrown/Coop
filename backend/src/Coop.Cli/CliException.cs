namespace Coop.Cli;

/// <summary>Something the operator named was not found or cannot be done; printed as a plain message (L2-REQ-102 AC5).</summary>
public class CliException : Exception
{
    public CliException(string message) : base(message)
    {
    }
}
