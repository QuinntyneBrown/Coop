// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Reflection;

namespace Asset.Infrastructure.Data.Seeding;

public static class StaticFileLocator
{
    public static byte[] Get(string name)
    {
        var assembly = typeof(StaticFileLocator).Assembly;
        var resourceNames = assembly.GetManifestResourceNames();

        var resourceName = resourceNames.FirstOrDefault(n => n.EndsWith(name));

        if (resourceName == null)
        {
            throw new FileNotFoundException($"Embedded resource '{name}' not found");
        }

        using var stream = assembly.GetManifestResourceStream(resourceName);
        if (stream == null)
        {
            throw new FileNotFoundException($"Could not open stream for resource '{resourceName}'");
        }

        using var memoryStream = new MemoryStream();
        stream.CopyTo(memoryStream);
        return memoryStream.ToArray();
    }
}
