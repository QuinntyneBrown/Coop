// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

var builder = DistributedApplication.CreateBuilder(args);

// Infrastructure resources
var redis = builder.AddRedis("redis");

var sqlServer = builder.AddSqlServer("sql");
var identityDb = sqlServer.AddDatabase("IdentityDb");
var profileDb = sqlServer.AddDatabase("ProfileDb");
var documentDb = sqlServer.AddDatabase("DocumentDb");
var maintenanceDb = sqlServer.AddDatabase("MaintenanceDb");
var messagingDb = sqlServer.AddDatabase("MessagingDb");
var assetDb = sqlServer.AddDatabase("AssetDb");

// Microservices
var identityApi = builder.AddProject<Projects.Identity_Api>("identity-api")
    .WithReference(identityDb)
    .WithReference(redis)
    .WaitFor(identityDb)
    .WaitFor(redis);

var profileApi = builder.AddProject<Projects.Profile_Api>("profile-api")
    .WithReference(profileDb)
    .WithReference(redis)
    .WaitFor(profileDb)
    .WaitFor(redis);

var documentApi = builder.AddProject<Projects.Document_Api>("document-api")
    .WithReference(documentDb)
    .WithReference(redis)
    .WaitFor(documentDb)
    .WaitFor(redis);

var maintenanceApi = builder.AddProject<Projects.Maintenance_Api>("maintenance-api")
    .WithReference(maintenanceDb)
    .WithReference(redis)
    .WaitFor(maintenanceDb)
    .WaitFor(redis);

var messagingApi = builder.AddProject<Projects.Messaging_Api>("messaging-api")
    .WithReference(messagingDb)
    .WithReference(redis)
    .WaitFor(messagingDb)
    .WaitFor(redis);

var assetApi = builder.AddProject<Projects.Asset_Api>("asset-api")
    .WithReference(assetDb)
    .WithReference(redis)
    .WaitFor(assetDb)
    .WaitFor(redis);

// API Gateway (YARP reverse proxy)
var gateway = builder.AddProject<Projects.Gateway_Api>("gateway-api")
    .WithReference(redis)
    .WithReference(identityApi)
    .WithReference(profileApi)
    .WithReference(documentApi)
    .WithReference(maintenanceApi)
    .WithReference(messagingApi)
    .WithReference(assetApi)
    .WaitFor(identityApi)
    .WaitFor(profileApi)
    .WaitFor(documentApi)
    .WaitFor(maintenanceApi)
    .WaitFor(messagingApi)
    .WaitFor(assetApi)
    .WithExternalHttpEndpoints();

// Angular Frontend
builder.AddNpmApp("frontend", "../Coop.App")
    .WithReference(gateway)
    .WaitFor(gateway)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
