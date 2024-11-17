using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamScheduler.Server.Source.Entities
{
    public class Address
    {
        [Key]
        public int AddressID { get; set; }

        [ForeignKey("Country")]
        public int CountryID { get; set; }

        [Required]
        [StringLength(255)]
        public string Location { get; set; }

        public virtual Country Country { get; set; }
        public virtual ICollection<Institute> Institutes { get; set; }
    }
}
