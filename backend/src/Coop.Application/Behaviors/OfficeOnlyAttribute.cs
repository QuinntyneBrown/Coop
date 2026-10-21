namespace Coop.Application.Behaviors;

/// <summary>
/// Marks a request of an office area: only a caller holding an office role
/// may send it (L2-REQ-113, ADR 0016).
/// </summary>
[AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
public class OfficeOnlyAttribute : Attribute
{
}
