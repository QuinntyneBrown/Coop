using MediatR;
using System;

namespace Coop.Core.Messages
{
    public class CreateBoardMember: INotification
    {
        public Guid UserId { get; set; }
        public string BoardTitle { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public Guid? AvatarDigitalAssetId { get; set; }
    }
}
