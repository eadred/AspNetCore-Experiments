using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MvcTest.Services.Files
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _env;
        private readonly string _rootPath;

        public FileService(IHostingEnvironment env)
        {
            _env = env;

            var appDataPath = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);

            _rootPath = Path.Combine(appDataPath, "MvcTestFiles");
            if (!Directory.Exists(_rootPath)) Directory.CreateDirectory(_rootPath);

            LogoFilesRootPath = Path.Combine(_rootPath, "Logos");
            if (!Directory.Exists(LogoFilesRootPath)) Directory.CreateDirectory(LogoFilesRootPath);
        }

        public void SaveModelLogo(int suiteId, int modelId, IFormFile logoFile)
        {
            var filename = GetLogoFilePath(suiteId, modelId, true);

            using (FileStream fs = File.Create(filename))
            {
                logoFile.CopyTo(fs);
                fs.Flush();
            }
        }

        public FileStream GetModelLogo(int suiteId, int modelId)
        {
            var path = GetLogoFilePath(suiteId, modelId, false);
            if (!File.Exists(path))
            {
                path = Path.Combine(_env.WebRootPath, "images", "default-model-logo.png");
            }
            
            return File.OpenRead(path);
        }

        public void DeleteModelLogo(int suiteId, int modelId)
        {
            var path = GetLogoFilePath(suiteId, modelId, false);
            if (File.Exists(path))
            {
                Directory.Delete(Path.GetDirectoryName(path), true);
            }
        }

        public void DeleteModelLogos(int suiteId)
        {
            var directory = GetSuiteLogosDirectoryPath(suiteId, false);
            if (Directory.Exists(directory))
            {
                Directory.Delete(directory, true);
            }
        }

        private string LogoFilesRootPath { get; set; }

        private string GetSuiteLogosDirectoryPath(int suiteId, bool createDirectories)
        {
            var suiteDir = Path.Combine(LogoFilesRootPath, $"Suite{suiteId}");
            if (createDirectories && !Directory.Exists(suiteDir)) Directory.CreateDirectory(suiteDir);

            return suiteDir;
        }

        private string GetLogoFilePath(int suiteId, int modelId, bool createDirectories)
        {
            var suiteDir = GetSuiteLogosDirectoryPath(suiteId, createDirectories);

            var modelDir = Path.Combine(suiteDir, $"Model{modelId}");
            if (createDirectories && !Directory.Exists(modelDir)) Directory.CreateDirectory(modelDir);

            return Path.Combine(modelDir, "logo");
        }
    }
}
