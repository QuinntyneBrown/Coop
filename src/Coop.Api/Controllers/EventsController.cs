using Coop.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Controllers;

 [ApiController]
 [Route("api/[controller]")]
 public class EventsController : Controller
 {
     private readonly INotificationService _notificationService;
     private readonly ILogger<EventsController> _logger;
     public EventsController(INotificationService notificationService, ILogger<EventsController> logger)
     {
         _notificationService = notificationService ?? throw new ArgumentNullException(nameof(notificationService));
         _logger = logger ?? throw new ArgumentNullException(nameof(logger));
     }
     [HttpGet]        
     public async Task Get(CancellationToken cancellationToken)
     {
         var tcs = new TaskCompletionSource<bool>(TaskCreationOptions.RunContinuationsAsynchronously);
         var response = Response;
         response.Headers.Add("Content-Type", "text/event-stream");
         _notificationService.Subscribe(async e =>
         {
             var @event = JsonConvert.SerializeObject(e);
             await response
             .WriteAsync($"data: {@event}\r\r", cancellationToken);
             response.Body.Flush();
         }, cancellationToken);
         while (!tcs.Task.IsCanceled)
         {
             if (cancellationToken.IsCancellationRequested)
             {
                 tcs.SetCanceled();
             }
         }
         await tcs.Task;
     }
 }
