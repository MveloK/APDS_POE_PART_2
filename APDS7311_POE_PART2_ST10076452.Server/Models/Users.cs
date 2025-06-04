using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace APDS7311_POE_PART2_ST10076452.Server.Models
{
    public class Users
    {
        [Required]
        [MaxLength(50)]
        public string fullName { get; set; }

        [Required]
        public int idNumber { get; set; }

        [Key] 
        [Required]
        [MaxLength(20)]
        public string accNumber { get; set; }

        [Required]
        [MaxLength(100)]
        public string Password { get; set; } 

        // Navigation properties
        public ICollection<PaymentRequest> PaymentRequests { get; set; }
        public ICollection<Login> Logins { get; set; }
    }
}
