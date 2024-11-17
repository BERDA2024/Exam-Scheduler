using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class Institute
    {
        [Key]
        public int InstituteID { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [ForeignKey("Address")]
        public int AddressID { get; set; }

        public virtual Address Address { get; set; }
        public virtual ICollection<User> Users { get; set; }
    }
}
