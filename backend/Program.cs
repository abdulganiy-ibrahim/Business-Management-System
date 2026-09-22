using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BusinessManagementApi.Data;
using BusinessManagementApi.Services;
using BusinessManagementApi.Middleware;

var builder = WebApplication.CreateBuilder(args);

// get database connection strings
var connectionString = builder.Configuration.GetConnectionString("BMSDB")
    ?? throw new InvalidOperationException("Connecting string 'BMSDB' not found");

// Register Repositories with the DI Container
builder.Services.AddScoped<UserRepository>(sp => new UserRepository(connectionString));
builder.Services.AddScoped<BusinessRepository>(sp => new BusinessRepository(connectionString));

// Register Services with the DI Container
builder.Services.AddScoped<BusinessService>();
builder.Services.AddScoped<UserService>();

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var jwtSecret = builder.Configuration["Supabase:JwtSecret"]
    ?? throw new InvalidOperationException("Supabase JWT secret not found.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer = false,
            ValidateAudience = false
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

app.UseAuthentication();
app.UseAuthorization();

// Register Middleware.
app.UseMiddleware<UserExistsMiddleware>();

app.MapControllers();

app.Run();