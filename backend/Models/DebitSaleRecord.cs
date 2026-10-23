namespace BusinessManagementApi.Models;

public record CreateDebitSaleRequest(
  int SaleId,
  decimal AmountDue,
  decimal AmountPaid
);

public record DebitPaymentRequest(
  int DebitSaleId,
  Guid BusinessId,
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

public record DebitPaymentRecord(
  int Id,
  int DebitSaleId,
  Guid BusinessId,
  decimal AmountPaid,
  DateTime CreatedAt
);

public record PayDebtRequest(decimal Amount);