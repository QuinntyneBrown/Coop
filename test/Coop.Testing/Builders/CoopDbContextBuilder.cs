using Coop.Api.Data;
using Microsoft.EntityFrameworkCore;
using System;

namespace Coop.Testing
{
    public class CoopDbContextBuilder
    {
        private CoopDbContext _context;

        public static CoopDbContext WithDefaults()
        {
            var configuration = ConfigurationFactory.Create();

            return new CoopDbContext(new DbContextOptionsBuilder()
                .UseSqlServer(configuration["Data:DefaultConnection:ConnectionString"])
                .Options);
        }

        public CoopDbContextBuilder()
        {
            _context = WithDefaults();
        }

        public CoopDbContextBuilder UseInMemoryDatabase()
        {
            _context = new CoopDbContext(new DbContextOptionsBuilder()
                .UseInMemoryDatabase($"{Guid.NewGuid()}")
                .Options);

            return this;
        }

        public CoopDbContextBuilder Add(object entity)
        {
            _context.Add(entity);

            return this;
        }

        public CoopDbContextBuilder SaveChanges()
        {
            _context.SaveChanges();

            return this;
        }

        public CoopDbContext Build()
        {
            return _context;
        }
    }
}