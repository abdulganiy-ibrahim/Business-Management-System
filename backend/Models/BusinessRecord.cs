namespace BusinessManagementApi.Model;

public record CreateBusinessRecord(string Name, string Category, string PhoneNumber);

public record BusinessRecord(Guid Id, Guid UserId, string Name, string Category, string PhoneNumber, string slug);