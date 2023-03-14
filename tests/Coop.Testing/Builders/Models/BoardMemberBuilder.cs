// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.Entities;

namespace Coop.Testing.Builders;

public class BoardMemberBuilder
{
    private BoardMember _boardMember;
    public static BoardMember WithDefaults()
    {
        return new BoardMember("", "", "");
    }
    public BoardMemberBuilder()
    {
        _boardMember = WithDefaults();
    }
    public BoardMember Build()
    {
        return _boardMember;
    }
}

