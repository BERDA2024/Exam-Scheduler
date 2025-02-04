﻿using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class StudentModel
    {
        public int Id { get; set; } // ID pentru identificare

        [Required(ErrorMessage = "UserId is required.")]
        public string UserId { get; set; } = string.Empty; // ID-ul utilizatorului asociat

        public int? SubgroupID { get; set; } // ID-ul subgrupului asociat (poate fi null)
    }
}
