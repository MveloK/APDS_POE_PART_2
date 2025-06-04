namespace APDS7311_POE_PART2_ST10076452.Server.Models
{
    public class Employee
    {
        public int Id { get; set; }

        public string EmployeeNumber { get; set; }  

        public string FullName { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }  

        public string Role { get; set; } = "Employee";  

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
