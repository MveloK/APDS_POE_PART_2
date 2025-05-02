using APDS7311_POE_PART2_ST10076452.Server.Data;
using APDS7311_POE_PART2_ST10076452.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace APDS7311_POE_PART2_ST10076452.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SecureWebsiteController : ControllerBase
    {
        private readonly SignInManager<Users> _signInManager;
        private readonly UserManager<Users> _userManager;
        private readonly ApplicationDbContext _context;

        public SecureWebsiteController(SignInManager<Users> signInManager, UserManager<Users> userManager, ApplicationDbContext context)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _context = context;
        }

        // Register User
        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser()
        {
            string message = "";
            IdentityResult result;

            try
            {
                using var reader = new StreamReader(Request.Body);
                var body = await reader.ReadToEndAsync();

                var json = JsonDocument.Parse(body).RootElement;

                var newUser = new Users
                {
                    fullName = json.GetProperty("fullName").GetString(),
                    accNumber = json.GetProperty("accNumber").GetString(),
                    idNumber = json.GetProperty("idNumber").GetInt32(),
                    UserName = json.GetProperty("accNumber").GetString()  // UserName is set to accNumber
                };

                var password = json.GetProperty("Password").GetString(); // Corrected to "Password"

                // Create the new user in the Identity system
                result = await _userManager.CreateAsync(newUser, password);

                if (!result.Succeeded)
                {
                    return BadRequest(new
                    {
                        message = "Registration failed.",
                        errors = result.Errors.Select(e => e.Description).ToList()
                    });
                }

                message = "You're now registered!";
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "There is a problem with registering. Please try again. " + ex.Message });
            }

            return Ok(new { message });
        }

        // Login User
        [HttpPost("login")]
        public async Task<ActionResult> LoginUser()
        {
            string message = "";

            try
            {
                // Read the login details from the request body
                using var reader = new StreamReader(Request.Body);
                var body = await reader.ReadToEndAsync();
                var json = JsonDocument.Parse(body).RootElement;

                var accNumber = json.GetProperty("accNumber").GetString();
                var password = json.GetProperty("Password").GetString();

                // Find the user by account number
                var user = await _userManager.Users.FirstOrDefaultAsync(u => u.accNumber == accNumber);

                if (user == null)
                    return Unauthorized("Account number or password is wrong, try again.");

                // Attempt to sign the user in
                var result = await _signInManager.PasswordSignInAsync(user.UserName, password, false, false);

                if (!result.Succeeded)
                    return Unauthorized("Account number or password is wrong, try again.");

                message = "Welcome, your login was successful!";
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "There is a problem with logging in. Please try again. " + ex.Message });
            }

            return Ok(new { message });
        }

        // Logout User
        [HttpGet("logout"), Authorize]
        public async Task<ActionResult> LogoutUser()
        {
            string message = "Have a good day, Goodbye!";

            try
            {
                await _signInManager.SignOutAsync();
            }
            catch (Exception ex)
            {
                return BadRequest("Something has gone wrong. Please try again. " + ex.Message);
            }

            return Ok(new { message });
        }

        // Check User
        [HttpGet("cookies"), Authorize]
        public async Task<ActionResult> CheckUser()
        {
            string message = "Logged in";
            Users currentUser = new();

            try
            {
                var userPrincipal = HttpContext.User;

                if (_signInManager.IsSignedIn(userPrincipal))
                {
                    currentUser = await _signInManager.UserManager.GetUserAsync(userPrincipal);
                }
                else
                {
                    return Forbid("Access Denied");
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Something went wrong, please try again. " + ex.Message);
            }

            return Ok(new { message, user = currentUser });
        }

        // Make Payment
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

                request.UserId = userId;
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
    }
}
