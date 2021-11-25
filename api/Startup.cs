using System;
using BudgeterApi.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

namespace BudgeterApi
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {

      services.AddControllers();
      services.AddSwaggerGen(c =>
      {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "BudgeterApi", Version = "v1" });
      });

      services.AddScoped<IAccountRepository, AccountRepository>();
      services.AddScoped<IBudgetRepository, BudgetRepository>();
      services.AddScoped<ICategoryGroupRepository, CategoryGroupRepository>();
      services.AddScoped<ICategoryRepository, CategoryRepository>();
      services.AddScoped<ITransactionRepository, TransactionRepository>();
      services.AddScoped<IRecipientRepository, RecipientRepository>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "BudgeterApi v1"));
      }

      app.UseCors(cors => 
        cors.SetIsOriginAllowed(origin => new Uri(origin).Host == Configuration.GetValue<string>("ClientHostName"))
            .AllowAnyHeader()
            .AllowAnyMethod());

      app.UseHttpsRedirection();

      app.UseRouting();

      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });
    }
  }
}
