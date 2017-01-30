using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using MvcTest.Data;

namespace MvcTest.Data.Migrations
{
    [DbContext(typeof(SuiteDbContext))]
    [Migration("20170130144138_CreateSuiteSchema")]
    partial class CreateSuiteSchema
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.0.1")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("MvcTest.Models.Suite", b =>
                {
                    b.Property<int>("SuiteId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.HasKey("SuiteId");

                    b.ToTable("Suites");
                });
        }
    }
}
