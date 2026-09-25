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

  [HttpPost]
  public IActionResult Create(CreateProductRecord newProduct)
  {
    var user = (User)HttpContext.Items["CurrentUser"]!;

    try
    {
      var productId = _productService.Create(user.Id, newProduct);
      return Ok(productId);
    } catch (KeyNotFoundException ex)
    {
      return NotFound(ex.Message);
    }
  }
}