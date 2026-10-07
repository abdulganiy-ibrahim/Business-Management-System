namespace BusinessManagementApi.Models;

public record CreateDebitSaleRequest(
  int SaleId,
  decimal AmountDue,
  decimal AmountPaid
);

public record DebitRecord(
  int Id,
  int SaleId,
  decimal AmountDue,
  decimal AmountPaid,
  DateTime CreatedAt,
  DateTime UpdatedAt
);

public record PayDebtRequest(decimal Amount);