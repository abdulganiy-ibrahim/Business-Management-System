using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using BusinessManagementApi.Data;
using BusinessManagementApi.Service;
using BusinessManagementApi.Middleware;
using BusinessManagementApi.Services;

var builder = WebApplication.CreateBuilder(args);

// get database connection strings
var connectionString = builder.Configuration.GetConnectionString("BusinessManagementDB")
    ?? throw new InvalidOperationException("Connecting string 'BusinessManagementDB' not found");

// Register Repositories with the DI Container
builder.Services.AddScoped<UserRepository>(sp => new UserRepository(connectionString));
builder.Services.AddScoped<BusinessRepository>(sp => new BusinessRepository(connectionString));
builder.Services.AddScoped<ProductRepository>(sp => new ProductRepository(connectionString));

// Register Services with the DI Container
builder.Services.AddScoped<BusinessService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ProductService>();

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// ADD CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.Authority = "https://kayecsjjsjxhhtlaqavh.supabase.co/auth/v1";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "https://kayecsjjsjxhhtlaqavh.supabase.co/auth/v1",
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

// Register Middleware.
app.UseMiddleware<UserExistsMiddleware>();

app.MapControllers();

app.Run();