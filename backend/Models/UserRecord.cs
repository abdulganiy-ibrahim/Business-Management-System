using Microsoft.VisualBasic;

namespace UserRecord.Model;

public record UserRecord(Guid Id, string FirstName, string? LastName, string Email, DateTime CreatedAt, bool verified);