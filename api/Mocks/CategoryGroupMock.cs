using System.Linq;
using System.Collections.Generic;
using BudgeterApi.Models;

namespace BudgeterApi.Mocks 
{
  public static class CategoryGroupMock 
  {
    public static IEnumerable<CategoryGroup> CategoryGroups = new List<CategoryGroup> 
    {
      new CategoryGroup { Id = 1, Name = "Necessary" },
      new CategoryGroup { Id = 2, Name = "Fun Stuff" }
    };
  }
}