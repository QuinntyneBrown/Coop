using Newtonsoft.Json.Linq;
using System;

namespace Coop.Domain.Entities;

 public class Theme
 {
     public Guid ThemeId { get; set; }
     public Guid? ProfileId { get; set; }
     public JObject CssCustomProperties { get; private set; }
     public Theme(Guid? profileId, JObject cssCustomProperties)
         : this(cssCustomProperties)
     {
         ProfileId = profileId;
     }
     public Theme(JObject cssCustomProperties)
     {
         CssCustomProperties = cssCustomProperties;
     }
     private Theme()
     {
     }
     public void SetCssCustomProperties(JObject cssCustomProperties)
     {
         CssCustomProperties = cssCustomProperties;
     }
 }
