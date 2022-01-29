using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Diagnostics;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MetaController
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public MetaController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment ?? throw new ArgumentNullException(nameof(webHostEnvironment));
        }

        [HttpGet("/info")]
        public string Info()
        {
            var assembly = typeof(Startup).Assembly;

            var creationDate = System.IO.File.GetCreationTime(assembly.Location);

            var version = FileVersionInfo.GetVersionInfo(assembly.Location).ProductVersion;

            var environment = _webHostEnvironment.EnvironmentName;

            return $"Version: {version}, Last Updated: {creationDate}, Environment: {environment}";
        }
    }
}
