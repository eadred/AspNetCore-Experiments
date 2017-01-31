using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using System.IO;

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
            return View();
        }

        [HttpPost]
        public IActionResult Upload(IFormFile file)
        {
            //Parameter will be an IList<IFormFile> if the multiple option is used in the view input
            if (file != null)
            {
                var filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');

                filename = Path.Combine(env.WebRootPath, filename);

                using (FileStream fs = System.IO.File.Create(filename))
                {
                    file.CopyTo(fs);
                    fs.Flush();
                }

            }

            return View("Index");
        }

        public FileResult Download(string filename)
        {
            var fullFilename = Path.Combine(env.WebRootPath, filename);

            return File(System.IO.File.OpenRead(fullFilename), System.Net.Mime.MediaTypeNames.Application.Octet, filename);   
        }
    }
}