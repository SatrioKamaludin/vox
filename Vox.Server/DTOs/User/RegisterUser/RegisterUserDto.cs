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
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", 
            ErrorMessage = "Password must contain at least one uppercase letter, one number, and one special character.")]
        public string Password { get; set; }

        [Required]
        [Compare("Password", ErrorMessage = "Password and Repeat Password must match.")]
        public string RepeatPassword { get; set; }
    }
}
