using Coop.Domain.Dtos;
using Coop.Domain.Enums;
using Coop.Domain.Entities;
using System;

namespace Coop.Application.Features;

 public class ProfileDto
 {
     public Guid? ProfileId { get; set; }
     public Guid? UserId { get; set; }
     public string Firstname { get; set; }
     public string Lastname { get; set; }
     public string PhoneNumber { get; set; }
     public Guid? AvatarDigitalAssetId { get; set; }
     public virtual ProfileType Type { get; set; }
     public AddressDto Address { get; set; }
 }
