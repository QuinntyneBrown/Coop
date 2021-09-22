namespace Coop.Core.DomainEvents
{
    public class ValidateInvitationToken : DomainEventBase
    {
        public ValidateInvitationToken(string invitationToken)
        {
            InvitationToken = invitationToken;
        }
        public string InvitationToken { get; private set; }
    }
}
