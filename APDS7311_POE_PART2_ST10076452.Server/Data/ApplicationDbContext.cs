using APDS7311_POE_PART2_ST10076452.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace APDS7311_POE_PART2_ST10076452.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Users> Users { get; set; }
        public DbSet<Login> Logins { get; set; }
        public DbSet<PaymentRequest> PaymentRequests { get; set; }
        public DbSet<Employee> Employees { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<PaymentRequest>()
                .HasOne(p => p.User)
                .WithMany(u => u.PaymentRequests)
                .HasForeignKey(p => p.accNumber)
                .HasPrincipalKey(u => u.accNumber)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Login>()
                .HasOne(l => l.Users)
                .WithMany(u => u.Logins)
                .HasForeignKey(l => l.accNumber)
                .HasPrincipalKey(u => u.accNumber)
                .OnDelete(DeleteBehavior.Restrict);

            // Unique constraint on Users.accNumber
            builder.Entity<Users>()
                .HasIndex(u => u.accNumber)
                .IsUnique();

            // Field constraints for Users
            builder.Entity<Users>()
                .Property(u => u.fullName)
                .HasMaxLength(50);

            builder.Entity<Users>()
                .Property(u => u.Password)
                .HasMaxLength(100);

            builder.Entity<Employee>()
                .HasIndex(e => e.EmployeeNumber)
                .IsUnique();

            builder.Entity<Employee>()
                .Property(e => e.FullName)
                .HasMaxLength(50);

            builder.Entity<Employee>()
                .Property(e => e.Password)
                .HasMaxLength(100);

            builder.Entity<Employee>().HasData(
                new Employee
                {
                    Id = 1,
                    EmployeeNumber = "EMP001",
                    FullName = "Slindelo Khumalo",
                    Email = "khumalo.slindelo@bank.com",
                    Password = "46e190379edbde8dec03a1d98f5c9443754bed3c",
                    Role = "Employee"
                }
            );
        }
    }
}
