using System.Collections.Generic;

namespace Coop.Domain;

 public class ResponseBase
 {
     public List<string> Errors { get; set; } = new();
 }
