using APDS7311_POE_PART2_ST10076452.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace APDS7311_POE_PART2_ST10076452.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<Users>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // Define DbSet for PaymentRequest
        public DbSet<PaymentRequest> PaymentRequests { get; set; }

        // Override OnModelCreating to configure models and relationships
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure relationship between PaymentRequest and Users
            builder.Entity<PaymentRequest>()
                .HasOne(p => p.User)  // PaymentRequest has one associated User
                .WithMany(u => u.PaymentRequests)  // User can have many PaymentRequests
                .HasForeignKey(p => p.UserId)  // ForeignKey: UserId in PaymentRequest
                .OnDelete(DeleteBehavior.Cascade);  // On deletion of User, cascade delete PaymentRequest

            // Ensure accNumber is unique for Users
            builder.Entity<Users>()
                .HasIndex(u => u.accNumber)
                .IsUnique();  // Enforces uniqueness constraint at the database level

            // Set the max length for fullName
            builder.Entity<Users>()
                .Property(u => u.fullName)
                .HasMaxLength(50); // Example of setting max length for fullName
        }
    }
}
