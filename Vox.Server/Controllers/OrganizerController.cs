using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;
using Vox.Server.DTOs;
using Vox.Server.DTOs.Organizer;
using Vox.Server.Services;

namespace Vox.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizerController : ControllerBase
    {
        private readonly IOrganizerService _organizerService;
        private readonly ILogger<OrganizerController> _logger;

        public OrganizerController(IOrganizerService organizerService, ILogger<OrganizerController> logger)
        {
            _organizerService = organizerService;
            _logger = logger;
        }

        [HttpGet("organizers")]
        public async Task<IActionResult> GetOrganizers([FromQuery] int page = 1, [FromQuery] int perPage = 10)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _logger.LogInformation("Token: {Token}", token);

            var organizers = await _organizerService.GetOrganizersAsync(token, page, perPage);
            return Ok(organizers);
        }

        [HttpGet("organizers/{id}")]
        public async Task<IActionResult> GetOrganizerById(int id)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _logger.LogInformation("Token: {Token}", token);

            var organizer = await _organizerService.GetOrganizerByIdAsync(id, token);
            if (organizer == null)
            {
                return NotFound(new { message = $"No query results for model [App\\Organizer] {id}", status_code = 404 });
            }
            return Ok(organizer);
        }

        [HttpPost("organizers")]
        public async Task<IActionResult> CreateOrganizer(CreateOrganizerDto createOrganizerDto)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _logger.LogInformation("Token: {Token}", token);

            var newOrganizer = await _organizerService.CreateOrganizerAsync(createOrganizerDto, token);
            return Ok(newOrganizer);
        }

        [HttpPut("organizers/{id}")]
        public async Task<IActionResult> UpdateOrganizer(int id, CreateOrganizerDto updateOrganizerDto)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _logger.LogInformation("Token: {Token}", token);

            var result = await _organizerService.UpdateOrganizerAsync(id, updateOrganizerDto, token);
            if (result is ErrorResponse errorResponse)
            {
                return StatusCode(errorResponse.StatusCode, errorResponse);
            }
            else
            {
                return NoContent();
            }
        }

        [HttpDelete("organizers/{id}")]
        public async Task<IActionResult> DeleteOrganizer(int id)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _logger.LogInformation("Token: {Token}", token);

            var response = await _organizerService.DeleteOrganizerAsync(id, token);
            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return NotFound(new { message = $"No query results for model [App\\Organizer] {id}", status_code = 404 });
            }
            else if (response.IsSuccessStatusCode)
            {
                return NoContent(); // Return 204 No Content status code
            }
            else
            {
                // Handle other error responses here
                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
            }
        }
    }
}
