using APDS7311_POE_PART2_ST10076452.Server.Data;
using APDS7311_POE_PART2_ST10076452.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace APDS7311_POE_PART2_ST10076452.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SecureWebsiteController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly PasswordHasher<Users> _passwordHasher;

        public SecureWebsiteController(ApplicationDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<Users>();
        }

        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser([FromBody] RegisterUserDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Invalid input.",
                    errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                });
            }

            try
            {
                if (await _context.Users.AnyAsync(u => u.accNumber == dto.AccNumber))
                    return BadRequest(new { message = "Account number already registered." });

                var newUser = new Users
                {
                    fullName = dto.FullName,
                    accNumber = dto.AccNumber,
                    idNumber = dto.IdNumber
                };

                newUser.Password = _passwordHasher.HashPassword(newUser, dto.Password);

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                return Ok(new { message = "You're now registered!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Registration error: " + ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult> LoginUser([FromBody] LoginUserDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Invalid input.",
                    errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                });
            }

            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.accNumber == dto.AccNumber);
                if (user == null)
                    return Unauthorized(new { message = "Account number or password is incorrect." });

                var result = _passwordHasher.VerifyHashedPassword(user, user.Password, dto.Password);
                if (result == PasswordVerificationResult.Failed)
                    return Unauthorized(new { message = "Account number or password is incorrect." });

                return Ok(new { message = $"Welcome, {user.fullName}! Login successful.", accNumber = user.accNumber });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Login error: " + ex.Message });
            }
        }

        [HttpPost("employee-login")]
        public async Task<ActionResult> LoginEmployee([FromBody] LoginEmployeeDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Invalid input.",
                    errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                });
            }

            try
            {
                var employee = await _context.Employees.FirstOrDefaultAsync(e => e.EmployeeNumber == dto.EmployeeNumber);
                if (employee == null)
                    return Unauthorized(new { message = "Employee number or password is incorrect." });

                var empHasher = new PasswordHasher<Employee>();
                var result = empHasher.VerifyHashedPassword(employee, employee.Password, dto.Password);

                if (result == PasswordVerificationResult.Failed)
                    return Unauthorized(new { message = "Employee number or password is incorrect." });

                return Ok(new
                {
                    message = $"Welcome, {employee.FullName}! Employee login successful.",
                    employee.EmployeeNumber,
                    employee.Role
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Login error: " + ex.Message });
            }
        }

        [HttpPost("makepayment"), Authorize]
        public async Task<ActionResult> MakePayment([FromBody] PaymentRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.AccountNumber) || string.IsNullOrWhiteSpace(request.SwiftCode))
                {
                    return BadRequest(new { message = "Account number and SWIFT code are required." });
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated." });
                }

                request.accNumber = userId;
                request.DateCreated = DateTime.UtcNow;

                _context.PaymentRequests.Add(request);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Payment successful",
                    transactionId = request.Id,
                    date = request.DateCreated
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Payment processing failed. " + ex.Message });
            }
        }

        [HttpGet("checkuser"), Authorize]
        public async Task<ActionResult> CheckUser()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null)
                    return Unauthorized(new { message = "User not authenticated." });

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    return NotFound(new { message = "User not found." });

                return Ok(new { message = "User is logged in.", user });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error checking user: " + ex.Message });
            }
        }

        [HttpGet("logout"), Authorize]
        public ActionResult LogoutUser()
        {
            return Ok(new { message = "Logged out successfully." });
        }

        [HttpGet("employee/{employeeNumber}")]
        public async Task<ActionResult> GetEmployeeByNumber(string employeeNumber)
        {
            try
            {
                var employee = await _context.Employees
                    .Where(e => e.EmployeeNumber == employeeNumber)
                    .Select(e => new
                    {
                        e.EmployeeNumber,
                        e.FullName,
                        e.Email,
                        e.Role,
                        e.CreatedAt
                    })
                    .FirstOrDefaultAsync();

                if (employee == null)
                    return NotFound(new { message = "Employee not found." });

                return Ok(employee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching employee: " + ex.Message });
            }
        }
    }

    public class RegisterUserDto
    {
        public string FullName { get; set; }
        public string AccNumber { get; set; }
        public string Password { get; set; }
        public int IdNumber { get; set; }
    }

    public class LoginUserDto
    {
        public string AccNumber { get; set; }
        public string Password { get; set; }
    }

    public class LoginEmployeeDto
    {
        public string EmployeeNumber { get; set; }
        public string Password { get; set; }
    }
}
