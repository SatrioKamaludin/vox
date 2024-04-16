using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Vox.Server.Services;
using Vox.Server.Exceptions;
using Vox.Server.DTOs.User.RegisterUser;
using Vox.Server.DTOs.User.LoginUser;
using Vox.Server.DTOs.User.UpdateUser;

namespace Vox.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser(RegisterUserDto registerUserDto)
        {
            var registeredUser = await _authService.RegisterUserAsync(registerUserDto);
            return Ok(registeredUser);
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginUser(LoginUserDto loginUserDto)
        {
            var loginResponse = await _authService.LoginUserAsync(loginUserDto);
            if (loginResponse != null)
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, loginResponse.Token)
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                var authProperties = new AuthenticationProperties();

                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity),
                    authProperties);

                return Ok(loginResponse);
            }
            return Unauthorized();
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<RegisteredUserDto>> GetUser(int id)
        {
            foreach (var claim in User.Claims)
            {
                _logger.LogInformation("Claim: {Type} - {Value}", claim.Type, claim.Value);
            }

            var token = User.FindFirstValue(ClaimTypes.NameIdentifier);
            _logger.LogInformation("Token: {Token}", token);
            var user = await _authService.GetUserById(id, token);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto updateUserDto)
        {
            var token = User.FindFirstValue(ClaimTypes.NameIdentifier);
            _logger.LogInformation("Token: {Token}", token);

            await _authService.UpdateUserAsync(id, updateUserDto, token);
            return Ok();
        }

        [HttpPut("users/{id}/password")]
        public async Task<IActionResult> ChangePassword(int id, ChangePasswordDto changePasswordDto)
        {
            var token = User.FindFirstValue(ClaimTypes.NameIdentifier);
            _logger.LogInformation("Token: {Token}", token);

            await _authService.ChangePasswordAsync(id, changePasswordDto, token);
            return Ok();
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var token = User.FindFirstValue(ClaimTypes.NameIdentifier);
            _logger.LogInformation("Token: {Token}", token);

            await _authService.DeleteUserAsync(id, token);
            return NoContent();
        }
    }
}
