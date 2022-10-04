using Microsoft.EntityFrameworkCore.Migrations;

namespace Coop.Infrastructure.Migrations
{
    public partial class AddMaintenaceRequestProfileForeignKeyConstraint : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceRequests_RequestedByProfileId",
                table: "MaintenanceRequests",
                column: "RequestedByProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_MaintenanceRequests_Profiles_RequestedByProfileId",
                table: "MaintenanceRequests",
                column: "RequestedByProfileId",
                principalTable: "Profiles",
                principalColumn: "ProfileId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MaintenanceRequests_Profiles_RequestedByProfileId",
                table: "MaintenanceRequests");

            migrationBuilder.DropIndex(
                name: "IX_MaintenanceRequests_RequestedByProfileId",
                table: "MaintenanceRequests");
        }
    }
}
