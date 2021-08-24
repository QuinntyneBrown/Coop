﻿// <auto-generated />
using System;
using Coop.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Coop.Api.Migrations
{
    [DbContext(typeof(CoopDbContext))]
    [Migration("20210823140923_InitialCreate")]
    partial class InitialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
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

            modelBuilder.Entity("Coop.Api.DomainEvents.MaintenanceRequestDomainEvent", b =>
                {
                    b.Property<Guid>("MaintenanceRequestDomainEventId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("Created")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("MaintenanceRequestId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("MaintenanceRequestDomainEventId");

                    b.HasIndex("MaintenanceRequestId");

                    b.ToTable("MaintenanceRequestDomainEvent");
                });

            modelBuilder.Entity("Coop.Api.DomainEvents.NoticeDomainEvent", b =>
                {
                    b.Property<Guid>("NoticeDomainEventId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("Created")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("NoticeId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("NoticeDomainEventId");

                    b.HasIndex("NoticeId");

                    b.ToTable("NoticeDomainEvent");
                });

            modelBuilder.Entity("Coop.Api.Models.Conversation", b =>
                {
                    b.Property<Guid>("ConversationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("Created")
                        .HasColumnType("datetime2");

                    b.HasKey("ConversationId");

                    b.ToTable("Conversations");
                });

            modelBuilder.Entity("Coop.Api.Models.CssCustomProperty", b =>
                {
                    b.Property<Guid>("CssCustomPropertyId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("CssCustomPropertyId");

                    b.ToTable("CssCustomProperties");

                    b.HasDiscriminator<string>("Discriminator").HasValue("CssCustomProperty");
                });

            modelBuilder.Entity("Coop.Api.Models.DigitalAsset", b =>
                {
                    b.Property<Guid>("DigitalAssetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<byte[]>("Bytes")
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("ContentType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("DigitalAssetId");

                    b.ToTable("DigitalAssets");
                });

            modelBuilder.Entity("Coop.Api.Models.Document", b =>
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

            modelBuilder.Entity("Coop.Api.Models.Fragment", b =>
                {
                    b.Property<Guid>("FragmentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("HtmlContentId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("FragmentId");

                    b.HasIndex("HtmlContentId");

                    b.ToTable("Fragments");
                });

            modelBuilder.Entity("Coop.Api.Models.HtmlContent", b =>
                {
                    b.Property<Guid>("HtmlContentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Body")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Component")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PageName")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("HtmlContentId");

                    b.ToTable("HtmlContents");
                });

            modelBuilder.Entity("Coop.Api.Models.ImageContent", b =>
                {
                    b.Property<Guid>("ImageContentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("DigitalAssetId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ImageContentId");

                    b.ToTable("ImageContents");
                });

            modelBuilder.Entity("Coop.Api.Models.JsonContent", b =>
                {
                    b.Property<Guid>("JsonContentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("FragmentId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Json")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid?>("JsonContentTypeId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("JsonContentId");

                    b.HasIndex("FragmentId");

                    b.HasIndex("JsonContentTypeId");

                    b.ToTable("JsonContents");
                });

            modelBuilder.Entity("Coop.Api.Models.JsonContentModel", b =>
                {
                    b.Property<Guid>("JsonContentModelId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("JsonContentModelId");

                    b.ToTable("JsonContentModels");
                });

            modelBuilder.Entity("Coop.Api.Models.JsonContentType", b =>
                {
                    b.Property<Guid>("JsonContentTypeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("Multi")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("JsonContentTypeId");

                    b.ToTable("JsonContentTypes");
                });

            modelBuilder.Entity("Coop.Api.Models.MaintenanceRequest", b =>
                {
                    b.Property<Guid>("MaintenanceRequestId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("CreatedById")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("MaintenanceRequestId");

                    b.ToTable("MaintenanceRequests");
                });

            modelBuilder.Entity("Coop.Api.Models.Message", b =>
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

            modelBuilder.Entity("Coop.Api.Models.Privilege", b =>
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

            modelBuilder.Entity("Coop.Api.Models.Profile", b =>
                {
                    b.Property<Guid>("ProfileId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("AvatarDigitalAssetId")
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

                    b.Property<Guid>("PublicAvatarDigitalAssetId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.Property<Guid?>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("ProfileId");

                    b.HasIndex("UserId");

                    b.ToTable("Profiles");

                    b.HasDiscriminator<string>("Discriminator").HasValue("Profile");
                });

            modelBuilder.Entity("Coop.Api.Models.Role", b =>
                {
                    b.Property<Guid>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("RoleId");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("Coop.Api.Models.User", b =>
                {
                    b.Property<Guid>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("CurrentProfileId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("DefaultProfileId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(max)");

                    b.Property<byte[]>("Salt")
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("Username")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId");

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

            modelBuilder.Entity("Coop.Api.Models.ProfileCssCustomProperty", b =>
                {
                    b.HasBaseType("Coop.Api.Models.CssCustomProperty");

                    b.Property<Guid>("ProfileCssCustomPropertyId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("ProfileId")
                        .HasColumnType("uniqueidentifier");

                    b.HasDiscriminator().HasValue("ProfileCssCustomProperty");
                });

            modelBuilder.Entity("Coop.Api.Models.ByLaw", b =>
                {
                    b.HasBaseType("Coop.Api.Models.Document");

                    b.Property<Guid>("ByLawId")
                        .HasColumnType("uniqueidentifier");

                    b.HasDiscriminator().HasValue("ByLaw");
                });

            modelBuilder.Entity("Coop.Api.Models.Notice", b =>
                {
                    b.HasBaseType("Coop.Api.Models.Document");

                    b.Property<string>("Body")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("NoticeId")
                        .HasColumnType("uniqueidentifier");

                    b.HasDiscriminator().HasValue("Notice");
                });

            modelBuilder.Entity("Coop.Api.Models.Report", b =>
                {
                    b.HasBaseType("Coop.Api.Models.Document");

                    b.Property<Guid>("ReportId")
                        .HasColumnType("uniqueidentifier");

                    b.HasDiscriminator().HasValue("Report");
                });

            modelBuilder.Entity("Coop.Api.Models.BoardMember", b =>
                {
                    b.HasBaseType("Coop.Api.Models.Profile");

                    b.Property<Guid>("BoardMemberId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("BoardTitle")
                        .HasColumnType("nvarchar(max)");

                    b.HasDiscriminator().HasValue("BoardMember");
                });

            modelBuilder.Entity("Coop.Api.Models.Member", b =>
                {
                    b.HasBaseType("Coop.Api.Models.Profile");

                    b.Property<Guid>("MemberId")
                        .HasColumnType("uniqueidentifier");

                    b.HasDiscriminator().HasValue("Member");
                });

            modelBuilder.Entity("Coop.Api.Models.StaffMember", b =>
                {
                    b.HasBaseType("Coop.Api.Models.Profile");

                    b.Property<string>("JobTitle")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("StaffMemberId")
                        .HasColumnType("uniqueidentifier");

                    b.HasDiscriminator().HasValue("StaffMember");
                });

            modelBuilder.Entity("ConversationProfile", b =>
                {
                    b.HasOne("Coop.Api.Models.Conversation", null)
                        .WithMany()
                        .HasForeignKey("ConversationsConversationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Coop.Api.Models.Profile", null)
                        .WithMany()
                        .HasForeignKey("ProfilesProfileId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Coop.Api.DomainEvents.MaintenanceRequestDomainEvent", b =>
                {
                    b.HasOne("Coop.Api.Models.MaintenanceRequest", null)
                        .WithMany("Events")
                        .HasForeignKey("MaintenanceRequestId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Coop.Api.DomainEvents.NoticeDomainEvent", b =>
                {
                    b.HasOne("Coop.Api.Models.Notice", null)
                        .WithMany("Events")
                        .HasForeignKey("NoticeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Coop.Api.Models.Fragment", b =>
                {
                    b.HasOne("Coop.Api.Models.HtmlContent", "HtmlContent")
                        .WithMany()
                        .HasForeignKey("HtmlContentId");

                    b.Navigation("HtmlContent");
                });

            modelBuilder.Entity("Coop.Api.Models.JsonContent", b =>
                {
                    b.HasOne("Coop.Api.Models.Fragment", null)
                        .WithMany("JsonContents")
                        .HasForeignKey("FragmentId");

                    b.HasOne("Coop.Api.Models.JsonContentType", null)
                        .WithMany("JsonContents")
                        .HasForeignKey("JsonContentTypeId");
                });

            modelBuilder.Entity("Coop.Api.Models.MaintenanceRequest", b =>
                {
                    b.OwnsMany("Coop.Api.Models.MaintenanceRequestComment", "Comments", b1 =>
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

                    b.OwnsMany("Coop.Api.Models.MaintenanceRequestDigitalAsset", "DigitalAssets", b1 =>
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

                    b.Navigation("Comments");

                    b.Navigation("DigitalAssets");
                });

            modelBuilder.Entity("Coop.Api.Models.Message", b =>
                {
                    b.HasOne("Coop.Api.Models.Conversation", null)
                        .WithMany("Messages")
                        .HasForeignKey("ConversationId");

                    b.HasOne("Coop.Api.Models.Profile", null)
                        .WithMany("Messages")
                        .HasForeignKey("ProfileId");
                });

            modelBuilder.Entity("Coop.Api.Models.Privilege", b =>
                {
                    b.HasOne("Coop.Api.Models.Role", null)
                        .WithMany("Privileges")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Coop.Api.Models.Profile", b =>
                {
                    b.HasOne("Coop.Api.Models.User", "User")
                        .WithMany("Profiles")
                        .HasForeignKey("UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("RoleUser", b =>
                {
                    b.HasOne("Coop.Api.Models.Role", null)
                        .WithMany()
                        .HasForeignKey("RolesRoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Coop.Api.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UsersUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Coop.Api.Models.Conversation", b =>
                {
                    b.Navigation("Messages");
                });

            modelBuilder.Entity("Coop.Api.Models.Fragment", b =>
                {
                    b.Navigation("JsonContents");
                });

            modelBuilder.Entity("Coop.Api.Models.JsonContentType", b =>
                {
                    b.Navigation("JsonContents");
                });

            modelBuilder.Entity("Coop.Api.Models.MaintenanceRequest", b =>
                {
                    b.Navigation("Events");
                });

            modelBuilder.Entity("Coop.Api.Models.Profile", b =>
                {
                    b.Navigation("Messages");
                });

            modelBuilder.Entity("Coop.Api.Models.Role", b =>
                {
                    b.Navigation("Privileges");
                });

            modelBuilder.Entity("Coop.Api.Models.User", b =>
                {
                    b.Navigation("Profiles");
                });

            modelBuilder.Entity("Coop.Api.Models.Notice", b =>
                {
                    b.Navigation("Events");
                });
#pragma warning restore 612, 618
        }
    }
}
