using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExamScheduler.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddExamDetailsToScheduleRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ExamDuration",
                table: "ScheduleRequest",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ExamType",
                table: "ScheduleRequest",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RejectionReason",
                table: "ScheduleRequest",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExamDuration",
                table: "ScheduleRequest");

            migrationBuilder.DropColumn(
                name: "ExamType",
                table: "ScheduleRequest");

            migrationBuilder.DropColumn(
                name: "RejectionReason",
                table: "ScheduleRequest");
        }
    }
}
