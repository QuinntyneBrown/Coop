using Coop.Domain.Onboarding;

namespace Coop.Application.Onboarding.Dtos;

public class InvitationTokenDto
{
    public Guid InvitationTokenId { get; set; }
    public string Value { get; set; } = string.Empty;
    public InvitationTokenType Type { get; set; }
    public DateTime? ExpirationDate { get; set; }
    public bool Redeemed { get; set; }

    public static InvitationTokenDto FromInvitationToken(InvitationToken token)
    {
        return new InvitationTokenDto
        {
            InvitationTokenId = token.InvitationTokenId,
            Value = token.Value,
            Type = token.Type,
            ExpirationDate = token.ExpirationDate,
            Redeemed = token.Redeemed
        };
    }
}
