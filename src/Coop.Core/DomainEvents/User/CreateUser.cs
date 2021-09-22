using System.Collections.Generic;

namespace Coop.Core.DomainEvents
{
    public class CreateUser : DomainEventBase
    {
        public string Username { get; private set; }
        public string Password { get; private set; }
        public List<string> Roles { get; private set; } = new List<string>();


        public CreateUser(string username, string password, string role)
        {
            Username = username;
            Password = password;
            Roles.Add(role);
        }

        public CreateUser(string username, string password)
        {
            Username = username;
            Password = password;
        }

        public CreateUser(string username, string password, List<string> roles)
        {
            Username = username;
            Password = password;
            Roles = roles;
        }
    }
}
