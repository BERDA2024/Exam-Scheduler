using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace ExamScheduler.Server.Source.Domain
{
    public class User : IdentityUser
    {

        [Required]
        [StringLength(50)]
        public required string LastName { get; set; }

        [Required]
        [StringLength(50)]
        public required string FirstName { get; set; }

        [ForeignKey("Role")]
        public int RoleID { get; set; }
    }
}
