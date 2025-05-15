using DoAnTotNghiep.Data;
using DoAnTotNghiep.DTOs;
using DoAnTotNghiep.Helper.SlugifyHelper;
using DoAnTotNghiep.Model;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace DoAnTotNghiep.Repository
{
    public class SubCategoryRepository : ISubCategoryRepository
    {
        private readonly DatabaseContext _databaseContext;
        public SubCategoryRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        Dictionary<int, string> movieStatusDict = new Dictionary<int, string>
        {
            { 0, "Chưa có lịch" },
            { 1, "Sắp chiếu" },
            { 2, "Đang cập nhật" },
            { 3, "Đang chiếu" },
            { 4, "Đã kết thúc" },
            { 5, "Đã hoàn thành" }
        };
       

        public async Task<bool> AddMovie(MovieToAddDTOs movieToAddDTOs)
        {
            string IdMovie = Guid.NewGuid().ToString();

            // Kiểm tra phim đã tồn tại chưa
            var existingMovie = await _databaseContext.Movies.AsNoTracking()
                .FirstOrDefaultAsync(u => u.Title == movieToAddDTOs.Title);

            if (existingMovie != null)
            {
                return false; // Phim đã tồn tại
            }
            int statusValue = movieStatusDict
    .FirstOrDefault(x => x.Value == movieToAddDTOs.StatusText).Key;

            // Tạo phim mới
            var movie = new Movie
            {
                IdMovie = IdMovie,
                Title = movieToAddDTOs.Title,
                SlugTitle = SlugHelper.Slugify(movieToAddDTOs.Title),
                Description = movieToAddDTOs.Description,
                Nation = movieToAddDTOs.Nation,
                TypeMovie = movieToAddDTOs.TypeMovie,
                SlugTypeMovie = SlugHelper.Slugify(movieToAddDTOs.TypeMovie),
                Status = statusValue.ToString(),
                NumberOfMovie = 0,
                Duration = movieToAddDTOs.Duration,
                Quality = movieToAddDTOs.Quality,
                Language = movieToAddDTOs.Language,
                Block = movieToAddDTOs.Block,
                NameDirector = movieToAddDTOs.NameDirector,
                IsVip = movieToAddDTOs.IsVip,
                View = 0,
                Image = movieToAddDTOs.Image,
                BackgroundImage = movieToAddDTOs.BackgroundImage,
                SlugNation = SlugHelper.Slugify(movieToAddDTOs.Nation),
                Point = 0
            };
            await _databaseContext.Movies.AddAsync(movie);

            // Xử lý danh mục (Category)
            string[] categories = movieToAddDTOs.NameCategories.Split(',')
                .Select(c => c.Trim()) // Xóa khoảng trắng dư thừa
                .Distinct() // Loại bỏ trùng lặp
                .ToArray();

            string[] NameActors = movieToAddDTOs.NameActors.Split(',')
                .Select(c => c.Trim()) // Xóa khoảng trắng dư thừa
                .Distinct() // Loại bỏ trùng lặp
                .ToArray();

            foreach (string categoryName in categories)
            {
                var existingCategory = await _databaseContext.Categories
                    .AsNoTracking() // Không để EF theo dõi entity này
                    .FirstOrDefaultAsync(u => u.NameCategories == categoryName);

                string categoryId;
                if (existingCategory == null)
                {
                    // Tạo mới Category
                    categoryId = Guid.NewGuid().ToString();
                    var newCategory = new Category
                    {
                        IdCategories = categoryId,
                        NameCategories = categoryName,
                        SlugNameCategories = SlugHelper.Slugify(categoryName)
                    };
                    await _databaseContext.Categories.AddAsync(newCategory);
                }
                else
                {
                    categoryId = existingCategory.IdCategories;

                    // Đính kèm vào DbContext để tránh lỗi tracking
                    // _databaseContext.Categories.Attach(existingCategory);
                }

                // Tạo mới SubCategory mà không tạo thực thể mới của Movie & Category
                var newSubCategory = new SubCategory
                {
                    IdMovie = IdMovie,
                    IdCategory = categoryId
                };
                await _databaseContext.SubCategories.AddAsync(newSubCategory);
            }

            foreach (string nameActor in NameActors)
            {
                var existingActor = await _databaseContext.Actors
                    .AsNoTracking() // Không để EF theo dõi entity này
                    .FirstOrDefaultAsync(u => u.ActorName == nameActor);

                string Idactor;
                if (existingActor == null)
                {
                    // Tạo mới Actor
                    Idactor = Guid.NewGuid().ToString();
                    var newActor = new Actor
                    {
                        IdActor = Idactor,
                        ActorName = nameActor,
                        SlugActorName = SlugHelper.Slugify(nameActor)
                    };
                    await _databaseContext.Actors.AddAsync(newActor);
                }
                else
                {
                    Idactor = existingActor.IdActor;

                    // Đính kèm vào DbContext để tránh lỗi tracking
                    // _databaseContext.Categories.Attach(existingCategory);
                }

                // Tạo mới SubCategory mà không tạo thực thể mới của Movie & Category
                var newSubActor = new SubActor
                {
                    IdMovie = IdMovie,
                    IdActor = Idactor

                };
                await _databaseContext.SubActors.AddAsync(newSubActor);
            }

            // Lưu vào database
            await _databaseContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CreateSubCategory(string IdMovie, string IdCategory)
        {
            var movieExists = await _databaseContext.Movies.AnyAsync(i => i.IdMovie == IdMovie);
            var categoryExists = await _databaseContext.Categories.AnyAsync(i => i.IdCategories == IdCategory);

            if (!movieExists || !categoryExists)
            {
                return false; // Nếu không tồn tại Movie hoặc Category, trả về false
            }

            var existingSubCategory = await _databaseContext.SubCategories
                .FirstOrDefaultAsync(i => i.IdMovie == IdMovie && i.IdCategory == IdCategory);

            if (existingSubCategory != null)
            {
                return false; // Tránh chèn trùng lặp
            }

            var newSubCategory = new SubCategory
            {
                IdMovie = IdMovie,
                IdCategory = IdCategory,
                Movie = new Movie { IdMovie = IdMovie },
                Category = new Category { IdCategories = IdCategory }
            };

            // Đánh dấu Movie và Category là Unchanged để EF không chèn mới
            _databaseContext.Entry(newSubCategory.Movie).State = EntityState.Unchanged;
            _databaseContext.Entry(newSubCategory.Category).State = EntityState.Unchanged;

            try
            {
                await _databaseContext.SubCategories.AddAsync(newSubCategory);
                await _databaseContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> DeleteMovie(string IdMovie)
        {
            var movie = await _databaseContext.Movies.FirstOrDefaultAsync(i => i.IdMovie == IdMovie);
            if (movie != null)
            {
                _databaseContext.Movies.Remove(movie);
                await _databaseContext.SaveChangesAsync();
                return true;
            }
            return false;
        
        }

        public async Task<List<MovieToShowDTOs>> GetAllMovie(string role)
        {
            if (role == "Admin")
            {
                var sql = @"
                    SELECT 
                        m.""Id"", 
                        m.""Title"", 
                        m.""Description"", 
                        m.""Nation"", 
                        m.""TypeMovie"", 
                        m.""Status"", 
                        m.""NumberOfMovie"", 
                        m.""Duration"", 
                        m.""Quality"", 
                        m.""Language"", 
                        m.""View"", 
                        m.""Image"", 
                        m.""BackgroundImage"",
                        m.""IsVip"",
                        m.""Block"",
                        m.""NameDirector"",
                        m.""Point"",
                        COALESCE(STRING_AGG(DISTINCT c.""NameCategories"", ', '), '') AS ""NameCategories"",
                        COALESCE(STRING_AGG(DISTINCT a.""ActorName"", ', '), '') AS ""NameActors"",
                        lm.""UrlMovie"",
                        lm.""Episode"",
                        lm.""CreatedAt""
                    FROM ""Movie"" m
                    LEFT JOIN ""SubCategories"" sc ON m.""Id"" = sc.""IdMovie""
                    LEFT JOIN ""Category"" c ON sc.""IdCategory"" = c.""IdCategories""
                    LEFT JOIN (
                        SELECT DISTINCT ON (""IdMovie"") ""IdMovie"", ""Episode"", ""CreatedAt"", ""UrlMovie""
                        FROM ""LinkMovie""
                        ORDER BY ""IdMovie"", ""CreatedAt"" DESC
                    ) lm ON m.""Id"" = lm.""IdMovie""
                    LEFT JOIN ""SubActor"" sa ON m.""Id"" = sa.""IdMovie""
                    LEFT JOIN ""Actor"" a ON sa.""IdActor"" = a.""IdActor""
                    GROUP BY m.""Id"", lm.""UrlMovie"", lm.""Episode"", lm.""CreatedAt"";
                    ";



                return await _databaseContext.Database.SqlQueryRaw<MovieToShowDTOs>(sql).ToListAsync();
            }
            else
            {
                var sql = @"
                    SELECT 
                        m.""Id"", 
                        m.""Title"", 
                        m.""Description"", 
                        m.""Nation"", 
                        m.""TypeMovie"", 
                        m.""Status"", 
                        m.""NumberOfMovie"", 
                        m.""Duration"", 
                        m.""Quality"", 
                        m.""Language"", 
                        m.""View"", 
                        m.""Image"", 
                        m.""BackgroundImage"",
                        m.""IsVip"",
                        m.""Block"",
                        m.""NameDirector"",
                        m.""Point"",
                        COALESCE(STRING_AGG(DISTINCT c.""NameCategories"", ', '), '') AS ""NameCategories"",
                        COALESCE(STRING_AGG(DISTINCT a.""ActorName"", ', '), '') AS ""NameActors"",
                        lm.""UrlMovie"",
                        lm.""Episode"",
                        lm.""CreatedAt""
                    FROM ""Movie"" m
                    LEFT JOIN ""SubCategories"" sc ON m.""Id"" = sc.""IdMovie""
                    LEFT JOIN ""Category"" c ON sc.""IdCategory"" = c.""IdCategories""
                    LEFT JOIN (
                        SELECT DISTINCT ON (""IdMovie"") ""IdMovie"", ""Episode"", ""CreatedAt"", ""UrlMovie""
                        FROM ""LinkMovie""
                        ORDER BY ""IdMovie"", ""CreatedAt"" DESC
                    ) lm ON m.""Id"" = lm.""IdMovie""
                    LEFT JOIN ""SubActor"" sa ON m.""Id"" = sa.""IdMovie""
                    LEFT JOIN ""Actor"" a ON sa.""IdActor"" = a.""IdActor""
                    WHERE m.""Block"" = false
                    GROUP BY m.""Id"", lm.""UrlMovie"", lm.""Episode"", lm.""CreatedAt"";
                    ";
                return await _databaseContext.Database.SqlQueryRaw<MovieToShowDTOs>(sql).ToListAsync();
            }
        }

        public async Task<List<MovieToShowDTOs>> GetMovieByCategory(string SlugCategory)
        {
            var sql = @"
                WITH MovieFiltered AS (
                    SELECT DISTINCT m.""Id""
                    FROM ""Movie"" m
                    LEFT JOIN ""SubCategories"" sc ON m.""Id"" = sc.""IdMovie""
                    LEFT JOIN ""Category"" c ON sc.""IdCategory"" = c.""IdCategories""
                    WHERE c.""SlugNameCategories"" ILIKE '%' || @slugcategory || '%'
                )
                SELECT 
                    m.""Id"", 
                    m.""Title"",  
                    m.""Description"", 
                    m.""Nation"", 
                    m.""TypeMovie"", 
                    m.""Status"", 
                    m.""NumberOfMovie"",
                    m.""Duration"", 
                    m.""Quality"", 
                    m.""Language"",
                    m.""IsVip"",
                    m.""Block"",
                    m.""NameDirector"",
                    m.""View"", 
                    m.""Image"",
                    m.""BackgroundImage"",
                    m.""Point"",
                    lm.""Episode"",
                    lm.""CreatedAt"",
                    COALESCE(STRING_AGG(DISTINCT c.""NameCategories"", ', '), '') AS ""NameCategories"",
                    COALESCE(STRING_AGG(DISTINCT a.""ActorName"", ', '), '') AS ""NameActors"",
                    COALESCE(STRING_AGG(DISTINCT lm.""UrlMovie"" || '-Tap-' || lm.""Episode"", ', '), '') AS ""UrlMovie""
                FROM ""Movie"" m
                LEFT JOIN ""SubCategories"" sc ON m.""Id"" = sc.""IdMovie""
                LEFT JOIN ""Category"" c ON sc.""IdCategory"" = c.""IdCategories""
                
                LEFT JOIN (
                    SELECT DISTINCT ON (""IdMovie"") ""IdMovie"", ""Episode"", ""CreatedAt"", ""UrlMovie""
                    FROM ""LinkMovie""
                    ORDER BY ""IdMovie"", ""CreatedAt"" DESC
                ) lm ON m.""Id"" = lm.""IdMovie""
                LEFT JOIN ""SubActor"" sa ON m.""Id"" = sa.""IdMovie""
                LEFT JOIN ""Actor"" a ON sa.""IdActor"" = a.""IdActor""
                WHERE m.""Id"" IN (SELECT ""Id"" FROM MovieFiltered)
                AND m.""Block"" = false
                GROUP BY m.""Id"", lm.""UrlMovie"", lm.""Episode"", lm.""CreatedAt"";
            ";
            return await _databaseContext.Database
        .SqlQueryRaw<MovieToShowDTOs>(sql, new[] { new NpgsqlParameter("@slugcategory", SlugCategory) })
            .ToListAsync();
        }

        public async Task<List<MovieToShowDTOs>> GetMovieByTitleSlug(string titleSlug)
        {
            var sql = @"
                SELECT 
                    m.""Id"", 
                    m.""Title"",  
                    m.""Description"", 
                    m.""Nation"", 
                    m.""TypeMovie"", 
                    m.""Status"", 
                    m.""NumberOfMovie"",
                    m.""Duration"", 
                    m.""Quality"", 
                    m.""Language"", 
                    m.""View"", 
                    m.""Image"",
                    m.""IsVip"",
                    m.""Block"",
                    m.""NameDirector"",
                    m.""BackgroundImage"",
                    m.""Point"",
                    lm.""Episode"",
                    lm.""CreatedAt"",
                    COALESCE(STRING_AGG(DISTINCT c.""NameCategories"", ', '), '') AS ""NameCategories"",
                    COALESCE(STRING_AGG(DISTINCT a.""ActorName"", ', '), '') AS ""NameActors"",
                    COALESCE(STRING_AGG(DISTINCT lm.""UrlMovie"" || '-Tap-' || lm.""Episode"", ', '), '') AS ""UrlMovie""
                    FROM ""Movie"" m
                LEFT JOIN ""SubCategories"" sc ON m.""Id"" = sc.""IdMovie""
                LEFT JOIN ""Category"" c ON sc.""IdCategory"" = c.""IdCategories""
                LEFT JOIN ""SubActor"" sa ON m.""Id"" = sa.""IdMovie""
                LEFT JOIN (
                    SELECT DISTINCT ON (""IdMovie"") ""IdMovie"", ""Episode"", ""CreatedAt"", ""UrlMovie""
                    FROM ""LinkMovie""
                    ORDER BY ""IdMovie"", ""CreatedAt"" DESC
                ) lm ON m.""Id"" = lm.""IdMovie""
                LEFT JOIN ""Actor"" a ON sa.""IdActor"" = a.""IdActor""
                WHERE m.""SlugTitle"" ILIKE '%' || @titleSlug || '%'
                GROUP BY m.""Id"", lm.""UrlMovie"", lm.""Episode"", lm.""CreatedAt"";";

            return await _databaseContext.Database
        .SqlQueryRaw<MovieToShowDTOs>(sql, new[] { new NpgsqlParameter("@titleSlug", titleSlug) })
            .ToListAsync();
        }
        public async Task<List<MovieToShowDTOs>> GetMovieById(string id)
        {
            var sql = @"
                SELECT 
                    m.""Id"", 
                    m.""Title"",  
                    m.""Description"", 
                    m.""Nation"", 
                    m.""TypeMovie"", 
                    m.""Status"", 
                    m.""NumberOfMovie"",
                    m.""Duration"", 
                    m.""Quality"", 
                    m.""Language"", 
                    m.""View"", 
                    m.""Image"",
                    m.""IsVip"",
                    m.""Block"",
                    m.""NameDirector"",
                    m.""BackgroundImage"",
                    m.""Point"",
                    lm.""Episode"",
                    lm.""CreatedAt"",
                    COALESCE(STRING_AGG(DISTINCT c.""NameCategories"", ', '), '') AS ""NameCategories"",
                    COALESCE(STRING_AGG(DISTINCT a.""ActorName"", ', '), '') AS ""NameActors"",
                    COALESCE(STRING_AGG(DISTINCT lm.""UrlMovie"" || '-Tap-' || lm.""Episode"", ', '), '') AS ""UrlMovie""
                    FROM ""Movie"" m
                LEFT JOIN ""SubCategories"" sc ON m.""Id"" = sc.""IdMovie""
                LEFT JOIN ""Category"" c ON sc.""IdCategory"" = c.""IdCategories""
                LEFT JOIN ""SubActor"" sa ON m.""Id"" = sa.""IdMovie""
                LEFT JOIN (
                    SELECT DISTINCT ON (""IdMovie"") ""IdMovie"", ""Episode"", ""CreatedAt"", ""UrlMovie""
                    FROM ""LinkMovie""
                    ORDER BY ""IdMovie"", ""CreatedAt"" DESC
                ) lm ON m.""Id"" = lm.""IdMovie""
                LEFT JOIN ""Actor"" a ON sa.""IdActor"" = a.""IdActor""
                WHERE m.""Id"" = @id
                GROUP BY m.""Id"", lm.""UrlMovie"", lm.""Episode"", lm.""CreatedAt"";";

            return await _databaseContext.Database
        .SqlQueryRaw<MovieToShowDTOs>(sql, new[] { new NpgsqlParameter("@id", id) })
            .ToListAsync();
        }

        public async Task<List<MovieToShowDTOs>> GetMovieByType(string slugtype)
        {
            var sql = @"
                SELECT 
                    m.""Id"", 
                    m.""Title"", 
                    m.""Description"", 
                    m.""Nation"", 
                    m.""TypeMovie"", 
                    m.""Status"", 
                    m.""NumberOfMovie"", 
                    m.""Duration"",
                    m.""Quality"", 
                    m.""Language"", 
                    m.""View"", 
                    m.""IsVip"",
                    m.""Block"",
                    m.""NameDirector"",
                    m.""Image"", 
                    m.""BackgroundImage"",
                    m.""Point"",
                    lm.""Episode"",
                    lm.""CreatedAt"",
                    COALESCE(STRING_AGG(DISTINCT c.""NameCategories"", ', '), '') AS ""NameCategories"",
                    COALESCE(STRING_AGG(DISTINCT a.""ActorName"", ', '), '') AS ""NameActors"",
                    COALESCE(STRING_AGG(DISTINCT lm.""UrlMovie"" || '-Tap-' || lm.""Episode"", ', '), '') AS ""UrlMovie""
                FROM ""Movie"" m
                LEFT JOIN ""SubCategories"" sc ON m.""Id"" = sc.""IdMovie""
                LEFT JOIN ""Category"" c ON sc.""IdCategory"" = c.""IdCategories""
                LEFT JOIN (
                    SELECT DISTINCT ON (""IdMovie"") ""IdMovie"", ""Episode"", ""CreatedAt"", ""UrlMovie""
                    FROM ""LinkMovie""
                    ORDER BY ""IdMovie"", ""CreatedAt"" DESC
                ) lm ON m.""Id"" = lm.""IdMovie""
                LEFT JOIN ""SubActor"" sa ON m.""Id"" = sa.""IdMovie""
                LEFT JOIN ""Actor"" a ON sa.""IdActor"" = a.""IdActor""
                WHERE m.""SlugTypeMovie"" ILIKE '%' || @slugtype || '%'
                GROUP BY m.""Id"", lm.""UrlMovie"", lm.""Episode"", lm.""CreatedAt"";";

            return await _databaseContext.Database
        .SqlQueryRaw<MovieToShowDTOs>(sql, new[] { new NpgsqlParameter("@slugtype", slugtype) })
            .ToListAsync();
        }

        public async Task<List<MovieToShowDTOs>> SearchMovie(string? Keyword, string role)
        {
            if (Keyword != null)
            {
                string SlugKeyword = SlugHelper.Slugify(Keyword);
                Dictionary<int, string> slugStatusDict = movieStatusDict.ToDictionary(
                    x => x.Key,
                    x => SlugHelper.Slugify(x.Value)
                );

                var foundPair = slugStatusDict.FirstOrDefault(x => x.Value == SlugKeyword);
                if (!foundPair.Equals(default(KeyValuePair<int, string>)))
                {
                    string whereCondition = @"
                WHERE m.""Status"" ILIKE '%' || @statusValue || '%'";

                    if (role != "Admin")
                    {
                        whereCondition += @" AND m.""Block"" = false";
                    }

                    string sql = $@"
                SELECT 
                    m.""Id"", 
                    m.""Title"", 
                    m.""Description"", 
                    m.""Nation"", 
                    m.""TypeMovie"", 
                    m.""Status"", 
                    m.""NumberOfMovie"", 
                    m.""Duration"",
                    m.""Quality"", 
                    m.""Language"", 
                    m.""View"", 
                    m.""Image"",
                    m.""IsVip"",
                    m.""Block"",
                    m.""NameDirector"",
                    m.""BackgroundImage"",
                    m.""Point"",
                    lm.""Episode"",
                    lm.""CreatedAt"",
                    COALESCE(STRING_AGG(DISTINCT c.""NameCategories"", ', '), '') AS ""NameCategories"",
                    COALESCE(STRING_AGG(DISTINCT a.""ActorName"", ', '), '') AS ""NameActors"",
                    COALESCE(STRING_AGG(DISTINCT lm.""UrlMovie"" || '-Tap-' || lm.""Episode"", ', '), '') AS ""UrlMovie""
                FROM ""Movie"" m
                LEFT JOIN ""SubCategories"" sc ON m.""Id"" = sc.""IdMovie""
                LEFT JOIN ""Category"" c ON sc.""IdCategory"" = c.""IdCategories""
                LEFT JOIN (
                    SELECT DISTINCT ON (""IdMovie"") ""IdMovie"", ""Episode"", ""CreatedAt"", ""UrlMovie""
                    FROM ""LinkMovie""
                    ORDER BY ""IdMovie"", ""CreatedAt"" DESC
                ) lm ON m.""Id"" = lm.""IdMovie""
                LEFT JOIN ""SubActor"" sa ON m.""Id"" = sa.""IdMovie""
                LEFT JOIN ""Actor"" a ON sa.""IdActor"" = a.""IdActor""
                {whereCondition}
                GROUP BY m.""Id"", lm.""UrlMovie"", lm.""Episode"", lm.""CreatedAt"";";

                    return await _databaseContext.Database
                        .SqlQueryRaw<MovieToShowDTOs>(sql, new[] {
                    new NpgsqlParameter("@statusValue", (foundPair.Key).ToString())
                        })
                        .ToListAsync();
                }
                else
                {
                    // phần tìm kiếm theo keyword, giữ nguyên logic
                    var sql = @"
                WITH MovieFiltered AS (
                    SELECT DISTINCT m.""Id""
                    FROM ""Movie"" m
                    LEFT JOIN ""SubCategories"" sc ON m.""Id"" = sc.""IdMovie""
                    LEFT JOIN ""Category"" c ON sc.""IdCategory"" = c.""IdCategories""
                    WHERE c.""SlugNameCategories"" ILIKE '%' || @keyword || '%'
                ),
                ActorFiltered AS (
                    SELECT DISTINCT m.""Id""
                    FROM ""Movie"" m
                    LEFT JOIN ""SubActor"" sa ON m.""Id"" = sa.""IdMovie""
                    LEFT JOIN ""Actor"" a ON sa.""IdActor"" = a.""IdActor""
                    WHERE a.""SlugActorName"" ILIKE '%' || @keyword || '%'
                )
                SELECT 
                    m.""Id"", 
                    m.""Title"",  
                    m.""Description"", 
                    m.""Nation"", 
                    m.""TypeMovie"", 
                    m.""Status"", 
                    m.""NumberOfMovie"",
                    m.""Duration"", 
                    m.""Quality"", 
                    m.""Language"", 
                    m.""View"", 
                    m.""Image"", 
                    m.""IsVip"",
                    m.""Block"",
                    m.""NameDirector"",
                    m.""BackgroundImage"",
                    m.""Point"",
                    lm.""Episode"",
                    lm.""CreatedAt"",
                    COALESCE(STRING_AGG(DISTINCT c.""NameCategories"", ', '), '') AS ""NameCategories"",
                    COALESCE(STRING_AGG(DISTINCT a.""ActorName"", ', '), '') AS ""NameActors"",
                    COALESCE(STRING_AGG(DISTINCT lm.""UrlMovie"" || '-Tap-' || lm.""Episode"", ', '), '') AS ""UrlMovie""
                FROM ""Movie"" m
                LEFT JOIN ""SubCategories"" sc ON m.""Id"" = sc.""IdMovie""
                LEFT JOIN ""Category"" c ON sc.""IdCategory"" = c.""IdCategories""
                LEFT JOIN (
                    SELECT DISTINCT ON (""IdMovie"") ""IdMovie"", ""Episode"", ""CreatedAt"", ""UrlMovie""
                    FROM ""LinkMovie""
                    ORDER BY ""IdMovie"", ""CreatedAt"" DESC
                ) lm ON m.""Id"" = lm.""IdMovie""
                LEFT JOIN ""SubActor"" sa ON m.""Id"" = sa.""IdMovie""
                LEFT JOIN ""Actor"" a ON sa.""IdActor"" = a.""IdActor""
                WHERE 
                    (m.""SlugTitle"" ILIKE '%' || @keyword || '%'
                     OR m.""SlugTypeMovie"" ILIKE '%' || @keyword || '%'
                     OR m.""SlugNation"" ILIKE '%' || @keyword || '%'
                     OR m.""Id"" IN (SELECT ""Id"" FROM ActorFiltered)
                     OR m.""Id"" IN (SELECT ""Id"" FROM MovieFiltered)                     
                    )
                AND m.""Block"" = false
                GROUP BY m.""Id"", lm.""UrlMovie"", lm.""Episode"", lm.""CreatedAt"";";

                    return await _databaseContext.Database
                        .SqlQueryRaw<MovieToShowDTOs>(sql, new[] {
                    new NpgsqlParameter("@keyword", SlugKeyword)
                        })
                        .ToListAsync();
                }
            }

            return null;
        }


        public async Task<bool> UpdateMovie(MovieToUpdateDTOs movieToAddDTOs)
        {
            // Kiểm tra phim có tồn tại không
            var existingMovie = await _databaseContext.Movies
                .FirstOrDefaultAsync(m => m.IdMovie == movieToAddDTOs.IdMovie);

            if (existingMovie == null)
            {
                return false; // Không tìm thấy phim
            }
            int statusValue = movieStatusDict
    .FirstOrDefault(x => x.Value == movieToAddDTOs.StatusText).Key;

            // Cập nhật thông tin Movie
            existingMovie.Title = movieToAddDTOs.Title;
            existingMovie.SlugTitle = SlugHelper.Slugify(movieToAddDTOs.Title);
            existingMovie.Description = movieToAddDTOs.Description;
            existingMovie.Nation = movieToAddDTOs.Nation;
            existingMovie.TypeMovie = movieToAddDTOs.TypeMovie;
            existingMovie.SlugTypeMovie = SlugHelper.Slugify(movieToAddDTOs.TypeMovie);
            existingMovie.Status = statusValue.ToString();
            existingMovie.Duration = movieToAddDTOs.Duration;
            existingMovie.Quality = movieToAddDTOs.Quality;
            existingMovie.Language = movieToAddDTOs.Language;
            existingMovie.Block = movieToAddDTOs.Block;
            existingMovie.NameDirector = movieToAddDTOs.NameDirector;
            existingMovie.IsVip = movieToAddDTOs.IsVip;
            existingMovie.Image = movieToAddDTOs.Image;
            existingMovie.BackgroundImage = movieToAddDTOs.BackgroundImage;

            // Xóa tất cả SubCategory cũ liên quan đến Movie
            var oldSubCategories =  _databaseContext.SubCategories
                .Where(sc => sc.IdMovie == movieToAddDTOs.IdMovie);
            _databaseContext.SubCategories.RemoveRange(oldSubCategories);

            var oldSubActor = _databaseContext.SubActors
                .Where(sc => sc.IdMovie == movieToAddDTOs.IdMovie);
            _databaseContext.SubActors.RemoveRange(oldSubActor);
            // Xử lý danh mục mới
            string[] categories = movieToAddDTOs.NameCategories.Split(',')
                .Select(c => c.Trim()) // Xóa khoảng trắng dư thừa
                .Distinct() // Loại bỏ trùng lặp
                .ToArray();

            string[] NameActors = movieToAddDTOs.NameActors.Split(',')
                .Select(c => c.Trim()) // Xóa khoảng trắng dư thừa
                .Distinct() // Loại bỏ trùng lặp
                .ToArray();

            foreach (string categoryName in categories)
            {
                var existingCategory = await _databaseContext.Categories
                    .FirstOrDefaultAsync(c => c.NameCategories == categoryName);

                string categoryId;
                if (existingCategory == null)
                {
                    // Tạo mới Category nếu chưa có
                    categoryId = Guid.NewGuid().ToString();
                    var newCategory = new Category
                    {
                        IdCategories = categoryId,
                        NameCategories = categoryName,
                        SlugNameCategories = SlugHelper.Slugify(categoryName)
                    };
                    await _databaseContext.Categories.AddAsync(newCategory);
                }
                else
                {
                    categoryId = existingCategory.IdCategories;
                }

                // Thêm mới SubCategory
                var newSubCategory = new SubCategory
                {
                    IdMovie = movieToAddDTOs.IdMovie,
                    IdCategory = categoryId
                };
                await _databaseContext.SubCategories.AddAsync(newSubCategory);
            }

            foreach (string nameActor in NameActors)
            {
                var existingActor = await _databaseContext.Actors
                    .AsNoTracking() // Không để EF theo dõi entity này
                    .FirstOrDefaultAsync(u => u.ActorName == nameActor);

                string Idactor;
                if (existingActor == null)
                {
                    // Tạo mới Actor
                    Idactor = Guid.NewGuid().ToString();
                    var newActor = new Actor
                    {
                        IdActor = Idactor,
                        ActorName = nameActor,
                        SlugActorName = SlugHelper.Slugify(nameActor)
                    };
                    await _databaseContext.Actors.AddAsync(newActor);
                }
                else
                {
                    Idactor = existingActor.IdActor;

                    // Đính kèm vào DbContext để tránh lỗi tracking
                    // _databaseContext.Categories.Attach(existingCategory);
                }

                // Tạo mới SubCategory mà không tạo thực thể mới của Movie & Category
                var newSubActor = new SubActor
                {
                    IdMovie = movieToAddDTOs.IdMovie,
                    IdActor = Idactor

                };
                await _databaseContext.SubActors.AddAsync(newSubActor);
            }

            // Lưu thay đổi vào database
            await _databaseContext.SaveChangesAsync();
            return true;
        }

        public async Task<List<MovieToShowDTOs>> GetMovieByNation(string slugNation)
        {
            var sql = @"
                SELECT 
                    m.""Id"", 
                    m.""Title"",  
                    m.""Description"", 
                    m.""Nation"", 
                    m.""TypeMovie"", 
                    m.""Status"", 
                    m.""NumberOfMovie"",
                    m.""Duration"", 
                    m.""Quality"", 
                    m.""Language"", 
                    m.""View"", 
                    m.""IsVip"",
                    m.""Block"",
                    m.""NameDirector"",
                    m.""Image"", 
                    m.""BackgroundImage"",
                    m.""Point"",
                    lm.""Episode"",
                    lm.""CreatedAt"",
                    COALESCE(STRING_AGG(DISTINCT c.""NameCategories"", ', '), '') AS ""NameCategories"",
                    COALESCE(STRING_AGG(DISTINCT a.""ActorName"", ', '), '') AS ""NameActors"",
                    COALESCE(STRING_AGG(DISTINCT lm.""UrlMovie"" || '-Tap-' || lm.""Episode"", ', '), '') AS ""UrlMovie""
                    FROM ""Movie"" m
                LEFT JOIN ""SubCategories"" sc ON m.""Id"" = sc.""IdMovie""
                LEFT JOIN ""Category"" c ON sc.""IdCategory"" = c.""IdCategories""
                LEFT JOIN (
                    SELECT DISTINCT ON (""IdMovie"") ""IdMovie"", ""Episode"", ""CreatedAt"", ""UrlMovie""
                    FROM ""LinkMovie""
                    ORDER BY ""IdMovie"", ""CreatedAt"" DESC
                ) lm ON m.""Id"" = lm.""IdMovie""
                LEFT JOIN ""SubActor"" sa ON m.""Id"" = sa.""IdMovie""
                LEFT JOIN ""Actor"" a ON sa.""IdActor"" = a.""IdActor""
                WHERE m.""SlugNation"" =  @slugNation AND m.""Block"" = false
                GROUP BY m.""Id"", lm.""UrlMovie"", lm.""Episode"", lm.""CreatedAt"";";

            return await _databaseContext.Database
        .SqlQueryRaw<MovieToShowDTOs>(sql, new[] { new NpgsqlParameter("@slugNation", slugNation) })
            .ToListAsync();
        }

        public async Task<List<MovieToShowDTOs>> GetMovieByStatus(string status)
        {
            string SlugKeyword = SlugHelper.Slugify(status);
            Dictionary<int, string> slugStatusDict = movieStatusDict.ToDictionary(
                    x => x.Key, // Giữ lại số tương ứng
                    x => SlugHelper.Slugify(x.Value)
            );

            var foundPair = slugStatusDict.FirstOrDefault(x => x.Value == SlugKeyword);
            if (!foundPair.Equals(default(KeyValuePair<int, string>)))
            {
                var sql = @"
                        SELECT 
                            m.""Id"", 
                            m.""Title"", 
                            m.""Description"", 
                            m.""Nation"", 
                            m.""TypeMovie"", 
                            m.""Status"", 
                            m.""NumberOfMovie"", 
                            m.""Duration"",
                            m.""Quality"", 
                            m.""Language"", 
                            m.""View"", 
                            m.""Image"",
                            m.""IsVip"",
                            m.""Block"",
                            m.""NameDirector"",
                            m.""BackgroundImage"",
                            m.""Point"",
                            lm.""Episode"",
                            lm.""CreatedAt"",
                            COALESCE(STRING_AGG(DISTINCT c.""NameCategories"", ', '), '') AS ""NameCategories"",
                            COALESCE(STRING_AGG(DISTINCT a.""ActorName"", ', '), '') AS ""NameActors"",
                            COALESCE(STRING_AGG(DISTINCT lm.""UrlMovie"" || '-Tap-' || lm.""Episode"", ', '), '') AS ""UrlMovie""
                        FROM ""Movie"" m
                        LEFT JOIN ""SubCategories"" sc ON m.""Id"" = sc.""IdMovie""
                        LEFT JOIN ""Category"" c ON sc.""IdCategory"" = c.""IdCategories""
                        LEFT JOIN (
                            SELECT DISTINCT ON (""IdMovie"") ""IdMovie"", ""Episode"", ""CreatedAt"", ""UrlMovie""
                            FROM ""LinkMovie""
                            ORDER BY ""IdMovie"", ""CreatedAt"" DESC
                        ) lm ON m.""Id"" = lm.""IdMovie""
                        LEFT JOIN ""SubActor"" sa ON m.""Id"" = sa.""IdMovie""
                        LEFT JOIN ""Actor"" a ON sa.""IdActor"" = a.""IdActor""
                        WHERE m.""Status"" ILIKE '%' || @statusValue || '%' AND m.""Block"" = false
                        GROUP BY m.""Id"", lm.""UrlMovie"", lm.""Episode"", lm.""CreatedAt"";";
                return await _databaseContext.Database
                   .SqlQueryRaw<MovieToShowDTOs>(sql, new[] { new NpgsqlParameter("@statusValue", (foundPair.Key).ToString()) })
                       .ToListAsync();
            }
            return null;
        }

        public async Task<List<MovieToShowDTOs>> GetMovieByActor(string actor)
        {
            var sql = @"
                WITH ActorFiltered AS (
                     SELECT DISTINCT m.""Id""
                     FROM ""Movie"" m
                     LEFT JOIN ""SubActor"" sa ON m.""Id"" = sa.""IdMovie""
                     LEFT JOIN ""Actor"" a ON sa.""IdActor"" = a.""IdActor""
                     WHERE a.""SlugActorName"" ILIKE '%' || @actor || '%'
                    )
                SELECT 
                    m.""Id"", 
                    m.""Title"",  
                    m.""Description"", 
                    m.""Nation"", 
                    m.""TypeMovie"", 
                    m.""Status"", 
                    m.""NumberOfMovie"",
                    m.""Duration"", 
                    m.""Quality"", 
                    m.""Language"",
                    m.""IsVip"",
                    m.""Block"",
                    m.""NameDirector"",
                    m.""View"", 
                    m.""Image"",
                    m.""BackgroundImage"",
                    m.""Point"",
                    lm.""Episode"",
                    lm.""CreatedAt"",
                    COALESCE(STRING_AGG(DISTINCT c.""NameCategories"", ', '), '') AS ""NameCategories"",
                    COALESCE(STRING_AGG(DISTINCT a.""ActorName"", ', '), '') AS ""NameActors"",
                    COALESCE(STRING_AGG(DISTINCT lm.""UrlMovie"" || '-Tap-' || lm.""Episode"", ', '), '') AS ""UrlMovie""
                FROM ""Movie"" m
                LEFT JOIN ""SubCategories"" sc ON m.""Id"" = sc.""IdMovie""
                LEFT JOIN ""Category"" c ON sc.""IdCategory"" = c.""IdCategories""
                LEFT JOIN (
                            SELECT DISTINCT ON (""IdMovie"") ""IdMovie"", ""Episode"", ""CreatedAt"", ""UrlMovie""
                            FROM ""LinkMovie""
                            ORDER BY ""IdMovie"", ""CreatedAt"" DESC
                        ) lm ON m.""Id"" = lm.""IdMovie""
                LEFT JOIN ""SubActor"" sa ON m.""Id"" = sa.""IdMovie""
                LEFT JOIN ""Actor"" a ON sa.""IdActor"" = a.""IdActor""
                WHERE m.""Id"" IN (SELECT ""Id"" FROM ActorFiltered)
                AND m.""Block"" = false
                GROUP BY m.""Id"", lm.""UrlMovie"", lm.""Episode"", lm.""CreatedAt"";";

            return await _databaseContext.Database
        .SqlQueryRaw<MovieToShowDTOs>(sql, new[] { new NpgsqlParameter("@actor", actor) })
            .ToListAsync();
        }
    }
}
