using MvcTest.Models.Suites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcTest.Services.Suites
{
    public interface ISuitesService
    {
        ICollection<SuiteViewModel> GetAllSuites();

        void UpdateSuite(SuiteViewModel suite);
    }
}
