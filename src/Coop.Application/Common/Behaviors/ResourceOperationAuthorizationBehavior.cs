using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Domain;

public class ResourceOperationAuthorizationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    where TResponse : ResponseBase, new()
{
    private readonly IAuthorizationService _authorizationService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public ResourceOperationAuthorizationBehavior(IAuthorizationService authorizationService, IHttpContextAccessor httpContextAccessor)
    {
        _authorizationService = authorizationService;
        _httpContextAccessor = httpContextAccessor;
    }
    public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
    {
        if (Attribute.GetCustomAttribute(request.GetType(), typeof(AuthorizeResourceOperationAttribute)) is AuthorizeResourceOperationAttribute attribute)
        {
            var result = await _authorizationService.AuthorizeAsync(_httpContextAccessor.HttpContext.User, attribute.Resource, attribute.Requirement);
            if (!result.Succeeded)
            {
                var response = new TResponse();
                response.Errors.Add($"Unauthorized: {attribute.Requirement}: {attribute.Resource}");
                return response;
            }
        }
        return await next();
    }
}
