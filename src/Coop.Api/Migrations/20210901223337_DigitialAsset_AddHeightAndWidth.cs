using Microsoft.EntityFrameworkCore.Migrations;

namespace Coop.Api.Migrations
{
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
}
