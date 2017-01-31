using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcTest.Services.Authorization
{
    public class RoleRequirement : IAuthorizationRequirement
    {
        public string RoleName { get; private set; }
        public RoleRequirement(string roleName)
        {
            RoleName = roleName;
        }
    }
}
