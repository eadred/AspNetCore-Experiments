using MvcTest.Models.Suites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcTest.Services.Suites
{
    public class SuitesService : ISuitesService
    {
        private Dictionary<int, SuiteViewModel> _suites;

        public SuitesService()
        {
            _suites = new[] {
                new SuiteViewModel
                {
                    SuiteId = 0,
                    Name = "S1",
                    Models = new[]
                    {
                        new Model { ModelId = 0, Name = "M1A" },
                        new Model { ModelId = 1, Name = "M1B" }
                    }
                },
                new SuiteViewModel
                {
                    SuiteId = 1,
                    Name = "S2",
                    Models = new[]
                    {
                        new Model { ModelId = 2, Name = "M2A" },
                        new Model { ModelId = 3, Name = "M2B" }
                    }
                }
            }.ToDictionary(s => s.SuiteId);
        }

        public ICollection<SuiteViewModel> GetAllSuites()
        {
            return _suites.Values.OrderBy(s => s.Name).ToList();
        }

        public void UpdateSuite(SuiteViewModel suite)
        {
            //Blank names are not allowed
            if (string.IsNullOrEmpty(suite.Name)) throw new SuiteException(SuiteException.SuiteErrorType.NameBlank, "The suite name cannot be blank.");

            //Check for conflicting names
            bool anyNameConflicts = _suites
                .Where(kvp => kvp.Key != suite.SuiteId)
                .Any(kvp => kvp.Value.Name == suite.Name);

            if (anyNameConflicts) throw new SuiteException(SuiteException.SuiteErrorType.NameConflict, "The suite name conflicts with an existing suite.");

            _suites[suite.SuiteId] = suite;
        }
    }
}
