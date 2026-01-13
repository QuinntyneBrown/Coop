// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Profile.Domain.Entities;
using Profile.Domain.Enums;

namespace Profile.Infrastructure.Data.Seeding;

public static class ProfileSeedData
{
    public static readonly Guid MemberUserId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    public static readonly Guid BoardMemberUserId = Guid.Parse("22222222-2222-2222-2222-222222222222");
    public static readonly Guid StaffMemberUserId = Guid.Parse("33333333-3333-3333-3333-333333333333");
    public static readonly Guid SupportUserId = Guid.Parse("44444444-4444-4444-4444-444444444444");

    public static void Seed(ProfileDbContext context)
    {
        SeedInvitationTokens(context);
        SeedProfiles(context);
    }

    private static void SeedInvitationTokens(ProfileDbContext context)
    {
        var tokens = new[]
        {
            new InvitationToken("MEMBER-TOKEN-123", InvitationTokenType.Member),
            new InvitationToken("STAFF-TOKEN-456", InvitationTokenType.Staff),
            new InvitationToken("BOARD-TOKEN-789", InvitationTokenType.BoardMember)
        };

        foreach (var token in tokens)
        {
            if (!context.InvitationTokens.Any(t => t.Type == token.Type))
            {
                context.InvitationTokens.Add(token);
            }
        }
        context.SaveChanges();
    }

    private static void SeedProfiles(ProfileDbContext context)
    {
        // Support Profile
        if (!context.Profiles.Any(p => p.UserId == SupportUserId))
        {
            var support = new ProfileBase(ProfileType.Support, SupportUserId, "Support", "User");
            context.Profiles.Add(support);
        }

        // Member Profile
        if (!context.Members.Any(m => m.UserId == MemberUserId))
        {
            var member = new Member(MemberUserId, "Earl", "Plett");
            member.SetAddress(new Address
            {
                Street = "123 Main St",
                Unit = "101",
                City = "Winnipeg",
                Province = "MB",
                PostalCode = "R3C 1A1"
            });
            context.Members.Add(member);
        }

        // Board Member Profile
        if (!context.BoardMembers.Any(b => b.UserId == BoardMemberUserId))
        {
            var boardMember = new BoardMember(BoardMemberUserId, "President", "Natasha", "Falk");
            context.BoardMembers.Add(boardMember);
        }

        // Staff Member Profile
        if (!context.StaffMembers.Any(s => s.UserId == StaffMemberUserId))
        {
            var staffMember = new StaffMember(StaffMemberUserId, "Building Manager", "Marie", "Enns");
            context.StaffMembers.Add(staffMember);
        }

        context.SaveChanges();
    }
}
