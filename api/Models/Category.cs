namespace Api.Models;

public class Category {
  public int Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public int SortOrder { get; set; }
  public int CategoryGroupId { get; set; }

  // Calculated Fields
  public decimal Spent { get; set; }
  public decimal Available { get; set; }
  public decimal Budget { get; set; }
}
