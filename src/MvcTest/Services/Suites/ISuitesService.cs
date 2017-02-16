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

        void AddSuite(SuiteViewModel newSuite);

        void UpdateSuite(SuiteViewModel suite);

        void DeleteSuite(int suiteId);
    }
}
