/**
 * - Login spec (API responses are stubbed with cy.intercept so the flow
 *   is deterministic and passes without network access)
 *   - should display login form correctly
 *   - should display error when email and password are wrong
 *   - should redirect to homepage when email and password are correct
 */

const fakeUser = {
  id: 'user-1',
  name: 'Dicoding',
  email: 'dicoding@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Dicoding&background=random',
};

const fakeThreads = [
  {
    id: 'thread-1',
    title: 'Belajar React itu seru',
    body: 'Isi thread pertama',
    category: 'react',
    createdAt: '2024-01-01T00:00:00.000Z',
    ownerId: 'user-1',
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 0,
  },
];

describe('Login spec', () => {
  let loggedIn;

  beforeEach(() => {
    loggedIn = false;

    cy.intercept('POST', '**/login', (req) => {
      loggedIn = true;
      req.reply({
        statusCode: 200,
        body: { status: 'success', data: { token: 'fake-token' } },
      });
    });

    cy.intercept('GET', '**/users/me', (req) => {
      if (loggedIn) {
        req.reply({ statusCode: 200, body: { status: 'success', data: { user: fakeUser } } });
      } else {
        req.reply({ statusCode: 401, body: { status: 'fail', message: 'Unauthorized' } });
      }
    });

    cy.intercept('GET', '**/threads', {
      statusCode: 200,
      body: { status: 'success', data: { threads: fakeThreads } },
    });

    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: { status: 'success', data: { users: [fakeUser] } },
    });

    cy.visit('/login');
  });

  it('should display login form correctly', () => {
    cy.get('input[placeholder="Email"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
    cy.get('button').contains(/^Masuk$/).should('be.visible');
  });

  it('should display error when email and password are wrong', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 400,
      body: { status: 'fail', message: 'email or password is wrong' },
    });

    cy.get('input[placeholder="Email"]').type('salah@example.com');
    cy.get('input[placeholder="Password"]').type('passwordsalah');
    cy.get('button').contains(/^Masuk$/).click();

    cy.get('.error').should('be.visible').and('contain', 'email or password is wrong');
  });

  it('should redirect to homepage when email and password are correct', () => {
    cy.get('input[placeholder="Email"]').type('dicoding@example.com');
    cy.get('input[placeholder="Password"]').type('passwordbenar');
    cy.get('button').contains(/^Masuk$/).click();

    cy.location('pathname').should('eq', '/');
    cy.contains('Daftar Thread').should('be.visible');
    cy.contains('Belajar React itu seru').should('be.visible');
  });
});
