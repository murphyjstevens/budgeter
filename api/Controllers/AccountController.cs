using System.Collections.Generic;
using Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Api.Repositories;
using System.Threading.Tasks;

namespace Api.Controllers;

[ApiController]
[Route("accounts")]
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
  public async Task<IEnumerable<Account>> Get()
  {
    return await _repository.Get();
  }

  [HttpGet]
  [Route("Url/{url}")]
  public async Task<Account> Find(string url) 
  {
    return await _repository.FindByUrl(url);
  }
}
