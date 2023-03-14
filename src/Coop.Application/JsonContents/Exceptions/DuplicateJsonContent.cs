// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;

namespace Coop.Application.JsonContents.Exceptions;

public class DuplicateJsonContent : Exception
{
    public DuplicateJsonContent()
        : base("Duplicate") { }
}

