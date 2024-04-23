﻿using System.ComponentModel.DataAnnotations;

namespace Vox.Server.DTOs.User.LoginUser
{
    public class LoginUserDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
            ErrorMessage = "Password must contain at least one uppercase letter, one number, and one special character.")]
        public string Password { get; set; }
    }
}
