namespace Coop.Core.DomainEvents.InvitationToken
{
    public class ValidatedInvitationToken : DomainEventBase
    {
        public bool IsValid { get; set; }
        public string InvitationTokenType { get; set; }
    }
}
