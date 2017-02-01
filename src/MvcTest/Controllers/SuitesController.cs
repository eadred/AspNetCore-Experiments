using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MvcTest.Data;
using MvcTest.Models.Suites;
using Microsoft.AspNetCore.Identity;
using MvcTest.Models;

namespace MvcTest.Controllers
{
    public class SuitesController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        private readonly Lazy<ApplicationUser[]> _allUsers;

        public SuitesController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
            _allUsers = new Lazy<ApplicationUser[]>(() => _userManager.Users.ToArray());
        }

        // GET: Suites
        public async Task<IActionResult> Index()
        {
            return View();
        }

        // GET: Suites/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var suite = await _context.Suites.SingleOrDefaultAsync(m => m.SuiteId == id);
            if (suite == null)
            {
                return NotFound();
            }

            return View(SuiteToViewModel(suite));
        }

        // GET: Suites/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Suites/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("SuiteId,Name")] SuiteViewModel suite)
        {
            if (ModelState.IsValid)
            {
                _context.Add(ViewModelToSuite(suite));
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(suite);
        }

        // GET: Suites/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var suite = await _context.Suites.SingleOrDefaultAsync(m => m.SuiteId == id);
            if (suite == null)
            {
                return NotFound();
            }
            return View(SuiteToViewModel(suite));
        }

        // POST: Suites/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("SuiteId,Name")] SuiteViewModel suite)
        {
            if (id != suite.SuiteId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var updatedSuite = ViewModelToSuite(suite);

                    //Can't post back a set of user selections so Edit can't modify the associated users => just copy over original set
                    var originalSuite = _context.Suites.SingleOrDefault(s => s.SuiteId == id);
                    if (originalSuite != null)
                    {
                        originalSuite.Name = suite.Name;
                        _context.Update(originalSuite);
                        await _context.SaveChangesAsync();
                    }  
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!SuiteExists(suite.SuiteId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("Index");
            }
            return View(suite);
        }

        // GET: Suites/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var suite = await _context.Suites.SingleOrDefaultAsync(m => m.SuiteId == id);
            if (suite == null)
            {
                return NotFound();
            }

            return View(SuiteToViewModel(suite));
        }

        // POST: Suites/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var suite = await _context.Suites.SingleOrDefaultAsync(m => m.SuiteId == id);
            _context.Suites.Remove(suite);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool SuiteExists(int id)
        {
            return _context.Suites.Any(e => e.SuiteId == id);
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

        private Suite ViewModelToSuite(SuiteViewModel suiteViewModel)
        {
            var suite = new Suite { SuiteId = suiteViewModel.SuiteId, Name = suiteViewModel.Name, AllowedUsers = null };
            suite.AllowedUsers = suiteViewModel.Users
                ?.Where(u => u.Selected)
                ?.Select(u => new UserSuite { AllowedUserId = u.UserId, Suite = suite }) //Will this work or will we have to pull out the actual user object?
                ?.ToArray();

            return suite;
        }
    }
}
