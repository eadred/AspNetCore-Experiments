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

        int AddModel(int suiteId, Model newModel);

        void UpdateSuite(SuiteViewModel suite);

        void UpdateModel(int suiteId, Model model);

        void DeleteSuite(int suiteId);

        void DeleteModel(int suiteId, int modelId);
    }
}
