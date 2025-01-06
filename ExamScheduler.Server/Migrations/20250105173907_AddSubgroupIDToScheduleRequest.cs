using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExamScheduler.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddSubgroupIDToScheduleRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SubgroupID",
                table: "ScheduleRequest",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleRequest_StudentID",
                table: "ScheduleRequest",
                column: "StudentID");

            migrationBuilder.AddForeignKey(
                name: "FK_ScheduleRequest_Student_StudentID",
                table: "ScheduleRequest",
                column: "StudentID",
                principalTable: "Student",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ScheduleRequest_Student_StudentID",
                table: "ScheduleRequest");

            migrationBuilder.DropIndex(
                name: "IX_ScheduleRequest_StudentID",
                table: "ScheduleRequest");

            migrationBuilder.DropColumn(
                name: "SubgroupID",
                table: "ScheduleRequest");
        }
    }
}
