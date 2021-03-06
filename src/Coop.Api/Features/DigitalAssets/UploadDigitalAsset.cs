using Coop.Api.Helpers;
using Coop.Core.Interfaces;
using Coop.Core.Models;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class UploadDigitalAsset
    {
        public class Request : IRequest<Response> { }

        public class Response
        {
            public List<System.Guid> DigitalAssetIds { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            public ICoopDbContext _context { get; set; }
            public IHttpContextAccessor _httpContextAccessor { get; set; }
            public Handler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {

                var httpContext = _httpContextAccessor.HttpContext;
                var defaultFormOptions = new FormOptions();
                var digitalAssets = new List<DigitalAsset>();

                if (!MultipartRequestHelper.IsMultipartContentType(httpContext.Request.ContentType))
                    throw new Exception($"Expected a multipart request, but got {httpContext.Request.ContentType}");

                var mediaTypeHeaderValue = MediaTypeHeaderValue.Parse(httpContext.Request.ContentType);

                var boundary = MultipartRequestHelper.GetBoundary(
                    mediaTypeHeaderValue,
                    defaultFormOptions.MultipartBoundaryLengthLimit);

                var reader = new MultipartReader(boundary, httpContext.Request.Body);

                var section = await reader.ReadNextSectionAsync();

                while (section != null)
                {

                    var digitalAsset = new DigitalAsset();

                    var hasContentDispositionHeader = ContentDispositionHeaderValue.TryParse(section.ContentDisposition, out ContentDispositionHeaderValue contentDisposition);

                    if (hasContentDispositionHeader)
                    {
                        if (MultipartRequestHelper.HasFileContentDisposition(contentDisposition))
                        {
                            using (var targetStream = new MemoryStream())
                            {
                                await section.Body.CopyToAsync(targetStream);
                                var name = $"{contentDisposition.FileName}".Trim(new char[] { '"' }).Replace("&", "and");

                                digitalAsset = _context.DigitalAssets.SingleOrDefault(x => x.Name == name);

                                if (digitalAsset == null)
                                {
                                    digitalAsset = new DigitalAsset();
                                    digitalAsset.Name = name;
                                    _context.DigitalAssets.Add(digitalAsset);
                                }

                                digitalAsset.Bytes = StreamHelper.ReadToEnd(targetStream);
                                digitalAsset.ContentType = section.ContentType;
                            }

                            try
                            {
                                using (var image = Image.FromStream(new MemoryStream(digitalAsset.Bytes)))
                                {
                                    digitalAsset.Height = image.PhysicalDimension.Height;
                                    digitalAsset.Width = image.PhysicalDimension.Width;
                                }
                            }
                            catch (Exception)
                            {

                            }

                        }
                    }

                    digitalAssets.Add(digitalAsset);

                    section = await reader.ReadNextSectionAsync();
                }

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    DigitalAssetIds = digitalAssets.Select(x => x.DigitalAssetId).ToList()
                };
            }
        }
    }
}
