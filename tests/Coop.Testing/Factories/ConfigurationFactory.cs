using Coop.Api;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Coop.Testing;

 public static class ConfigurationFactory
 {
     private static IConfiguration _configuration;
     public static IConfiguration Create()
     {
         if (_configuration == null)
         {
             var basePath = Path.GetFullPath(@$"../../../../../src/Coop.Api");
             _configuration = new ConfigurationBuilder()
                 .SetBasePath(basePath)
                 .AddJsonFile("appsettings.json")
                 .AddUserSecrets<Startup>()
                 .Build();
         }
         return _configuration;
     }
 }
