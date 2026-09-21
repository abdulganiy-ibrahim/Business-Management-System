namespace BusinessManagementApi.Models;

public record User(
    Guid Id,
    string Email,
    string? DisplayName,
    string? Phone,
    DateTime CreatedAt,
    DateTime? LastSignInAt
);