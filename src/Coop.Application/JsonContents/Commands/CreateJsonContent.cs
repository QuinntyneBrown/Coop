// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Domain.Entities;
using Coop.Domain.DomainEvents;
using FluentValidation;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.JsonContents;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.JsonContent).NotNull();
        RuleFor(request => request.JsonContent).SetValidator(new JsonContentValidator());
    }
}
public class CreateJsonContentRequest : IRequest<CreateJsonContentResponse>
{
    public JsonContentDto JsonContent { get; set; }
}
public class CreateJsonContentResponse : ResponseBase
{
    public JsonContentDto JsonContent { get; set; }
}
public class CreateJsonContentHandler : IRequestHandler<CreateJsonContentRequest, CreateJsonContentResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IOrchestrationHandler _messageHandlerContext;
    public CreateJsonContentHandler(ICoopDbContext context, IOrchestrationHandler messageHandlerContext)
    {
        _context = context;
        _messageHandlerContext = messageHandlerContext;
    }
    public async Task<CreateJsonContentResponse> Handle(CreateJsonContentRequest request, CancellationToken cancellationToken)
    {
        var jsonContent = new JsonContent(request.JsonContent.Name, request.JsonContent.Json);
        _context.JsonContents.Add(jsonContent);
        await _context.SaveChangesAsync(cancellationToken);
        var repsonse = new CreateJsonContentResponse
        {
            JsonContent = jsonContent.ToDto()
        };
        try
        {
            await _messageHandlerContext.Publish(new CreatedJsonContent
            {
                JsonContentId = jsonContent.JsonContentId,
                Name = jsonContent.Name
            });
        }
        catch
        {
            _context.JsonContents.Remove(jsonContent);
            await _context.SaveChangesAsync(default);
            repsonse = new CreateJsonContentResponse
            {
                Errors = new List<string>
                  {
                      "Duplicate Name"
                  }
            };
        }
        return repsonse;
    }
}

