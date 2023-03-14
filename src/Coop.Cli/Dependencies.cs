// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace Coop.Cli;

public class Dependencies
{
    internal static void Configure(IServiceCollection services)
    {
        services.AddMediatR(typeof(Program));
        services.AddScoped<ICommandService, CommandService>();
    }
}

