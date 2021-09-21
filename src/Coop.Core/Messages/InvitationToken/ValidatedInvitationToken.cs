using MediatR;

namespace Coop.Core.Messages.InvitationToken
{
    public class ValidatedInvitationToken: INotification
    {
        public bool IsValid { get; set; }
    }
}
