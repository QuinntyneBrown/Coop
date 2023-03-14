using Coop.Domain.Interfaces;
using Coop.Domain.DomainEvents;
using System;
using System.Threading.Tasks;

namespace Coop.Domain;

 public static class OrchestrationHandlerExtensions
 {
     public static Task PublishCreateUserEvent(this IOrchestrationHandler orchestrationHandler, string username, string password, string role, BaseDomainEvent @event)
         => orchestrationHandler.Publish(new CreateUser(@event, username, password, role));
     public static Task PublishAddProfileEvent(this IOrchestrationHandler orchestrationHandler, Guid userId, Guid profileId)
         => orchestrationHandler.Publish(new AddProfile(userId, profileId));
     public static Task PublishCreateProfileEvent(this IOrchestrationHandler orchestrationHandler, string profileType, string firstname, string lastname, Guid? avatarDigitalAssetId)
         => orchestrationHandler.Publish(new CreateProfile(profileType, firstname, lastname, avatarDigitalAssetId));
 }
