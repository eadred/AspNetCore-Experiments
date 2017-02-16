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
using MvcTest.Services.Suites;
using System.Net;

namespace MvcTest.Controllers
{
    [Produces("application/json")]
    [Route("api/Suites")]
    public class SuitesApiController : Controller
    {
        private readonly ISuitesService _suitesSvc;
        private readonly UserManager<ApplicationUser> _userManager;

        private readonly Lazy<ApplicationUser[]> _allUsers;

        public SuitesApiController(ISuitesService suitesSvc, UserManager<ApplicationUser> userManager)
        {
            _suitesSvc = suitesSvc;
            _userManager = userManager;
            _allUsers = new Lazy<ApplicationUser[]>(() => _userManager.Users.ToArray());
        }

        [HttpGet]
        public async Task<ICollection<SuiteViewModel>> Index()
        {
            ICollection<SuiteViewModel> suites = _suitesSvc.GetAllSuites();

            return await Task.FromResult(suites);
        }

        [HttpPut]
        [Route("{suiteId}")]
        public IActionResult EditSuite(int suiteId, [FromBody] SuiteViewModel suite)
        {
            try
            {
                _suitesSvc.UpdateSuite(suite);
            }
            catch (SuiteException ex)
            {
                HttpStatusCode statusCode;
                switch (ex.ErrorType)
                {
                    case SuiteException.SuiteErrorType.NameBlank:
                        statusCode = HttpStatusCode.BadRequest;
                        break;
                    case SuiteException.SuiteErrorType.NameConflict:
                        statusCode = HttpStatusCode.Conflict;
                        break;
                    default:
                        statusCode = HttpStatusCode.BadRequest;
                        break;
                }
                return StatusCode((int)statusCode, new { errorMsg = ex.Message });
            }

            return Ok();
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