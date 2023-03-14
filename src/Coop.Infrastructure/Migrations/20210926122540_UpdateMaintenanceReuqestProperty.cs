// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore.Migrations;

namespace Coop.Infrastructure.Migrations;

public partial class UpdateMaintenanceReuqestProperty : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.RenameColumn(
            name: "UnitEntry",
            table: "MaintenanceRequests",
            newName: "UnattendedUnitEntryAllowed");
    }
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.RenameColumn(
            name: "UnattendedUnitEntryAllowed",
            table: "MaintenanceRequests",
            newName: "UnitEntry");
    }
}

