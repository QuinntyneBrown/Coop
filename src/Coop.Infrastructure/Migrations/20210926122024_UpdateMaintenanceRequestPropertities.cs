using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coop.Infrastructure.Migrations
{
    public partial class UpdateMaintenanceRequestPropertities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WorkCompletedById",
                table: "MaintenanceRequests");

            migrationBuilder.RenameColumn(
                name: "ReceivedById",
                table: "MaintenanceRequests",
                newName: "RequestedByProfileId");

            migrationBuilder.RenameColumn(
                name: "MemberName",
                table: "MaintenanceRequests",
                newName: "WorkCompletedByName");

            migrationBuilder.AddColumn<string>(
                name: "ReceivedByName",
                table: "MaintenanceRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ReceivedByProfileId",
                table: "MaintenanceRequests",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "RequestedByName",
                table: "MaintenanceRequests",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReceivedByName",
                table: "MaintenanceRequests");

            migrationBuilder.DropColumn(
                name: "ReceivedByProfileId",
                table: "MaintenanceRequests");

            migrationBuilder.DropColumn(
                name: "RequestedByName",
                table: "MaintenanceRequests");

            migrationBuilder.RenameColumn(
                name: "WorkCompletedByName",
                table: "MaintenanceRequests",
                newName: "MemberName");

            migrationBuilder.RenameColumn(
                name: "RequestedByProfileId",
                table: "MaintenanceRequests",
                newName: "ReceivedById");

            migrationBuilder.AddColumn<DateTime>(
                name: "WorkCompletedById",
                table: "MaintenanceRequests",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
