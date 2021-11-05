using System.Collections.Generic;
using BudgeterApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using BudgeterApi.Repositories;
using System;
using BudgeterApi.Requests;
using System.Threading.Tasks;

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
    public async Task<IEnumerable<CategoryGroup>> Get()
    {
      return await _repository.Get();
    }

    [HttpPost]
    public async Task<CategoryGroup> Create(CategoryGroup group)
    {
      return await _repository.Create(group);
    }

    [HttpPut]
    public async Task<CategoryGroup> Update(CategoryGroup group)
    {
      return await _repository.Update(group);
    }

    [HttpPatch]
    [Route("reorder")]
    public async Task<Tuple<CategoryGroup, CategoryGroup>> Reorder(ReorderRequest request)
    {
      return await _repository.Reorder(request);
    }

    [HttpDelete]
    [Route("{id}")]
    public async Task Delete(int id)
    {
      await _repository.Delete(id);
    }
  }
}
