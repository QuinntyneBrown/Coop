using Coop.Api.Data;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;

namespace Coop.Testing
{
    public static class CoopDbContextFactory
    {
        public static ICoopDbContext Create() =>
            new CoopDbContext(new DbContextOptionsBuilder()
                .UseInMemoryDatabase($"{Guid.NewGuid()}")
                .Options);
    }
}
