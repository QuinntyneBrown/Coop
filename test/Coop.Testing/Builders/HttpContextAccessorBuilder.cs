using Coop.Api.Core;
using Coop.Api.Models;
using Microsoft.AspNetCore.Http;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;

namespace Coop.Testing
{
    public class HttpContextAccessorBuilder
    {
        private Mock<IHttpContextAccessor> _mockHttpContextAccessor;

        public HttpContextAccessorBuilder()
        {
            _mockHttpContextAccessor = new Mock<IHttpContextAccessor>();

            _mockHttpContextAccessor
                .Setup(x => x.HttpContext)
                .Returns(new HttpContextBuilder()
                .WithUser(null)
                .Build());

        }

        public HttpContextAccessorBuilder WithUser(User user)
        {
            _mockHttpContextAccessor
                .Setup(x => x.HttpContext)
                .Returns(new HttpContextBuilder()
                .WithUser(user)
                .Build());

            return this;
        }

        public IHttpContextAccessor Build()
        {
            return _mockHttpContextAccessor.Object;
        }
    }

    public class HttpContextBuilder
    {
        private Mock<HttpContext> _mockHttpContext;

        public HttpContextBuilder()
        {
            _mockHttpContext = new();
        }

        public HttpContextBuilder WithUser(User user)
        {
            _mockHttpContext
                .Setup(x => x.User)
                .Returns(new ClaimsPrincipalBuilder()
                .WithUser(user)
                .Build());

            return this;
        }

        public HttpContext Build()
        {
            return _mockHttpContext.Object;
        }
    }

    public class ClaimsPrincipalBuilder
    {
        private Mock<ClaimsPrincipal> _mockClaimsPrincipal;

        public ClaimsPrincipalBuilder()
        {
            _mockClaimsPrincipal = new Mock<ClaimsPrincipal>();
        }

        public ClaimsPrincipalBuilder WithUser(User user)
        {
            var claims = new List<Claim>
            {
                new (Constants.ClaimTypes.UserId, $"{user?.UserId}"),
                new (Constants.ClaimTypes.Username, $"{user?.Username}")
            };

            if (user != null)
            {
                foreach (var role in user.Roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role.Name));

                    foreach (var privilege in role.Privileges)
                    {
                        claims.Add(new Claim(Constants.ClaimTypes.Privilege, $"{privilege.AccessRight}{privilege.Aggregate}"));
                    }
                }
            }

            _mockClaimsPrincipal.Setup(x => x.Identity)
                .Returns(new IdentityBuilder()
                .WithUser(user)
                .Build());

            _mockClaimsPrincipal.Setup(x => x.Claims)
                .Returns(claims);

            _mockClaimsPrincipal.Setup(x => x.FindFirst(It.IsAny<string>()))
                .Returns((string type) => claims.First(x => x.Type == type));

            return this;
        }

        public ClaimsPrincipal Build()
        {
            return this._mockClaimsPrincipal.Object;
        }
    }

    public class IdentityBuilder
    {
        private Mock<IIdentity> _mockIdentity;

        public IdentityBuilder()
        {
            _mockIdentity = new();
        }

        public IdentityBuilder WithUser(User user)
        {
            _mockIdentity.Setup(x => x.Name)
                .Returns(user?.Username);

            _mockIdentity.Setup(x => x.IsAuthenticated)
                .Returns(user != null);

            return this;
        }

        public IIdentity Build()
        {
            return _mockIdentity.Object;
        }
    }
}