using System.ComponentModel.DataAnnotations;

namespace APDS7311_POE_PART2_ST10076452.Server.Models
{
    public class LoginUserDto
    {
        [Required]
        public string AccNumber { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class LoginEmployeeDto
    {
        public string EmployeeNumber { get; set; }
        public string Password { get; set; }
    }
}
