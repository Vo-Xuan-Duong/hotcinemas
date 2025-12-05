# Cities Data Files

This directory contains SQL files for inserting city data into the HotCinemas database.

## Files Description

### 1. `insert_cities_data.sql`
- **Purpose**: Comprehensive list of all major cities in Vietnam
- **Content**: 60+ cities including all provinces and major urban areas
- **Use case**: When you need complete coverage of Vietnamese cities
- **Size**: Large dataset

### 2. `insert_major_cities.sql` ⭐ **RECOMMENDED**
- **Purpose**: Major cities suitable for cinema business
- **Content**: 30+ key cities where cinemas are typically located
- **Use case**: Production environment with focus on cinema business
- **Size**: Medium dataset, optimized for performance

### 3. `insert_sample_cinemas_with_cities.sql`
- **Purpose**: Sample cinema data that references cities
- **Content**: Sample cinemas in major cities with proper city_id references
- **Use case**: Testing and development with sample data
- **Prerequisites**: Run `insert_major_cities.sql` first

### 4. `cities_migration.sql`
- **Purpose**: Database migration script
- **Content**: Creates cities table, updates cinemas table structure
- **Use case**: Initial database setup and migration

## Usage Instructions

### For Development/Testing:
```sql
-- 1. Run migration first
\i data/cities_migration.sql

-- 2. Insert major cities
\i data/insert_major_cities.sql

-- 3. Insert sample cinemas (optional)
\i data/insert_sample_cinemas_with_cities.sql
```

### For Production:
```sql
-- 1. Run migration
\i data/cities_migration.sql

-- 2. Insert major cities
\i data/insert_major_cities.sql

-- 3. Insert your actual cinema data with proper city_id references
```

## City Data Structure

Each city record contains:
- `id`: Auto-generated primary key
- `name`: City name (e.g., "Ho Chi Minh City")
- `code`: City code (e.g., "HCM")
- `country`: Country name (e.g., "Vietnam")
- `is_active`: Boolean flag for active status
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Major Cities Included

### Tier 1 (Major Metropolitan Areas):
- Ho Chi Minh City (HCM)
- Ha Noi (HN)
- Da Nang (DN)

### Tier 2 (Important Economic Centers):
- Can Tho (CT)
- Hai Phong (HP)
- Bien Hoa (BH)
- Hue (HU)
- Nha Trang (NT)
- Vung Tau (VT)
- Quy Nhon (QN)

### Tier 3 (Regional Centers):
- Buon Ma Thuot (BMT)
- Da Lat (DL)
- Pleiku (PL)
- Rach Gia (RG)
- Ca Mau (CM)
- And more...

## API Usage

After inserting the data, you can use the City API:

```bash
# Get all cities
GET /api/v1/cities

# Get active cities
GET /api/v1/cities/active

# Search cities
GET /api/v1/cities/search?name=Ho Chi Minh

# Get city by ID
GET /api/v1/cities/1
```

## Notes

- All city names are in Vietnamese
- City codes are unique 2-3 character abbreviations
- All cities are set as active by default
- Timestamps are set to current time during insertion
- Foreign key constraints ensure data integrity
