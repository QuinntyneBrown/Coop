using Coop.Core.Interfaces;
using Coop.Core.Models;
using Coop.Core.DomainEvents;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features.JsonContents
{
    public class CreatedJsonContentHandler : INotificationHandler<CreatedJsonContent>
    {
        private readonly ICoopDbContext _context;

        public CreatedJsonContentHandler(ICoopDbContext context)
        {
            _context = context;
        }

        public async Task Handle(CreatedJsonContent notification, CancellationToken cancellationToken)
        {
            if (await _context.JsonContents.Where(x => x.Name == notification.Name).CountAsync() > 1)
            {
                throw new Exception("Duplicate");
            }
        }
    }
}
