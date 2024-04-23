using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Newtonsoft.Json;
using Vox.Server.Services;
using Vox.Server.Exceptions;
using Vox.Server.DTOs.User.RegisterUser;
using Vox.Server.DTOs.User.LoginUser;
using Vox.Server.DTOs.User.UpdateUser;
using Vox.Server.DTOs;
using System.Net;
using Microsoft.AspNetCore.Authorization;

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
            try
            {
                var registeredUser = await _authService.RegisterUserAsync(registerUserDto);
                return Ok(registeredUser);
            }
            catch (Exception ex)
            {
                var errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(ex.Message);
                return StatusCode(errorResponse.StatusCode, errorResponse);
            }
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
            return Unauthorized(new { error = "invalid_credentials" });
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
                return NotFound(new { message = $"No query results for model [App\\User] {id}", status_code = 404 });
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

            var result = await _authService.ChangePasswordAsync(id, changePasswordDto, token);
            if (result is ErrorResponse errorResponse)
            {
                return StatusCode(errorResponse.StatusCode, errorResponse);
            }
            else
            {
                return Ok(result);
            }
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
