// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Profile.Domain.Enums;

namespace Profile.Domain.Entities;

public class BoardMember : ProfileBase
{
    public string BoardTitle { get; private set; } = string.Empty;

    private BoardMember() { }

    public BoardMember(Guid userId, string boardTitle, string firstName, string lastName)
        : base(ProfileType.BoardMember, userId, firstName, lastName)
    {
        BoardTitle = boardTitle;
    }

    public void SetBoardTitle(string boardTitle)
    {
        BoardTitle = boardTitle;
        UpdatedAt = DateTime.UtcNow;
    }
}
