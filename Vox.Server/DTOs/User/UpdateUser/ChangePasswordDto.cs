namespace Vox.Server.DTOs.User.UpdateUser
{
    public class ChangePasswordDto
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string RepeatPassword { get; set; }
    }
}
