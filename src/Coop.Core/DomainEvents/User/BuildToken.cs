namespace Coop.Core.DomainEvents
{
    public class BuildToken : EventBase
    {
        public BuildToken(string username)
        {
            Username = username;
        }
        public string Username { get; private set; }
    }
}
