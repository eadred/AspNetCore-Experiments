using Microsoft.EntityFrameworkCore;
using MvcTest.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcTest.Data
{
    public class SuiteDbContext : DbContext
    {
        public SuiteDbContext(DbContextOptions<SuiteDbContext> contextOptions) : base(contextOptions)
        {
        }

        public DbSet<Suite> Suites {get; set;}
    }
}
