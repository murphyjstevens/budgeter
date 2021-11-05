using System.Collections.Generic;
using BudgeterApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using BudgeterApi.Repositories;
using System;
using BudgeterApi.Requests;

namespace BudgeterApi.Controllers
{
  [ApiController]
  [Route("category-groups")]
  public class CategoryGroupController : ControllerBase
  {
    private readonly ILogger<CategoryGroupController> _logger;
    private readonly ICategoryGroupRepository _repository;

    public CategoryGroupController(ILogger<CategoryGroupController> logger, ICategoryGroupRepository repository)
    {
      _logger = logger;
      _repository = repository;
    }

    [HttpGet]
    public IEnumerable<CategoryGroup> Get()
    {
      return _repository.Get();
    }

    [HttpPost]
    public CategoryGroup Create(CategoryGroup group)
    {
      return _repository.Create(group);
    }

    [HttpPut]
    public CategoryGroup Update(CategoryGroup group)
    {
      return _repository.Update(group);
    }

    [HttpPatch]
    [Route("reorder")]
    public Tuple<CategoryGroup, CategoryGroup> Reorder(ReorderRequest request)
    {
      return _repository.Reorder(request);
    }

    [HttpDelete]
    [Route("{id}")]
    public void Delete(int id)
    {
      _repository.Delete(id);
    }
  }
}
