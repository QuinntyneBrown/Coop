using System.Security.Claims;
using System.Text;
using Coop.Api.Tenancy;
using Coop.Application.Behaviors;
using Coop.Application.Common.Interfaces;
using Coop.Domain.Authorization;
using Coop.Domain.Identity;
using Coop.Infrastructure.Identity;
using Coop.Infrastructure.Notifications;
using Coop.Infrastructure.Persistence;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

namespace Coop.Api;

public static class Dependencies
{
    public static IServiceCollection AddCoopServices(this IServiceCollection services, IConfiguration configuration)
    {
        // DbContext
        services.AddDbContext<CoopDbContext>(options =>
            options.UseSqlite(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<ICoopDbContext>(provider => provider.GetRequiredService<CoopDbContext>());

        // The co-op each request is for, found from its sub-domain (ADR 0009)
        services.AddSingleton(configuration.GetSection(TenancyOptions.SectionName).Get<TenancyOptions>() ?? new TenancyOptions());
        services.AddScoped<TenantContext>();
        services.AddScoped<ITenantContext>(provider => provider.GetRequiredService<TenantContext>());

        // MediatR
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(ICoopDbContext).Assembly);
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ResourceOperationAuthorizationBehavior<,>));
        });

        // FluentValidation
        services.AddValidatorsFromAssembly(typeof(ICoopDbContext).Assembly);

        // Identity services
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<ITokenProvider, TokenProvider>();
        services.AddScoped<ITokenBuilder, TokenBuilder>();
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

        // ClaimsPrincipal from HttpContext
        services.AddHttpContextAccessor();
        services.AddScoped(sp =>
        {
            var httpContextAccessor = sp.GetRequiredService<IHttpContextAccessor>();
            return httpContextAccessor.HttpContext?.User ?? new ClaimsPrincipal();
        });

        // JWT Authentication
        var authSection = configuration.GetSection("Authentication");
        var key = Encoding.UTF8.GetBytes(authSection["JwtKey"]!);

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = authSection["JwtIssuer"],
                ValidateAudience = true,
                ValidAudience = authSection["JwtAudience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        });

        services.AddAuthorization();

        // CORS
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                builder
                    .WithOrigins("http://localhost:4200", "http://localhost:4201")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        // Swagger
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Coop API", Version = "v1" });
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme.",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });
            c.AddSecurityRequirement(document => new OpenApiSecurityRequirement
            {
                [new OpenApiSecuritySchemeReference("Bearer", document)] = []
            });
        });

        services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
            });

        return services;
    }
}
