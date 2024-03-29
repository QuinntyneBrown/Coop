// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.DomainEvents;
using Coop.Domain.DomainEvents.InvitationToken;
using FluentValidation;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class CreateProfileValidator : AbstractValidator<CreateProfileRequest>
{
    public CreateProfileValidator()
    {
        RuleFor(x => x.Firstname).NotEmpty();
        RuleFor(x => x.Lastname).NotEmpty();
        RuleFor(x => x.Email).NotEmpty();
        RuleFor(x => x.Password).NotEmpty();
    }
}
public class CreateProfileRequest : IRequest<CreateProfileResponse>
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string PasswordConfirmation { get; set; }
    public string InvitationToken { get; set; }
    public string Firstname { get; set; }
    public string Lastname { get; set; }
    public Guid? AvatarDigitalAssetId { get; set; }
    public void Deconstruct(out string email, out string password, out string passwordConfirmation, out string invitationToken, out string firstname, out string lastname, out Guid? avatarDigitalAssetId)
    {
        email = Email;
        password = Password;
        passwordConfirmation = PasswordConfirmation;
        invitationToken = InvitationToken;
        firstname = Firstname;
        lastname = Lastname;
        avatarDigitalAssetId = AvatarDigitalAssetId;
    }
}
public class CreateProfileResponse : ResponseBase
{
    public CreateProfileResponse(Profile profile)
    {
        Profile = new()
        {
            ProfileId = profile.ProfileId,
            UserId = profile.UserId,
            Firstname = profile.Firstname,
            Lastname = profile.Lastname,
            AvatarDigitalAssetId = profile.AvatarDigitalAssetId,
            Type = profile.Type
        };
    }
    public ProfileDto Profile { get; private set; }
}
public class CreateProfileHandler : IRequestHandler<CreateProfileRequest, CreateProfileResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IOrchestrationHandler _orchestrationHandler;
    public CreateProfileHandler(ICoopDbContext context, IOrchestrationHandler orchestrationHandler)
    {
        _context = context;
        _orchestrationHandler = orchestrationHandler;
    }
    public async Task<CreateProfileResponse> Handle(CreateProfileRequest request, CancellationToken cancellationToken)
    {
        var (email, password, passwordConfirmation, invitationToken, firstname, lastname, avatarDigitalAssetId) = request;
        Guid userId = default;
        string invitationTokenType = default;
        var startWith = new ValidateInvitationToken(request.InvitationToken);
        return await _orchestrationHandler.Handle<CreateProfileResponse>(startWith, (ctx) => async message =>
        {
            switch (message)
            {
                case ValidatedInvitationToken validatedToken:
                    if (!validatedToken.IsValid)
                        throw new Exception();
                    invitationTokenType = validatedToken.InvitationTokenType;
                    var role = _resolveRoleByInvitationTokenType(invitationTokenType);
                    await _orchestrationHandler.PublishCreateUserEvent(email, password, role, validatedToken);
                    break;
                case CreatedUser createdUser:
                    userId = createdUser.UserId;
                    var profileType = _resolveProfileTypeByInvitationTokenType(invitationTokenType);
                    await _orchestrationHandler.PublishCreateProfileEvent(profileType, firstname, lastname, avatarDigitalAssetId);
                    break;
                case CreatedProfile createdProfile:
                    await _orchestrationHandler.PublishAddProfileEvent(userId, createdProfile.ProfileId);
                    break;
                case AddedProfile addedProfile:
                    var profile = await _context.Profiles.FindAsync(addedProfile.ProfileId);
                    ctx.SetResult(new CreateProfileResponse(profile));
                    break;
            }
        });
    }
    private string _resolveRoleByInvitationTokenType(string invitationTokenType) => invitationTokenType switch
    {
        Constants.InvitationTypes.Member => Constants.Roles.Member,
        Constants.InvitationTypes.Staff => Constants.Roles.Staff,
        Constants.InvitationTypes.BoardMember => Constants.Roles.BoardMember,
        _ => throw new NotImplementedException()
    };
    private string _resolveProfileTypeByInvitationTokenType(string invitationTokenType) => invitationTokenType switch
    {
        Constants.InvitationTypes.Member => Constants.ProfileTypes.Member,
        Constants.InvitationTypes.Staff => Constants.ProfileTypes.Staff,
        Constants.InvitationTypes.BoardMember => Constants.ProfileTypes.BoardMember,
        _ => throw new NotImplementedException()
    };
}

