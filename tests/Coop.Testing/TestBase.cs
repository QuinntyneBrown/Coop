// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.Extensions.DependencyInjection;

namespace Coop.Testing;

public class TestBase
{
    protected ServiceCollection _serviceCollection;
    public TestBase()
    {
        _serviceCollection = new ServiceCollection();
    }
}

