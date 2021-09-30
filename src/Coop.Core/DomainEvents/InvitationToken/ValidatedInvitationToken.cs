namespace Coop.Core.DomainEvents.InvitationToken
{
    public class ValidatedInvitationToken : BaseDomainEvent
    {
        public bool IsValid { get; set; }
        public string InvitationTokenType { get; set; }
    }
}
