namespace BusinessManagementApi.Model;

public record UserRecord(
    Guid Id,
    string Email,
    string DisplayName,
    string? Phone,
    DateTime CreatedAt,
    DateTime LastSignIn
);