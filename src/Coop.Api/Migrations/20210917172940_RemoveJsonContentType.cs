using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coop.Api.Migrations
{
    public partial class RemoveJsonContentType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JsonContents_JsonContentTypes_JsonContentTypeId",
                table: "JsonContents");

            migrationBuilder.DropTable(
                name: "JsonContentTypes");

            migrationBuilder.DropIndex(
                name: "IX_JsonContents_JsonContentTypeId",
                table: "JsonContents");

            migrationBuilder.DropColumn(
                name: "JsonContentTypeId",
                table: "JsonContents");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "JsonContentTypeId",
                table: "JsonContents",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "JsonContentTypes",
                columns: table => new
                {
                    JsonContentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Multi = table.Column<bool>(type: "bit", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JsonContentTypes", x => x.JsonContentTypeId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_JsonContents_JsonContentTypeId",
                table: "JsonContents",
                column: "JsonContentTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_JsonContents_JsonContentTypes_JsonContentTypeId",
                table: "JsonContents",
                column: "JsonContentTypeId",
                principalTable: "JsonContentTypes",
                principalColumn: "JsonContentTypeId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
