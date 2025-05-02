using System.ComponentModel.DataAnnotations;

namespace APDS7311_POE_PART2_ST10076452.Server.Models
{
    public class PaymentRequest
    {
        public int Id { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public string Currency { get; set; }

        [Required]
        public string Provider { get; set; }

        [Required]
        public string AccountNumber { get; set; }

        [Required]
        public string SwiftCode { get; set; }

        public DateTime DateCreated { get; set; } = DateTime.UtcNow;

        // Add this to associate with the logged-in user
        public string UserId { get; set; }
        public Users User { get; set; }
    }
}
