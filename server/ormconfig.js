const env =
  process.env.NODE_ENV === "development"
    ? { dir: "src", host: "localhost", password: "", ext: ".ts" }
    : { dir: "build", host: "18.140.209.86", password: "RFC2019@db", ext: ".js" };

module.exports = {
  type: "mysql",
  host: env.host,
  port: 3306,
  username: "root",
  password: env.password,
  database: "raffle_drawing_system_db",
  synchronize: true,
  logging: false,
  entities: [env.dir + `/entity/**/*${env.ext}`],
  migrations: [env.dir + `/migration/*${env.ext}`],
  subscribers: [env.dir + `/subscriber/**/*${env.ext}`],
  //   entities: ["build/entity/**/*.js"],
  //   migrations: ["build/migration/**/*.js"],
  //   subscribers: ["build/subscriber/**/*.js"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};
