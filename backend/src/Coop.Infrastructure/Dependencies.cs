using Coop.Application.Behaviors;
using Coop.Application.Common.Interfaces;
using Coop.Domain.Authorization;
using Coop.Domain.Identity;
using Coop.Infrastructure.Identity;
using Coop.Infrastructure.Notifications;
using Coop.Infrastructure.Persistence;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Coop.Infrastructure;

/// <summary>
/// The services the API and the command-line tool share: the database, the
/// MediatR pipeline with its behaviors, the validators and the identity and
/// notice services (ADR 0012).
/// </summary>
public static class Dependencies
{
    public static IServiceCollection AddCoopCore(this IServiceCollection services, IConfiguration configuration)
    {
        // DbContext
        services.AddDbContext<CoopDbContext>(options =>
            options.UseSqlite(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<ICoopDbContext>(provider => provider.GetRequiredService<CoopDbContext>());

        // MediatR
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(ICoopDbContext).Assembly);
            // Office areas are refused before anything else runs (ADR 0016).
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(OfficeOnlyBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ResourceOperationAuthorizationBehavior<,>));
        });

        // FluentValidation
        services.AddValidatorsFromAssembly(typeof(ICoopDbContext).Assembly);

        // Identity services
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<ITokenProvider, TokenProvider>();
        services.AddScoped<ITokenBuilder, TokenBuilder>();
        services.AddScoped<IPreviewTokenService, PreviewTokenService>();
        services.AddScoped<INotificationService, NotificationService>();
        // Notice emails go out through SMTP when it is configured; otherwise every message is only logged (ADR 0008).
        var noticeEmail = configuration.GetSection(NoticeEmailOptions.SectionName).Get<NoticeEmailOptions>() ?? new NoticeEmailOptions();
        services.AddSingleton(noticeEmail);
        if (noticeEmail.IsConfigured)
        {
            services.AddScoped<INoticeSender, SmtpNoticeSender>();
        }
        else
        {
            services.AddScoped<INoticeSender, LoggingNoticeSender>();
        }

        // Authorization handler
        services.AddScoped<IAuthorizationHandler, ResourceOperationAuthorizationHandler>();

        return services;
    }
}
