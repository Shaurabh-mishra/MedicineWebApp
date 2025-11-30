namespace MedApp.Core.Entities;

public class Medicine
{
    public int MedicineId { get; set; }
    public string Name { get; set; } = "";
    public string Company { get; set; } = "";
    public decimal Price { get; set; }
    public DateTime ExpiryDate { get; set; }
    public int Stock { get; set; }
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
}
