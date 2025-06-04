using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [Required]
        public string accNumber { get; set; }

        [ForeignKey("accNumber")]
        public Users User { get; set; }
    }
}
