// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Coop.SharedKernel.Interfaces;

public interface IEntity<TId>
{
    TId Id { get; }
}

public interface IEntity : IEntity<Guid>
{
}
