namespace MedApp.Core.Entities;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Provider { get; set; } = "";
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
}
