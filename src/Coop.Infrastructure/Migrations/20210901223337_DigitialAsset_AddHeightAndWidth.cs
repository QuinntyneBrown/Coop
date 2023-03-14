// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore.Migrations;

namespace Coop.Infrastructure.Migrations;

public partial class DigitialAsset_AddHeightAndWidth : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<float>(
            name: "Height",
            table: "DigitalAssets",
            type: "real",
            nullable: false,
            defaultValue: 0f);
        migrationBuilder.AddColumn<float>(
            name: "Width",
            table: "DigitalAssets",
            type: "real",
            nullable: false,
            defaultValue: 0f);
    }
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "Height",
            table: "DigitalAssets");
        migrationBuilder.DropColumn(
            name: "Width",
            table: "DigitalAssets");
    }
}

