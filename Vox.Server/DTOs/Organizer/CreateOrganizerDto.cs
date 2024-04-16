using System.ComponentModel.DataAnnotations;

namespace Vox.Server.DTOs.Organizer
{
    public class CreateOrganizerDto
    {
        [Required]
        public string OrganizerName { get; set; }
        [Required]
        public string ImageLocation { get; set; }
    }
}
