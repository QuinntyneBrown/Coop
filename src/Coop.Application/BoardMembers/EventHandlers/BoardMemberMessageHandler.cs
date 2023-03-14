// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.Interfaces;

namespace Coop.Application.BoardMembers;

public class BoardMemberMessageHandler
{
    private readonly ICoopDbContext _context;
    private readonly IOrchestrationHandler _messageHandlerContext;
    public BoardMemberMessageHandler(ICoopDbContext context, IOrchestrationHandler messageHandlerContext)
    {
        _context = context;
        _messageHandlerContext = messageHandlerContext;
    }
}

