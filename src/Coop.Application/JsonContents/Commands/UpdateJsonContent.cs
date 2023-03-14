// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.JsonContents;

public class UpdateJsonContentValidator : AbstractValidator<UpdateJsonContentRequest>
{
    public UpdateJsonContentValidator()
    {
        RuleFor(request => request.JsonContent).NotNull();
        RuleFor(request => request.JsonContent).SetValidator(new JsonContentValidator());
    }
}
public class UpdateJsonContentRequest : IRequest<UpdateJsonContentResponse>
{
    public JsonContentDto JsonContent { get; set; }
}
public class UpdateJsonContentResponse : ResponseBase
{
    public JsonContentDto JsonContent { get; set; }
}
public class UpdateJsonContentHandler : IRequestHandler<UpdateJsonContentRequest, UpdateJsonContentResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateJsonContentHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateJsonContentResponse> Handle(UpdateJsonContentRequest request, CancellationToken cancellationToken)
    {
        var jsonContent = await _context.JsonContents.SingleAsync(x => x.JsonContentId == request.JsonContent.JsonContentId);
        jsonContent.SetJson(request.JsonContent.Json);
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateJsonContentResponse()
        {
            JsonContent = jsonContent.ToDto()
        };
    }
}

