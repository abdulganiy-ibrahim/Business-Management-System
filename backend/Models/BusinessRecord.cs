namespace BusinessRecord.Model;

public record CreateBusinessRecord(string Name, string Category);

public record BusinessRecord(Guid id, Guid UserId, string Name, string Category);