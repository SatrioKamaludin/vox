using System.ComponentModel.DataAnnotations;

namespace Vox.Server.DTOs.User.RegisterUser
{
    public class RegisterUserDto
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        [Compare("Password")]
        public string RepeatPassword { get; set; }
    }
}
