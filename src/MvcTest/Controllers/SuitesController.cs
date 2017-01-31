using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MvcTest.Data;
using MvcTest.Models;

namespace MvcTest.Controllers
{
    public class SuitesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public SuitesController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: Suites
        public async Task<IActionResult> Index()
        {
            return View(await _context.Suites.ToListAsync());
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

            return View(suite);
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
        public async Task<IActionResult> Create([Bind("SuiteId,Name")] Suite suite)
        {
            if (ModelState.IsValid)
            {
                _context.Add(suite);
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
            return View(suite);
        }

        // POST: Suites/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("SuiteId,Name")] Suite suite)
        {
            if (id != suite.SuiteId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(suite);
                    await _context.SaveChangesAsync();
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

            return View(suite);
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
    }
}
