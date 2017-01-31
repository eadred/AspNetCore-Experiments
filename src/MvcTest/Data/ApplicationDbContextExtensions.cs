using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcTest.Data
{
    public static class ApplicationDbContextExtensions
    {
        public static void EnsureRoles(this ApplicationDbContext dbContext)
        {
            if (!dbContext.Roles.Any())
            {
                var roleStore = new RoleStore<IdentityRole>(dbContext) { AutoSaveChanges = true };

                roleStore.CreateAsync(new IdentityRole { Name = "admin", NormalizedName = "admin" }).Wait();
                roleStore.CreateAsync(new IdentityRole { Name = "marketing", NormalizedName = "marketing" }).Wait();
                roleStore.CreateAsync(new IdentityRole { Name = "finance", NormalizedName = "finance" }).Wait();
            }
        }
    }
}
