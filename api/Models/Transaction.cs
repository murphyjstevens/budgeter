using System;

namespace BudgeterApi.Models;

public class Transaction {
  public int Id { get; set; }
  public int AccountId { get; set; }
  public DateTime Date { get; set; }
  public int RecipientId { get; set; }
  public decimal Cost { get; set; }
  public int? CategoryId { get; set; }
}
