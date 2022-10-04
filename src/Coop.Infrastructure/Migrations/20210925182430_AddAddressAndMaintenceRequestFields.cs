using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coop.Infrastructure.Migrations
{
    public partial class AddAddressAndMaintenceRequestFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "MaintenanceRequests",
                newName: "WorkDetails");

            migrationBuilder.RenameColumn(
                name: "CreatedById",
                table: "MaintenanceRequests",
                newName: "ReceivedById");

            migrationBuilder.AddColumn<string>(
                name: "Address_City",
                table: "Profiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address_PostalCode",
                table: "Profiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address_Province",
                table: "Profiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address_Street",
                table: "Profiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Address_Unit",
                table: "Profiles",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address_City",
                table: "MaintenanceRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address_PostalCode",
                table: "MaintenanceRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address_Province",
                table: "MaintenanceRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address_Street",
                table: "MaintenanceRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Address_Unit",
                table: "MaintenanceRequests",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "MaintenanceRequests",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "MemberName",
                table: "MaintenanceRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "MaintenanceRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReceivedDate",
                table: "MaintenanceRequests",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UnitEntered",
                table: "MaintenanceRequests",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "UnitEntry",
                table: "MaintenanceRequests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "WorkCompleted",
                table: "MaintenanceRequests",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "WorkCompletedById",
                table: "MaintenanceRequests",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "WorkStarted",
                table: "MaintenanceRequests",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address_City",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "Address_PostalCode",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "Address_Province",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "Address_Street",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "Address_Unit",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "Address_City",
                table: "MaintenanceRequests");

            migrationBuilder.DropColumn(
                name: "Address_PostalCode",
                table: "MaintenanceRequests");

            migrationBuilder.DropColumn(
                name: "Address_Province",
                table: "MaintenanceRequests");

            migrationBuilder.DropColumn(
                name: "Address_Street",
                table: "MaintenanceRequests");

            migrationBuilder.DropColumn(
                name: "Address_Unit",
                table: "MaintenanceRequests");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "MaintenanceRequests");

            migrationBuilder.DropColumn(
                name: "MemberName",
                table: "MaintenanceRequests");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "MaintenanceRequests");

            migrationBuilder.DropColumn(
                name: "ReceivedDate",
                table: "MaintenanceRequests");

            migrationBuilder.DropColumn(
                name: "UnitEntered",
                table: "MaintenanceRequests");

            migrationBuilder.DropColumn(
                name: "UnitEntry",
                table: "MaintenanceRequests");

            migrationBuilder.DropColumn(
                name: "WorkCompleted",
                table: "MaintenanceRequests");

            migrationBuilder.DropColumn(
                name: "WorkCompletedById",
                table: "MaintenanceRequests");

            migrationBuilder.DropColumn(
                name: "WorkStarted",
                table: "MaintenanceRequests");

            migrationBuilder.RenameColumn(
                name: "WorkDetails",
                table: "MaintenanceRequests",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "ReceivedById",
                table: "MaintenanceRequests",
                newName: "CreatedById");
        }
    }
}
