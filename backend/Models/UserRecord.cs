using Microsoft.VisualBasic;

namespace UserRecord.Model;

public record CreateUser();

public record User(Guid Id, string FirstName, string? LastName, string Email, DateTime CreatedAt, bool verified);