
namespace Coop.Domain.DomainEvents;

 public class BuildToken : BaseDomainEvent
 {
     public BuildToken(string username)
     {
         Username = username;
     }
     public string Username { get; private set; }
 }
