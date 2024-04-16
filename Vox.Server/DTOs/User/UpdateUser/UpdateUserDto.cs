using System.ComponentModel.DataAnnotations;

namespace Vox.Server.DTOs.User.UpdateUser
{
    public class UpdateUserDto
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        [EmailAddress]
        public string Email { get; set; }
    }
}
