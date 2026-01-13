// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Maintenance.Infrastructure.Data.Seeding;

public static class MaintenanceSeedData
{
    public static void Seed(MaintenanceDbContext context)
    {
        // No seed data required for maintenance requests
        // They are created through user interactions
        context.SaveChanges();
    }
}
