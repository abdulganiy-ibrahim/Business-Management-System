namespace BusinessManagementApi.Model;

public record CreateBusinessRecord(string Name, string Category);

public record BusinessRecord(Guid Id, Guid UserId, string Name, string Category);