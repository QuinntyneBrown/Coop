// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.Entities;

namespace Coop.Application.Features;

public static class NoticeExtensions
{
    public static NoticeDto ToDto(this Notice notice)
    {
        return new()
        {
            NoticeId = notice.NoticeId,
            DocumentId = notice.DocumentId,
            Name = notice.Name,
            DigitalAssetId = notice.DigitalAssetId,
            Published = notice.Published,
            CreatedById = notice.CreatedById
        };
    }
}

