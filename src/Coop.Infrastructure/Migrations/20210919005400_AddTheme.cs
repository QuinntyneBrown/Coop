// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coop.Infrastructure.Migrations;

public partial class AddTheme : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Themes",
            columns: table => new
            {
                ThemeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                ProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                CssCustomProperties = table.Column<string>(type: "nvarchar(max)", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Themes", x => x.ThemeId);
            });
    }
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "Themes");
    }
}

