using System.Linq;
using System.Collections.Generic;
using BudgeterApi.Models;

namespace BudgeterApi.Mocks 
{
  public static class CategoryMock 
  {
    public static IEnumerable<Category> Categories = new List<Category> 
    {
      new Category {
        Id = 1,
        Name = "Groceries",
        Budget = 500.52m,
        Spent = 25.22m,
        CategoryGroupId = 1
      }, 
      new Category {
        Id = 2,
        Name = "Mortage",
        Budget = 2000.00m,
        Spent = 0.00m,
        CategoryGroupId = 1
      }, 
      new Category {
        Id = 3,
        Name = "Dining Out",
        Budget = 111.00m,
        Spent = 10.00m,
        CategoryGroupId = 2
      }
    };
  }
}