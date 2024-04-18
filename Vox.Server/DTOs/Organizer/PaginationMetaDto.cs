using System.Text.Json.Serialization;

namespace Vox.Server.DTOs.Organizer
{
    public class PaginationMetaDto
    {
        [JsonPropertyName("pagination")]
        public Pagination pagination { get; set; }

        public class Pagination
        {
            public int Total { get; set; }
            public int Count { get; set; }
            public int per_page { get; set; }
            public int current_page { get; set; }
            public int total_pages { get; set; }
            public Dictionary<string, string> Links { get; set; }
        }
    }
}
