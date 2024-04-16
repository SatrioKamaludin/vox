using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.OpenApi.Models;
using Vox.Server.Services;
using Microsoft.AspNetCore.Cors.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IOrganizerService, OrganizerService>();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
                   builder.AllowAnyOrigin()// Replace with your frontend domain
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

// Add authentication services
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.HttpOnly = true;
        options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
        options.LoginPath = "/login";
        options.LogoutPath = "/logout";
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API Title", Version = "v1" });

    c.AddSecurityDefinition("BearerAuth", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Input your Bearer token in the following format - Bearer {your token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "BearerAuth"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();
app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication(); // Make sure this comes before UseAuthorization
app.UseAuthorization();

// Use CORS policy
app.UseCors("AllowSpecificOrigin");

app.MapControllers();
app.MapFallbackToFile("/index.html");
app.Run();
