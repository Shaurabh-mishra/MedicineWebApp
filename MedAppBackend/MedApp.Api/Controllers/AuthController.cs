using Google.Apis.Auth;
using MedApp.Core.Dto;
using MedApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace MedApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserService _userService;
    private readonly JwtService _jwtService;

    public AuthController(UserService userService, JwtService jwtService)
    {
        _userService = userService;
        _jwtService = jwtService;
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
        // 1️⃣ Verify token with Google
        var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken);
            // var payload = new GoogleJsonWebSignature.Payload
            // {
            //     Email = "testuser@gmail.com",
            //     Name = "Test User"
            // };
        // 2️⃣ Create or get user
        var user = await _userService.CreateOrGetUser(payload.Name, payload.Email);

        // 3️⃣ Generate your JWT for Angular
        var jwt = _jwtService.GenerateToken(payload.Email, payload.Name);

        return Ok(new
        {
            token = jwt,
            name = payload.Name,
            email = payload.Email
        });
    }
}
