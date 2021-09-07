using Coop.Testing;
using Xunit;
using System;

namespace Coop.IntegrationTests
{
    public class UserControllerTests : IClassFixture<ApiTestFixture>
    {
    }

    internal static class Endpoints
    {
        public static class Post
        {
            public static string Create = "api/user";
        }

        public static class Put
        {
            public static string Update = "api/user";
        }

        public static class Delete
        {
            public static string By(Guid id)
            {
                return $"api/user/{id}";
            }
        }

        public static class Get
        {
            public static string Users = "api/user";
            public static string By(Guid id)
            {
                return $"api/user/{id}";
            }
        }
    }
}
