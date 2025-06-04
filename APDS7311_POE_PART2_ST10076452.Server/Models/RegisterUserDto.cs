using System.ComponentModel.DataAnnotations;

namespace APDS7311_POE_PART2_ST10076452.Server.Models
{
    public class RegisterUserDto
    {
        [Required]
        public string FullName { get; set; }

        [Required]
        public int IdNumber { get; set; }

        [Required]
        public string AccNumber { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
