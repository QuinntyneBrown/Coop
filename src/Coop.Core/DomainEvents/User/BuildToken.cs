namespace Coop.Core.DomainEvents
{
    public class BuildToken : DomainEventBase
    {
        public BuildToken(string username)
        {
            Username = username;
        }
        public string Username { get; private set; }
    }
}
