using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcTest.Services.Authorization
{
    public class ExampleAuthHandler : AuthorizationHandler<ExampleAuthRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, ExampleAuthRequirement requirement)
        {
            if (context.User.Identity.IsAuthenticated)
            {
                var resource = context.Resource as AuthorizationFilterContext;
                if (resource != null)
                {
                    object id;
                    if (resource.RouteData.Values.TryGetValue("id", out id))
                    {
                        if ((string)id == "1")
                        {
                            context.Succeed(requirement);
                        }
                        else
                        {
                            context.Fail();
                        }

                        return Task.CompletedTask;
                    }
                }

                context.Succeed(requirement);

            }
            else
            {
                context.Fail();
            }

            return Task.CompletedTask;
        }
    }
}
