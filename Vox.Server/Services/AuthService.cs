using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Net.Http.Headers;
using Vox.Server.DTOs.User.LoginUser;
using Vox.Server.DTOs.User.RegisterUser;
using Vox.Server.DTOs;
using Vox.Server.Exceptions;
using Newtonsoft.Json;
using Vox.Server.DTOs.User.UpdateUser;

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

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception(errorContent);
            }

            return await response.Content.ReadFromJsonAsync<RegisteredUserDto>();
        }

        public async Task<LoginResponseDto> LoginUserAsync(LoginUserDto loginUserDto)
        {
            var response = await _httpClient.PostAsJsonAsync("https://api-sport-events.php9-01.test.voxteneo.com/api/v1/users/login", loginUserDto);
            if (response.IsSuccessStatusCode) {
                return await response.Content.ReadFromJsonAsync<LoginResponseDto>();
            }
            else if (response.StatusCode == HttpStatusCode.Unauthorized)
            {
                return null;
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new ApiException(response.StatusCode, errorContent);
            }    
        }

        public async Task<RegisteredUserDto> GetUserById(int id, string token)
        {
            _logger.LogInformation("Bearer token: {Token}", token);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync($"https://api-sport-events.php9-01.test.voxteneo.com/api/v1/users/{id}");
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<RegisteredUserDto>();
            }
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                // Return null instead of throwing an exception
                return null;
            }
            else
            {
                // Handle error responses here
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new ApiException(response.StatusCode, errorContent);
            }
        }

        public async Task<ErrorResponse> UpdateUserAsync(int id, UpdateUserDto updateUserDto, string token)
        {
            _logger.LogInformation("Bearer token: {Token}", token);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.PutAsJsonAsync($"https://api-sport-events.php9-01.test.voxteneo.com/api/v1/users/{id}", updateUserDto);

            if (!response.IsSuccessStatusCode)
            {
                // Handle error responses here
                var errorContent = await response.Content.ReadAsStringAsync();
                var errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(errorContent);
                return new ErrorResponse
                {
                    Message = errorResponse.Message,
                    StatusCode = (int)response.StatusCode
                };
            }

            return null;
        }

        public async Task<object> ChangePasswordAsync(int id, ChangePasswordDto changePasswordDto, string token)
        {
            _logger.LogInformation("Bearer token: {Token}", token);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.PutAsJsonAsync($"https://api-sport-events.php9-01.test.voxteneo.com/api/v1/users/{id}/password", changePasswordDto);

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return new ErrorResponse
                {
                    Message = $"No query results for model [App\\User] {id}",
                    StatusCode = (int)HttpStatusCode.NotFound
                };
            }
            else if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                if (string.IsNullOrEmpty(responseContent))
                {
                    return null;
                }
                else
                {
                    return JsonConvert.DeserializeObject<ChangePasswordDto>(responseContent);
                }
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                var errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(errorContent);
                errorResponse.StatusCode = (int)response.StatusCode;
                return errorResponse;
            }
        }


        public async Task<ErrorResponse> DeleteUserAsync(int id, string token)
        {
            _logger.LogInformation("Bearer token: {Token}", token);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.DeleteAsync($"http://localhost:5022/api/Auth/users/{id}");

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return new ErrorResponse
                {
                    Message = $"No query results for model [App\\User] {id}",
                    StatusCode = (int)HttpStatusCode.NotFound
                };
            }
            else if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                return new ErrorResponse
                {
                    Message = errorContent,
                    StatusCode = (int)response.StatusCode
                };
            }

            return null;
        }

    }
}
