using Coop.Application.CMS.Dtos;
using Coop.Application.Common.Interfaces;
using Coop.Domain.CMS;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Board.Commands.SaveBoardOfDirectors;

public class SaveBoardOfDirectorsHandler : IRequestHandler<SaveBoardOfDirectorsRequest, SaveBoardOfDirectorsResponse>
{
    private readonly ICoopDbContext _context;
    public SaveBoardOfDirectorsHandler(ICoopDbContext context) { _context = context; }

    public async Task<SaveBoardOfDirectorsResponse> Handle(SaveBoardOfDirectorsRequest request, CancellationToken cancellationToken)
    {
        var directors = request.Directors
            .Select(d => new DirectorDto
            {
                Name = d.Name.Trim(),
                Title = d.Title.Trim(),
                PhotoUrl = string.IsNullOrWhiteSpace(d.PhotoUrl) ? null : d.PhotoUrl.Trim(),
            })
            .ToList();

        var content = await _context.JsonContents
            .FirstOrDefaultAsync(x => x.Name == BoardOfDirectorsContent.Name && !x.IsDeleted, cancellationToken);
        if (content is null)
        {
            content = new JsonContent { Name = BoardOfDirectorsContent.Name };
            _context.JsonContents.Add(content);
        }

        content.Json = BoardOfDirectorsContent.Write(directors);
        await _context.SaveChangesAsync(cancellationToken);

        return new SaveBoardOfDirectorsResponse { Directors = directors };
    }
}
