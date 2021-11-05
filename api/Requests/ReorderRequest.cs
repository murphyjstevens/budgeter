namespace BudgeterApi.Requests
{
  public class ReorderItemRequest
  {
    public int Id { get; set; }
    public int SortOrder { get; set; }
  }

  public class ReorderRequest
  {
    public ReorderItemRequest Item1 { get; set; }
    public ReorderItemRequest Item2 { get; set; }
  }
}