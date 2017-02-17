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
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;
using MvcTest.Services.Files;

namespace MvcTest.Controllers
{
    [Produces("application/json")]
    [Route("api/Suites")]
    public class SuitesApiController : Controller
    {
        private readonly ISuitesService _suitesSvc;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IFileService _fileService;

        private readonly Lazy<ApplicationUser[]> _allUsers;

        public SuitesApiController(
            ISuitesService suitesSvc,
            UserManager<ApplicationUser> userManager,
            IFileService fileService)
        {
            _suitesSvc = suitesSvc;
            _userManager = userManager;
            _fileService = fileService;
            _allUsers = new Lazy<ApplicationUser[]>(() => _userManager.Users.ToArray());
        }

        [HttpGet]
        public ICollection<SuiteViewModel> Index()
        {
            ICollection<SuiteViewModel> suites = _suitesSvc.GetAllSuites();

            return suites;
        }

        [HttpPost]
        public IActionResult AddSuite([FromBody] SuiteViewModel suite)
        {
            return UseSuitesService(() => _suitesSvc.AddSuite(suite));
        }

        [HttpPost]
        [Route("{suiteId}/Models")]
        public IActionResult AddModel(int suiteId, [FromBody] Model model)
        {
            return UseSuitesService(() => _suitesSvc.AddModel(suiteId, model));
        }

        [HttpPut]
        [Route("{suiteId}")]
        public IActionResult EditSuite(int suiteId, [FromBody] SuiteViewModel suite)
        {
            return UseSuitesService(() => _suitesSvc.UpdateSuite(suite));
        }

        [HttpPut]
        [Route("{suiteId}/Models/{modelId}")]
        public IActionResult EditModel(int suiteId, int modelId, IFormFile logoFile)
        {
            if (!Request.Form.ContainsKey("model"))
                return BadRequest(CreateErrorResponseBody("Item 'model' was not included in the form data."));

            //Note that if client side the model json is appended to the form as a blob (as a way of specifying the Content-Type), ie like:
            //
            //fd.append('model', new Blob([JSON.stringify(modelToSend)], { type: 'application/json' }), 'model');
            //
            //then the model will be available as an IFormFile in the Request.Form.Files collection

            var model = JsonConvert.DeserializeObject<Model>(Request.Form["model"]);

            if (logoFile != null)
            {
                if (!logoFile.ContentType.StartsWith("image/"))
                    return BadRequest(CreateErrorResponseBody("Specified logo is not an image."));
            }

            return UseSuitesService(() =>
            {
                _suitesSvc.UpdateModel(suiteId, model);

                if (logoFile != null)
                {
                    _fileService.SaveModelLogo(suiteId, modelId, logoFile);
                } 
            });
        }

        [HttpDelete]
        [Route("{suiteId}")]
        public IActionResult DeleteSuite(int suiteId)
        {
            return UseSuitesService(() => _suitesSvc.DeleteSuite(suiteId));
        }

        [HttpDelete]
        [Route("{suiteId}/Models/{modelId}")]
        public IActionResult DeleteModel(int suiteId, int modelId)
        {
            return UseSuitesService(() => _suitesSvc.DeleteModel(suiteId, modelId));
        }

        [HttpGet]
        [Produces("application/octet-stream")]
        [Route("{suiteId}/Models/{modelId}/logo")]
        public IActionResult ModelLogo(int suiteId, int modelId)
        {
            var fstream = _fileService.GetModelLogo(suiteId, modelId);
            return File(fstream, System.Net.Mime.MediaTypeNames.Application.Octet);
        }

        private IActionResult UseSuitesService(Action useService)
        {
            try
            {
                useService();
            }
            catch (SuiteException ex)
            {
                return StatusCode(
                    (int)ex.ErrorType.ToHttpErrorCode(),
                    CreateErrorResponseBody(ex.Message));
            }

            return Ok();
        }

        private dynamic CreateErrorResponseBody(string errorMessage)
        {
            return new { errorMsg = errorMessage };
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