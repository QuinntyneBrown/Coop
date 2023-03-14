using Newtonsoft.Json.Linq;
using System;

namespace Coop.Application.Features;

 public class ThemeDto
 {
     public Guid ThemeId { get; set; }
     public Guid? ProfileId { get; set; }
     public JObject CssCustomProperties { get; set; }
 }
