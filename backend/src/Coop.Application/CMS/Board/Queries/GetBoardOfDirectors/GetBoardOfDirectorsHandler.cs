using Coop.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Board.Queries.GetBoardOfDirectors;

public class GetBoardOfDirectorsHandler : IRequestHandler<GetBoardOfDirectorsRequest, GetBoardOfDirectorsResponse>
{
    private readonly ICoopDbContext _context;
    public GetBoardOfDirectorsHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetBoardOfDirectorsResponse> Handle(GetBoardOfDirectorsRequest request, CancellationToken cancellationToken)
    {
        var content = await _context.JsonContents
            .FirstOrDefaultAsync(x => x.Name == BoardOfDirectorsContent.Name && !x.IsDeleted, cancellationToken);

        return new GetBoardOfDirectorsResponse { Directors = BoardOfDirectorsContent.Read(content?.Json) };
    }
}
