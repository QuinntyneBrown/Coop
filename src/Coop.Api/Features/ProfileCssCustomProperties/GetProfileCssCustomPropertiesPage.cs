using Coop.Api.Core;
using Coop.Api.Extensions;
using Coop.Api.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class GetProfileCssCustomPropertiesPage
    {
        public class Request: IRequest<Response>
        {
            public int PageSize { get; set; }
            public int Index { get; set; }
        }

        public class Response: ResponseBase
        {
            public int Length { get; set; }
            public List<ProfileCssCustomPropertyDto> Entities { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var query = from profileCssCustomProperty in _context.ProfileCssCustomProperties
                    select profileCssCustomProperty;
                
                var length = await _context.ProfileCssCustomProperties.CountAsync();
                
                var profileCssCustomProperties = await query.Page(request.Index, request.PageSize)
                    .Select(x => x.ToDto()).ToListAsync();
                
                return new()
                {
                    Length = length,
                    Entities = profileCssCustomProperties
                };
            }
            
        }
    }
}
