using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using MvcTest.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcTest.Services.Authorization
{
    public class ExampleAuthHandler : AuthorizationHandler<ExampleAuthRequirement, TestItem>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, ExampleAuthRequirement requirement, TestItem resource)
        {
            if (context.User.Identity.IsAuthenticated) //Strictly speaking don't have to do this if the action or controller is using Authorize with the default handler
            {
                if (resource.Id == 1)
                {
                    context.Succeed(requirement);
                    return Task.CompletedTask;
                }
            }

            context.Fail();
            return Task.CompletedTask;
        }
    }
}
