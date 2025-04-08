using DoAnTotNghiep.Data.EntitiesConfig;
using DoAnTotNghiep.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;


namespace DoAnTotNghiep.Data
{
    public class DatabaseContext: IdentityDbContext<AppUser, AppRole, string>
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> dbContextOptions) : base(dbContextOptions) { }
        /*  protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(Program).Assembly);
        }*/

        public DbSet<Movie> Movies { get; set; } 
        public DbSet<Comment> Comments { get; set; } 
        public DbSet<SubCategory> SubCategories { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<LinkMovie> LinkMovies { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<SubActor> SubActors { get; set; }
        public DbSet<Actor> Actors { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cấu hình Identity mặc định
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(Program).Assembly);

            // Cấu hình thực thể Account (không cần DbSet)
            modelBuilder.ApplyConfiguration(new AccountEntitiesConfig());

            modelBuilder.Entity<Movie>(b =>
            {
                b.ToTable("Movie");
                b.HasKey(m => m.IdMovie);
                b.Property(m => m.IdMovie).HasColumnName("Id").HasColumnType("VARCHAR(50)").IsRequired(); // Ví dụ: varchar(50), not null
                b.Property(m => m.Title).HasColumnName("Title").HasColumnType("VARCHAR(255)").IsRequired(); // Ví dụ: nvarchar(255), not null
                b.Property(m => m.SlugTitle).HasColumnName("SlugTitle").HasColumnType("VARCHAR(255)");
                b.Property(m => m.Description).HasColumnName("Description").HasColumnType("VARCHAR(1500)"); // Ví dụ: nvarchar(max)
                b.Property(m => m.Nation).HasColumnName("Nation").HasColumnType("VARCHAR(50)"); // Ví dụ: nvarchar(50)
                b.Property(m => m.TypeMovie).HasColumnName("TypeMovie").HasColumnType("VARCHAR(50)"); // Ví dụ: nvarchar(50)
                b.Property(m => m.Status).HasColumnName("Status").HasColumnType("VARCHAR(50)"); // Ví dụ: nvarchar(50)
                b.Property(m => m.SlugTypeMovie).HasColumnName("SlugTypeMovie").HasColumnType("VARCHAR(100)");
                b.Property(m => m.NumberOfMovie).HasColumnName("NumberOfMovie");
                b.Property(m => m.SlugNation).HasColumnName("SlugNation").HasColumnType("VARCHAR(50)");
                b.Property(m => m.Image).HasColumnName("Image").HasColumnType("VARCHAR(500)");
                b.Property(m => m.BackgroundImage).HasColumnName("BackgroundImage").HasColumnType("VARCHAR(500)");
                b.Property(m => m.Duration).HasColumnName("Duration");
                b.Property(m => m.Quality).HasColumnName("Quality").HasColumnType("VARCHAR(50)"); // Ví dụ: nvarchar(50)
                b.Property(m => m.Block).HasColumnName("Block").IsRequired(true);
                b.Property(m => m.NameDirector).HasColumnName("NameDirector").HasColumnType("VARCHAR(50)");
                b.Property(m => m.IsVip).HasColumnName("IsVip").IsRequired(true);
                b.Property(m => m.Language).HasColumnName("Language").HasColumnType("VARCHAR(50)"); // Ví dụ: nvarchar(50)
                b.Property(m => m.View).HasColumnName("View");
                
            });

            modelBuilder.Entity<Comment>(b =>
            {
                b.ToTable("Comment");
                b.HasKey(m => m.IdComment);
                b.Property(m => m.IdComment).HasColumnName("IdComment").HasColumnType("VARCHAR(50)");
                b.Property(m => m.IdMovie).HasColumnName("IdMovie").HasColumnType("VARCHAR(50)");
                b.Property(m => m.IdUserName).HasColumnName("IdUserName").HasColumnType("VARCHAR(50)");
                b.Property(m => m.Content).HasColumnName("Content").HasColumnType("VARCHAR(400)");
                b.Property(m => m.TimeComment).HasColumnName("TimeComment").HasColumnType("VARCHAR(150)");

                b.HasOne(c => c.Movie) 
                        .WithMany(m => m.Comments) 
                        .HasForeignKey(c => c.IdMovie) 
                        .OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<LinkMovie>(b =>
            {
                b.ToTable("LinkMovie");
                b.HasKey(m => m.IdLinkMovie);
                b.Property(m => m.IdLinkMovie).HasColumnName("IdLinkMovie").HasColumnType("VARCHAR(50)").IsRequired();
                b.Property(m => m.IdMovie).HasColumnName("IdMovie").HasColumnType("VARCHAR(50)").IsRequired();
                b.Property(m => m.Episode).HasColumnName("Episode");
                b.Property(m => m.UrlMovie).HasColumnName("UrlMovie").HasColumnType("VARCHAR(400)").IsRequired();
                
                b.HasOne(c => c.Movie)
                .WithMany(m => m.LinkMovies)
                .HasForeignKey( c => c.IdMovie)
                .OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<Category>(b =>
            {
                b.ToTable("Category");
                b.HasKey(m => m.IdCategories);
                b.Property(m => m.IdCategories).HasColumnName("IdCategories").HasColumnType("VARCHAR(50)");
                b.Property(m => m.SlugNameCategories).HasColumnName("SlugNameCategories").HasColumnType("VARCHAR(200)");
                b.Property(m => m.NameCategories).HasColumnName("NameCategories").HasColumnType("VARCHAR(200)");
            });
            modelBuilder.Entity<SubCategory>(b =>
            {
                b.HasKey(mt => new { mt.IdMovie, mt.IdCategory });

                b.HasOne(c => c.Movie)
                         .WithMany(m => m.SubCategories)
                         .HasForeignKey(c => c.IdMovie)
                         .OnDelete(DeleteBehavior.Cascade);

                b.HasOne(c => c.Category)
                        .WithMany(m => m.SubCategories)
                        .HasForeignKey(c => c.IdCategory)
                        .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<SubActor>(s =>
            {
                s.ToTable("SubActor");
                s.HasKey(mt => new { mt.IdMovie, mt.IdActor });

                s.HasOne(c => c.Movie)
                        .WithMany(m => m.SubActors)
                        .HasForeignKey(c=>c.IdMovie)
                        .OnDelete(DeleteBehavior.Cascade);

                s.HasOne(c => c.Actor)
                        .WithMany(m => m.SubActors)
                        .HasForeignKey(c => c.IdActor)
                        .OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<Actor>(a =>
            {
                a.ToTable("Actor");
                a.HasKey(k => k.IdActor);
                a.Property(r => r.IdActor).HasColumnName("IdActor").HasColumnType("VARCHAR(50)").IsRequired(true);
                a.Property(r => r.ActorName).HasColumnName("ActorName").HasColumnType("VARCHAR(350)").IsRequired(true);
                a.Property(r => r.BirthDay).HasColumnName("Birthday").HasColumnType("VARCHAR(50)").IsRequired(false);
                a.Property(r => r.UrlImage).HasColumnName("UrlImage").HasColumnType("VARCHAR(200)");
                a.Property(r => r.SlugActorName).HasColumnName("SlugActorName").HasColumnType("VARCHAR(350)").IsRequired(false);
            });
            modelBuilder.Entity<Report>(b =>
            {
                b.ToTable("Report");
                b.HasKey(r => r.IdReport);
                b.Property(r => r.IdReport).HasColumnName("IdReport").HasColumnType("VARCHAR(50)").IsRequired(true);
                b.Property(r => r.IdMovie).HasColumnName("IdMovie").HasColumnType("VARCHAR(50)").IsRequired(false);
                b.Property(r => r.UserNameReporter).HasColumnName("UserNameReporter").HasColumnType("VARCHAR(150)").IsRequired(true);
                b.Property(r => r.Content).HasColumnName("Content").HasColumnType("VARCHAR(250)").IsRequired(true);
                b.Property(r => r.UserNameAdminFix).HasColumnName("UserNameAdminFix").HasColumnType("VARCHAR(50)").IsRequired(false);
                b.Property(r => r.Response).HasColumnName("Response").HasColumnType("VARCHAR(250)").IsRequired(false);
                b.Property(r => r.TimeReport).HasColumnName("TimeReport").HasColumnType("VARCHAR(50)").IsRequired(true);
                b.Property(r => r.TimeResponse).HasColumnName("TimeResponse").HasColumnType("VARCHAR(50)").IsRequired(false);
                b.Property(r => r.Status).HasColumnName("Status").IsRequired(true);

                b.HasOne(r => r.Movie)
                    .WithMany(b => b.Reports)
                    .HasForeignKey(r => r.IdMovie)
                    .IsRequired(false);

                
            });
               
          
            

            List<AppRole> roles = new List<AppRole>
            {
                new AppRole
                {
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                },
                new AppRole
                {
                    Name = "User",
                    NormalizedName = "USER",
                },

            };
            modelBuilder.Entity<AppRole>().HasData(roles);

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.ConfigureWarnings(warnings => warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
            base.OnConfiguring(optionsBuilder);
        }

    }
}
