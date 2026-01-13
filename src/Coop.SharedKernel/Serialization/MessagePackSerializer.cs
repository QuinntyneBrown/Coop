// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MessagePack;
using MessagePack.Resolvers;

namespace Coop.SharedKernel.Serialization;

public static class MessagePackSerializerConfig
{
    private static readonly MessagePackSerializerOptions Options;

    static MessagePackSerializerConfig()
    {
        var resolver = CompositeResolver.Create(
            StandardResolver.Instance,
            ContractlessStandardResolver.Instance
        );

        Options = MessagePackSerializerOptions.Standard
            .WithResolver(resolver)
            .WithSecurity(MessagePackSecurity.UntrustedData);
    }

    public static byte[] Serialize<T>(T value)
    {
        return MessagePackSerializer.Serialize(value, Options);
    }

    public static T Deserialize<T>(byte[] bytes)
    {
        return MessagePackSerializer.Deserialize<T>(bytes, Options);
    }

    public static object Deserialize(Type type, byte[] bytes)
    {
        return MessagePackSerializer.Deserialize(type, bytes, Options);
    }

    public static T Deserialize<T>(ReadOnlyMemory<byte> bytes)
    {
        return MessagePackSerializer.Deserialize<T>(bytes, Options);
    }
}
