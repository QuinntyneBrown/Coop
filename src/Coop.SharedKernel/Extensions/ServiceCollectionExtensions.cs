// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.SharedKernel.Messaging;
using Coop.SharedKernel.Serialization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace Coop.SharedKernel.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddSharedKernel(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddRedisMessaging(configuration);
        services.AddMessagePackSerialization();

        return services;
    }

    public static IServiceCollection AddRedisMessaging(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<RedisOptions>(configuration.GetSection(RedisOptions.SectionName));

        var redisOptions = configuration.GetSection(RedisOptions.SectionName).Get<RedisOptions>()
            ?? new RedisOptions();

        services.AddSingleton<IConnectionMultiplexer>(sp =>
        {
            var configurationOptions = ConfigurationOptions.Parse(redisOptions.ConnectionString);
            configurationOptions.AbortOnConnectFail = false;
            configurationOptions.ConnectRetry = redisOptions.RetryCount;

            return ConnectionMultiplexer.Connect(configurationOptions);
        });

        services.AddSingleton<IMessageBus, RedisMessageBus>();

        return services;
    }

    public static IServiceCollection AddMessagePackSerialization(this IServiceCollection services)
    {
        services.AddSingleton<IMessageSerializer, MessagePackMessageSerializer>();
        return services;
    }
}
