using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Vox.Server
{
    public class RemoveLoginEndpointSecurityFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var action = context.ApiDescription.ActionDescriptor as ControllerActionDescriptor;
            if (action.ControllerName == "AuthController" && action.ActionName == "LoginUser")
            {
                operation.Security.Clear();
            }
        }
    }
}
