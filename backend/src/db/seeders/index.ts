/* Commands
    -createDb
    -dropDb
    -seedDb
    -unseedDb

    Usage:
        npm run devHelper -- -createDb
        npm run devHelper -- -dropDb
        npm run devHelper -- -seedDb    *Applies to all seed
        npm run devHelper -- -seedDb --name file.json
        npm run devHelper -- -unseedDb  *Applies to all seed
        npm run devHelper -- -unseedDb --name <filename>

    *Note when using nvm you must add "-- -- --" in order to pass it to underlying process
    Example: npm run devHelper -- -- -- -seedDb
*/

import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import { join } from "path";
import { Db, ObjectId } from "mongodb";

import dbOptions from "../../configs/databaseConf";
import { connectToDb } from "./mongoClient";

var argument = process.argv;
console.log(argument);

let commands = ["-createDb", "-dropDb", "-seedDb", "-unseedDb"];
let execCommand: String | undefined = undefined;
argument.forEach((param) => {
  commands.forEach((command) => {
    if (param == command) {
      execCommand = command;
      return;
    }
  });
  if (execCommand) return;
});
console.log(execCommand ? "Executing " + execCommand : "Command wasn't found");

if (!execCommand) process.exit();

let fileName: string | undefined = undefined;
switch (execCommand) {
  case "-createDb":
    createDb();
    break;
  case "-dropDb":
    dropDb();
    break;
  case "-seedDb":
    fileName = getFileName();
    seedDb(fileName);
    break;
  case "-unseedDb":
    fileName = getFileName();
    unseedDb(fileName);
    break;
}

function getFileName() {
  let i: number;
  for (i = 0; i < argument.length; i++) {
    if (argument[i] == "--name") return argument[i + 1];
  }
  return undefined;
}

async function createDb() {
  const dbInstance = await connectToDb("mongodb://localhost:27017/");
  const database = dbInstance.db(dbOptions.dbName);
  //   const dbInstance = await createConnection(`mongodb://localhost:27017/`);
  console.log("Created database: " + dbOptions.dbName);
  await database.collection("dummyCollection").insertOne({
    Note: "This collection is created in order for mongoDb to create the table, delete this collection",
  });
  dbInstance.close();
}

async function dropDb() {
  const dbInstance = await connectToDb("mongodb://localhost:27017/");
  const database = dbInstance.db(dbOptions.dbName);
  console.log("Drop database: " + dbOptions.dbName);
  await database.dropDatabase();
  dbInstance.close();
}

async function seedDb(fileName?: string) {
  const dbInstance = await connectToDb("mongodb://localhost:27017/");
  const database = dbInstance.db(dbOptions.dbName);

  if (fileName) {
    const filePath = join(__dirname, fileName);
    console.log("Seed file " + fileName + " \n" + filePath);

    const fileContent = fs.readFileSync(filePath);
    const data = JSON.parse(fileContent.toLocaleString());
    for (let i = 0; i < data.content.length; i++) {
      data.content[i]._id = new ObjectId(data.content[i]._id);
    }

    if (fileName.includes("users")) {
      for (let i = 0; i < data.content.length; i++) {
        let workoutIdsObject: Array<ObjectId> = [];

        console.log(i, data.content[i]);

        if (data.content[i].workoutsIds && data.content[i].calendarId) {
          for (let j = 0; j < data.content[i].workoutsIds.length; j++) {
            workoutIdsObject.push(new ObjectId(data.content[i].workoutsIds[j]));
          }
          data.content[i].workoutsIds = workoutIdsObject.slice();

          data.content[i].calendarId = new ObjectId(data.content[i].calendarId);
        }
      }
    }

    if (fileName.includes("workouts")) {
      for (let i = 0; i < data.content.length; i++) {
        data.content[i].author = new ObjectId(data.content[i].author);
      }
    }

    if (fileName.includes("calendars")) {
      const createObjectId = (id: string) => {
        console.log(id);

        return new ObjectId(id);
      };

      for (let i = 0; i < data.content.length; i++) {
        for (let j = 0; j < data.content[i].calendar.su.length; j++) {
          data.content[i].calendar.su[j].workout = createObjectId(
            data.content[i].calendar.su[j].workout
          );
        }
        for (let j = 0; j < data.content[i].calendar.mo.length; j++) {
          data.content[i].calendar.mo[j].workout = createObjectId(
            data.content[i].calendar.mo[j].workout
          );
        }
        for (let j = 0; j < data.content[i].calendar.tu.length; j++) {
          data.content[i].calendar.tu[j].workout = createObjectId(
            data.content[i].calendar.tu[j].workout
          );
        }
        for (let j = 0; j < data.content[i].calendar.we.length; j++) {
          data.content[i].calendar.we[j].workout = createObjectId(
            data.content[i].calendar.we[j].workout
          );
        }
        for (let j = 0; j < data.content[i].calendar.th.length; j++) {
          data.content[i].calendar.th[j].workout = createObjectId(
            data.content[i].calendar.th[j].workout
          );
        }
        for (let j = 0; j < data.content[i].calendar.fr.length; j++) {
          data.content[i].calendar.fr[j].workout = createObjectId(
            data.content[i].calendar.fr[j].workout
          );
        }
        for (let j = 0; j < data.content[i].calendar.sa.length; j++) {
          data.content[i].calendar.sa[j].workout = createObjectId(
            data.content[i].calendar.sa[j].workout
          );
        }
      }
    }

    await database.collection(data.name).insertMany(data.content);
  } else {
    console.log("No seed file passed, applying all seeds");
    const jsonFiles = fs.readdirSync(__dirname).filter((file) => {
      return file.indexOf(".") !== 0 && file.slice(-5) === ".json";
    });
    console.log("Applying seeds: " + jsonFiles);
    for (let i = 0; i < jsonFiles.length; i++) {
      const file = jsonFiles[i];
      const filePath = join(__dirname, file);
      console.log("Seed file " + file + " \n" + filePath);

      const fileContent = fs.readFileSync(filePath);
      const data = JSON.parse(fileContent.toLocaleString());
      console.log(data);

      for (let i = 0; i < data.content.length; i++) {
        data.content[i]._id = new ObjectId(data.content[i]._id);
      }

      if (file.includes("users")) {
        for (let i = 0; i < data.content.length; i++) {
          let workoutIdsObject: Array<ObjectId> = [];

          console.log(i, data.content[i]);

          if (data.content[i].workoutsIds && data.content[i].calendarId) {
            for (let j = 0; j < data.content[i].workoutsIds.length; j++) {
              workoutIdsObject.push(
                new ObjectId(data.content[i].workoutsIds[j])
              );
            }
            data.content[i].workoutsIds = workoutIdsObject.slice();

            data.content[i].calendarId = new ObjectId(
              data.content[i].calendarId
            );
          }
        }
      }

      if (file.includes("workouts")) {
        for (let i = 0; i < data.content.length; i++) {
          data.content[i].author = new ObjectId(data.content[i].author);
        }
      }

      if (file.includes("calendars")) {
        const createObjectId = (id: string) => {
          console.log(id);

          return new ObjectId(id);
        };

        for (let i = 0; i < data.content.length; i++) {
          for (let j = 0; j < data.content[i].calendar.su.length; j++) {
            data.content[i].calendar.su[j].workout = createObjectId(
              data.content[i].calendar.su[j].workout
            );
          }
          for (let j = 0; j < data.content[i].calendar.mo.length; j++) {
            data.content[i].calendar.mo[j].workout = createObjectId(
              data.content[i].calendar.mo[j].workout
            );
          }
          for (let j = 0; j < data.content[i].calendar.tu.length; j++) {
            data.content[i].calendar.tu[j].workout = createObjectId(
              data.content[i].calendar.tu[j].workout
            );
          }
          for (let j = 0; j < data.content[i].calendar.we.length; j++) {
            data.content[i].calendar.we[j].workout = createObjectId(
              data.content[i].calendar.we[j].workout
            );
          }
          for (let j = 0; j < data.content[i].calendar.th.length; j++) {
            data.content[i].calendar.th[j].workout = createObjectId(
              data.content[i].calendar.th[j].workout
            );
          }
          for (let j = 0; j < data.content[i].calendar.fr.length; j++) {
            data.content[i].calendar.fr[j].workout = createObjectId(
              data.content[i].calendar.fr[j].workout
            );
          }
          for (let j = 0; j < data.content[i].calendar.sa.length; j++) {
            data.content[i].calendar.sa[j].workout = createObjectId(
              data.content[i].calendar.sa[j].workout
            );
          }
        }
      }

      await database.collection(data.name).insertMany(data.content);
    }
  }
  dbInstance.close();
}

async function unseedDb(fileName?: string) {
  const dbInstance = await connectToDb("mongodb://localhost:27017/");
  const database = dbInstance.db(dbOptions.dbName);

  if (fileName) {
    const filePath = join(__dirname, fileName);
    console.log("Seed file " + fileName + " \n" + filePath);

    const jsonFiles = fs.readdirSync(__dirname).filter((file) => {
      return file.indexOf(".") !== 0 && file.slice(-5) === ".json";
    });

    if (jsonFiles.includes(fileName)) {
      const seedName = fileName.split("-")[0];
      console.log("Deleting collection" + seedName);
      await database.dropCollection(seedName);
    } else console.log("No collection with the specify name");
  } else {
    console.log("No seed name passed, dropping all seeds");
    const jsonFiles = fs.readdirSync(__dirname).filter((file) => {
      return file.indexOf(".") !== 0 && file.slice(-5) === ".json";
    });
    for (let i = 0; i < jsonFiles.length; i++) {
      const file = jsonFiles[i];
      const seedName = file.split("-")[0];
      console.log("Deleting collection" + seedName);
      await database.dropCollection(seedName);
    }
  }
  dbInstance.close();
}
