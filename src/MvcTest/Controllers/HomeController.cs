using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MvcTest.Models;
using MvcTest.Data;

namespace MvcTest.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private IAuthorizationService authService;
        private ApplicationDbContext applicationDbContext;

        public HomeController(IAuthorizationService authService, ApplicationDbContext applicationDbContext)
        {
            this.authService = authService;
            this.applicationDbContext = applicationDbContext;
        }

        [AllowAnonymous]
        public IActionResult Index()
        {
            return View();
        }
        
        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public async Task<IActionResult> Test(int id)
        {
            //Would fetch this from Db or whatever...
            var item = new TestItem(id);

            if (!await authService.AuthorizeAsync(User, item, "ExamplePolicy"))
            {
                return new ChallengeResult();
            }

            ViewData["Id"] = id;
            return View();
        }

        [AllowAnonymous]
        public IActionResult Error()
        {
            return View();
        }
    }
}
