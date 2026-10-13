namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestPhoto;

public class GetMaintenanceRequestPhotoResponse
{
    public byte[] Bytes { get; set; } = Array.Empty<byte>();
    public string ContentType { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}
