using System;

namespace BudgeterApi.Models
{
  public class Category {
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Budget { get; set; }
    public decimal Spent { get; set; }
    public int CategoryGroupId { get; set; }
  }
}
