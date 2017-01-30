using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace MvcTest.Data.Migrations
{
    public partial class SuiteUsers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserSuite",
                columns: table => new
                {
                    UserSuiteId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AllowedUserId = table.Column<string>(nullable: true),
                    SuiteId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSuite", x => x.UserSuiteId);
                    table.ForeignKey(
                        name: "FK_UserSuite_AspNetUsers_AllowedUserId",
                        column: x => x.AllowedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserSuite_Suites_SuiteId",
                        column: x => x.SuiteId,
                        principalTable: "Suites",
                        principalColumn: "SuiteId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserSuite_AllowedUserId",
                table: "UserSuite",
                column: "AllowedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserSuite_SuiteId",
                table: "UserSuite",
                column: "SuiteId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserSuite");
        }
    }
}
