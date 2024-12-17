namespace ExamScheduler.Server.Source.Models
{
    public class UserModel
    {
        public required string Id { get; set; }
        public required string Email { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public string? Role {  get; set; }
        public string? Faculty { get; set; }
    }
}
