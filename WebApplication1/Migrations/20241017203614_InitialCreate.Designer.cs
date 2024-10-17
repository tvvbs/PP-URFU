﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using WebApplication1.Database;

#nullable disable

namespace WebApplication1.Migrations
{
    [DbContext(typeof(PracticeDbContext))]
    [Migration("20241017203614_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("WebApplication1.Database.Company", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Login")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Password")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Companies");
                });

            modelBuilder.Entity("WebApplication1.Database.File", b =>
                {
                    b.Property<Guid?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<byte[]>("Data")
                        .HasColumnType("bytea");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Files");
                });

            modelBuilder.Entity("WebApplication1.Database.Internship", b =>
                {
                    b.Property<Guid?>("Id")
                        .HasColumnType("uuid");

                    b.Property<int?>("Status")
                        .HasColumnType("integer");

                    b.Property<Guid?>("VacancyId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("VacancyId");

                    b.ToTable("Internships");
                });

            modelBuilder.Entity("WebApplication1.Database.Notification", b =>
                {
                    b.Property<Guid?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid?>("Receiver")
                        .HasColumnType("uuid");

                    b.Property<string>("Text")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Notifications");
                });

            modelBuilder.Entity("WebApplication1.Database.ReviewOfStudent", b =>
                {
                    b.Property<Guid?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Comment")
                        .HasColumnType("text");

                    b.Property<Guid?>("InternshipId")
                        .HasColumnType("uuid");

                    b.Property<int?>("Rating")
                        .HasColumnType("integer");

                    b.Property<Guid?>("StudentId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("InternshipId");

                    b.HasIndex("StudentId");

                    b.ToTable("ReviewsOfStudents");
                });

            modelBuilder.Entity("WebApplication1.Database.ReviewOfVacancy", b =>
                {
                    b.Property<Guid?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Comment")
                        .HasColumnType("text");

                    b.Property<int?>("Rating")
                        .HasColumnType("integer");

                    b.Property<Guid?>("StudentId")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("VacancyId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("StudentId");

                    b.HasIndex("VacancyId");

                    b.ToTable("ReviewsOfVacancies");
                });

            modelBuilder.Entity("WebApplication1.Database.Student", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Login")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Password")
                        .HasColumnType("text");

                    b.Property<string>("Patronymic")
                        .HasColumnType("text");

                    b.Property<string>("Surname")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Students");
                });

            modelBuilder.Entity("WebApplication1.Database.Vacancy", b =>
                {
                    b.Property<Guid?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid?>("CompanyId")
                        .HasColumnType("uuid");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<int?>("IncomeRub")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("PositionName")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("Vacancies");
                });

            modelBuilder.Entity("WebApplication1.Database.VacancyResponse", b =>
                {
                    b.Property<Guid?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid?>("ResumeId")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("StatusId")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("StudentId")
                        .HasColumnType("uuid");

                    b.Property<string>("Text")
                        .HasColumnType("text");

                    b.Property<Guid?>("VacancyId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("ResumeId");

                    b.HasIndex("StatusId");

                    b.HasIndex("StudentId");

                    b.HasIndex("VacancyId");

                    b.ToTable("VacancyResponses");
                });

            modelBuilder.Entity("WebApplication1.Database.VacancyResponseStatus", b =>
                {
                    b.Property<Guid?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("VacancyResponsesStatuses");
                });

            modelBuilder.Entity("WebApplication1.Database.Internship", b =>
                {
                    b.HasOne("WebApplication1.Database.Student", "Student")
                        .WithOne("Internship")
                        .HasForeignKey("WebApplication1.Database.Internship", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebApplication1.Database.Vacancy", "Vacancy")
                        .WithMany()
                        .HasForeignKey("VacancyId");

                    b.Navigation("Student");

                    b.Navigation("Vacancy");
                });

            modelBuilder.Entity("WebApplication1.Database.ReviewOfStudent", b =>
                {
                    b.HasOne("WebApplication1.Database.Internship", "Internship")
                        .WithMany()
                        .HasForeignKey("InternshipId");

                    b.HasOne("WebApplication1.Database.Student", "Student")
                        .WithMany()
                        .HasForeignKey("StudentId");

                    b.Navigation("Internship");

                    b.Navigation("Student");
                });

            modelBuilder.Entity("WebApplication1.Database.ReviewOfVacancy", b =>
                {
                    b.HasOne("WebApplication1.Database.Student", "Student")
                        .WithMany()
                        .HasForeignKey("StudentId");

                    b.HasOne("WebApplication1.Database.Vacancy", "Vacancy")
                        .WithMany()
                        .HasForeignKey("VacancyId");

                    b.Navigation("Student");

                    b.Navigation("Vacancy");
                });

            modelBuilder.Entity("WebApplication1.Database.Vacancy", b =>
                {
                    b.HasOne("WebApplication1.Database.Company", "Company")
                        .WithMany()
                        .HasForeignKey("CompanyId");

                    b.Navigation("Company");
                });

            modelBuilder.Entity("WebApplication1.Database.VacancyResponse", b =>
                {
                    b.HasOne("WebApplication1.Database.File", "Resume")
                        .WithMany()
                        .HasForeignKey("ResumeId");

                    b.HasOne("WebApplication1.Database.VacancyResponseStatus", "Status")
                        .WithMany()
                        .HasForeignKey("StatusId");

                    b.HasOne("WebApplication1.Database.Student", "Student")
                        .WithMany()
                        .HasForeignKey("StudentId");

                    b.HasOne("WebApplication1.Database.Vacancy", "Vacancy")
                        .WithMany()
                        .HasForeignKey("VacancyId");

                    b.Navigation("Resume");

                    b.Navigation("Status");

                    b.Navigation("Student");

                    b.Navigation("Vacancy");
                });

            modelBuilder.Entity("WebApplication1.Database.Student", b =>
                {
                    b.Navigation("Internship");
                });
#pragma warning restore 612, 618
        }
    }
}
