DROP TABLE IF EXISTS Movies;

CREATE TABLE IF NOT EXISTS Movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date VARCHAR(255),
    overview VARCHAR(100000),
    poster_path VARCHAR(10000),
    comment VARCHAR(10000)
);
-- sqlserver://localhost:5432

-- INSERT INTO movies (title, release_date, overview,poster_path,comment) VALUES (to_json('${movie.title}'),'${movie.release_date}',to_json('${movie.overview}'),'${movie.poster_path}','${movie.comment}')