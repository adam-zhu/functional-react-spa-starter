const users_mock = () => [
  {
    email: "dude@whatever.com",
    user_id: 666,
    last_login_date: 1524079704580,
    credits: 420,
    license: "freemium",
    early_access: true
  },
  {
    email: "user@test.com",
    user_id: 69,
    last_login_date: 1524685402682,
    credits: 1,
    license: "trial",
    early_access: false
  },
  {
    email: "abc@123.com",
    user_id: 100,
    last_login_date: 1524762731658,
    credits: 5,
    license: "professional",
    early_access: true
  },
  {
    email: "rick@sanchez.com",
    user_id: 45,
    last_login_date: 1496725200000,
    credits: 16,
    license: "trial",
    early_access: true
  },
  {
    email: "morty@smith.com",
    user_id: 12,
    last_login_date: 1524200400000,
    credits: 50,
    license: "professional",
    early_access: false
  },
  {
    email: "paper@boi.com",
    user_id: 888,
    last_login_date: 1522126800000,
    credits: 100,
    license: "freemium",
    early_access: false
  },
  {
    email: "someone@something.com",
    user_id: 999,
    last_login_date: 1514786400000,
    credits: 10,
    license: "professional",
    early_access: true
  }
];

export default {
  users: () =>
    new Promise((resolve, reject) =>
      setTimeout(
        () =>
          Math.random() > 0.25
            ? resolve(users_mock())
            : reject(new Error("Users loading error.")),
        1000
      )
    )
};
