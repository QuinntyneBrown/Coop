// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Coop.SharedKernel.Serialization;

public interface IMessageSerializer
{
    byte[] Serialize<T>(T value);
    T Deserialize<T>(byte[] bytes);
    object Deserialize(Type type, byte[] bytes);
}

public class MessagePackMessageSerializer : IMessageSerializer
{
    public byte[] Serialize<T>(T value)
    {
        return MessagePackSerializerConfig.Serialize(value);
    }

    public T Deserialize<T>(byte[] bytes)
    {
        return MessagePackSerializerConfig.Deserialize<T>(bytes);
    }

    public object Deserialize(Type type, byte[] bytes)
    {
        return MessagePackSerializerConfig.Deserialize(type, bytes);
    }
}
