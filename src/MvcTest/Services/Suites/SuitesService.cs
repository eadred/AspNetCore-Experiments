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

        public void AddSuite(SuiteViewModel newSuite)
        {
            AssignIdToSuite(newSuite);
            ValidateSuite(newSuite);
            SetSuite(newSuite);
        }

        public int AddModel(int suiteId, Model newModel)
        {
            var parentSuite = FindParentSuite(suiteId);
            AssignIdToModel(newModel);
            ValidateModel(parentSuite, newModel);
            SetModel(parentSuite, newModel);
            return newModel.ModelId;
        }

        public void UpdateSuite(SuiteViewModel suite)
        {
            ValidateSuite(suite);
            SetSuite(suite);
        }

        public void UpdateModel(int suiteId, Model model)
        {
            var parentSuite = FindParentSuite(suiteId);
            ValidateModel(parentSuite, model);
            SetModel(parentSuite, model);
        }

        public void DeleteSuite(int suiteId)
        {
            if (!_suites.ContainsKey(suiteId)) throw new SuiteException(SuiteException.SuiteErrorType.NotFound, "The specified suite does not exist.");

            _suites.Remove(suiteId);
        }

        public void DeleteModel(int suiteId, int modelId)
        {
            var parentSuite = FindParentSuite(suiteId);

            if (!parentSuite.Models.Any(m => m.ModelId == modelId))
                throw new SuiteException(SuiteException.SuiteErrorType.NotFound, "The specified model does not exist.");

            parentSuite.Models = parentSuite.Models.Where(m => m.ModelId != modelId).ToArray();
        }

        private void AssignIdToSuite(SuiteViewModel suite)
        {
            suite.SuiteId = _suites.Keys.Max() + 1;
        }

        private void AssignIdToModel(Model model)
        {
            model.ModelId = _suites
                .SelectMany(kvp => kvp.Value.Models)
                .Select(m => m.ModelId)
                .Max() + 1;
        }

        private void ValidateSuite(SuiteViewModel suite)
        {
            //Blank names are not allowed
            if (string.IsNullOrEmpty(suite.Name)) throw new SuiteException(SuiteException.SuiteErrorType.NameBlank, "The suite name cannot be blank.");

            //Check for conflicting names
            bool anyNameConflicts = _suites
                .Where(kvp => kvp.Key != suite.SuiteId)
                .Any(kvp => kvp.Value.Name == suite.Name);

            if (anyNameConflicts) throw new SuiteException(SuiteException.SuiteErrorType.NameConflict, "The suite name conflicts with an existing suite.");
        }

        private void ValidateModel(SuiteViewModel parentSuite, Model model)
        {
            //Blank names are not allowed
            if (string.IsNullOrEmpty(model.Name)) throw new SuiteException(SuiteException.SuiteErrorType.NameBlank, "The model name cannot be blank.");

            //Check for conflicting names
            bool anyNameConflicts = parentSuite.Models
                .Where(m => m.ModelId != model.ModelId)
                .Any(m => m.Name == model.Name);

            if (anyNameConflicts) throw new SuiteException(SuiteException.SuiteErrorType.NameConflict, "The model name conflicts with an existing model in this suite.");
        }

        private void SetSuite(SuiteViewModel suite)
        {
            _suites[suite.SuiteId] = suite;
        }

        private void SetModel(SuiteViewModel parentSuite, Model model)
        {
            parentSuite.Models = parentSuite.Models
                .Where(m => m.ModelId != model.ModelId) //Remove the old version of the model if there was one
                .Concat(new[] { model })
                .OrderBy(m => m.Name)
                .ToArray();
        }

        private SuiteViewModel FindParentSuite(int suiteId)
        {
            if (!_suites.ContainsKey(suiteId)) throw new SuiteException(SuiteException.SuiteErrorType.NotFound, "The parent suite for the model could not be found.");

            return _suites[suiteId];
        }
    }
}
