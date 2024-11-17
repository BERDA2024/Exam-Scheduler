using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Entities
{
    public class Secretary
    {
        [Key]
        public int SecretaryID { get; set; }

        [ForeignKey("User ")]
        public int UserID { get; set; }

        public virtual User User { get; set; }
    }
}
