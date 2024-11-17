using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Entities
{
    public class Country
    {
        [Key]
        public int CountryID { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        public virtual ICollection<Address> Addresses { get; set; }
    }
}
