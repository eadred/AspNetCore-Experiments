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
using System.Net.Http;

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


        [HttpGet]
        public async Task<IActionResult> PostFormData([FromQuery(Name="file")] string filePath)
        {
            //See http://stackoverflow.com/questions/16416601/c-sharp-httpclient-4-5-multipart-form-data-upload

            var content = new MultipartFormDataContent();

            var stringContentName = "mystring";
            var stringContent = new StringContent("Hello World", System.Text.Encoding.UTF8, "text/plain");
            stringContent.Headers.Add("Content-Disposition", $"form-data; name=\"{stringContentName}\"");
            content.Add(stringContent, stringContentName);

            var fileContentName = "myfile";
            var str = System.IO.File.OpenRead(filePath);
            var fileContent = new StreamContent(str);
            fileContent.Headers.Add("Content-Type", "image/jpeg");
            fileContent.Headers.Add("Content-Disposition", $"form-data; name=\"{fileContentName}\"; filename=\"{filePath}\"");
            content.Add(fileContent, fileContentName, filePath);

            var client = new HttpClient();
            try
            {
                HttpResponseMessage result = await client.PostAsync($"{Request.Scheme}://{Request.Host.Value}/Files/ReceiveFormData", content);

                return StatusCode((int)result.StatusCode);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
            finally
            {
                str.Close();
                client.Dispose();
            }
            
        }

        [HttpPost]
        public IActionResult ReceiveFormData([FromForm(Name="mystring")] string thestring, [FromForm(Name = "myfile")] IFormFile thefile)
        {
            var filename = thefile.FileName + ".dup";

            using (FileStream fs = System.IO.File.Create(filename))
            {
                thefile.CopyTo(fs);
                fs.Flush();
            }

            return Ok();
        }
    }
}