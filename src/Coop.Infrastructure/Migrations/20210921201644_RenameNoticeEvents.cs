using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coop.Infrastructure.Migrations;

 public partial class RenameNoticeEvents : Migration
 {
     protected override void Up(MigrationBuilder migrationBuilder)
     {
         migrationBuilder.DropTable(
             name: "NoticeDomainEvent");
     }
     protected override void Down(MigrationBuilder migrationBuilder)
     {
         migrationBuilder.CreateTable(
             name: "NoticeDomainEvent",
             columns: table => new
             {
                 NoticeDomainEventId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                 Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                 NoticeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
             },
             constraints: table =>
             {
                 table.PrimaryKey("PK_NoticeDomainEvent", x => x.NoticeDomainEventId);
                 table.ForeignKey(
                     name: "FK_NoticeDomainEvent_Documents_NoticeId",
                     column: x => x.NoticeId,
                     principalTable: "Documents",
                     principalColumn: "DocumentId",
                     onDelete: ReferentialAction.Cascade);
             });
         migrationBuilder.CreateIndex(
             name: "IX_NoticeDomainEvent_NoticeId",
             table: "NoticeDomainEvent",
             column: "NoticeId");
     }
 }
