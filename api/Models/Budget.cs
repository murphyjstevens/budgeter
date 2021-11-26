using System;

namespace BudgeterApi.Models
{
  public class Budget {
    public int Id { get; set; }
    public decimal Assigned { get; set; }
    public DateTime Date { get; set; }
    public int CategoryId { get; set; }
  }
}
