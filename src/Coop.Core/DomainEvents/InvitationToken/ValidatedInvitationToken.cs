namespace Coop.Core.DomainEvents.InvitationToken
{
    public class ValidatedInvitationToken : EventBase
    {
        public bool IsValid { get; set; }
        public string InvitationTokenType { get; set; }
    }
}
