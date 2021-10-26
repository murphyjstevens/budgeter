using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BudgeterApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using BudgeterApi.Mocks;
using BudgeterApi.Repositories;

namespace BudgeterApi.Controllers
{
  [ApiController]
  [Route("CategoryGroups")]
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
  }
}
