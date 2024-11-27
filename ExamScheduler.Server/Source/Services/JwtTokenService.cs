using ExamScheduler.Server.Source.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ExamScheduler.Server.Source.Services
{
    public class JwtTokenService(IConfiguration configuration, UserManager<User> userManager)
    {
        private readonly IConfiguration _configuration = configuration;
        private readonly UserManager<User> _userManager = userManager;

        public string GenerateToken(User user)
        {
            var secretKey = _configuration["Jwt:SecretKey"];
            var handler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);
            var credentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = GenerateClaimsAsync(user).Result,
                Expires = DateTime.UtcNow.AddMinutes(15),
                SigningCredentials = credentials,
            };

            var token = handler.CreateToken(tokenDescriptor);
            return handler.WriteToken(token);
        }

        private async Task<ClaimsIdentity> GenerateClaimsAsync(User user)
        {
            var claims = new ClaimsIdentity();
            claims.AddClaim(new Claim(ClaimTypes.Email, user.Email));
            claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id));
            var roles = await _userManager.GetRolesAsync(user);
            // Add roles as claims
            foreach (var role in roles)
            {
                claims.AddClaim(new Claim(ClaimTypes.Role, role));
            }
            return claims;
        }
    }
}
