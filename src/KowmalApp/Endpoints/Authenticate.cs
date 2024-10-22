using KowmalApp.Stores;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace KowmalApp.Endpoints;

using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Net;
using System.Text.Json;
using System.IO;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;

public class Authenticate
{
    private readonly ILogger _logger;

    public Authenticate(ILoggerFactory loggerFactory)
    {
        _logger = loggerFactory.CreateLogger<UploadProduct>();
    }

    [Function("Authenticate")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "authenticate")] HttpRequestData req)
    {
        _logger.LogInformation("Processing the Authenticate request.");
        try
        {
            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var loginRequest = JsonConvert.DeserializeObject<LoginRequest>(requestBody);

            if (loginRequest == null)
            {
                _logger.LogWarning("Invalid request body.");
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequestResponse.WriteStringAsync("Invalid request body.");
                return badRequestResponse;
            }

            // Validate the credentials
            var user = UserStore.GetUser(loginRequest.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.PasswordHash))
            {
                _logger.LogWarning("Invalid username or password.");
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                await unauthorizedResponse.WriteStringAsync("Invalid username or password.");
                return unauthorizedResponse;
            }

            // Generate JWT token
            var token = GenerateJwtToken(user.Username);

            // Return the token
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(new { token });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError("Unhandled exception.");
            var internalServerErrorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await internalServerErrorResponse.WriteStringAsync($"Unhandled exception. {ex.Message}");
            return internalServerErrorResponse;
        }
    }

    private string GenerateJwtToken(string username)
    {
        var secretKey = Environment.GetEnvironmentVariable("JwtSecretKey");
        var issuer = Environment.GetEnvironmentVariable("JwtIssuer");
        var audience = Environment.GetEnvironmentVariable("JwtAudience");

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new System.Security.Claims.ClaimsIdentity(new[]
            {
                new System.Security.Claims.Claim("username", username),
                // Add other claims if needed
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}

public class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}