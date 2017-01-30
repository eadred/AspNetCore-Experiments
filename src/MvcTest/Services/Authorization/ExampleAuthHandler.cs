using Microsoft.AspNetCore.Authorization;
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
