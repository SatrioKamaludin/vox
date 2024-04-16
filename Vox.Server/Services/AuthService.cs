using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Net.Http.Headers;
using Vox.Server.DTOs.User.LoginUser;
using Vox.Server.DTOs.User.RegisterUser;
using Vox.Server.DTOs.User.UpdateUser;
using Vox.Server.Exceptions;

namespace Vox.Server.Services
{
    public class AuthService : IAuthService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<AuthService> _logger;

        public AuthService(HttpClient httpClient, ILogger<AuthService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<RegisteredUserDto> RegisterUserAsync(RegisterUserDto registerUserDto)
        {
            var response = await _httpClient.PostAsJsonAsync("https://api-sport-events.php9-01.test.voxteneo.com/api/v1/users", registerUserDto);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<RegisteredUserDto>();
        }

        public async Task<LoginResponseDto> LoginUserAsync(LoginUserDto loginUserDto)
        {
            var response = await _httpClient.PostAsJsonAsync("https://api-sport-events.php9-01.test.voxteneo.com/api/v1/users/login", loginUserDto);
            if (response.IsSuccessStatusCode) {
                return await response.Content.ReadFromJsonAsync<LoginResponseDto>();
            } 
            else
            {
                // Handle error responses here
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new ApiException(response.StatusCode, errorContent);
            }    
        }

        public async Task<RegisteredUserDto> GetUserById(int id, string token)
        {
            // Log the bearer token
            _logger.LogInformation("Bearer token: {Token}", token);

            // Include the bearer token in the request headers
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Call the external API with the token included in the headers
            var response = await _httpClient.GetAsync($"https://api-sport-events.php9-01.test.voxteneo.com/api/v1/users/{id}");
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<RegisteredUserDto>();
            }
            else
            {
                // Handle error responses here
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new ApiException(response.StatusCode, errorContent);
            }
        }

        public async Task UpdateUserAsync(int id, UpdateUserDto updateUserDto, string token)
        {
            // Log the bearer token
            _logger.LogInformation("Bearer token: {Token}", token);

            // Include the bearer token in the request headers
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.PutAsJsonAsync($"https://api-sport-events.php9-01.test.voxteneo.com/api/v1/users/{id}", updateUserDto);

            if (!response.IsSuccessStatusCode)
            {
                // Handle error responses here
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new ApiException(response.StatusCode, errorContent);
            }
        }

        public async Task ChangePasswordAsync(int id, ChangePasswordDto changePasswordDto, string token)
        {
            _logger.LogInformation("Bearer token: {Token}", token);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.PutAsJsonAsync($"https://api-sport-events.php9-01.test.voxteneo.com/api/v1/users/{id}/password", changePasswordDto);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new ApiException(response.StatusCode, errorContent);
            }
        }

        public async Task DeleteUserAsync(int id, string token)
        {
            _logger.LogInformation("Bearer token: {Token}", token);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.DeleteAsync($"http://localhost:5022/api/Auth/users/{id}");

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new ApiException(response.StatusCode, errorContent);
            }
        }

    }
}
