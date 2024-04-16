namespace Vox.Server.DTOs
{
    public class ErrorResponse
    {
        public string Message { get; set; }
        public Dictionary<string, List<string>> Errors { get; set; }
        public int StatusCode { get; set; }
    }
}
