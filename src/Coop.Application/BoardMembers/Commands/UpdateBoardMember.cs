// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Coop.Domain.Entities;

namespace Coop.Application.BoardMembers;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.BoardMember).NotNull();
        RuleFor(request => request.BoardMember).SetValidator(new BoardMemberValidator());
    }
}
public class UpdateBoardMemberRequest : IRequest<UpdateBoardMemberResponse>
{
    public BoardMemberDto BoardMember { get; set; }
}
public class UpdateBoardMemberResponse : ResponseBase
{
    public BoardMemberDto BoardMember { get; set; }
}
public class UpdateBoardMemberHandler : IRequestHandler<UpdateBoardMemberRequest, UpdateBoardMemberResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateBoardMemberHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateBoardMemberResponse> Handle(UpdateBoardMemberRequest request, CancellationToken cancellationToken)
    {
        var boardMember = await _context.BoardMembers.SingleAsync(x => x.ProfileId == request.BoardMember.ProfileId);
        boardMember.Update(request.BoardMember.BoardTitle, request.BoardMember.Firstname, request.BoardMember.Lastname, request.BoardMember.AvatarDigitalAssetId);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            BoardMember = boardMember.ToDto()
        };
    }
}

