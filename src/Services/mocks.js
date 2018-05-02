const teams_list_mock = () => [
  {
    email: 'dude@whatever.com',
    team_id: 666,
    last_login_date: 1524079704580,
    simulations: 420,
    license: 'freemium', // enum [ "freemium", "trial", "professional" ]
    early_access: true
  },
  {
    email: 'team@test.com',
    team_id: 69,
    last_login_date: 1524685402682,
    simulations: 1,
    license: 'trial', // enum [ "freemium", "trial", "professional" ]
    early_access: false
  },
  {
    email: 'abc@123.com',
    team_id: 100,
    last_login_date: 1524762731658,
    simulations: 5,
    license: 'professional', // enum [ "freemium", "trial", "professional" ]
    early_access: true
  },
  {
    email: 'rick@sanchez.com',
    team_id: 45,
    last_login_date: 1496725200000,
    simulations: 16,
    license: 'trial', // enum [ "freemium", "trial", "professional" ]
    early_access: true
  },
  {
    email: 'morty@smith.com',
    team_id: 12,
    last_login_date: 1524200400000,
    simulations: 50,
    license: 'professional', // enum [ "freemium", "trial", "professional" ]
    early_access: false
  },
  {
    email: 'paper@boi.com',
    team_id: 888,
    last_login_date: 1522126800000,
    simulations: 100,
    license: 'freemium', // enum [ "freemium", "trial", "professional" ]
    early_access: false
  },
  {
    email: 'someone@something.com',
    team_id: 999,
    last_login_date: 1514786400000,
    simulations: 10,
    license: 'professional', // enum [ "freemium", "trial", "professional" ]
    early_access: true
  }
];

export default {
  teams_list: () =>
    new Promise((resolve, reject) =>
      setTimeout(() => resolve(teams_list_mock()), 1000)
    )
};
