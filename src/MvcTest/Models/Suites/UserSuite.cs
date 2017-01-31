using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MvcTest.Models.Suites
{
    public class UserSuite
    {
        public int UserSuiteId {get; set;}

        public string AllowedUserId { get; set; }

        public ApplicationUser AllowedUser { get; set; }

        public int SuiteId { get; set; }

        public Suite Suite { get; set; }
    }
}
