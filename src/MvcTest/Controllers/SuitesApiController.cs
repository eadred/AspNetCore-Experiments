using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MvcTest.Models.Suites;
using MvcTest.Models;
using MvcTest.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MvcTest.Controllers
{
    [Produces("application/json")]
    [Route("api/Suites")]
    public class SuitesApiController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        private readonly Lazy<ApplicationUser[]> _allUsers;

        public SuitesApiController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
            _allUsers = new Lazy<ApplicationUser[]>(() => _userManager.Users.ToArray());
        }

        public async Task<ICollection<SuiteViewModel>> Index()
        {
            ICollection<SuiteViewModel> suites = new[] {
                new SuiteViewModel
                {
                    SuiteId = 0,
                    Name = "S1",
                    Models = new[]
                    {
                        new Model { ModelId = 0, Name = "M1A" },
                        new Model { ModelId = 1, Name = "M1B" }
                    }
                },
                new SuiteViewModel
                {
                    SuiteId = 1,
                    Name = "S2",
                    Models = new[]
                    {
                        new Model { ModelId = 2, Name = "M2A" },
                        new Model { ModelId = 3, Name = "M2B" }
                    }
                }
            };

            return await Task.FromResult(suites);


            //var allSuites = await _context.Suites.ToListAsync();

            //return allSuites.Select(SuiteToViewModel).ToArray();
        }

        private SuiteViewModel SuiteToViewModel(Suite suite)
        {
            HashSet<string> allowedUsers = new HashSet<string>();

            allowedUsers = new HashSet<string>(
                suite.AllowedUsers?.Select(su => su.AllowedUserId) ?? Enumerable.Empty<string>());


            var suiteUsers = _allUsers.Value
                .Select(u => new SuiteUser
                {
                    UserId = u.Id,
                    UserName = u.UserName,
                    Selected = allowedUsers.Contains(u.Id)
                });

            return new SuiteViewModel
            {
                SuiteId = suite.SuiteId,
                Name = suite.Name,
                Users = suiteUsers.ToArray()
            };
        }
    }
}