using System.Net;

namespace Vox.Server.Exceptions
{
    public class ApiException : Exception
    {
        public HttpStatusCode StatusCode { get; set; }
        public object Value { get; set; }

        public ApiException(HttpStatusCode statusCode, object value = null)
        : base(GetErrorMessage(statusCode, value))
        {
            StatusCode = statusCode;
            Value = value;
        }

        private static string GetErrorMessage(HttpStatusCode statusCode, object value)
        {
            return value == null ? statusCode.ToString() : $"{statusCode}: {value}";
        }
    }
}
