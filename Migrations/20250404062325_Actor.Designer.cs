﻿// <auto-generated />
using System;
using DoAnTotNghiep.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DoAnTotNghiep.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    [Migration("20250404062325_Actor")]
    partial class Actor
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("DoAnTotNghiep.Model.Account", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<int>("Age")
                        .HasColumnType("int");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("VARCHAR(255)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("VARCHAR(255)");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasColumnType("VARCHAR(255)");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("VARCHAR(255)");

                    b.HasKey("Id");

                    b.ToTable("Account", (string)null);
                });

            modelBuilder.Entity("DoAnTotNghiep.Model.Actor", b =>
                {
                    b.Property<string>("IdActor")
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("IdActor");

                    b.Property<string>("ActorName")
                        .IsRequired()
                        .HasColumnType("VARCHAR(350)")
                        .HasColumnName("ActorName");

                    b.Property<string>("BirthDay")
                        .IsRequired()
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("Birthday");

                    b.HasKey("IdActor");

                    b.ToTable("Actor", (string)null);
                });

            modelBuilder.Entity("DoAnTotNghiep.Model.AppUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("integer");

                    b.Property<int?>("Age")
                        .HasColumnType("integer");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("text");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("DoAnTotNghiep.Model.Category", b =>
                {
                    b.Property<string>("IdCategories")
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("IdCategories");

                    b.Property<string>("NameCategories")
                        .IsRequired()
                        .HasColumnType("VARCHAR(200)")
                        .HasColumnName("NameCategories");

                    b.Property<string>("SlugNameCategories")
                        .IsRequired()
                        .HasColumnType("VARCHAR(200)")
                        .HasColumnName("SlugNameCategories");

                    b.HasKey("IdCategories");

                    b.ToTable("Category", (string)null);
                });

            modelBuilder.Entity("DoAnTotNghiep.Model.Comment", b =>
                {
                    b.Property<string>("IdComment")
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("IdComment");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("VARCHAR(400)")
                        .HasColumnName("Content");

                    b.Property<string>("IdMovie")
                        .IsRequired()
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("IdMovie");

                    b.Property<string>("IdUserName")
                        .IsRequired()
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("IdUserName");

                    b.Property<string>("TimeComment")
                        .IsRequired()
                        .HasColumnType("VARCHAR(150)")
                        .HasColumnName("TimeComment");

                    b.HasKey("IdComment");

                    b.HasIndex("IdMovie");

                    b.ToTable("Comment", (string)null);
                });

            modelBuilder.Entity("DoAnTotNghiep.Model.LinkMovie", b =>
                {
                    b.Property<string>("IdLinkMovie")
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("IdLinkMovie");

                    b.Property<int>("Episode")
                        .HasColumnType("integer")
                        .HasColumnName("Episode");

                    b.Property<string>("IdMovie")
                        .IsRequired()
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("IdMovie");

                    b.Property<string>("UrlMovie")
                        .IsRequired()
                        .HasColumnType("VARCHAR(400)")
                        .HasColumnName("UrlMovie");

                    b.HasKey("IdLinkMovie");

                    b.HasIndex("IdMovie");

                    b.ToTable("LinkMovie", (string)null);
                });

            modelBuilder.Entity("DoAnTotNghiep.Model.Movie", b =>
                {
                    b.Property<string>("IdMovie")
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("Id");

                    b.Property<string>("BackgroundImage")
                        .IsRequired()
                        .HasColumnType("VARCHAR(500)")
                        .HasColumnName("BackgroundImage");

                    b.Property<bool>("Block")
                        .HasColumnType("boolean")
                        .HasColumnName("Block");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("VARCHAR(1500)")
                        .HasColumnName("Description");

                    b.Property<int>("Duration")
                        .HasColumnType("integer")
                        .HasColumnName("Duration");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasColumnType("VARCHAR(500)")
                        .HasColumnName("Image");

                    b.Property<bool>("IsVip")
                        .HasColumnType("boolean")
                        .HasColumnName("IsVip");

                    b.Property<string>("Language")
                        .IsRequired()
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("Language");

                    b.Property<string>("NameDirector")
                        .IsRequired()
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("NameActor");

                    b.Property<string>("Nation")
                        .IsRequired()
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("Nation");

                    b.Property<int>("NumberOfMovie")
                        .HasColumnType("integer")
                        .HasColumnName("NumberOfMovie");

                    b.Property<string>("Quality")
                        .IsRequired()
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("Quality");

                    b.Property<string>("SlugNation")
                        .IsRequired()
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("SlugNation");

                    b.Property<string>("SlugTitle")
                        .IsRequired()
                        .HasColumnType("VARCHAR(255)")
                        .HasColumnName("SlugTitle");

                    b.Property<string>("SlugTypeMovie")
                        .IsRequired()
                        .HasColumnType("VARCHAR(100)")
                        .HasColumnName("SlugTypeMovie");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("Status");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("VARCHAR(255)")
                        .HasColumnName("Title");

                    b.Property<string>("TypeMovie")
                        .IsRequired()
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("TypeMovie");

                    b.Property<int>("View")
                        .HasColumnType("integer")
                        .HasColumnName("View");

                    b.HasKey("IdMovie");

                    b.ToTable("Movie", (string)null);
                });

            modelBuilder.Entity("DoAnTotNghiep.Model.Report", b =>
                {
                    b.Property<string>("IdReport")
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("IdReport");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("VARCHAR(250)")
                        .HasColumnName("Content");

                    b.Property<string>("IdMovie")
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("IdMovie");

                    b.Property<string>("Response")
                        .HasColumnType("VARCHAR(250)")
                        .HasColumnName("Response");

                    b.Property<int>("Status")
                        .HasColumnType("integer")
                        .HasColumnName("Status");

                    b.Property<string>("TimeReport")
                        .IsRequired()
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("TimeReport");

                    b.Property<string>("TimeResponse")
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("TimeResponse");

                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("UserNameAdminFix")
                        .HasColumnType("VARCHAR(50)")
                        .HasColumnName("UserNameAdminFix");

                    b.Property<string>("UserNameReporter")
                        .IsRequired()
                        .HasColumnType("VARCHAR(150)")
                        .HasColumnName("UserNameReporter");

                    b.HasKey("IdReport");

                    b.HasIndex("IdMovie");

                    b.HasIndex("UserId");

                    b.ToTable("Report", (string)null);
                });

            modelBuilder.Entity("DoAnTotNghiep.Model.SubActor", b =>
                {
                    b.Property<string>("IdMovie")
                        .HasColumnType("VARCHAR(50)");

                    b.Property<string>("IdActor")
                        .HasColumnType("VARCHAR(50)");

                    b.HasKey("IdMovie", "IdActor");

                    b.HasIndex("IdActor");

                    b.ToTable("SubActor", (string)null);
                });

            modelBuilder.Entity("DoAnTotNghiep.Model.SubCategory", b =>
                {
                    b.Property<string>("IdMovie")
                        .HasColumnType("VARCHAR(50)");

                    b.Property<string>("IdCategory")
                        .HasColumnType("VARCHAR(50)");

                    b.HasKey("IdMovie", "IdCategory");

                    b.HasIndex("IdCategory");

                    b.ToTable("SubCategories");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex");

                    b.ToTable("AspNetRoles", (string)null);

                    b.HasData(
                        new
                        {
                            Id = "305456bd-48de-4010-9e85-a3da28ec18d4",
                            Name = "Admin",
                            NormalizedName = "ADMIN"
                        },
                        new
                        {
                            Id = "7a02e8a0-f90d-4dd6-9e48-a1255d9e69e8",
                            Name = "User",
                            NormalizedName = "USER"
                        });
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("text");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("RoleId")
                        .HasColumnType("text");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Value")
                        .HasColumnType("text");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("DoAnTotNghiep.Model.Comment", b =>
                {
                    b.HasOne("DoAnTotNghiep.Model.Movie", "Movie")
                        .WithMany("Comments")
                        .HasForeignKey("IdMovie")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Movie");
                });

            modelBuilder.Entity("DoAnTotNghiep.Model.LinkMovie", b =>
                {
                    b.HasOne("DoAnTotNghiep.Model.Movie", "Movie")
                        .WithMany("LinkMovies")
                        .HasForeignKey("IdMovie")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Movie");
                });

            modelBuilder.Entity("DoAnTotNghiep.Model.Report", b =>
                {
                    b.HasOne("DoAnTotNghiep.Model.Movie", "Movie")
                        .WithMany("Reports")
                        .HasForeignKey("IdMovie");

                    b.HasOne("DoAnTotNghiep.Model.AppUser", "User")
                        .WithMany()
                        .HasForeignKey("UserId");

                    b.Navigation("Movie");

                    b.Navigation("User");
                });

            modelBuilder.Entity("DoAnTotNghiep.Model.SubActor", b =>
                {
                    b.HasOne("DoAnTotNghiep.Model.Actor", "Actor")
                        .WithMany("SubActors")
                        .HasForeignKey("IdActor")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DoAnTotNghiep.Model.Movie", "Movie")
                        .WithMany("SubActors")
                        .HasForeignKey("IdMovie")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Actor");

                    b.Navigation("Movie");
                });

            modelBuilder.Entity("DoAnTotNghiep.Model.SubCategory", b =>
                {
                    b.HasOne("DoAnTotNghiep.Model.Category", "Category")
                        .WithMany("SubCategories")
                        .HasForeignKey("IdCategory")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DoAnTotNghiep.Model.Movie", "Movie")
                        .WithMany("SubCategories")
                        .HasForeignKey("IdMovie")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Category");

                    b.Navigation("Movie");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("DoAnTotNghiep.Model.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("DoAnTotNghiep.Model.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DoAnTotNghiep.Model.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("DoAnTotNghiep.Model.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("DoAnTotNghiep.Model.Actor", b =>
                {
                    b.Navigation("SubActors");
                });

            modelBuilder.Entity("DoAnTotNghiep.Model.Category", b =>
                {
                    b.Navigation("SubCategories");
                });

            modelBuilder.Entity("DoAnTotNghiep.Model.Movie", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("LinkMovies");

                    b.Navigation("Reports");

                    b.Navigation("SubActors");

                    b.Navigation("SubCategories");
                });
#pragma warning restore 612, 618
        }
    }
}
