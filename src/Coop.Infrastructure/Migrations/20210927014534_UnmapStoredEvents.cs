using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coop.Infrastructure.Migrations
{
    public partial class UnmapStoredEvents : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StoredEvents_MaintenanceRequests_MaintenanceRequestId",
                table: "StoredEvents");

            migrationBuilder.DropIndex(
                name: "IX_StoredEvents_MaintenanceRequestId",
                table: "StoredEvents");

            migrationBuilder.DropColumn(
                name: "MaintenanceRequestId",
                table: "StoredEvents");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "MaintenanceRequestId",
                table: "StoredEvents",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StoredEvents_MaintenanceRequestId",
                table: "StoredEvents",
                column: "MaintenanceRequestId");

            migrationBuilder.AddForeignKey(
                name: "FK_StoredEvents_MaintenanceRequests_MaintenanceRequestId",
                table: "StoredEvents",
                column: "MaintenanceRequestId",
                principalTable: "MaintenanceRequests",
                principalColumn: "MaintenanceRequestId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
