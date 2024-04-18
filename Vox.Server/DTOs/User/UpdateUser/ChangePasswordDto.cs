using System.ComponentModel.DataAnnotations;

namespace Vox.Server.DTOs.User.UpdateUser
{
    public class ChangePasswordDto
    {
        [Required]
        public string OldPassword { get; set; }
        [Required]
        public string NewPassword { get; set; }
        [Required]
        public string RepeatPassword { get; set; }
    }
}
