using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coop.Infrastructure.Migrations;

public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Conversations",
            columns: table => new
            {
                ConversationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Created = table.Column<DateTime>(type: "datetime2", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Conversations", x => x.ConversationId);
            });
        migrationBuilder.CreateTable(
            name: "CssCustomProperties",
            columns: table => new
            {
                CssCustomPropertyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Value = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Type = table.Column<int>(type: "int", nullable: false),
                Discriminator = table.Column<string>(type: "nvarchar(max)", nullable: false),
                ProfileCssCustomPropertyId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                ProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_CssCustomProperties", x => x.CssCustomPropertyId);
            });
        migrationBuilder.CreateTable(
            name: "DigitalAssets",
            columns: table => new
            {
                DigitalAssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Bytes = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                ContentType = table.Column<string>(type: "nvarchar(max)", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_DigitalAssets", x => x.DigitalAssetId);
            });
        migrationBuilder.CreateTable(
            name: "Documents",
            columns: table => new
            {
                DocumentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                PdfDigitalAssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Published = table.Column<DateTime>(type: "datetime2", nullable: true),
                CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Discriminator = table.Column<string>(type: "nvarchar(max)", nullable: false),
                ByLawId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                NoticeId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                Body = table.Column<string>(type: "nvarchar(max)", nullable: true),
                ReportId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Documents", x => x.DocumentId);
            });
        migrationBuilder.CreateTable(
            name: "JsonContentTypes",
            columns: table => new
            {
                JsonContentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Multi = table.Column<bool>(type: "bit", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_JsonContentTypes", x => x.JsonContentTypeId);
            });
        migrationBuilder.CreateTable(
            name: "MaintenanceRequests",
            columns: table => new
            {
                MaintenanceRequestId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Status = table.Column<int>(type: "int", nullable: false),
                CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_MaintenanceRequests", x => x.MaintenanceRequestId);
            });
        migrationBuilder.CreateTable(
            name: "Roles",
            columns: table => new
            {
                RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Roles", x => x.RoleId);
            });
        migrationBuilder.CreateTable(
            name: "Users",
            columns: table => new
            {
                UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Username = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Salt = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                CurrentProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                DefaultProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Users", x => x.UserId);
            });
        migrationBuilder.CreateTable(
            name: "NoticeDomainEvent",
            columns: table => new
            {
                NoticeDomainEventId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                NoticeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Created = table.Column<DateTime>(type: "datetime2", nullable: false)
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
        migrationBuilder.CreateTable(
            name: "JsonContents",
            columns: table => new
            {
                JsonContentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Json = table.Column<string>(type: "nvarchar(max)", nullable: true),
                JsonContentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_JsonContents", x => x.JsonContentId);
                table.ForeignKey(
                    name: "FK_JsonContents_JsonContentTypes_JsonContentTypeId",
                    column: x => x.JsonContentTypeId,
                    principalTable: "JsonContentTypes",
                    principalColumn: "JsonContentTypeId",
                    onDelete: ReferentialAction.Restrict);
            });
        migrationBuilder.CreateTable(
            name: "MaintenanceRequestComments",
            columns: table => new
            {
                MaintenanceRequestCommentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                MaintenanceRequestId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Body = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_MaintenanceRequestComments", x => new { x.MaintenanceRequestId, x.MaintenanceRequestCommentId });
                table.ForeignKey(
                    name: "FK_MaintenanceRequestComments_MaintenanceRequests_MaintenanceRequestId",
                    column: x => x.MaintenanceRequestId,
                    principalTable: "MaintenanceRequests",
                    principalColumn: "MaintenanceRequestId",
                    onDelete: ReferentialAction.Cascade);
            });
        migrationBuilder.CreateTable(
            name: "MaintenanceRequestDigitalAssets",
            columns: table => new
            {
                MaintenanceRequestDigitalAssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                MaintenanceRequestId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                DigitalAssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_MaintenanceRequestDigitalAssets", x => new { x.MaintenanceRequestId, x.MaintenanceRequestDigitalAssetId });
                table.ForeignKey(
                    name: "FK_MaintenanceRequestDigitalAssets_MaintenanceRequests_MaintenanceRequestId",
                    column: x => x.MaintenanceRequestId,
                    principalTable: "MaintenanceRequests",
                    principalColumn: "MaintenanceRequestId",
                    onDelete: ReferentialAction.Cascade);
            });
        migrationBuilder.CreateTable(
            name: "MaintenanceRequestDomainEvent",
            columns: table => new
            {
                MaintenanceRequestDomainEventId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                MaintenanceRequestId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Created = table.Column<DateTime>(type: "datetime2", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_MaintenanceRequestDomainEvent", x => x.MaintenanceRequestDomainEventId);
                table.ForeignKey(
                    name: "FK_MaintenanceRequestDomainEvent_MaintenanceRequests_MaintenanceRequestId",
                    column: x => x.MaintenanceRequestId,
                    principalTable: "MaintenanceRequests",
                    principalColumn: "MaintenanceRequestId",
                    onDelete: ReferentialAction.Cascade);
            });
        migrationBuilder.CreateTable(
            name: "Privileges",
            columns: table => new
            {
                PrivilegeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                AccessRight = table.Column<int>(type: "int", nullable: false),
                Aggregate = table.Column<string>(type: "nvarchar(max)", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Privileges", x => x.PrivilegeId);
                table.ForeignKey(
                    name: "FK_Privileges_Roles_RoleId",
                    column: x => x.RoleId,
                    principalTable: "Roles",
                    principalColumn: "RoleId",
                    onDelete: ReferentialAction.Cascade);
            });
        migrationBuilder.CreateTable(
            name: "Profiles",
            columns: table => new
            {
                ProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                Firstname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Lastname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                AvatarDigitalAssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Type = table.Column<int>(type: "int", nullable: false),
                Discriminator = table.Column<string>(type: "nvarchar(max)", nullable: false),
                BoardMemberId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                BoardTitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                MemberId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                OnCallId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                StaffMemberId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                JobTitle = table.Column<string>(type: "nvarchar(max)", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Profiles", x => x.ProfileId);
                table.ForeignKey(
                    name: "FK_Profiles_Users_UserId",
                    column: x => x.UserId,
                    principalTable: "Users",
                    principalColumn: "UserId",
                    onDelete: ReferentialAction.Restrict);
            });
        migrationBuilder.CreateTable(
            name: "RoleUser",
            columns: table => new
            {
                RolesRoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                UsersUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_RoleUser", x => new { x.RolesRoleId, x.UsersUserId });
                table.ForeignKey(
                    name: "FK_RoleUser_Roles_RolesRoleId",
                    column: x => x.RolesRoleId,
                    principalTable: "Roles",
                    principalColumn: "RoleId",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_RoleUser_Users_UsersUserId",
                    column: x => x.UsersUserId,
                    principalTable: "Users",
                    principalColumn: "UserId",
                    onDelete: ReferentialAction.Cascade);
            });
        migrationBuilder.CreateTable(
            name: "ConversationProfile",
            columns: table => new
            {
                ConversationsConversationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                ProfilesProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_ConversationProfile", x => new { x.ConversationsConversationId, x.ProfilesProfileId });
                table.ForeignKey(
                    name: "FK_ConversationProfile_Conversations_ConversationsConversationId",
                    column: x => x.ConversationsConversationId,
                    principalTable: "Conversations",
                    principalColumn: "ConversationId",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_ConversationProfile_Profiles_ProfilesProfileId",
                    column: x => x.ProfilesProfileId,
                    principalTable: "Profiles",
                    principalColumn: "ProfileId",
                    onDelete: ReferentialAction.Cascade);
            });
        migrationBuilder.CreateTable(
            name: "Messages",
            columns: table => new
            {
                MessageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                ConversationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                ToProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                FromProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Body = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Read = table.Column<bool>(type: "bit", nullable: false),
                Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                ProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Messages", x => x.MessageId);
                table.ForeignKey(
                    name: "FK_Messages_Conversations_ConversationId",
                    column: x => x.ConversationId,
                    principalTable: "Conversations",
                    principalColumn: "ConversationId",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_Messages_Profiles_ProfileId",
                    column: x => x.ProfileId,
                    principalTable: "Profiles",
                    principalColumn: "ProfileId",
                    onDelete: ReferentialAction.Restrict);
            });
        migrationBuilder.CreateIndex(
            name: "IX_ConversationProfile_ProfilesProfileId",
            table: "ConversationProfile",
            column: "ProfilesProfileId");
        migrationBuilder.CreateIndex(
            name: "IX_JsonContents_JsonContentTypeId",
            table: "JsonContents",
            column: "JsonContentTypeId");
        migrationBuilder.CreateIndex(
            name: "IX_MaintenanceRequestDomainEvent_MaintenanceRequestId",
            table: "MaintenanceRequestDomainEvent",
            column: "MaintenanceRequestId");
        migrationBuilder.CreateIndex(
            name: "IX_Messages_ConversationId",
            table: "Messages",
            column: "ConversationId");
        migrationBuilder.CreateIndex(
            name: "IX_Messages_ProfileId",
            table: "Messages",
            column: "ProfileId");
        migrationBuilder.CreateIndex(
            name: "IX_NoticeDomainEvent_NoticeId",
            table: "NoticeDomainEvent",
            column: "NoticeId");
        migrationBuilder.CreateIndex(
            name: "IX_Privileges_RoleId",
            table: "Privileges",
            column: "RoleId");
        migrationBuilder.CreateIndex(
            name: "IX_Profiles_UserId",
            table: "Profiles",
            column: "UserId");
        migrationBuilder.CreateIndex(
            name: "IX_RoleUser_UsersUserId",
            table: "RoleUser",
            column: "UsersUserId");
    }
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "ConversationProfile");
        migrationBuilder.DropTable(
            name: "CssCustomProperties");
        migrationBuilder.DropTable(
            name: "DigitalAssets");
        migrationBuilder.DropTable(
            name: "JsonContents");
        migrationBuilder.DropTable(
            name: "MaintenanceRequestComments");
        migrationBuilder.DropTable(
            name: "MaintenanceRequestDigitalAssets");
        migrationBuilder.DropTable(
            name: "MaintenanceRequestDomainEvent");
        migrationBuilder.DropTable(
            name: "Messages");
        migrationBuilder.DropTable(
            name: "NoticeDomainEvent");
        migrationBuilder.DropTable(
            name: "Privileges");
        migrationBuilder.DropTable(
            name: "RoleUser");
        migrationBuilder.DropTable(
            name: "JsonContentTypes");
        migrationBuilder.DropTable(
            name: "MaintenanceRequests");
        migrationBuilder.DropTable(
            name: "Conversations");
        migrationBuilder.DropTable(
            name: "Profiles");
        migrationBuilder.DropTable(
            name: "Documents");
        migrationBuilder.DropTable(
            name: "Roles");
        migrationBuilder.DropTable(
            name: "Users");
    }
}
