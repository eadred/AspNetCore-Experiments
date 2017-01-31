using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcTest.Models.Suites
{
    public class SuiteViewModel
    {
        public int SuiteId { get; set; }

        public string Name { get; set; }

        public IEnumerable<SuiteUser> Users { get; set; }  
    }

    public class SuiteUser
    {
        public bool Selected { get; set; }

        public string UserId { get; set; }

        public string UserName { get; set; }
    }
}
