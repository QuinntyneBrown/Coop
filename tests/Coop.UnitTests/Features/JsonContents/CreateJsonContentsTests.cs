﻿using Coop.Api;
using Coop.Application.JsonContents;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Testing;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Xunit;
using static Coop.Application.JsonContents.CreateJsonContent;

namespace Coop.UnitTests.Features.JsonContents
{
    using Request = Coop.Application.JsonContents.CreateJsonContent.Request;

    public class CreateJsonContentsTests : TestBase
    {
        [Fact]
        public async Task Handle()
        {
            var context = await CoopDbContextFactory.Create();

            var container = _serviceCollection
                .AddSingleton(context)
                .AddSingleton<Handler>()
                .AddMediatR(typeof(Startup))
                .AddSingleton<IOrchestrationHandler, OrchestrationHandler>()
                .BuildServiceProvider();

            var sut = container.GetRequiredService<Handler>();

            var result = await sut.Handle(new Request()
            {
                JsonContent = new JsonContentDto
                {
                    Json = default,
                    Name = "Content"
                }
            }, default);

        }
    }
}