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
    public class RoleAuthHandler : AuthorizationHandler<RoleRequirement, TestItem>
    {
        private UserManager<ApplicationUser> userManager;

        public RoleAuthHandler(UserManager<ApplicationUser> userManager)
        {
            this.userManager = userManager;
        }
        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, RoleRequirement requirement, TestItem resource)
        {
            if (context.User.Identity.IsAuthenticated) //Strictly speaking don't have to do this if the action or controller is using Authorize with the default handler
            {
                var user = await userManager.FindByNameAsync(context.User.Identity.Name);
                var isAdmin = await userManager.IsInRoleAsync(user, requirement.RoleName);
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
