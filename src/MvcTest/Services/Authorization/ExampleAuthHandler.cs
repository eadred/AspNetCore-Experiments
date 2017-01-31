using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
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
        private UserManager<ApplicationUser> userManager;

        public ExampleAuthHandler(UserManager<ApplicationUser> userManager)
        {
            this.userManager = userManager;
        }
        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, ExampleAuthRequirement requirement, TestItem resource)
        {
            if (context.User.Identity.IsAuthenticated) //Strictly speaking don't have to do this if the action or controller is using Authorize with the default handler
            {
                var user = await userManager.FindByNameAsync(context.User.Identity.Name);
                var isAdmin = await userManager.IsInRoleAsync(user, "admin");
                if (isAdmin)
                {
                    context.Succeed(requirement);
                    return;
                }
            }

            context.Fail();
        }
    }
}
