using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coop.Infrastructure.Migrations;

public partial class UpdateDocument : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "PdfDigitalAssetId",
            table: "Documents");
        migrationBuilder.AddColumn<Guid>(
            name: "DigitalAssetId",
            table: "Documents",
            type: "uniqueidentifier",
            nullable: true);
    }
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "DigitalAssetId",
            table: "Documents");
        migrationBuilder.AddColumn<Guid>(
            name: "PdfDigitalAssetId",
            table: "Documents",
            type: "uniqueidentifier",
            nullable: false,
            defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
    }
}
