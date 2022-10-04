namespace Coop.Domain.DomainEvents
{
    public class ValidateInvitationToken : BaseDomainEvent
    {
        public ValidateInvitationToken(string invitationToken)
        {
            InvitationToken = invitationToken;
        }
        public string InvitationToken { get; private set; }
    }
}
