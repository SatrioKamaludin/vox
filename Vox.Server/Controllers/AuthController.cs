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
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.HttpResults;

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
                return Ok(loginResponse);
            }
            return Unauthorized(new { error = "invalid_credentials" });
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<RegisteredUserDto>> GetUser(int id)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _logger.LogInformation("User ID: {UserId}", id);
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
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _logger.LogInformation("Token: {Token}", token);

            var result = await _authService.UpdateUserAsync(id, updateUserDto, token);
            if (result is ErrorResponse errorResponse)
            {
                return StatusCode(errorResponse.StatusCode, errorResponse);
            }
            else
            {
                return NoContent();
            }
        }

        [HttpPut("users/{id}/password")]
        public async Task<IActionResult> ChangePassword(int id, ChangePasswordDto changePasswordDto)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _logger.LogInformation("Token: {Token}", token);

            var result = await _authService.ChangePasswordAsync(id, changePasswordDto, token);
            if (result is ErrorResponse errorResponse)
            {
                return StatusCode(errorResponse.StatusCode, errorResponse);
            }
            else
            {
                return NoContent();
            }
        }


        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _logger.LogInformation("Token: {Token}", token);

            var result = await _authService.DeleteUserAsync(id, token);
            if (result is ErrorResponse errorResponse)
            {
                return StatusCode(errorResponse.StatusCode, errorResponse);
            }
            else
            {
                return NoContent();
            }
        }
    }
}
