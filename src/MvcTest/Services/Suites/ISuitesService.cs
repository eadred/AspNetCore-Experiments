﻿using Microsoft.AspNetCore.Http;
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

        int AddModel(int suiteId, Model newModel, IFormFile logoFile);

        void UpdateSuite(SuiteViewModel suite);

        void UpdateModel(int suiteId, Model model, IFormFile logoFile);

        void DeleteSuite(int suiteId);

        void DeleteModel(int suiteId, int modelId);
    }
}
