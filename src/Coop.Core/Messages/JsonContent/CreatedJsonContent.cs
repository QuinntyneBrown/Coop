using MediatR;
using System;

namespace Coop.Core.Messages
{
    public class CreatedJsonContent: INotification
    {
        public Guid JsonContentId { get; set; }
        public string Name { get; set; }
    }
}
