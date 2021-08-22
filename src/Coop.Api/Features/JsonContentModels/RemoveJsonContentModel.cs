using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;

namespace Coop.Api.Features
{
    public class RemoveJsonContentModel
    {
        public class Request: IRequest<Response>
        {
            public Guid JsonContentModelId { get; set; }
        }

        public class Response: ResponseBase
        {
            public JsonContentModelDto JsonContentModel { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var jsonContentModel = await _context.JsonContentModels.SingleAsync(x => x.JsonContentModelId == request.JsonContentModelId);
                
                _context.JsonContentModels.Remove(jsonContentModel);
                
                await _context.SaveChangesAsync(cancellationToken);
                
                return new Response()
                {
                    JsonContentModel = jsonContentModel.ToDto()
                };
            }
            
        }
    }
}
