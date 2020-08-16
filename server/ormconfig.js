const env =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === undefined
    ? { dir: "src", host: "localhost", password: "" }
    : { dir: "build", host: "127.0.0.1", password: "RFC2019@db" };

module.exports = {
  type: "mysql",
  host: env.host,
  port: 3306,
  username: "root",
  password: env.password,
  database: "raffle_drawing_system_db",
  synchronize: true,
  logging: false,
  entities: [env.dir + "/entity/**/*.{js,ts}"],
  migrations: [env.dir + "/migration/*.{js,ts}"],
  subscribers: [env.dir + "/subscriber/**/*.{js,ts}"],
  //   entities: ["build/entity/**/*.js"],
  //   migrations: ["build/migration/**/*.js"],
  //   subscribers: ["build/subscriber/**/*.js"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};
