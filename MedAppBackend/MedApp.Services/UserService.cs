using MedApp.Core.Entities;
using MedApp.Core.Interfaces;

namespace MedApp.Services;

public class UserService
{
    private readonly IUserRepository _userRepo;

    public UserService(IUserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    public async Task<User> CreateOrGetUser(string name, string email)
    {
        var existing = await _userRepo.GetByEmailAsync(email);
        if (existing != null)
            return existing;

        var user = new User
        {
            Name = name,
            Email = email,
            Provider = "Google",
            CreatedOn = DateTime.UtcNow
        };

        return await _userRepo.AddAsync(user);
    }
}
