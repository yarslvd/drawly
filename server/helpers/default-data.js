const { hashPassword } = require("../utils/bcrypt");

const data = {
  users: [
    {
      first_name: "John",
      last_name: "Doe",
      birthdate: "1990-01-01",
      email: "john.doe@example.com",
      confirmed_email: true,
      username: "johndoe",
      password: hashPassword("password"),
      image: "https://i.imgur.com/0V3xRbK.png",
    },
    {
      first_name: "Jane",
      last_name: "Doe",
      birthdate: "1992-05-15",
      email: "jane.doe@example.com",
      confirmed_email: true,
      username: "janedoe",
      password: hashPassword("password"),
    },
    {
      first_name: "Bob",
      last_name: "Smith",
      birthdate: "1985-03-25",
      email: "bob.smith@example.com",
      confirmed_email: true,
      username: "bobsmith",
      password: hashPassword("password"),
      image: "https://i.imgur.com/hfqoNvz.png",
    },
    {
      first_name: "Alice",
      last_name: "Johnson",
      birthdate: "1998-12-10",
      email: "alice.johnson@example.com",
      confirmed_email: true,
      username: "alicejohnson",
      password: hashPassword("password"),
      image: "https://i.imgur.com/wbci1oY.png",
    },
    {
      first_name: "Tom",
      last_name: "Brown",
      birthdate: "1978-08-21",
      email: "tom.brown@example.com",
      confirmed_email: true,
      username: "tombrown",
      password: hashPassword("password"),
    },
  ],
};

async function setDefaultData(database) {
  for (const table in data) {
    const arr = data[table];
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      let instance = addData(database[table], obj);
      if (instance == null) {
        console.log("error while setting default data");
        return;
      }
    }
  }
}

async function addData(model, data) {
  try {
    const { password, ...whereData } = data;
    const [instance, isCreated] = await model.findOrCreate({
      where: {
        ...whereData,
      },
      defaults: {
        ...data,
      },
    });

    return instance;
  } catch (err) {
    console.log(err);
    return null;
  }
}
module.exports = {
  setDefaultData,
};
