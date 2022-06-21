describe('Login Test', () => {
  it('Login page Visit', () => {
    cy.visit('localhost:4200/');
  });
  it('check the element is there or not', () => {
    cy.contains('Email');
    cy.contains('Password');
    cy.contains('Login');
  });
  it('click button without value', () => {
    cy.contains('Login').click();
    cy.get('mat-error').contains('This Field is Required');
  });

  it('Invalid Email and password && Clicking button && invalid message', () => {
    cy.get('input[type="email"]').type('ab@gmai');
    cy.get('input[type="password"]').type('asdfghj');
    cy.contains('Login').click();
    cy.contains('Invalid Username and password');
    cy.contains('close').click();
  });

  it('valid Email and password && Clicking button && valid message', () => {
    cy.get('input[type="email"]').clear();
    cy.get('input[type="password"]').clear();
    cy.get('input[type="email"]').type('abc@gmail.com');
    cy.get('input[type="password"]').type('temp');
    cy.contains('Login').click();
    cy.contains('Login Successfully');
    cy.contains('close').click();
    cy.url().should('include', 'localhost:4200/home/dashboard');
  });
});
