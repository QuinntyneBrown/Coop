// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Coop.SharedKernel.Messaging;

public class RedisOptions
{
    public const string SectionName = "Redis";

    public string ConnectionString { get; set; } = "localhost:6379";
    public string ChannelPrefix { get; set; } = "coop";
    public int RetryCount { get; set; } = 3;
    public int RetryDelayMilliseconds { get; set; } = 1000;
}
