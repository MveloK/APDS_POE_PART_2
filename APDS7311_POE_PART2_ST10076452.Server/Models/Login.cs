using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace APDS7311_POE_PART2_ST10076452.Server.Models
{
    public class Login
    {
        [Key]
        public int Id { get; set; }


        [Required]
        public string accNumber { get; set; }

        [ForeignKey("accNumber")]
        public Users Users { get; set; }

        [Required]
        public string Password { get; set; }

    }
}
