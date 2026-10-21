namespace Coop.Application.Behaviors;

/// <summary>
/// Marks a request of an office area: only a caller holding an office role
/// may send it (L2-REQ-105, ADR 0012).
/// </summary>
[AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
public class OfficeOnlyAttribute : Attribute
{
}
