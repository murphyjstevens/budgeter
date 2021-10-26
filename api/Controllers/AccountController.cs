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
  [Route("Accounts")]
  public class AccountController : ControllerBase
  {
    private readonly ILogger<AccountController> _logger;
    private readonly IAccountRepository _repository;

    public AccountController(ILogger<AccountController> logger, IAccountRepository repository)
    {
        _logger = logger;
        _repository = repository;
    }

    [HttpGet]
    public IEnumerable<Account> Get()
    {
      return _repository.Get();
    }

    [HttpGet]
    [Route("Url/{url}")]
    public Account Find(string url) 
    {
      return _repository.FindByUrl(url);
    }
  }
}
