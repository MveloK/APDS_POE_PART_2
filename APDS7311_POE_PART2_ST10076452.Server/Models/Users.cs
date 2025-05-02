using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace APDS7311_POE_PART2_ST10076452.Server.Models
{
    public class Users : IdentityUser
    {
        [MaxLength(50)]
        public string fullName { get; set; }

        [Required]
        public int idNumber { get; set; }

        [Required]
        [MaxLength(20)]
        public string accNumber { get; set; }

        // Navigation property to PaymentRequests (reverse navigation)
        public ICollection<PaymentRequest> PaymentRequests { get; set; }
    }

}
