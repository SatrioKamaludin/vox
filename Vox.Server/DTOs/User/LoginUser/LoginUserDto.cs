using System.ComponentModel.DataAnnotations;

namespace Vox.Server.DTOs.User.LoginUser
{
    public class LoginUserDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
