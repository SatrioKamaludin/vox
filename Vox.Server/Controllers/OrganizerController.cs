using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
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
            var token = User.FindFirstValue(ClaimTypes.NameIdentifier);
            _logger.LogInformation("Token: {Token}", token);

            var organizers = await _organizerService.GetOrganizersAsync(token, page, perPage);
            return Ok(organizers.Data);
        }

        [HttpGet("organizers/{id}")]
        public async Task<IActionResult> GetOrganizerById(int id)
        {
            var token = User.FindFirstValue(ClaimTypes.NameIdentifier);
            _logger.LogInformation("Token: {Token}", token);

            var organizer = await _organizerService.GetOrganizerByIdAsync(id, token);
            return Ok(organizer);
        }

        [HttpPost("organizers")]
        public async Task<IActionResult> CreateOrganizer(CreateOrganizerDto createOrganizerDto)
        {
            var token = User.FindFirstValue(ClaimTypes.NameIdentifier);
            _logger.LogInformation("Token: {Token}", token);

            var newOrganizer = await _organizerService.CreateOrganizerAsync(createOrganizerDto, token);
            return Ok(newOrganizer);
        }

        [HttpPut("organizers/{id}")]
        public async Task<IActionResult> UpdateOrganizer(int id, CreateOrganizerDto updateOrganizerDto)
        {
            var token = User.FindFirstValue(ClaimTypes.NameIdentifier);
            _logger.LogInformation("Token: {Token}", token);

            await _organizerService.UpdateOrganizerAsync(id, updateOrganizerDto, token);
            return NoContent(); // Return 204 No Content status code
        }

        [HttpDelete("organizers/{id}")]
        public async Task<IActionResult> DeleteOrganizer(int id)
        {
            var token = User.FindFirstValue(ClaimTypes.NameIdentifier);
            _logger.LogInformation("Token: {Token}", token);

            await _organizerService.DeleteOrganizerAsync(id, token);
            return NoContent(); // Return 204 No Content status code
        }
    }
}
