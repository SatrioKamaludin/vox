using System.Net.Http.Headers;
using System.Net.Http;
using Vox.Server.DTOs.Organizer;
using Vox.Server.Exceptions;
using System.Net;

namespace Vox.Server.Services
{
    public class OrganizerService : IOrganizerService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<OrganizerService> _logger;

        public OrganizerService(HttpClient httpClient, ILogger<OrganizerService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<OrganizersResponseDto> GetOrganizersAsync(string token, int page = 1, int perPage = 10 )
        {
            _logger.LogInformation("Bearer token: {Token}", token);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync($"https://api-sport-events.php9-01.test.voxteneo.com/api/v1/organizers?page={page}&perPage={perPage}");

            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<OrganizersResponseDto>();
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new ApiException(response.StatusCode, errorContent);
            }
        }

        public async Task<OrganizerDto> GetOrganizerByIdAsync(int id, string token)
        {
            _logger.LogInformation("Bearer token: {Token}", token);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync($"https://api-sport-events.php9-01.test.voxteneo.com/api/v1/organizers/{id}");

            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<OrganizerDto>();
            }
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return null;
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new ApiException(response.StatusCode, errorContent);
            }
        }

        public async Task<OrganizerDto> CreateOrganizerAsync(CreateOrganizerDto createOrganizerDto, string token)
        {
            _logger.LogInformation("Bearer token: {Token}", token);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.PostAsJsonAsync("https://api-sport-events.php9-01.test.voxteneo.com/api/v1/organizers", createOrganizerDto);

            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<OrganizerDto>();
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new ApiException(response.StatusCode, errorContent);
            }
        }

        public async Task UpdateOrganizerAsync(int id, CreateOrganizerDto updateOrganizerDto, string token)
        {
            _logger.LogInformation("Bearer token: {Token}", token);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.PutAsJsonAsync($"https://api-sport-events.php9-01.test.voxteneo.com/api/v1/organizers/{id}", updateOrganizerDto);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new ApiException(response.StatusCode, errorContent);
            }
        }

        public async Task<HttpResponseMessage> DeleteOrganizerAsync(int id, string token)
        {
            _logger.LogInformation("Bearer token: {Token}", token);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.DeleteAsync($"https://api-sport-events.php9-01.test.voxteneo.com/api/v1/organizers/{id}");

            if (response.StatusCode == HttpStatusCode.NotFound || response.IsSuccessStatusCode)
            {
                // Return the response instead of throwing an exception
                return response;
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new ApiException(response.StatusCode, errorContent);
            }
        }

    }
}
