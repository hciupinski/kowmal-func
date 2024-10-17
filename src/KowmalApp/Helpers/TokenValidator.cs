namespace KowmalApp.Helpers;

using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;

public class TokenValidator
{
    public static ClaimsPrincipal ValidateToken(string token)
    {
        var secretKey = Environment.GetEnvironmentVariable("JwtSecretKey");
        var issuer = Environment.GetEnvironmentVariable("JwtIssuer");
        var audience = Environment.GetEnvironmentVariable("JwtAudience");

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

        var tokenHandler = new JwtSecurityTokenHandler();
        var validationParameters = new TokenValidationParameters()
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = securityKey,
            ValidateIssuer = true,
            ValidIssuer = issuer,
            ValidateAudience = true,
            ValidAudience = audience,
            ValidateLifetime = true
        };

        try
        {
            var principal = tokenHandler.ValidateToken(token, validationParameters, out var securityToken);
            return principal;
        }
        catch
        {
            // Token validation failed
            return null;
        }
    }
}