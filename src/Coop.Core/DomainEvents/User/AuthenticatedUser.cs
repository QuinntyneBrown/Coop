namespace Coop.Core.DomainEvents
{
    public class AuthenticatedUser : DomainEventBase
    {
        public AuthenticatedUser(string username)
        {
            Username = username;
        }
        public string Username { get; private set; }
    }
}
