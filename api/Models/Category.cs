namespace Api.Models;

public class Category {
  public int Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public decimal Spent { get; set; }
  public decimal Available { get; set; }
  public int SortOrder { get; set; }
  public int CategoryGroupId { get; set; }
}
