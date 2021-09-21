using MediatR;

namespace Coop.Api.Models
{
    public class CreateUser: INotification
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
