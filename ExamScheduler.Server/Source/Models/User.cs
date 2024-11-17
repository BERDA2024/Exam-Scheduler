using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class User
    {
        [Key]
        public int UserID { get; set; }

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(50)]
        public string LastName { get; set; }

        [Required]
        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(20)]
        public string Phone { get; set; }

        [ForeignKey("Institute")]
        public int? InstituteID { get; set; }

        [ForeignKey("Role")]
        public int RoleID { get; set; }

        public virtual Institute Institute { get; set; }
        public virtual Role Role { get; set; }
        public virtual Professor Professor { get; set; }
        public virtual Secretary Secretary { get; set; }
    }
}
