using KowmalApp.Models;

namespace KowmalApp.Stores;

public static class UserStore
{
    private static List<User> _users = new List<User>
    {
        new User
        {
            Username = "admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(Environment.GetEnvironmentVariable("UserPassword"))
        }
    };

    public static User? GetUser(string username)
    {
        return _users.FirstOrDefault(u => u.Username == username);
    }
}