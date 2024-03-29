// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using Coop.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Coop.Infrastructure.Migrations;

 [DbContext(typeof(CoopDbContext))]
 [Migration("20210927014534_UnmapStoredEvents")]
 partial class UnmapStoredEvents
 {
     protected override void BuildTargetModel(ModelBuilder modelBuilder)
     {
         modelBuilder
             .HasAnnotation("Relational:MaxIdentifierLength", 128)
             .HasAnnotation("ProductVersion", "5.0.8")
             .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);
         modelBuilder.Entity("ConversationProfile", b =>
             {
                 b.Property<Guid>("ConversationsConversationId")
                     .HasColumnType("uniqueidentifier");
                 b.Property<Guid>("ProfilesProfileId")
                     .HasColumnType("uniqueidentifier");
                 b.HasKey("ConversationsConversationId", "ProfilesProfileId");
                 b.HasIndex("ProfilesProfileId");
                 b.ToTable("ConversationProfile");
             });
         modelBuilder.Entity("Coop.Domain.Entities.Conversation", b =>
             {
                 b.Property<Guid>("ConversationId")
                     .ValueGeneratedOnAdd()
                     .HasColumnType("uniqueidentifier");
                 b.Property<DateTime>("Created")
                     .HasColumnType("datetime2");
                 b.HasKey("ConversationId");
                 b.ToTable("Conversations");
             });
         modelBuilder.Entity("Coop.Domain.Entities.DigitalAsset", b =>
             {
                 b.Property<Guid>("DigitalAssetId")
                     .ValueGeneratedOnAdd()
                     .HasColumnType("uniqueidentifier");
                 b.Property<byte[]>("Bytes")
                     .HasColumnType("varbinary(max)");
                 b.Property<string>("ContentType")
                     .HasColumnType("nvarchar(max)");
                 b.Property<float>("Height")
                     .HasColumnType("real");
                 b.Property<string>("Name")
                     .HasColumnType("nvarchar(max)");
                 b.Property<float>("Width")
                     .HasColumnType("real");
                 b.HasKey("DigitalAssetId");
                 b.ToTable("DigitalAssets");
             });
         modelBuilder.Entity("Coop.Domain.Entities.Document", b =>
             {
                 b.Property<Guid>("DocumentId")
                     .ValueGeneratedOnAdd()
                     .HasColumnType("uniqueidentifier");
                 b.Property<Guid>("CreatedById")
                     .HasColumnType("uniqueidentifier");
                 b.Property<string>("Discriminator")
                     .IsRequired()
                     .HasColumnType("nvarchar(max)");
                 b.Property<string>("Name")
                     .HasColumnType("nvarchar(max)");
                 b.Property<Guid>("PdfDigitalAssetId")
                     .HasColumnType("uniqueidentifier");
                 b.Property<DateTime?>("Published")
                     .HasColumnType("datetime2");
                 b.HasKey("DocumentId");
                 b.ToTable("Documents");
                 b.HasDiscriminator<string>("Discriminator").HasValue("Document");
             });
         modelBuilder.Entity("Coop.Domain.Entities.InvitationToken", b =>
             {
                 b.Property<Guid>("InvitationTokenId")
                     .ValueGeneratedOnAdd()
                     .HasColumnType("uniqueidentifier");
                 b.Property<DateTime?>("Expiry")
                     .HasColumnType("datetime2");
                 b.Property<int>("Type")
                     .HasColumnType("int");
                 b.Property<string>("Value")
                     .HasColumnType("nvarchar(max)");
                 b.HasKey("InvitationTokenId");
                 b.ToTable("InvitationTokens");
             });
         modelBuilder.Entity("Coop.Domain.Entities.JsonContent", b =>
             {
                 b.Property<Guid>("JsonContentId")
                     .ValueGeneratedOnAdd()
                     .HasColumnType("uniqueidentifier");
                 b.Property<string>("Json")
                     .HasColumnType("nvarchar(max)");
                 b.Property<string>("Name")
                     .HasColumnType("nvarchar(max)");
                 b.HasKey("JsonContentId");
                 b.ToTable("JsonContents");
             });
         modelBuilder.Entity("Coop.Domain.Entities.MaintenanceRequest", b =>
             {
                 b.Property<Guid>("MaintenanceRequestId")
                     .ValueGeneratedOnAdd()
                     .HasColumnType("uniqueidentifier");
                 b.Property<DateTime>("Date")
                     .HasColumnType("datetime2");
                 b.Property<string>("Description")
                     .HasColumnType("nvarchar(max)");
                 b.Property<string>("Phone")
                     .HasColumnType("nvarchar(max)");
                 b.Property<string>("ReceivedByName")
                     .HasColumnType("nvarchar(max)");
                 b.Property<Guid>("ReceivedByProfileId")
                     .HasColumnType("uniqueidentifier");
                 b.Property<DateTime?>("ReceivedDate")
                     .HasColumnType("datetime2");
                 b.Property<string>("RequestedByName")
                     .HasColumnType("nvarchar(max)");
                 b.Property<Guid>("RequestedByProfileId")
                     .HasColumnType("uniqueidentifier");
                 b.Property<int>("Status")
                     .HasColumnType("int");
                 b.Property<bool>("UnattendedUnitEntryAllowed")
                     .HasColumnType("bit");
                 b.Property<int>("UnitEntered")
                     .HasColumnType("int");
                 b.Property<DateTime>("WorkCompleted")
                     .HasColumnType("datetime2");
                 b.Property<string>("WorkCompletedByName")
                     .HasColumnType("nvarchar(max)");
                 b.Property<string>("WorkDetails")
                     .HasColumnType("nvarchar(max)");
                 b.Property<DateTime>("WorkStarted")
                     .HasColumnType("datetime2");
                 b.HasKey("MaintenanceRequestId");
                 b.HasIndex("RequestedByProfileId");
                 b.ToTable("MaintenanceRequests");
             });
         modelBuilder.Entity("Coop.Domain.Entities.Message", b =>
             {
                 b.Property<Guid>("MessageId")
                     .ValueGeneratedOnAdd()
                     .HasColumnType("uniqueidentifier");
                 b.Property<string>("Body")
                     .HasColumnType("nvarchar(max)");
                 b.Property<Guid?>("ConversationId")
                     .HasColumnType("uniqueidentifier");
                 b.Property<DateTime>("Created")
                     .HasColumnType("datetime2");
                 b.Property<Guid>("FromProfileId")
                     .HasColumnType("uniqueidentifier");
                 b.Property<Guid?>("ProfileId")
                     .HasColumnType("uniqueidentifier");
                 b.Property<bool>("Read")
                     .HasColumnType("bit");
                 b.Property<Guid>("ToProfileId")
                     .HasColumnType("uniqueidentifier");
                 b.HasKey("MessageId");
                 b.HasIndex("ConversationId");
                 b.HasIndex("ProfileId");
                 b.ToTable("Messages");
             });
         modelBuilder.Entity("Coop.Domain.Entities.Privilege", b =>
             {
                 b.Property<Guid>("PrivilegeId")
                     .ValueGeneratedOnAdd()
                     .HasColumnType("uniqueidentifier");
                 b.Property<int>("AccessRight")
                     .HasColumnType("int");
                 b.Property<string>("Aggregate")
                     .HasColumnType("nvarchar(max)");
                 b.Property<Guid>("RoleId")
                     .HasColumnType("uniqueidentifier");
                 b.HasKey("PrivilegeId");
                 b.HasIndex("RoleId");
                 b.ToTable("Privileges");
             });
         modelBuilder.Entity("Coop.Domain.Entities.Profile", b =>
             {
                 b.Property<Guid>("ProfileId")
                     .ValueGeneratedOnAdd()
                     .HasColumnType("uniqueidentifier");
                 b.Property<Guid?>("AvatarDigitalAssetId")
                     .HasColumnType("uniqueidentifier");
                 b.Property<string>("Discriminator")
                     .IsRequired()
                     .HasColumnType("nvarchar(max)");
                 b.Property<string>("Firstname")
                     .HasColumnType("nvarchar(max)");
                 b.Property<string>("Lastname")
                     .HasColumnType("nvarchar(max)");
                 b.Property<string>("PhoneNumber")
                     .HasColumnType("nvarchar(max)");
                 b.Property<int>("Type")
                     .HasColumnType("int");
                 b.Property<Guid?>("UserId")
                     .HasColumnType("uniqueidentifier");
                 b.HasKey("ProfileId");
                 b.HasIndex("UserId");
                 b.ToTable("Profiles");
                 b.HasDiscriminator<string>("Discriminator").HasValue("Profile");
             });
         modelBuilder.Entity("Coop.Domain.Entities.Role", b =>
             {
                 b.Property<Guid>("RoleId")
                     .ValueGeneratedOnAdd()
                     .HasColumnType("uniqueidentifier");
                 b.Property<string>("Name")
                     .HasColumnType("nvarchar(max)");
                 b.HasKey("RoleId");
                 b.ToTable("Roles");
             });
         modelBuilder.Entity("Coop.Domain.Entities.StoredEvent", b =>
             {
                 b.Property<Guid>("StoredEventId")
                     .ValueGeneratedOnAdd()
                     .HasColumnType("uniqueidentifier");
                 b.Property<string>("Aggregate")
                     .HasColumnType("nvarchar(450)");
                 b.Property<string>("AggregateDotNetType")
                     .HasColumnType("nvarchar(max)");
                 b.Property<Guid>("CorrelationId")
                     .HasColumnType("uniqueidentifier");
                 b.Property<DateTime>("CreatedOn")
                     .HasColumnType("datetime2");
                 b.Property<string>("Data")
                     .HasColumnType("nvarchar(max)");
                 b.Property<string>("DotNetType")
                     .HasColumnType("nvarchar(max)");
                 b.Property<int>("Sequence")
                     .HasColumnType("int");
                 b.Property<Guid>("StreamId")
                     .HasColumnType("uniqueidentifier");
                 b.Property<string>("Type")
                     .HasColumnType("nvarchar(max)");
                 b.Property<int>("Version")
                     .HasColumnType("int");
                 b.HasKey("StoredEventId");
                 b.HasIndex("StreamId", "Aggregate");
                 b.ToTable("StoredEvents");
             });
         modelBuilder.Entity("Coop.Domain.Entities.Theme", b =>
             {
                 b.Property<Guid>("ThemeId")
                     .ValueGeneratedOnAdd()
                     .HasColumnType("uniqueidentifier");
                 b.Property<string>("CssCustomProperties")
                     .HasColumnType("nvarchar(max)");
                 b.Property<Guid?>("ProfileId")
                     .HasColumnType("uniqueidentifier");
                 b.HasKey("ThemeId");
                 b.ToTable("Themes");
             });
         modelBuilder.Entity("Coop.Domain.Entities.User", b =>
             {
                 b.Property<Guid>("UserId")
                     .ValueGeneratedOnAdd()
                     .HasColumnType("uniqueidentifier");
                 b.Property<Guid>("CurrentProfileId")
                     .HasColumnType("uniqueidentifier");
                 b.Property<Guid>("DefaultProfileId")
                     .HasColumnType("uniqueidentifier");
                 b.Property<bool>("IsDeleted")
                     .HasColumnType("bit");
                 b.Property<string>("Password")
                     .HasColumnType("nvarchar(max)");
                 b.Property<byte[]>("Salt")
                     .HasColumnType("varbinary(max)");
                 b.Property<string>("Username")
                     .HasColumnType("nvarchar(450)");
                 b.HasKey("UserId");
                 b.HasIndex("Username")
                     .IsUnique()
                     .HasFilter("[Username] IS NOT NULL");
                 b.ToTable("Users");
             });
         modelBuilder.Entity("RoleUser", b =>
             {
                 b.Property<Guid>("RolesRoleId")
                     .HasColumnType("uniqueidentifier");
                 b.Property<Guid>("UsersUserId")
                     .HasColumnType("uniqueidentifier");
                 b.HasKey("RolesRoleId", "UsersUserId");
                 b.HasIndex("UsersUserId");
                 b.ToTable("RoleUser");
             });
         modelBuilder.Entity("Coop.Domain.Entities.ByLaw", b =>
             {
                 b.HasBaseType("Coop.Domain.Entities.Document");
                 b.Property<Guid>("ByLawId")
                     .HasColumnType("uniqueidentifier");
                 b.HasDiscriminator().HasValue("ByLaw");
             });
         modelBuilder.Entity("Coop.Domain.Entities.Notice", b =>
             {
                 b.HasBaseType("Coop.Domain.Entities.Document");
                 b.Property<string>("Body")
                     .HasColumnType("nvarchar(max)");
                 b.Property<Guid>("NoticeId")
                     .HasColumnType("uniqueidentifier");
                 b.HasDiscriminator().HasValue("Notice");
             });
         modelBuilder.Entity("Coop.Domain.Entities.Report", b =>
             {
                 b.HasBaseType("Coop.Domain.Entities.Document");
                 b.Property<Guid>("ReportId")
                     .HasColumnType("uniqueidentifier");
                 b.HasDiscriminator().HasValue("Report");
             });
         modelBuilder.Entity("Coop.Domain.Entities.BoardMember", b =>
             {
                 b.HasBaseType("Coop.Domain.Entities.Profile");
                 b.Property<Guid>("BoardMemberId")
                     .HasColumnType("uniqueidentifier");
                 b.Property<string>("BoardTitle")
                     .HasColumnType("nvarchar(max)");
                 b.HasDiscriminator().HasValue("BoardMember");
             });
         modelBuilder.Entity("Coop.Domain.Entities.Member", b =>
             {
                 b.HasBaseType("Coop.Domain.Entities.Profile");
                 b.Property<Guid>("MemberId")
                     .HasColumnType("uniqueidentifier");
                 b.HasDiscriminator().HasValue("Member");
             });
         modelBuilder.Entity("Coop.Domain.Entities.OnCall", b =>
             {
                 b.HasBaseType("Coop.Domain.Entities.Profile");
                 b.Property<Guid>("OnCallId")
                     .HasColumnType("uniqueidentifier");
                 b.HasDiscriminator().HasValue("OnCall");
             });
         modelBuilder.Entity("Coop.Domain.Entities.StaffMember", b =>
             {
                 b.HasBaseType("Coop.Domain.Entities.Profile");
                 b.Property<string>("JobTitle")
                     .HasColumnType("nvarchar(max)");
                 b.Property<Guid>("StaffMemberId")
                     .HasColumnType("uniqueidentifier");
                 b.HasDiscriminator().HasValue("StaffMember");
             });
         modelBuilder.Entity("ConversationProfile", b =>
             {
                 b.HasOne("Coop.Domain.Entities.Conversation", null)
                     .WithMany()
                     .HasForeignKey("ConversationsConversationId")
                     .OnDelete(DeleteBehavior.Cascade)
                     .IsRequired();
                 b.HasOne("Coop.Domain.Entities.Profile", null)
                     .WithMany()
                     .HasForeignKey("ProfilesProfileId")
                     .OnDelete(DeleteBehavior.Cascade)
                     .IsRequired();
             });
         modelBuilder.Entity("Coop.Domain.Entities.MaintenanceRequest", b =>
             {
                 b.HasOne("Coop.Domain.Entities.Profile", "RequestedByProfile")
                     .WithMany()
                     .HasForeignKey("RequestedByProfileId")
                     .OnDelete(DeleteBehavior.Cascade)
                     .IsRequired();
                 b.OwnsOne("Coop.Domain.Entities.Address", "Address", b1 =>
                     {
                         b1.Property<Guid>("MaintenanceRequestId")
                             .HasColumnType("uniqueidentifier");
                         b1.Property<string>("City")
                             .HasColumnType("nvarchar(max)");
                         b1.Property<string>("PostalCode")
                             .HasColumnType("nvarchar(max)");
                         b1.Property<string>("Province")
                             .HasColumnType("nvarchar(max)");
                         b1.Property<string>("Street")
                             .HasColumnType("nvarchar(max)");
                         b1.Property<int?>("Unit")
                             .HasColumnType("int");
                         b1.HasKey("MaintenanceRequestId");
                         b1.ToTable("MaintenanceRequests");
                         b1.WithOwner()
                             .HasForeignKey("MaintenanceRequestId");
                     });
                 b.OwnsMany("Coop.Domain.Entities.MaintenanceRequestComment", "Comments", b1 =>
                     {
                         b1.Property<Guid>("MaintenanceRequestId")
                             .HasColumnType("uniqueidentifier");
                         b1.Property<Guid>("MaintenanceRequestCommentId")
                             .ValueGeneratedOnAdd()
                             .HasColumnType("uniqueidentifier");
                         b1.Property<string>("Body")
                             .HasColumnType("nvarchar(max)");
                         b1.Property<DateTime>("Created")
                             .HasColumnType("datetime2");
                         b1.Property<Guid>("CreatedById")
                             .HasColumnType("uniqueidentifier");
                         b1.HasKey("MaintenanceRequestId", "MaintenanceRequestCommentId");
                         b1.ToTable("MaintenanceRequestComments");
                         b1.WithOwner()
                             .HasForeignKey("MaintenanceRequestId");
                     });
                 b.OwnsMany("Coop.Domain.Entities.MaintenanceRequestDigitalAsset", "DigitalAssets", b1 =>
                     {
                         b1.Property<Guid>("MaintenanceRequestId")
                             .HasColumnType("uniqueidentifier");
                         b1.Property<Guid>("MaintenanceRequestDigitalAssetId")
                             .ValueGeneratedOnAdd()
                             .HasColumnType("uniqueidentifier");
                         b1.Property<Guid>("DigitalAssetId")
                             .HasColumnType("uniqueidentifier");
                         b1.HasKey("MaintenanceRequestId", "MaintenanceRequestDigitalAssetId");
                         b1.ToTable("MaintenanceRequestDigitalAssets");
                         b1.WithOwner()
                             .HasForeignKey("MaintenanceRequestId");
                     });
                 b.Navigation("Address");
                 b.Navigation("Comments");
                 b.Navigation("DigitalAssets");
                 b.Navigation("RequestedByProfile");
             });
         modelBuilder.Entity("Coop.Domain.Entities.Message", b =>
             {
                 b.HasOne("Coop.Domain.Entities.Conversation", null)
                     .WithMany("Messages")
                     .HasForeignKey("ConversationId");
                 b.HasOne("Coop.Domain.Entities.Profile", null)
                     .WithMany("Messages")
                     .HasForeignKey("ProfileId");
             });
         modelBuilder.Entity("Coop.Domain.Entities.Privilege", b =>
             {
                 b.HasOne("Coop.Domain.Entities.Role", null)
                     .WithMany("Privileges")
                     .HasForeignKey("RoleId")
                     .OnDelete(DeleteBehavior.Cascade)
                     .IsRequired();
             });
         modelBuilder.Entity("Coop.Domain.Entities.Profile", b =>
             {
                 b.HasOne("Coop.Domain.Entities.User", "User")
                     .WithMany("Profiles")
                     .HasForeignKey("UserId");
                 b.OwnsOne("Coop.Domain.Entities.Address", "Address", b1 =>
                     {
                         b1.Property<Guid>("ProfileId")
                             .HasColumnType("uniqueidentifier");
                         b1.Property<string>("City")
                             .HasColumnType("nvarchar(max)");
                         b1.Property<string>("PostalCode")
                             .HasColumnType("nvarchar(max)");
                         b1.Property<string>("Province")
                             .HasColumnType("nvarchar(max)");
                         b1.Property<string>("Street")
                             .HasColumnType("nvarchar(max)");
                         b1.Property<int?>("Unit")
                             .HasColumnType("int");
                         b1.HasKey("ProfileId");
                         b1.ToTable("Profiles");
                         b1.WithOwner()
                             .HasForeignKey("ProfileId");
                     });
                 b.Navigation("Address");
                 b.Navigation("User");
             });
         modelBuilder.Entity("RoleUser", b =>
             {
                 b.HasOne("Coop.Domain.Entities.Role", null)
                     .WithMany()
                     .HasForeignKey("RolesRoleId")
                     .OnDelete(DeleteBehavior.Cascade)
                     .IsRequired();
                 b.HasOne("Coop.Domain.Entities.User", null)
                     .WithMany()
                     .HasForeignKey("UsersUserId")
                     .OnDelete(DeleteBehavior.Cascade)
                     .IsRequired();
             });
         modelBuilder.Entity("Coop.Domain.Entities.Conversation", b =>
             {
                 b.Navigation("Messages");
             });
         modelBuilder.Entity("Coop.Domain.Entities.Profile", b =>
             {
                 b.Navigation("Messages");
             });
         modelBuilder.Entity("Coop.Domain.Entities.Role", b =>
             {
                 b.Navigation("Privileges");
             });
         modelBuilder.Entity("Coop.Domain.Entities.User", b =>
             {
                 b.Navigation("Profiles");
             });
     }
 }

