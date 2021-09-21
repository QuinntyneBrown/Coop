using MediatR;

namespace Coop.Core.Messages
{
    public class ValidateInvitationToken: INotification
    {
        public ValidateInvitationToken(string invitationToken)
        {
            InvitationToken = invitationToken;
        }
        public string InvitationToken { get; private set; }
    }
}
