using BusinessManagementApi.Model;
using BusinessManagementApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusinessManagementApi.Controller;

[ApiController]
[Route("api/products")]
[Authorize]
public class ProductController : ControllerBase
{
  private readonly ProductService _productService;

  public ProductController(ProductService productService)
  {
    _productService = productService;
  }
}