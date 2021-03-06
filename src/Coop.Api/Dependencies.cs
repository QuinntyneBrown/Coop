using Coop.Api.Data;
using Coop.Api.Extensions;
using Coop.Core;
using Coop.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;

namespace Coop.Api
{
    public static class Dependencies
    {
        public static void Configure(IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<KestrelServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Coop",
                    Description = "Co-op Management",
                    TermsOfService = new Uri("https://example.com/terms"),
                    Contact = new OpenApiContact
                    {
                        Name = "Quinntyne Brown",
                        Email = "quinntynebrown@gmail.com"
                    },
                    License = new OpenApiLicense
                    {
                        Name = "Use under MIT",
                        Url = new Uri("https://opensource.org/licenses/MIT"),
                    }
                });

                options.CustomSchemaIds(x => x.FullName);
            });

            services.AddCors(options => options.AddPolicy("CorsPolicy",
                builder => builder
                .WithOrigins("https://localhost:4200", "https://white-bay-0cf53f60f.azurestaticapps.net/")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(isOriginAllowed: _ => true)
                .AllowCredentials()));

            services.AddValidation(typeof(Startup));

            services.AddHttpContextAccessor();

            services.AddMediatR(typeof(Startup), typeof(ICoopDbContext));

            services.AddSingleton<INotificationService, NotificationService>();

            services.AddScoped<IOrchestrationHandler, OrchestrationHandler>();

            services.AddScoped<ICoopDbContext, CoopDbContext>();

            services.AddDbContext<CoopDbContext>(options =>
            {
                options.UseSqlServer(configuration["ConnectionStrings:DefaultConnection"],
                    builder => builder.MigrationsAssembly("Coop.Api").EnableRetryOnFailure())
                .LogTo(Console.WriteLine)
                .EnableSensitiveDataLogging();
            });

            services.AddControllers()
                .AddNewtonsoftJson();
        }

        public static void ConfigureAuth(IServiceCollection services, IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ResourceOperationAuthorizationBehavior<,>));

            services.AddSingleton<IAuthorizationHandler, ResourceOperationAuthorizationHandler>();

            services.AddSingleton<IPasswordHasher, PasswordHasher>();

            services.AddSingleton<ITokenProvider, TokenProvider>();

            services.AddTransient<ITokenBuilder, TokenBuilder>();

            var jwtSecurityTokenHandler = new JwtSecurityTokenHandler
            {
                InboundClaimTypeMap = new Dictionary<string, string>()
            };

            if (webHostEnvironment.IsDevelopment() || webHostEnvironment.IsProduction())
            {
                services.AddAuthentication(x =>
                {
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.SecurityTokenValidators.Clear();
                    options.SecurityTokenValidators.Add(jwtSecurityTokenHandler);
                    options.TokenValidationParameters = GetTokenValidationParameters(configuration);
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            context.Request.Query.TryGetValue("access_token", out StringValues token);

                            if (!string.IsNullOrEmpty(token))
                            {
                                context.Token = token;
                            };

                            return Task.CompletedTask;
                        }
                    };
                });
            }
        }


        public static TokenValidationParameters GetTokenValidationParameters(IConfiguration configuration)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration[$"{nameof(Authentication)}:{nameof(Authentication.JwtKey)}"])),
                ValidateIssuer = true,
                ValidIssuer = configuration[$"{nameof(Authentication)}:{nameof(Authentication.JwtIssuer)}"],
                ValidateAudience = true,
                ValidAudience = configuration[$"{nameof(Authentication)}:{nameof(Authentication.JwtAudience)}"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero,
                NameClaimType = JwtRegisteredClaimNames.UniqueName
            };

            return tokenValidationParameters;
        }
    }
}

