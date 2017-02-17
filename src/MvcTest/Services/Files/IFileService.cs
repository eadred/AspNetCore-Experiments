using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MvcTest.Services.Files
{
    public interface IFileService
    {
        void SaveModelLogo(int suiteId, int modelId, IFormFile logoFile);

        FileStream GetModelLogo(int suiteId, int modelId);
    }
}
