namespace BusinessManagementApi.Model;

public record User(
    Guid Id,
    string Email,
    string DisplayName,
    string? Phone,
    DateTime CreatedAt,
    DateTime LastSignIn
);