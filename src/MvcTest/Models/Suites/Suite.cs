using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcTest.Models.Suites
{
    public class Suite
    {
        public int SuiteId { get; set; }

        public string Name { get; set; }

        public virtual ICollection<UserSuite> AllowedUsers { get; set; }
    }
}
