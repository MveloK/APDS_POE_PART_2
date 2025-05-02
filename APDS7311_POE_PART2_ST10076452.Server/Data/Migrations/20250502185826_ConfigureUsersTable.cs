using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APDS7311_POE_PART2_ST10076452.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class ConfigureUsersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_accNumber",
                table: "AspNetUsers",
                column: "accNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_accNumber",
                table: "AspNetUsers");
        }
    }
}
