using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Coop.Application.Common.Extensions;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Application.Common.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

 public class GetDigitalAssetsPage
 {
     public class Request : IRequest<Response>
     {
         public int PageSize { get; set; }
         public int Index { get; set; }
     }
     public class Response : ResponseBase
     {
         public int Length { get; set; }
         public List<DigitalAssetDto> Entities { get; set; }
     }
     public class Handler : IRequestHandler<Request, Response>
     {
         private readonly ICoopDbContext _context;
         public Handler(ICoopDbContext context)
             => _context = context;
         public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
         {
             var query = from digitalAsset in _context.DigitalAssets
                         select digitalAsset;
             var length = await _context.DigitalAssets.CountAsync();
             var digitalAssets = await query.Page(request.Index, request.PageSize)
                 .Select(x => x.ToDto()).ToListAsync();
             return new()
             {
                 Length = length,
                 Entities = digitalAssets
             };
         }
     }
 }
