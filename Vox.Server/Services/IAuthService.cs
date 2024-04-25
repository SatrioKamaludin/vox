using Vox.Server.DTOs;
using Vox.Server.DTOs.User.LoginUser;
using Vox.Server.DTOs.User.RegisterUser;
using Vox.Server.DTOs.User.UpdateUser;

namespace Vox.Server.Services
{
    public interface IAuthService
    {
        Task<RegisteredUserDto> RegisterUserAsync(RegisterUserDto registerUserDto);
        Task<LoginResponseDto> LoginUserAsync(LoginUserDto loginUserDto);
        Task<RegisteredUserDto> GetUserById(int id, string token);
        Task<ErrorResponse> UpdateUserAsync(int id, UpdateUserDto updateUserDto, string token);
        Task<object> ChangePasswordAsync(int id, ChangePasswordDto changePasswordDto, string token);
        Task<ErrorResponse> DeleteUserAsync(int id, string token);
    }
}
