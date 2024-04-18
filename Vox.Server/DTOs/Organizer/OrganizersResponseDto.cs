namespace Vox.Server.DTOs.Organizer
{
    public class OrganizersResponseDto
    {
        public List<OrganizerDto> Data { get; set; }
        public PaginationMetaDto Meta { get; set; }
    }
}
