using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using System.IO;
using MvcTest.Models.Files;

namespace MvcTest.Controllers
{
    public class FilesController : Controller
    {
        private IHostingEnvironment env;

        public FilesController(IHostingEnvironment env)
        {
            this.env = env;
        }

        public IActionResult Index()
        {
            return IndexView("Upload a file or download a previously uploaded one", null);
        }

        [HttpPost]
        public IActionResult Upload(IFormFile file)
        {
            //Parameter will be an IList<IFormFile> if the multiple option is used in the view input
            if (file != null)
            {
                var filename = file.FileName;

                var fullFilename = Path.Combine(env.WebRootPath, filename);

                using (FileStream fs = System.IO.File.Create(fullFilename))
                {
                    file.CopyTo(fs);
                    fs.Flush();
                }

                return IndexView("Upload a file or download a previously uploaded one", filename);
            }

            return IndexView("No file was selected", null);
        }

        public IActionResult Download(string filename)
        {
            if (string.IsNullOrEmpty(filename))
            {
                return IndexView("No file was selected", filename);
            }

            var fullFilename = Path.Combine(env.WebRootPath, filename);

            if (!System.IO.File.Exists(fullFilename))
            {
                return IndexView("File does not exist", filename);
            }

            return File(System.IO.File.OpenRead(fullFilename), System.Net.Mime.MediaTypeNames.Application.Octet, filename);   
        }

        private ViewResult IndexView(string message, string downloadFile)
        {
            return View("Index", new FilesViewModel { Message = message, DownloadFile = downloadFile });
        }
    }
}